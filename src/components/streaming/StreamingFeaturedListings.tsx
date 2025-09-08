import { FeaturedListingsSection } from "@/components/property/listings/featured-listings-section";
import { AlertCard } from "@/components/common/alert-card";
import type { FeaturedListingsResponse } from "@/lib/get-featured-listings";
import type { Listing as CardListing } from "@/components/property/cards/property-card";
import { formatNumberToCedis } from "@/lib/utils";

interface StreamingFeaturedListingsProps {
  featuredListingsPromise: Promise<FeaturedListingsResponse>;
}

export async function StreamingFeaturedListings({
  featuredListingsPromise,
}: StreamingFeaturedListingsProps) {
  try {
    const featuredListings = await featuredListingsPromise;

    if (!featuredListings) {
      return (
        <AlertCard
          title="No featured listings available at the moment."
          description="Please check back soon."
          className="my-8"
        />
      );
    }

    const toCardListing = (
      l: FeaturedListingsResponse["rentals"][number]
    ): CardListing => {
      const detailreq = l.detailreq ?? "";
      const cleanPath = detailreq.replace(/^https?:\/\/[^/]+\//, "");
      const idMatch = /-(\d+)$/.exec(cleanPath);
      const listingid = idMatch?.[1] ?? "0";

      // Use the original price data which is already cleaned by our transformer
      // The get-featured-listings.ts now uses propertyDataFetchers which applies extractNumericPrice
      const priceAmount = parseFloat(String(l.price || "0")) || 0;
      const formattedPriceAmount =
        priceAmount > 0 ? formatNumberToCedis(priceAmount) : "Price on request";

      return {
        detailreq: l.detailreq,
        image: l.image,
        streetaddress: l.streetaddress,
        garages: l.garages,
        title: l.title,
        listingid,
        bathroomcount: l.bathroomcount ?? String(l.baths ?? ""),
        bedroomcount: l.bedroomcount ?? String(l.beds ?? ""),
        price: l.price,
        pricepart1: formattedPriceAmount, // Clean formatted price without period
        pricepart2: l.contract === "rent" ? "month" : undefined, // Period only
        contract: l.contract,
      };
    };

    return (
      <FeaturedListingsSection
        rentListings={(featuredListings?.rentals ?? []).map(toCardListing)}
        saleListings={(featuredListings?.selling ?? []).map(toCardListing)}
      />
    );
  } catch {
    return (
      <AlertCard
        variant="destructive"
        title="Unable to render featured listings"
        description="Please try again later."
        className="my-8"
      />
    );
  }
}
