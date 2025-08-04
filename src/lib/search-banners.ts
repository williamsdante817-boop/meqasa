import { apiFetch } from "./api-client";
import { getCachedBanner, setCachedBanner, CACHE_KEYS } from "./banner-cache";

// 1. Get Hero Banner
export async function getHeroBanner() {
  // Hero banner should not be cached - always fetch fresh
  try {
    const data = await apiFetch<{ src: string; href: string }>({
      url: "https://meqasa.com/rp-0",
      method: "POST",
      params: { app: "vercel" },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // Keep cache-busting headers for hero banner
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

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

// 2. Get Leaderboard Banner
export async function getLeaderboardBanner() {
  const cacheKey = CACHE_KEYS.LEADERBOARD;

  // Check cache first
  const cached = await getCachedBanner<string>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch("https://meqasa.com/rp-6", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // Remove cache-busting headers
      },
      body: new URLSearchParams({ app: "vercel" }).toString(),
    });
    if (!response.ok) throw new Error("Failed to fetch leaderboard banner");

    const result = await response.text();

    // Cache the result for 7 minutes
    setCachedBanner(cacheKey, result, 7 * 60 * 1000);

    return result;
  } catch (error) {
    console.error("Failed to fetch leaderboard banner:", error);
    return null;
  }
}

// 3. Get Flexi Banner
export async function getFlexiBanner() {
  const cacheKey = CACHE_KEYS.FLEXI;

  // Check cache first
  const cached = await getCachedBanner<string>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch("https://meqasa.com/rp-10", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // Remove cache-busting headers
      },
      body: new URLSearchParams({ app: "vercel" }).toString(),
    });
    if (!response.ok) throw new Error("Failed to fetch flexi banner");

    const result = await response.text();

    // Cache the result for 7 minutes
    setCachedBanner(cacheKey, result, 7 * 60 * 1000);

    return result;
  } catch (error) {
    console.error("Failed to fetch flexi banner:", error);
    return null;
  }
}

// 4. Get Rectangle Banners
export async function getRectangleBanners() {
  const cacheKey = CACHE_KEYS.RECTANGLE;

  // Check cache first
  const cached =
    await getCachedBanner<Array<{ src: string; href: string }>>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const data = await apiFetch<Array<{ src: string; href: string }>>({
      url: "https://meqasa.com/rp-12",
      method: "POST",
      params: { app: "vercel" },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        // Remove cache-busting headers
      },
    });

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
