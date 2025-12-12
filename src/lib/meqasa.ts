import { getBaseUrl } from "@/config/env";
import type {
  MeqasaLoadMoreParams,
  MeqasaSearchParams,
  MeqasaSearchResponse,
} from "@/types/meqasa";

interface RequestOptions {
  baseUrl?: string;
}

/**
 * Search for properties using the Meqasa API
 * @param contract - "rent" or "sale"
 * @param locality - location string
 * @param params - search parameters
 * @returns Promise<MeqasaSearchResponse>
 */
export async function searchProperties(
  contract: string,
  locality: string,
  params: MeqasaSearchParams,
  options: RequestOptions = {}
): Promise<MeqasaSearchResponse> {
  const isServer = typeof window === "undefined";

  // For server-side rendering, we need absolute URLs
  // For client-side, relative URLs work fine
  const resolveBaseUrl = (): string => {
    if (!isServer) return "";
    if (options.baseUrl) return options.baseUrl;
    return getBaseUrl();
  };

  const baseUrl = resolveBaseUrl();
  const apiUrl = baseUrl ? `${baseUrl.replace(/\/$/, "")}/api/properties` : "/api/properties";
  
  // Log URL resolution for debugging in production
  if (isServer && process.env.NODE_ENV === "production") {
    console.log("[searchProperties] Resolved API URL:", apiUrl, {
      baseUrl,
      hasOptionsBaseUrl: !!options.baseUrl,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      VERCEL_URL: process.env.VERCEL_URL,
    });
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "search",
      params: {
        contract,
        locality,
        ...params,
      },
    }),
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    // Enhanced error logging for production debugging
    const error = new Error(`Failed to search properties: ${response.status} ${response.statusText}`);
    console.error("searchProperties error:", {
      error: error.message,
      contract,
      locality,
      apiUrl,
      isServer,
      environment: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      baseUrlOverride: options.baseUrl,
      status: response.status,
      statusText: response.statusText,
    });
    throw error;
  }

  return response.json() as Promise<MeqasaSearchResponse>;
}

/**
 * Load more properties using searchId and page number
 * @param contract - "rent" or "sale"
 * @param locality - location string
 * @param params - load more parameters (searchId and page number)
 * @returns Promise<MeqasaSearchResponse>
 */
export async function loadMoreProperties(
  contract: string,
  locality: string,
  params: MeqasaLoadMoreParams,
  options: RequestOptions = {}
): Promise<MeqasaSearchResponse> {
  const isServer = typeof window === "undefined";

  // For server-side rendering, we need absolute URLs
  // For client-side, relative URLs work fine
  const resolveBaseUrl = (): string => {
    if (!isServer) return "";
    if (options.baseUrl) return options.baseUrl;
    return getBaseUrl();
  };

  const baseUrl = resolveBaseUrl();
  const apiUrl = baseUrl ? `${baseUrl.replace(/\/$/, "")}/api/properties` : "/api/properties";
  
  // Log URL resolution for debugging in production
  if (isServer && process.env.NODE_ENV === "production") {
    console.log("[loadMoreProperties] Resolved API URL:", apiUrl, {
      baseUrl,
      hasOptionsBaseUrl: !!options.baseUrl,
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
      VERCEL_URL: process.env.VERCEL_URL,
    });
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: "loadMore",
      params: {
        contract,
        locality,
        ...params,
      },
    }),
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    // Enhanced error logging for production debugging
    const error = new Error(`Failed to load more properties: ${response.status} ${response.statusText}`);
    console.error("loadMoreProperties error:", {
      error: error.message,
      contract,
      locality,
      apiUrl,
      isServer,
      environment: process.env.NODE_ENV,
      vercelUrl: process.env.VERCEL_URL,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      baseUrlOverride: options.baseUrl,
      status: response.status,
      statusText: response.statusText,
      params,
    });
    throw error;
  }

  return response.json() as Promise<MeqasaSearchResponse>;
}

/**
 * Map UI contract types to API contract types
 */
export const CONTRACT_TYPE_MAP: Record<string, string> = {
  rent: "rent",
  buy: "sale",
  land: "sale",
  "short-let": "rent",
};

/**
 * Get API contract type from UI type
 */
export function getApiContractType(uiType: string): string {
  return CONTRACT_TYPE_MAP[uiType] ?? uiType;
}

/**
 * Validate search parameters according to API documentation
 */
export function validateSearchParams(
  params: Partial<MeqasaSearchParams>
): boolean {
  // Validate property type
  if (
    params.ftype &&
    ![
      "apartment",
      "house",
      "office",
      "warehouse",
      "guest house",
      "townhouse",
      "land",
    ].includes(params.ftype)
  ) {
    return false;
  }

  // Validate bedrooms and bathrooms
  if (
    params.fbeds &&
    params.fbeds !== "- Any -" &&
    (typeof params.fbeds !== "number" || params.fbeds < 1)
  ) {
    return false;
  }
  if (
    params.fbaths &&
    params.fbaths !== "- Any -" &&
    (typeof params.fbaths !== "number" || params.fbaths < 1)
  ) {
    return false;
  }

  // Validate price range
  if (params.fmin && params.fmin < 0) return false;
  if (params.fmax && params.fmax < 0) return false;
  if (params.fmin && params.fmax && params.fmin >= params.fmax) return false;

  // Validate rent period
  if (
    params.frentperiod &&
    !["shortrent", "longrent", "- Any -"].includes(params.frentperiod)
  ) {
    return false;
  }

  // Validate sort order
  if (
    params.fsort &&
    !["date", "date2", "price", "price2"].includes(params.fsort)
  ) {
    return false;
  }

  return true;
}
