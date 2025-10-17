import { ErrorStateCard } from "@/components/common/error-state-card";
import ContentSection from "@/components/layout/content-section";
import type { Listing as CardListing } from "@/components/property/cards/property-card";
import { LatestListingsSection } from "@/components/property/listings/latest-listings-section";
import type { LatestListingsResponse } from "@/lib/get-latest-listing";
import { logError } from "@/lib/logger";

interface StreamingLatestListingsProps {
  latestListingsPromise: Promise<LatestListingsResponse>;
}

export async function StreamingLatestListings({
  latestListingsPromise,
}: StreamingLatestListingsProps) {
  const sectionClassName =
    "w-full pt-14 md:pt-20 lg:pt-24 [&_h2]:px-4 md:[&_h2]:px-0 [&_p]:px-4 md:[&_p]:px-0";

  const renderMessage = (
    title: string,
    description: string,
    variant: "info" | "error"
  ) => (
    <ContentSection
      title="Latest Listings"
      description="View all recent property listings available."
      href="/search/rent?q=ghana&w=1"
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
    const raw: LatestListingsResponse = await latestListingsPromise;

    const isLatestListingsResponse = (
      value: unknown
    ): value is {
      rentals: LatestListingsResponse["rentals"];
      selling: LatestListingsResponse["selling"];
    } => {
      if (typeof value !== "object" || value === null) return false;
      const v = value as { rentals?: unknown; selling?: unknown };
      return Array.isArray(v.rentals) && Array.isArray(v.selling);
    };

    if (!isLatestListingsResponse(raw)) {
      return renderMessage(
        "No latest listings available",
        "There are no recent properties to show right now. Please check back later.",
        "info"
      );
    }

    const toCardListing = (
      l: LatestListingsResponse["rentals"][number]
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
        bathroomcount: l.bathroomcount,
        bedroomcount: l.bedroomcount,
        price: l.price,
        contract: l.contract,
      };
    };

    const rentals = raw.rentals.map(toCardListing);
    const selling = raw.selling.map(toCardListing);

    if (rentals.length === 0 && selling.length === 0) {
      return renderMessage(
        "No latest listings available",
        "There are no recent properties to show right now. Please check back later.",
        "info"
      );
    }

    return (
      <LatestListingsSection rentListings={rentals} saleListings={selling} />
    );
  } catch (error: unknown) {
    logError("Failed to load latest listings", error, {
      component: "StreamingLatestListings",
    });
    return renderMessage(
      "Unable to load latest listings",
      "Something went wrong while fetching the latest properties. Please try again later.",
      "error"
    );
  }
}
