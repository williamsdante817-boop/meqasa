import type {
  MeqasaListing,
  MeqasaSearchParams,
  MeqasaLoadMoreParams,
} from "@/types/meqasa";

interface MeqasaSearchResponse {
  resultcount: number;
  results: MeqasaListing[];
  searchid: number;
}

export async function searchProperties(
  contract: string,
  locality: string,
  params: MeqasaSearchParams,
): Promise<MeqasaSearchResponse> {
  const response = await fetch("/api/properties", {
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

export async function loadMoreProperties(
  contract: string,
  locality: string,
  params: MeqasaLoadMoreParams,
): Promise<MeqasaSearchResponse> {
  const response = await fetch("/api/properties", {
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
