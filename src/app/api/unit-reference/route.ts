import type { UnitDetails } from "@/lib/get-unit-details";
import {
  cleanUnitReference,
  constructUnitUrlFromData,
  formatUnitReferenceForDisplay,
  generateGenericUnitSlug,
} from "@/lib/unit-reference-url-generator";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const runtime = "edge";

const MEQASA_UNIT_ENDPOINT = "https://meqasa.com/developer-units/details";

// Different TTLs for caching
const CACHE_TTL_SUCCESS = 60 * 30; // 30 minutes
const CACHE_TTL_NOT_FOUND = 60 * 5; // 5 minutes
const API_TIMEOUT_MS = 5000;

interface UnitReferenceResponse {
  reference: string;
  url: string;
  isValid: boolean;
  source: "api" | "cache";
  cachedAt?: string;
  unitData?: UnitDetails | null;
  error?: string;
  statusCode?: number;
}

/** Build a simple string-based cache key */
function buildCacheKey(reference: string): string {
  return `unit-ref:${reference}`;
}

/** Fetch unit details from upstream Meqasa API */
async function fetchUnitFromUpstream(slug: string): Promise<UnitDetails> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const upstreamUrl = `${MEQASA_UNIT_ENDPOINT}/${slug}?app=vercel`;
    const response = await fetch(upstreamUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Upstream error: ${response.status}`);
    }

    const payload = (await response.json()) as UnitDetails & {
      status?: string;
      msg?: string;
    };

    if ("status" in payload && payload.status === "fail") {
      throw new Error(payload.msg ?? "Unit not available");
    }

    return payload as UnitDetails;
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
  const normalized = cleanUnitReference(rawReference ?? "");

  if (!normalized) {
    return NextResponse.json(
      {
        reference: rawReference ?? "",
        url: "",
        isValid: false,
        source: "api",
        error:
          "Invalid or missing unit reference. Use letters and numbers only (max 20).",
        statusCode: 400,
      },
      { status: 400 }
    );
  }

  const cache =
    typeof caches === "undefined" ? null : await caches.open("default");
  const cacheKey = buildCacheKey(normalized);

  // Try cache first
  if (cache) {
    const cached = await cache.match(cacheKey);
    if (cached) {
      const cachedPayload = (await cached.json()) as UnitReferenceResponse;
      return NextResponse.json(
        {
          ...cachedPayload,
          source: "cache",
          statusCode: cachedPayload.statusCode ?? 200,
        },
        {
          headers: {
            ...buildCacheHeaders(
              cachedPayload.statusCode === 404
                ? CACHE_TTL_NOT_FOUND
                : CACHE_TTL_SUCCESS
            ),
            "x-cache": "HIT",
          },
        }
      );
    }
  }

  // If cache miss → fetch from API
  const slug = generateGenericUnitSlug(normalized).replace(
    "/developer-unit/",
    ""
  );

  try {
    const unitDetails = await fetchUnitFromUpstream(slug);
    const urlPath = constructUnitUrlFromData(unitDetails);

    const payload: UnitReferenceResponse = {
      reference: formatUnitReferenceForDisplay(normalized),
      url: urlPath,
      isValid: true,
      source: "api",
      cachedAt: new Date().toISOString(),
      unitData: unitDetails,
      statusCode: 200,
    };

    const response = NextResponse.json(payload, {
      headers: { ...buildCacheHeaders(CACHE_TTL_SUCCESS), "x-cache": "MISS" },
    });

    if (cache) await cache.put(cacheKey, response.clone());
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unit lookup failed";
    const isNotFound = /not available|not found/i.test(message);
    const status = isNotFound ? 404 : 502;

    const payload: UnitReferenceResponse = {
      reference: formatUnitReferenceForDisplay(normalized),
      url: "",
      isValid: false,
      source: "api",
      error: isNotFound
        ? "Unit not found. Please check the reference number."
        : message,
      statusCode: status,
    };

    const response = NextResponse.json(payload, {
      status,
      headers: {
        ...buildCacheHeaders(
          status === 404 ? CACHE_TTL_NOT_FOUND : CACHE_TTL_SUCCESS
        ),
        "x-cache": "MISS",
      },
    });

    // Cache 404 briefly, skip caching server errors
    if (cache && status === 404) await cache.put(cacheKey, response.clone());

    return response;
  }
}
