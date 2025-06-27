import type { ListingDetails } from "@/types";
import { apiFetch } from "./api-client";

type Listing = Pick<
  ListingDetails,
  | "detailreq"
  | "image"
  | "streetaddress"
  | "garages"
  | "title"
  | "price"
  | "contract"
> & {
  bathroomcount: string;
  bedroomcount: string;
};

/**
 * Fetches the featured listings from the MeQasa server.
 *
 * @returns A promise that resolves with an array of {@link Listing} objects,
 *          each containing details such as image, street address, number of
 *          bathrooms, bedrooms, garages, and title.
 * @throws An error if the request fails or the server returns an error.
 */
export async function getFeaturedListings(): Promise<Listing[]> {
  const url = "https://meqasa.com/hp-7";

  return await apiFetch<Listing[]>({
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
