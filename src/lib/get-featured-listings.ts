import type { ListingDetails } from "@/types";
import { propertyDataFetchers } from "./api/data-fetchers";

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
 * @deprecated Consider migrating to propertyDataFetchers.getFeaturedListings() for standardized types
 * @returns A promise that resolves with an object containing {@link FeaturedListingsResponse},
 *          with rentals and selling arrays, each containing {@link Listing} objects
 *          with details such as image, street address, number of
 *          bathrooms, bedrooms, garages, and title.
 * @throws An error if the request fails or the server returns an error.
 */
export async function getFeaturedListings(): Promise<FeaturedListingsResponse> {
  try {
    // Use the new standardized data fetcher
    const standardizedResponse =
      await propertyDataFetchers.getFeaturedListings();

    // Transform standardized response back to legacy format for backward compatibility
    const transformToLegacy = (
      properties: typeof standardizedResponse.rentals
    ): Listing[] => {
      return properties.map((property) => {
        return {
          detailreq: property.reference,
          image: property.coverImage,
          streetaddress: property.location,
          baths: property.bathrooms.toString(),
          beds: property.bedrooms.toString(),
          garages: "0", // Default value as not available in standardized format
          title: property.title,
          price: property.pricing.amount.toString(), // Always use cleaned numeric amount
          contract: property.contract,
          bathroomcount: property.bathrooms.toString(),
          bedroomcount: property.bedrooms.toString(),
        };
      });
    };

    return {
      rentals: transformToLegacy(standardizedResponse.rentals),
      selling: transformToLegacy(standardizedResponse.selling),
    };
  } catch (error) {
    console.error("Featured listings fetch failed:", error);
    // Return empty arrays instead of throwing to maintain application stability
    return {
      rentals: [],
      selling: [],
    };
  }
}
