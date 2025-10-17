import { ErrorStateCard } from "@/components/common/error-state-card";
import ContentSection from "@/components/layout/content-section";
import type { Listing as CardListing } from "@/components/property/cards/property-card";
import { FeaturedListingsSection } from "@/components/property/listings/featured-listings-section";
import type { FeaturedListingsResponse } from "@/lib/get-featured-listings";
import { logError } from "@/lib/logger";
import { formatNumberToCedis } from "@/lib/utils";

interface StreamingFeaturedListingsProps {
  featuredListingsPromise: Promise<FeaturedListingsResponse>;
}

export async function StreamingFeaturedListings({
  featuredListingsPromise,
}: StreamingFeaturedListingsProps) {
  const sectionClassName =
    "w-full pt-14 md:pt-20 lg:pt-24 [&_h2]:px-4 md:[&_h2]:px-0 [&_p]:px-4 md:[&_p]:px-0";
  const defaultHref = "/search/rent?q=ghana&w=1";

  const renderMessage = (
    title: string,
    description: string,
    variant: "info" | "error" = "info"
  ) => (
    <ContentSection
      title="Featured Listings"
      description="View all featured property listings available."
      href={defaultHref}
      className={sectionClassName}
    >
      <ErrorStateCard
        variant={variant === "error" ? "error" : "info"}
        title={title}
        description={description}
      />
    </ContentSection>
  );

  try {
    const featuredListings = await featuredListingsPromise;

    if (!featuredListings) {
      return renderMessage(
        "No featured listings available",
        "There are no featured properties to show right now. Please check back later.",
        "info"
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

    const rentListings = (featuredListings?.rentals ?? []).map(toCardListing);
    const saleListings = (featuredListings?.selling ?? []).map(toCardListing);

    if (rentListings.length === 0 && saleListings.length === 0) {
      return renderMessage(
        "No featured listings available",
        "There are no featured properties to show right now. Please check back later.",
        "info"
      );
    }

    return (
      <FeaturedListingsSection
        rentListings={rentListings}
        saleListings={saleListings}
      />
    );
  } catch (error) {
    logError("Failed to render featured listings", error, {
      component: "StreamingFeaturedListings",
    });
    return renderMessage(
      "Unable to load featured listings",
      "Something went wrong while fetching featured properties. Please try again later.",
      "error"
    );
  }
}
