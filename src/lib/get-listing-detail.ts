import { apiClient } from "./axios-client";
import type { ListingDetails } from "@/types";

export interface SimilarListings extends ListingDetails {
  summary: string;
}

/**
 * Fetches the listing details for a specific listing ID from the MeQasa server.
 *
 * @param id - The unique identifier for the listing to retrieve details for.
 * @returns A promise that resolves with an object of type {@link SimilarListings},
 * which includes various details such as the summary of the listing.
 * @throws An error if the request fails or the server returns an error.
 */

export async function getListingDetails(id: string): Promise<SimilarListings> {
  const url = "https://meqasa.com/mqrouter/ref";

  const response = await apiClient.post<
    SimilarListings | { status: string; msg?: string }
  >(
    url,
    {
      refref: id,
      app: "vercel",
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  // Check if the API returned a fail status (even with 200 HTTP status)
  if ("status" in response && response.status === "fail") {
    throw new Error(response.msg ?? "Listing not available");
  }

  return response as SimilarListings;
}
