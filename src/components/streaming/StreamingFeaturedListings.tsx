import { FeaturedListingsSection } from "@/components/featured-listings-section";
import { AlertCard } from "@/components/alert-card";
import type {
  getFeaturedListings,
  FeaturedListingsResponse,
} from "@/lib/get-featured-listings";
import type { Listing as CardListing } from "@/components/property-card";

interface StreamingFeaturedListingsProps {
  featuredListingsPromise: ReturnType<typeof getFeaturedListings>;
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
      l: FeaturedListingsResponse["rentals"][number],
    ): CardListing => {
      const detailreq = l.detailreq ?? "";
      const cleanPath = detailreq.replace(/^https?:\/\/[^/]+\//, "");
      const idMatch = /-(\d+)$/.exec(cleanPath);
      const listingid = idMatch?.[1] ?? "0";

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
        title="Unable to load featured listings"
        description="Please try again later."
        className="my-8"
      />
    );
  }
}
