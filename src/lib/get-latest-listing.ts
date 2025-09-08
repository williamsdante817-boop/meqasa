import { apiClient } from "./axios-client";
import type { ListingDetails } from "@/types";

type RawListing = Pick<
  ListingDetails,
  "detailreq" | "image" | "streetaddress" | "garages" | "title"
> & {
  summary?: string;
  bathroomcount: string; // Rename `baths` to `bathroomcount`
  bedroomcount: string; // Rename `beds` to `bedroomcount`
  contract?: string;
  price?: string;
};

interface LatestListingsRawResponse {
  newrent: RawListing[];
  newsale: RawListing[];
}

export type LatestListing = Omit<RawListing, "price"> & { price: string };

export interface LatestListingsResponse {
  rentals: LatestListing[];
  selling: LatestListing[];
}

/**
 * Fetches the latest listings from the MeQasa server.
 *
 * @returns A promise that resolves with an object containing two arrays:
 *          {@link LatestListingsResponse}. Each array contains {@link Listing}
 *          objects with details such as image, street address, number of
 *          bathrooms, bedrooms, garages, and title.
 */

export async function getLatestListings(): Promise<LatestListingsResponse> {
  const url = "https://meqasa.com/hp-8";

  const data = await apiClient.post<LatestListingsRawResponse>(
    url,
    {
      app: "vercel",
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const normalize = (items: RawListing[] | undefined): LatestListing[] =>
    (items ?? []).map((item) => ({
      ...item,
      price: item.price ?? "",
    }));

  return {
    rentals: normalize(data?.newrent),
    selling: normalize(data?.newsale),
  };
}
