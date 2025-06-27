import { apiFetch } from "./api-client";
import type { ListingDetails } from "@/types";

type Listing = Pick<
  ListingDetails,
  | "detailreq"
  | "image"
  | "streetaddress"
  | "baths"
  | "beds"
  | "garages"
  | "title"
  | "contract"
  | "price"
> & {
  summary?: string;
  bathroomcount: string; // Rename `baths` to `bathroomcount`
  bedroomcount: string; // Rename `beds` to `bedroomcount`
};

/**
 * Fetches the latest listings from the MeQasa server.
 *
 * @returns A promise that resolves with an array of {@link Listing} objects,
 *          each containing details such as image, street address, number of
 *          bathrooms, bedrooms, garages, and title.
 */

export async function getLatestListings(): Promise<Listing[]> {
  const url = "https://meqasa.com/hp-8";

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
