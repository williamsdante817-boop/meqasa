import type { ListingDetails } from "@/types/property";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const runtime = "edge";

const MEQASA_REFERENCE_ENDPOINT = "https://meqasa.com/mqrouter/ref";

// Different cache TTLs
const CACHE_TTL_SUCCESS = 60 * 30; // 30 minutes
const CACHE_TTL_NOT_FOUND = 60 * 5; // 5 minutes
const API_TIMEOUT_MS = 5000;

interface ReferenceApiResponse {
  reference: string;
  url: string;
  isValid: boolean;
  source: "api" | "cache";
  cachedAt?: string;
  propertyData?: ListingDetails | null;
  error?: string;
  statusCode?: number;
}

/** Normalize and validate a property reference */
function normalizeReference(reference: string | null): string | null {
  if (!reference) return null;
  const clean = reference.replace(/[^a-zA-Z0-9]/g, "").trim();
  if (!clean || clean.length > 20 || /^0+$/.test(clean)) return null;
  return clean.toUpperCase();
}

/** Use simple string cache keys instead of Request objects */
function buildCacheKey(reference: string): string {
  return `reference:${reference}`;
}

/** Always uppercase */
function formatReference(reference: string): string {
  return reference.toUpperCase();
}

/** Build user-friendly property URLs */
function buildPropertyUrl(data: ListingDetails, fallbackRef: string): string {
  const {
    detailreq,
    type = "property",
    contract = "rent",
    location = "Ghana",
    locationstring,
    listingid,
  } = data;

  if (detailreq) {
    // Strip protocol + domain
    const cleanPath = detailreq.replace(/^https?:\/\/[^/]+\//, "");

    // Ensure only valid listing paths are returned
    if (/^\/?listings\/[a-zA-Z0-9-_]+/.test(cleanPath)) {
      return cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    }
  }

  const locationName = locationstring || location;
  const typeSlug = type.toLowerCase().replace(/\s+/g, "-");
  const contractSlug = contract.toLowerCase();
  const locationSlug = locationName
    .split(" ")
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase();

  const id = listingid ?? fallbackRef;
  return `/listings/${typeSlug}-for-${contractSlug}-at-${locationSlug}-${id}`;
}

/** Fetch property details from upstream API */
async function fetchReferenceFromUpstream(
  reference: string
): Promise<ListingDetails> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const upstreamResponse = await fetch(MEQASA_REFERENCE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ refref: reference, app: "vercel" }),
      signal: controller.signal,
    });

    if (!upstreamResponse.ok) {
      throw new Error(`Upstream error: ${upstreamResponse.status}`);
    }

    const payload = (await upstreamResponse.json()) as
      | ListingDetails
      | { status?: string; msg?: string };

    if ("status" in payload && payload.status === "fail") {
      throw new Error(payload.msg ?? "Listing not available");
    }

    return payload as ListingDetails;
  } finally {
    clearTimeout(timeout);
  }
}

/** Build cache headers dynamically */
function buildCacheHeaders(ttl: number): Record<string, string> {
  const base = `public, max-age=0, s-maxage=${ttl}, stale-while-revalidate=${Math.round(
    ttl / 2
  )}`;
  return {
    "Cache-Control": base,
    "CDN-Cache-Control": base,
    "Vercel-CDN-Cache-Control": base,
  };
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const rawReference = url.searchParams.get("ref");
  const reference = normalizeReference(rawReference);

  if (!reference) {
    return NextResponse.json(
      {
        reference: rawReference ?? "",
        url: "",
        isValid: false,
        error:
          "Invalid or missing reference. Use only letters and numbers (max 20).",
        statusCode: 400,
      },
      { status: 400 }
    );
  }

  const cache =
    typeof caches === "undefined" ? null : await caches.open("default");
  const cacheKey = buildCacheKey(reference);

  // Try cache first
  if (cache) {
    const cached = await cache.match(cacheKey);
    if (cached) {
      const cachedData = (await cached.json()) as ReferenceApiResponse;
      return NextResponse.json(
        {
          ...cachedData,
          source: "cache",
          statusCode: cachedData.statusCode ?? 200,
        },
        {
          headers: {
            ...buildCacheHeaders(
              cachedData.statusCode === 404
                ? CACHE_TTL_NOT_FOUND
                : CACHE_TTL_SUCCESS
            ),
            "x-cache": "HIT",
          },
        }
      );
    }
  }

  // Fetch upstream if no cache
  try {
    const listingDetails = await fetchReferenceFromUpstream(reference);
    const urlPath = buildPropertyUrl(listingDetails, reference);

    const payload: ReferenceApiResponse = {
      reference: formatReference(reference),
      url: urlPath,
      isValid: true,
      source: "api",
      cachedAt: new Date().toISOString(),
      propertyData: listingDetails,
      statusCode: 200,
    };

    const response = NextResponse.json(payload, {
      headers: { ...buildCacheHeaders(CACHE_TTL_SUCCESS), "x-cache": "MISS" },
    });

    if (cache) await cache.put(cacheKey, response.clone());
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Reference lookup failed";
    const status =
      message.includes("not available") || message.includes("not found")
        ? 404
        : 502;

    const response = NextResponse.json(
      {
        reference: formatReference(reference),
        url: "",
        isValid: false,
        source: "api",
        error:
          status === 404
            ? "Property not found. Please check the reference number."
            : message,
        statusCode: status,
      },
      {
        status,
        headers: {
          ...buildCacheHeaders(
            status === 404 ? CACHE_TTL_NOT_FOUND : CACHE_TTL_SUCCESS
          ),
          "x-cache": "MISS",
        },
      }
    );

    // Cache 404s briefly, but avoid caching upstream errors
    if (cache && status === 404) await cache.put(cacheKey, response.clone());

    return response;
  }
}
