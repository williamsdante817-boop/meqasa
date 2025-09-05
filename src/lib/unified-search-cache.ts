/**
 * Production-Ready Unified Search Cache
 * Eliminates duplicate API calls for both property and unit searches
 * Features: Memory + SessionStorage, TTL, cleanup, error recovery
 */

import type { ListingDetails } from "@/types/property";
import type { UnitDetails } from "./get-unit-details";

// Cache entry structure
interface CacheEntry<T> {
  data: T;
  url: string;
  timestamp: number;
  source: 'api' | 'fallback';
  responseTime?: number;
  reference: string;
}

// Cache configuration
const CACHE_CONFIG = {
  TTL: 5 * 60 * 1000, // 5 minutes
  MAX_ENTRIES_PER_TYPE: 50, // Memory management
  STORAGE_PREFIX: 'meqasa_search_',
  VERSION: '1.0' // For cache invalidation if structure changes
} as const;

// Cache types
type PropertyCacheEntry = CacheEntry<ListingDetails>;
type UnitCacheEntry = CacheEntry<UnitDetails>;

/**
 * Unified Search Cache Implementation
 * Handles both properties and units with hybrid storage
 */
class UnifiedSearchCache {
  // Memory caches for performance
  private propertyCache = new Map<string, PropertyCacheEntry>();
  private unitCache = new Map<string, UnitCacheEntry>();
  
  // Cache statistics
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    errors: 0
  };

  /**
   * Generate cache key for reference
   */
  private getKey(type: 'property' | 'unit', reference: string): string {
    const cleanRef = reference.trim().replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return `${type}_${cleanRef}`;
  }

  /**
   * Get storage key for sessionStorage
   */
  private getStorageKey(cacheKey: string): string {
    return `${CACHE_CONFIG.STORAGE_PREFIX}${cacheKey}`;
  }

  /**
   * Check if cache entry is valid (not expired)
   */
  private isValid(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp < CACHE_CONFIG.TTL;
  }

  /**
   * Load from sessionStorage into memory cache
   */
  private loadFromStorage<T>(cacheKey: string): CacheEntry<T> | null {
    try {
      if (typeof window === 'undefined') {
        console.log(`🖥️ Server-side: Cannot access sessionStorage for ${cacheKey}`);
        return null;
      }
      
      const stored = sessionStorage.getItem(this.getStorageKey(cacheKey));
      if (!stored) return null;

      const entry = JSON.parse(stored) as CacheEntry<T>;
      
      // Validate entry structure and freshness
      if (!entry.data || !entry.url || !entry.timestamp || !this.isValid(entry)) {
        this.removeFromStorage(cacheKey);
        return null;
      }

      return entry;
    } catch (error) {
      console.warn(`Cache storage load error for ${cacheKey}:`, error);
      this.stats.errors++;
      this.removeFromStorage(cacheKey);
      return null;
    }
  }

  /**
   * Save to sessionStorage
   */
  private saveToStorage<T>(cacheKey: string, entry: CacheEntry<T>): void {
    try {
      if (typeof window === 'undefined') return;
      
      sessionStorage.setItem(
        this.getStorageKey(cacheKey),
        JSON.stringify(entry)
      );
    } catch (error) {
      console.warn(`Cache storage save error for ${cacheKey}:`, error);
      this.stats.errors++;
      // Continue without storage - memory cache still works
    }
  }

  /**
   * Remove from sessionStorage
   */
  private removeFromStorage(cacheKey: string): void {
    try {
      if (typeof window === 'undefined') return;
      sessionStorage.removeItem(this.getStorageKey(cacheKey));
    } catch (error) {
      // Silent fail - not critical
    }
  }

  /**
   * Cleanup expired entries from memory
   */
  private cleanup(): void {
    const now = Date.now();
    
    // Cleanup property cache
    for (const [key, entry] of this.propertyCache.entries()) {
      if (now - entry.timestamp > CACHE_CONFIG.TTL) {
        this.propertyCache.delete(key);
        this.removeFromStorage(key);
      }
    }
    
    // Cleanup unit cache
    for (const [key, entry] of this.unitCache.entries()) {
      if (now - entry.timestamp > CACHE_CONFIG.TTL) {
        this.unitCache.delete(key);
        this.removeFromStorage(key);
      }
    }

    // Enforce size limits
    if (this.propertyCache.size > CACHE_CONFIG.MAX_ENTRIES_PER_TYPE) {
      const oldest = Array.from(this.propertyCache.entries())
        .sort(([,a], [,b]) => a.timestamp - b.timestamp)
        .slice(0, this.propertyCache.size - CACHE_CONFIG.MAX_ENTRIES_PER_TYPE);
      
      oldest.forEach(([key]) => {
        this.propertyCache.delete(key);
        this.removeFromStorage(key);
      });
    }

    if (this.unitCache.size > CACHE_CONFIG.MAX_ENTRIES_PER_TYPE) {
      const oldest = Array.from(this.unitCache.entries())
        .sort(([,a], [,b]) => a.timestamp - b.timestamp)
        .slice(0, this.unitCache.size - CACHE_CONFIG.MAX_ENTRIES_PER_TYPE);
      
      oldest.forEach(([key]) => {
        this.unitCache.delete(key);
        this.removeFromStorage(key);
      });
    }
  }

  /**
   * Get property from cache
   */
  getProperty(reference: string): PropertyCacheEntry | null {
    const key = this.getKey('property', reference);
    console.log(`🔍 Cache GET: Looking for property key "${key}" (from reference "${reference}")`);
    
    // Check memory first
    let entry = this.propertyCache.get(key);
    console.log(`📝 Memory cache result:`, entry ? 'FOUND' : 'NOT FOUND');
    
    // If not in memory, try sessionStorage
    if (!entry) {
      entry = this.loadFromStorage<ListingDetails>(key) || undefined;
      console.log(`💾 Storage cache result:`, entry ? 'FOUND' : 'NOT FOUND');
      if (entry) {
        // Restore to memory cache
        this.propertyCache.set(key, entry);
      }
    }
    
    // Validate freshness
    if (entry && this.isValid(entry)) {
      console.log(`✅ Cache HIT for ${key}`);
      this.stats.hits++;
      return entry;
    }
    
    // Cleanup expired entry
    if (entry) {
      console.log(`⏰ Cache entry expired for ${key}`);
      this.propertyCache.delete(key);
      this.removeFromStorage(key);
    }
    
    console.log(`❌ Cache MISS for ${key}`);
    this.stats.misses++;
    return null;
  }

  /**
   * Set property in cache
   */
  setProperty(
    reference: string,
    data: ListingDetails,
    url: string,
    source: 'api' | 'fallback' = 'api',
    responseTime?: number
  ): void {
    const key = this.getKey('property', reference);
    console.log(`💾 Cache SET: Storing property key "${key}" (from reference "${reference}")`);
    
    const entry: PropertyCacheEntry = {
      data,
      url,
      timestamp: Date.now(),
      source,
      responseTime,
      reference: reference.trim()
    };

    // Save to both memory and storage
    this.propertyCache.set(key, entry);
    this.saveToStorage(key, entry);
    
    console.log(`✅ Cached property data for ${key}, memory size: ${this.propertyCache.size}`);
    
    this.stats.sets++;
    this.cleanup(); // Periodic cleanup
  }

  /**
   * Get unit from cache
   */
  getUnit(reference: string): UnitCacheEntry | null {
    const key = this.getKey('unit', reference);
    
    // Check memory first
    let entry = this.unitCache.get(key);
    
    // If not in memory, try sessionStorage
    if (!entry) {
      entry = this.loadFromStorage<UnitDetails>(key) || undefined;
      if (entry) {
        // Restore to memory cache
        this.unitCache.set(key, entry);
      }
    }
    
    // Validate freshness
    if (entry && this.isValid(entry)) {
      this.stats.hits++;
      return entry;
    }
    
    // Cleanup expired entry
    if (entry) {
      this.unitCache.delete(key);
      this.removeFromStorage(key);
    }
    
    this.stats.misses++;
    return null;
  }

  /**
   * Set unit in cache
   */
  setUnit(
    reference: string,
    data: UnitDetails,
    url: string,
    source: 'api' | 'fallback' = 'api',
    responseTime?: number
  ): void {
    const key = this.getKey('unit', reference);
    const entry: UnitCacheEntry = {
      data,
      url,
      timestamp: Date.now(),
      source,
      responseTime,
      reference: reference.trim()
    };

    // Save to both memory and storage
    this.unitCache.set(key, entry);
    this.saveToStorage(key, entry);
    
    this.stats.sets++;
    this.cleanup(); // Periodic cleanup
  }

  /**
   * Add cache metadata to URL for page consumption
   */
  addCacheMetadata(url: string, reference: string, type: 'property' | 'unit'): string {
    try {
      const urlObj = new URL(url, 'https://example.com'); // Handle relative URLs
      urlObj.searchParams.set('ref', reference);
      urlObj.searchParams.set('cached', 'true');
      urlObj.searchParams.set('type', type);
      urlObj.searchParams.set('t', Date.now().toString());
      
      return urlObj.pathname + urlObj.search;
    } catch (error) {
      // If URL parsing fails, return original URL
      console.warn('URL metadata addition failed:', error);
      return url;
    }
  }

  /**
   * Parse cache metadata from URL
   */
  parseCacheMetadata(url: string): {
    reference?: string;
    isCached?: boolean;
    type?: 'property' | 'unit';
    timestamp?: number;
  } {
    try {
      const urlObj = new URL(url, 'https://example.com');
      return {
        reference: urlObj.searchParams.get('ref') || undefined,
        isCached: urlObj.searchParams.get('cached') === 'true',
        type: urlObj.searchParams.get('type') as 'property' | 'unit' || undefined,
        timestamp: Number(urlObj.searchParams.get('t')) || undefined
      };
    } catch {
      return {};
    }
  }

  /**
   * Clear all caches (memory + storage)
   */
  clear(): void {
    this.propertyCache.clear();
    this.unitCache.clear();
    
    if (typeof window !== 'undefined') {
      // Clear all cache entries from sessionStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith(CACHE_CONFIG.STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
    }

    this.stats = { hits: 0, misses: 0, sets: 0, errors: 0 };
  }

  /**
   * Get cache statistics for monitoring
   */
  getStats() {
    return {
      ...this.stats,
      memorySizes: {
        properties: this.propertyCache.size,
        units: this.unitCache.size
      },
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
      version: CACHE_CONFIG.VERSION
    };
  }

  /**
   * Force cleanup - useful for memory management
   */
  forceCleanup(): void {
    this.cleanup();
  }
}

// Export singleton instance
export const unifiedSearchCache = new UnifiedSearchCache();

// Export types for consumers
export type { PropertyCacheEntry, UnitCacheEntry };