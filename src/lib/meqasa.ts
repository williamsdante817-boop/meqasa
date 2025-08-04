import type {
  MeqasaSearchParams,
  MeqasaLoadMoreParams,
  MeqasaSearchResponse,
} from "@/types/meqasa";

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
): Promise<MeqasaSearchResponse> {
  const isServer = typeof window === "undefined";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const apiUrl = isServer ? `${baseUrl}/api/properties` : "/api/properties";

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
  });

  if (!response.ok) {
    throw new Error("Failed to search properties");
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
): Promise<MeqasaSearchResponse> {
  const isServer = typeof window === "undefined";
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const apiUrl = isServer ? `${baseUrl}/api/properties` : "/api/properties";

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
  });

  if (!response.ok) {
    throw new Error("Failed to load more properties");
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
  params: Partial<MeqasaSearchParams>,
): boolean {
  // Validate property type
  if (
    params.ftype &&
    ![
      "apartment",
      "house",
      "office",
      "warehouse",
      "guesthouse",
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
