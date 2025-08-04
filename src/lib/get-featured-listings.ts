import type { ListingDetails } from "@/types";
import { apiFetch } from "./api-client";

type Listing = Pick<
  ListingDetails,
  | "detailreq"
  | "image"
  | "streetaddress"
  | "baths"
  | "beds"
  | "garages"
  | "title"
  | "price"
  | "contract"
> & {
  bathroomcount: string;
  bedroomcount: string;
};

export interface FeaturedListingsResponse {
  rentals: Listing[];
  selling: Listing[];
}

/**
 * Fetches the featured listings from the MeQasa server.
 *
 * @returns A promise that resolves with an object containing {@link FeaturedListingsResponse},
 *          with rentals and selling arrays, each containing {@link Listing} objects
 *          with details such as image, street address, number of
 *          bathrooms, bedrooms, garages, and title.
 * @throws An error if the request fails or the server returns an error.
 */
export async function getFeaturedListings(): Promise<FeaturedListingsResponse> {
  const url = "https://meqasa.com/hp-7";

  return await apiFetch<FeaturedListingsResponse>({
    url,
    method: "POST",
    params: {
      app: "vercel",
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}
