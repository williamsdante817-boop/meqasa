import type { BlogResponse } from "@/types/blog";

/**
 * Server-side function to fetch blog data for initial homepage render
 * This ensures fast server-side rendering with blog content
 */
export async function getBlogData(): Promise<BlogResponse> {
  try {
    const response = await fetch("https://meqasa.com/hp-12", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "MeQasa-Vercel-App/1.0",
      },
      body: "app=vercel",
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(8000), // 8 second timeout for server-side
      // Disable cache for server-side requests to ensure fresh data
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Blog API responded with status: ${response.status}`);
    }

    const rawData = (await response.json()) as unknown;

    // Handle double-encoded JSON string response
    let data: BlogResponse;
    if (typeof rawData === "string") {
      data = JSON.parse(rawData) as BlogResponse;
    } else {
      data = rawData as BlogResponse;
    }

    // Validate and clean response structure
    const cleanedData = {
      featured: Array.isArray(data.featured) ? data.featured : [],
      market: Array.isArray(data.market) ? data.market : [],
    };

    return cleanedData;
  } catch {
    // Return empty structure on error to prevent SSR failures
    const fallbackData = {
      featured: [],
      market: [],
    };

    return fallbackData;
  }
}
