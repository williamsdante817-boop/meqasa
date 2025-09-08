/**
 * Production-grade reference search optimization layer
 * Handles caching, deduplication, and performance monitoring
 */

interface CacheEntry {
  url: string;
  timestamp: number;
  hits: number;
  isValid: boolean;
}

interface PendingRequest {
  promise: Promise<string>;
  timestamp: number;
}

class ProductionReferenceCache {
  private cache = new Map<string, CacheEntry>();
  private pendingRequests = new Map<string, PendingRequest>();
  private readonly maxCacheSize = 500;
  private readonly cacheTimeout = 30 * 60 * 1000; // 30 minutes
  private readonly dedupeTimeout = 10 * 1000; // 10 seconds

  // Performance metrics
  private metrics = {
    cacheHits: 0,
    cacheMisses: 0,
    deduplicatedRequests: 0,
    totalRequests: 0,
    avgResponseTime: 0,
    errors: 0,
  };

  async get(
    reference: string,
    apiCall: () => Promise<string>
  ): Promise<string> {
    const startTime = performance.now();
    this.metrics.totalRequests++;

    try {
      // 1. Check cache first
      const cached = this.getCachedUrl(reference);
      if (cached) {
        this.metrics.cacheHits++;
        return cached;
      }

      // 2. Check for pending request (deduplication)
      const pending = this.pendingRequests.get(reference);
      if (pending && Date.now() - pending.timestamp < this.dedupeTimeout) {
        this.metrics.deduplicatedRequests++;
        return await pending.promise;
      }

      // 3. Make new API call
      this.metrics.cacheMisses++;
      const apiPromise = this.makeApiCall(reference, apiCall);

      // Store pending request for deduplication
      this.pendingRequests.set(reference, {
        promise: apiPromise,
        timestamp: Date.now(),
      });

      const result = await apiPromise;

      // Clean up pending request
      this.pendingRequests.delete(reference);

      // Cache the result
      this.setCachedUrl(reference, result);

      return result;
    } finally {
      // Update response time metrics
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      this.metrics.avgResponseTime =
        (this.metrics.avgResponseTime + responseTime) / 2;
    }
  }

  private getCachedUrl(reference: string): string | null {
    const entry = this.cache.get(reference);

    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.cacheTimeout) {
      this.cache.delete(reference);
      return null;
    }

    // Update hit count
    entry.hits++;
    return entry.url;
  }

  private setCachedUrl(reference: string, url: string): void {
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      this.evictOldestEntries(50); // Remove 10% of entries
    }

    this.cache.set(reference, {
      url,
      timestamp: Date.now(),
      hits: 1,
      isValid: true,
    });
  }

  private evictOldestEntries(count: number): void {
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp)
      .slice(0, count);

    entries.forEach(([key]) => this.cache.delete(key));
  }

  private async makeApiCall(
    reference: string,
    apiCall: () => Promise<string>
  ): Promise<string> {
    try {
      return await apiCall();
    } catch (error) {
      this.metrics.errors++;

      // Remove failed pending request
      this.pendingRequests.delete(reference);

      throw error;
    }
  }

  // Performance monitoring
  getMetrics() {
    const cacheHitRate =
      this.metrics.totalRequests > 0
        ? ((this.metrics.cacheHits / this.metrics.totalRequests) * 100).toFixed(
            2
          )
        : "0";

    return {
      ...this.metrics,
      cacheHitRate: `${cacheHitRate}%`,
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size,
    };
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    // Clean cache
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.cacheTimeout) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    // Clean expired pending requests
    for (const [key, request] of this.pendingRequests.entries()) {
      if (now - request.timestamp > this.dedupeTimeout) {
        this.pendingRequests.delete(key);
      }
    }

    if (cleaned > 0 && typeof window !== "undefined") {
      console.debug(`[ReferenceCache] Cleaned ${cleaned} expired entries`);
    }
  }

  // Clear all cache (for testing or memory pressure)
  clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
    this.metrics = {
      cacheHits: 0,
      cacheMisses: 0,
      deduplicatedRequests: 0,
      totalRequests: 0,
      avgResponseTime: 0,
      errors: 0,
    };
  }
}

// Global cache instance
export const prodReferenceCache = new ProductionReferenceCache();

// Auto-cleanup every 5 minutes
if (typeof window !== "undefined") {
  setInterval(
    () => {
      prodReferenceCache.cleanup();
    },
    5 * 60 * 1000
  );
}
