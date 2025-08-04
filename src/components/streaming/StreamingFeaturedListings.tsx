import { FeaturedListingsSection } from "@/components/featured-listings-section";
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
        <div className="text-center py-8 text-brand-muted">
          No featured listings available at the moment.
        </div>
      );
    }

    return (
      <FeaturedListingsSection
        rentListings={featuredListings?.rentals ?? []}
        saleListings={featuredListings?.selling ?? []}
      />
    );
  } catch (error) {
    console.error("Failed to load featured listings:", error);
    return (
      <div className="text-center py-8 text-brand-muted">
        Unable to load featured listings. Please try again later.
      </div>
    );
  }
}
