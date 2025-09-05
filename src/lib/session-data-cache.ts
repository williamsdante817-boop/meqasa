/**
 * Production-Ready Session Data Cache
 * Eliminates duplicate API calls using sessionStorage + clean URLs
 * Features: TTL expiry, automatic cleanup, type safety, error recovery
 */

import type { ListingDetails } from "@/types/property";
import type { UnitDetails } from "./get-unit-details";

// Cache configuration
const CACHE_CONFIG = {
  TTL: 5 * 60 * 1000, // 5 minutes
  KEY_PREFIX: 'meqasa_cache_',
  MAX_ENTRIES: 20, // Memory management
  VERSION: '1.0'
} as const;

// Cache entry structure
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  reference: string;
  type: 'property' | 'unit';
  version: string;
}

// Cache types
type PropertyCacheEntry = CacheEntry<ListingDetails>;
type UnitCacheEntry = CacheEntry<UnitDetails>;

/**
 * Session-based data cache for search results
 * Stores data temporarily to eliminate duplicate API calls
 */
class SessionDataCache {
  private stats = {
    hits: 0,
    misses: 0,
    sets: 0,
    cleanups: 0,
    errors: 0
  };

  /**
   * Generate cache key with timestamp for uniqueness
   */
  private generateCacheKey(type: 'property' | 'unit', reference: string): string {
    const cleanRef = reference.trim().replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const timestamp = Date.now();
    return `${CACHE_CONFIG.KEY_PREFIX}${type}_${cleanRef}_${timestamp}`;
  }

  /**
   * Generate storage key for sessionStorage
   */
  private getStorageKey(cacheKey: string): string {
    return cacheKey;
  }

  /**
   * Check if cache entry is valid (not expired)
   */
  private isValid<T>(entry: CacheEntry<T>): boolean {
    const now = Date.now();
    const age = now - entry.timestamp;
    return age < entry.ttl && entry.version === CACHE_CONFIG.VERSION;
  }

  /**
   * Safely parse JSON from sessionStorage
   */
  private safeParseJSON<T>(data: string): CacheEntry<T> | null {
    try {
      const parsed = JSON.parse(data) as CacheEntry<T>;
      
      // Validate structure
      if (!parsed.data || !parsed.timestamp || !parsed.reference) {
        return null;
      }
      
      return parsed;
    } catch (error) {
      console.warn('Failed to parse cache data:', error);
      this.stats.errors++;
      return null;
    }
  }

  /**
   * Store property data in session cache
   */
  setProperty(reference: string, data: ListingDetails): string {
    if (typeof window === 'undefined') {
      console.warn('SessionStorage not available on server');
      return '';
    }

    try {
      const cacheKey = this.generateCacheKey('property', reference);
      const entry: PropertyCacheEntry = {
        data,
        timestamp: Date.now(),
        ttl: CACHE_CONFIG.TTL,
        reference: reference.trim(),
        type: 'property',
        version: CACHE_CONFIG.VERSION
      };

      sessionStorage.setItem(
        this.getStorageKey(cacheKey),
        JSON.stringify(entry)
      );

      this.stats.sets++;
      this.periodicCleanup();
      
      console.log(`💾 Cached property data: ${cacheKey}`);
      return cacheKey;
      
    } catch (error) {
      console.warn('Failed to cache property data:', error);
      this.stats.errors++;
      return '';
    }
  }

  /**
   * Store unit data in session cache
   */
  setUnit(reference: string, data: UnitDetails): string {
    if (typeof window === 'undefined') {
      console.warn('SessionStorage not available on server');
      return '';
    }

    try {
      const cacheKey = this.generateCacheKey('unit', reference);
      const entry: UnitCacheEntry = {
        data,
        timestamp: Date.now(),
        ttl: CACHE_CONFIG.TTL,
        reference: reference.trim(),
        type: 'unit',
        version: CACHE_CONFIG.VERSION
      };

      sessionStorage.setItem(
        this.getStorageKey(cacheKey),
        JSON.stringify(entry)
      );

      this.stats.sets++;
      this.periodicCleanup();
      
      console.log(`💾 Cached unit data: ${cacheKey}`);
      return cacheKey;
      
    } catch (error) {
      console.warn('Failed to cache unit data:', error);
      this.stats.errors++;
      return '';
    }
  }

  /**
   * Get property data by cache key
   */
  getProperty(cacheKey: string): ListingDetails | null {
    if (typeof window === 'undefined') {
      console.log(`🖥️ Server-side: Cannot access sessionStorage for ${cacheKey}`);
      return null;
    }

    try {
      const stored = sessionStorage.getItem(this.getStorageKey(cacheKey));
      if (!stored) {
        console.log(`❌ Cache MISS: No data found for ${cacheKey}`);
        this.stats.misses++;
        return null;
      }

      const entry = this.safeParseJSON<ListingDetails>(stored);
      if (!entry) {
        this.removeFromCache(cacheKey);
        this.stats.misses++;
        return null;
      }

      if (!this.isValid(entry)) {
        console.log(`⏰ Cache EXPIRED for ${cacheKey}`);
        this.removeFromCache(cacheKey);
        this.stats.misses++;
        return null;
      }

      console.log(`✅ Cache HIT: Retrieved property data from ${cacheKey}`);
      this.stats.hits++;
      return entry.data;
      
    } catch (error) {
      console.warn(`Cache retrieval error for ${cacheKey}:`, error);
      this.removeFromCache(cacheKey);
      this.stats.errors++;
      return null;
    }
  }

  /**
   * Get unit data by cache key
   */
  getUnit(cacheKey: string): UnitDetails | null {
    if (typeof window === 'undefined') {
      console.log(`🖥️ Server-side: Cannot access sessionStorage for ${cacheKey}`);
      return null;
    }

    try {
      const stored = sessionStorage.getItem(this.getStorageKey(cacheKey));
      if (!stored) {
        console.log(`❌ Cache MISS: No data found for ${cacheKey}`);
        this.stats.misses++;
        return null;
      }

      const entry = this.safeParseJSON<UnitDetails>(stored);
      if (!entry) {
        this.removeFromCache(cacheKey);
        this.stats.misses++;
        return null;
      }

      if (!this.isValid(entry)) {
        console.log(`⏰ Cache EXPIRED for ${cacheKey}`);
        this.removeFromCache(cacheKey);
        this.stats.misses++;
        return null;
      }

      console.log(`✅ Cache HIT: Retrieved unit data from ${cacheKey}`);
      this.stats.hits++;
      return entry.data;
      
    } catch (error) {
      console.warn(`Cache retrieval error for ${cacheKey}:`, error);
      this.removeFromCache(cacheKey);
      this.stats.errors++;
      return null;
    }
  }

  /**
   * Remove entry from cache
   */
  private removeFromCache(cacheKey: string): void {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(this.getStorageKey(cacheKey));
      }
    } catch (error) {
      // Silent fail - not critical
    }
  }

  /**
   * Build clean URL with cache parameter
   */
  buildCachedUrl(baseUrl: string, cacheKey: string): string {
    try {
      const urlObj = new URL(baseUrl, window.location.origin);
      urlObj.searchParams.set('cached', cacheKey);
      return urlObj.pathname + urlObj.search;
    } catch (error) {
      console.warn('Failed to build cached URL:', error);
      return baseUrl;
    }
  }

  /**
   * Extract cache key from URL
   */
  extractCacheKey(url: string | URLSearchParams): string | null {
    try {
      if (typeof url === 'string') {
        const urlObj = new URL(url, window.location.origin);
        return urlObj.searchParams.get('cached');
      } else {
        return url.get('cached');
      }
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate clean URL without cache parameters
   */
  getCleanUrl(currentUrl: string): string {
    try {
      const urlObj = new URL(currentUrl, window.location.origin);
      urlObj.searchParams.delete('cached');
      return urlObj.pathname + (urlObj.search || '');
    } catch (error) {
      return currentUrl.split('?')[0] || currentUrl; // Fallback
    }
  }

  /**
   * Periodic cleanup of expired entries
   */
  private periodicCleanup(): void {
    if (typeof window === 'undefined') return;
    
    // Only cleanup occasionally to avoid performance impact
    if (Math.random() > 0.1) return; // 10% chance
    
    try {
      const toRemove: string[] = [];
      
      // Check all sessionStorage items for expired cache entries
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (!key?.startsWith(CACHE_CONFIG.KEY_PREFIX)) continue;
        
        const stored = sessionStorage.getItem(key);
        if (!stored) continue;
        
        const entry = this.safeParseJSON(stored);
        if (!entry || !this.isValid(entry)) {
          toRemove.push(key);
        }
      }
      
      // Remove expired entries
      toRemove.forEach(key => {
        sessionStorage.removeItem(key);
        this.stats.cleanups++;
      });
      
      if (toRemove.length > 0) {
        console.log(`🧹 Cleaned up ${toRemove.length} expired cache entries`);
      }
      
    } catch (error) {
      console.warn('Cache cleanup error:', error);
      this.stats.errors++;
    }
  }

  /**
   * Clear all cache entries
   */
  clearAll(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith(CACHE_CONFIG.KEY_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
      
      this.stats = { hits: 0, misses: 0, sets: 0, cleanups: 0, errors: 0 };
      console.log(`🧹 Cleared ${keysToRemove.length} cache entries`);
      
    } catch (error) {
      console.warn('Failed to clear cache:', error);
      this.stats.errors++;
    }
  }

  /**
   * Get cache statistics for monitoring
   */
  getStats() {
    return {
      ...this.stats,
      hitRate: this.stats.hits / (this.stats.hits + this.stats.misses) || 0,
      totalEntries: typeof window !== 'undefined' 
        ? Object.keys(sessionStorage).filter(key => 
            key.startsWith(CACHE_CONFIG.KEY_PREFIX)
          ).length 
        : 0
    };
  }
}

// Export singleton instance
export const sessionDataCache = new SessionDataCache();

// Export types for consumers
export type { PropertyCacheEntry, UnitCacheEntry };