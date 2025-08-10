import { FeaturedListingsSection } from "@/components/featured-listings-section";
import { AlertCard } from "@/components/alert-card";
import type { getFeaturedListings } from "@/lib/get-featured-listings";

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

    return (
      <FeaturedListingsSection
        rentListings={featuredListings?.rentals ?? []}
        saleListings={featuredListings?.selling ?? []}
      />
    );
  } catch{
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
