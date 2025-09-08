import { NextResponse } from "next/server";
import type { BlogResponse } from "@/types/blog";

/**
 * API route for fetching featured blog articles and market news
 * Proxies the external meQasa blog API with proper CORS handling
 */
export async function GET() {
  try {
    const response = await fetch("https://meqasa.com/hp-12", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "MeQasa-Vercel-App/1.0",
      },
      body: "app=vercel",
      // Add timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
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

    // Validate response structure
    if (!data || typeof data !== "object") {
      throw new Error("Invalid blog API response structure");
    }

    // Ensure arrays exist even if empty
    const validatedData: BlogResponse = {
      featured: Array.isArray(data.featured) ? data.featured : [],
      market: Array.isArray(data.market) ? data.market : [],
    };

    // Set cache headers for better performance
    return NextResponse.json(validatedData, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600", // 30min cache, 1hr stale
      },
    });
  } catch {
    // Return empty structure on error to prevent UI breaks
    const fallbackData: BlogResponse = {
      featured: [],
      market: [],
    };

    return NextResponse.json(fallbackData, {
      status: 200, // Return 200 to prevent React Query error states
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600", // Shorter cache on error
      },
    });
  }
}
