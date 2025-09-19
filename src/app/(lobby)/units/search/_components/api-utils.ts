import type { SearchParams, ApiSearchParams, DeveloperUnit } from "./types";

// API utilities for units search
export function mapSearchParamsToApi(
  searchParams: SearchParams
): ApiSearchParams {
  const apiParams: ApiSearchParams = {
    app: "vercel",
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

  return apiParams;
}

// Server-side function to fetch initial search results
export async function fetchUnitsSearchResults(
  searchParams: SearchParams
): Promise<DeveloperUnit[]> {
  try {
    const apiParams = mapSearchParamsToApi(searchParams);

    // Use environment variable or fallback to localhost
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
    const apiUrl = `${baseUrl}/api/developer-units`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "MeQasa-App/1.0",
      },
      body: JSON.stringify(apiParams),
      // Cache for 5 minutes
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return [];
    }

    const units: unknown = await response.json();

    return Array.isArray(units) ? units as DeveloperUnit[] : [];
  } catch {
    return [];
  }
}

// Client-side function for fetching more results
export async function fetchMoreUnits(
  searchParams: SearchParams,
  page = 1
): Promise<{ units: DeveloperUnit[]; hasMore: boolean }> {
  try {
    const apiParams = mapSearchParamsToApi(searchParams);

    const response = await fetch("/api/developer-units", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...apiParams,
        page,
        limit: 12, // Standard page size
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const units = Array.isArray(data) ? data : [];

    return {
      units,
      hasMore: units.length === 12, // If we got full page, there might be more
    };
  } catch {
    return { units: [], hasMore: false };
  }
}
