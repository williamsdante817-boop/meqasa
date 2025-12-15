import { fetchDeveloperUnitsServer } from "@/lib/developer-units-server";
import { API_CONFIG } from "./constants";
import type { ApiSearchParams, DeveloperUnit, SearchParams } from "./types";

export interface UnitsSearchResponse {
  units: DeveloperUnit[];
  hasMore: boolean;
}

// API utilities for units search
export function mapSearchParamsToApi(
  searchParams: SearchParams
): ApiSearchParams {
  const apiParams: ApiSearchParams = {
    app: API_CONFIG.APP_ID,
    offset: 0,
  };

  // Map search params to API params
  if (searchParams.terms) {
    apiParams.terms = Array.isArray(searchParams.terms)
      ? searchParams.terms[0]
      : searchParams.terms;
  } else {
    apiParams.terms = "sale"; // Default
  }

  if (searchParams.unittype && searchParams.unittype !== "all") {
    apiParams.unittype = Array.isArray(searchParams.unittype)
      ? searchParams.unittype[0]
      : searchParams.unittype;
  }

  if (searchParams.address) {
    apiParams.address = Array.isArray(searchParams.address)
      ? searchParams.address[0]
      : searchParams.address;
  }

  if (searchParams.maxprice && searchParams.maxprice !== "all") {
    const maxPrice = parseInt(
      Array.isArray(searchParams.maxprice)
        ? searchParams.maxprice[0]
        : searchParams.maxprice
    );
    if (!isNaN(maxPrice) && maxPrice > 0) {
      apiParams.maxprice = maxPrice;
    }
  }

  if (searchParams.beds && searchParams.beds !== "0") {
    const beds = parseInt(
      Array.isArray(searchParams.beds)
        ? searchParams.beds[0]
        : searchParams.beds
    );
    if (!isNaN(beds) && beds > 0) {
      apiParams.beds = beds;
    }
  }

  if (searchParams.baths && searchParams.baths !== "0") {
    const baths = parseInt(
      Array.isArray(searchParams.baths)
        ? searchParams.baths[0]
        : searchParams.baths
    );
    if (!isNaN(baths) && baths > 0) {
      apiParams.baths = baths;
    }
  }

  if (searchParams.projectid) {
    const projectId = parseInt(
      Array.isArray(searchParams.projectid)
        ? searchParams.projectid[0]
        : searchParams.projectid
    );
    if (!isNaN(projectId) && projectId > 0) {
      apiParams.projectid = projectId;
    }
  }

  if (searchParams.page) {
    const pageParam = Array.isArray(searchParams.page)
      ? searchParams.page[0]
      : searchParams.page;
    const parsedPage = parseInt(pageParam ?? "", 10);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      apiParams.offset = parsedPage - 1;
    }
  }

  return apiParams;
}

/**
 * Server-side function to fetch initial search results
 * **SERVER COMPONENTS ONLY** - Calls Meqasa API directly
 */
export async function fetchUnitsSearchResults(
  searchParams: SearchParams
): Promise<UnitsSearchResponse> {
  try {
    const apiParams = mapSearchParamsToApi(searchParams);

    console.log("[Server] Units search params:", apiParams);

    const units = await fetchDeveloperUnitsServer(apiParams);

    console.log(`[Server] Units search returned ${units.length} units`);

    return {
      units,
      hasMore: units.length > 0,
    };
  } catch (error) {
    console.error("[Server] Units search error:", error);
    return { units: [], hasMore: false };
  }
}


