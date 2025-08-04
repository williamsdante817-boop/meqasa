interface CachedBanner<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class BannerCache {
  private cache = new Map<string, CachedBanner<unknown>>();
  private readonly defaultTTL = 7 * 60 * 1000; // 7 minutes default

  set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    const now = Date.now();
    const expiresAt = now + ttl;

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
    });
  }

  get<T>(key: string): T | null {
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // Check if cache has expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now > cached.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache stats for monitoring
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const cached of this.cache.values()) {
      if (now > cached.expiresAt) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      total: this.cache.size,
      valid: validEntries,
      expired: expiredEntries,
    };
  }
}

// Global banner cache instance
export const bannerCache = new BannerCache();

// Cache keys for different banner types
export const CACHE_KEYS = {
  LEADERBOARD: "leaderboard-banner",
  FLEXI: "flexi-banner",
  RECTANGLE: "rectangle-banners",
  // Static data cache keys
  AGENT_LOGOS: "agent-logos",
  BLOG_DATA: "blog-data",
  LOCATION_DATA: "location-data",
  SEO_TEXT: "seo-text",
} as const;

// Utility functions for banner caching
export async function getCachedBanner<T>(key: string): Promise<T | null> {
  return bannerCache.get<T>(key);
}

export function setCachedBanner<T>(key: string, data: T, ttl?: number): void {
  bannerCache.set(key, data, ttl);
}

// Cache invalidation functions
export function invalidateBannerCache(key?: string): void {
  if (key) {
    bannerCache.delete(key);
  } else {
    bannerCache.clear();
  }
}

export function invalidateAllBannerCaches(): void {
  Object.values(CACHE_KEYS).forEach((key) => {
    bannerCache.delete(key);
  });
}

// Force refresh specific banner type
export async function refreshBanner<T>(
  bannerType: keyof typeof CACHE_KEYS,
  fetchFunction: () => Promise<T>,
): Promise<T | null> {
  const cacheKey = CACHE_KEYS[bannerType];

  // Invalidate existing cache
  bannerCache.delete(cacheKey);

  try {
    // Fetch fresh data
    const freshData = await fetchFunction();

    // Cache the fresh data
    if (freshData) {
      setCachedBanner(cacheKey, freshData);
    }

    return freshData;
  } catch (error) {
    console.error(`Failed to refresh ${bannerType} banner:`, error);
    return null;
  }
}

// Clean up expired cache entries periodically
if (typeof window !== "undefined") {
  setInterval(() => {
    bannerCache.cleanup();
  }, 60 * 1000); // Clean up every minute
}
