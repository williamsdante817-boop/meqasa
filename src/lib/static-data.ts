import { blog } from "@/assets/data/blog";
import { location } from "@/assets/data/location";
import { getCachedBanner, setCachedBanner, CACHE_KEYS } from "./banner-cache";
import type { getAgentLogos } from "@/lib/get-agents-logos";

// Static data types
export interface StaticData {
  agentLogos: Awaited<ReturnType<typeof getAgentLogos>>;
  blogData: typeof blog;
  locationData: typeof location;
  seoText: string; // We'll define this
}

// Cache configuration for static data
const STATIC_CACHE_CONFIG = {
  agentLogos: { ttl: 24 * 60 * 60 * 1000 }, // 24 hours
  blogData: { ttl: 7 * 24 * 60 * 60 * 1000 }, // 1 week
  locationData: { ttl: 30 * 24 * 60 * 60 * 1000 }, // 1 month
  seoText: { ttl: 24 * 60 * 60 * 1000 }, // 24 hours
};

// Get cached agent logos
export async function getCachedAgentLogos() {
  const cacheKey = CACHE_KEYS.AGENT_LOGOS;

  // Check cache first
  const cached =
    await getCachedBanner<Awaited<ReturnType<typeof getAgentLogos>>>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Import and call the actual function
    const { getAgentLogos } = await import("./get-agents-logos");
    const data = await getAgentLogos();

    // Cache the result
    setCachedBanner(cacheKey, data, STATIC_CACHE_CONFIG.agentLogos.ttl);

    return data;
  } catch (error) {
    console.error("Failed to fetch agent logos:", error);
    return null;
  }
}

// Get cached blog data (currently static, but could be dynamic in future)
export async function getCachedBlogData() {
  const cacheKey = CACHE_KEYS.BLOG_DATA;

  // Check cache first
  const cached = await getCachedBanner<typeof blog>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // For now, return static data, but this could fetch from API in future
    const data = blog;

    // Cache the result
    setCachedBanner(cacheKey, data, STATIC_CACHE_CONFIG.blogData.ttl);

    return data;
  } catch (error) {
    console.error("Failed to fetch blog data:", error);
    return blog; // Fallback to static data
  }
}

// Get cached location data
export async function getCachedLocationData() {
  const cacheKey = CACHE_KEYS.LOCATION_DATA;

  // Check cache first
  const cached = await getCachedBanner<typeof location>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // For now, return static data, but this could fetch from API in future
    const data = location;

    // Cache the result
    setCachedBanner(cacheKey, data, STATIC_CACHE_CONFIG.locationData.ttl);

    return data;
  } catch (error) {
    console.error("Failed to fetch location data:", error);
    return location; // Fallback to static data
  }
}

// Get cached SEO text
export async function getCachedSeoText() {
  const cacheKey = CACHE_KEYS.SEO_TEXT;

  // Check cache first
  const cached = await getCachedBanner<string>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // For now, return static SEO text, but this could fetch from CMS in future
    const data =
      "Discover the best properties in Ghana with MeQasa. Find your dream home, office, or investment property with our comprehensive real estate platform.";

    // Cache the result
    setCachedBanner(cacheKey, data, STATIC_CACHE_CONFIG.seoText.ttl);

    return data;
  } catch (error) {
    console.error("Failed to fetch SEO text:", error);
    return "Discover the best properties in Ghana with MeQasa."; // Fallback
  }
}

// Get all static data in parallel
export async function getStaticData(): Promise<StaticData> {
  const [agentLogos, blogData, locationData, seoText] = await Promise.all([
    getCachedAgentLogos(),
    getCachedBlogData(),
    getCachedLocationData(),
    getCachedSeoText(),
  ]);

  return {
    agentLogos: agentLogos ?? [],
    blogData: blogData ?? blog,
    locationData: locationData ?? location,
    seoText: seoText ?? "Discover the best properties in Ghana with MeQasa.",
  };
}
