import { apiClient } from "./axios-client";
import { getCachedBanner, setCachedBanner, CACHE_KEYS } from "./banner-cache";

export type BannerType = "home" | "results";

interface BannerConfig {
  url: string;
  type: BannerType;
}

const BANNER_CONFIGS: Record<string, BannerConfig> = {
  hero: {
    url: "https://meqasa.com/hp-0",
    type: "home",
  },
  resultsHero: {
    url: "https://meqasa.com/rp-0",
    type: "results",
  },
  leaderboard: {
    url: "https://meqasa.com/hp-6",
    type: "results",
  },
  flexi: {
    url: "https://meqasa.com/rp-10",
    type: "results",
  },
  rectangle: {
    url: "https://meqasa.com/rp-12",
    type: "results",
  },
};

// Unified banner fetching function with caching
export async function getBanner(type: keyof typeof BANNER_CONFIGS) {
  const config = BANNER_CONFIGS[type];
  if (!config) throw new Error(`No config for banner type: ${type}`);
  const cacheKey = CACHE_KEYS[type.toUpperCase() as keyof typeof CACHE_KEYS];

  // Check cache first
  const cached = await getCachedBanner<{ src: string; href: string }>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const data = await apiClient.post<{ src: string; href: string }>(
      config.url,
      { app: "vercel" },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          // Remove cache-busting headers to allow caching
        },
      },
    );

    const result = {
      src: "https://dve7rykno93gs.cloudfront.net" + data.src,
      href: "https://meqasa.com" + data.href,
    };

    // Cache the result for 7 minutes
    setCachedBanner(cacheKey, result, 7 * 60 * 1000);

    return result;
  } catch (error) {
    console.error(`Failed to fetch ${type} banner:`, error);
    return null;
  }
}

// Convenience functions for backward compatibility
export async function getHeroBanner() {
  // Hero banner should not be cached - always fetch fresh
  const config = BANNER_CONFIGS.hero;

  if (!config) {
    console.error("Hero banner config not found");
    return null;
  }

  try {
    const data = await apiClient.post<{ src: string; href: string }>(
      config.url,
      { app: "vercel" },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          // Keep cache-busting headers for hero banner
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );

    return {
      src:
        "https://dve7rykno93gs.cloudfront.net" + data.src + "?v=" + Date.now(),
      href: "https://meqasa.com" + data.href,
    };
  } catch (error) {
    console.error("Failed to fetch hero banner:", error);
    return null;
  }
}

export async function getResultsHeroBanner() {
  // Results hero banner should not be cached - always fetch fresh
  const config = BANNER_CONFIGS.resultsHero;

  if (!config) {
    console.error("Results hero banner config not found");
    return null;
  }

  try {
    const data = await apiClient.post<{ src: string; href: string }>(
      config.url,
      { app: "vercel" },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          // Keep cache-busting headers for hero banner
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );

    return {
      src:
        "https://dve7rykno93gs.cloudfront.net" + data.src + "?v=" + Date.now(),
      href: "https://meqasa.com" + data.href,
    };
  } catch (error) {
    console.error("Failed to fetch results hero banner:", error);
    return null;
  }
}

export async function getLeaderboardBanner() {
  const cacheKey = CACHE_KEYS.LEADERBOARD;

  // Check cache first
  const cached = await getCachedBanner<string>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const result = await apiClient.post<string>(
      "https://meqasa.com/rp-6",
      { app: "vercel" },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          // Remove cache-busting headers
        },
        responseType: "text",
      },
    );

    // Cache the result for 7 minutes
    setCachedBanner(cacheKey, result, 7 * 60 * 1000);

    return result;
  } catch (error) {
    console.error("Failed to fetch leaderboard banner:", error);
    return null;
  }
}

export async function getFlexiBanner() {
  const cacheKey = CACHE_KEYS.FLEXI;

  // Check cache first
  const cached = await getCachedBanner<string>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const result = await apiClient.post<string>(
      "https://meqasa.com/rp-10",
      { app: "vercel" },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          // Remove cache-busting headers
        },
        responseType: "text",
      },
    );

    // Cache the result for 7 minutes
    setCachedBanner(cacheKey, result, 7 * 60 * 1000);

    return result;
  } catch (error) {
    console.error("Failed to fetch flexi banner:", error);
    return null;
  }
}

export async function getRectangleBanners() {
  const cacheKey = CACHE_KEYS.RECTANGLE;

  // Check cache first
  const cached =
    await getCachedBanner<Array<{ src: string; href: string }>>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const data = await apiClient.post<Array<{ src: string; href: string }>>(
      "https://meqasa.com/rp-12",
      { app: "vercel" },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          // Remove cache-busting headers
        },
      },
    );

    const result = data.map((banner) => ({
      src: "https://dve7rykno93gs.cloudfront.net" + banner.src,
      href: "https://meqasa.com" + banner.href,
    }));

    // Cache the result for 7 minutes
    setCachedBanner(cacheKey, result, 7 * 60 * 1000);

    return result;
  } catch (error) {
    console.error("Failed to fetch rectangle banners:", error);
    return [];
  }
}
