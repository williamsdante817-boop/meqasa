import ContentSection from "@/components/layout/content-section";
import { LatestListingsSection } from "@/components/property/listings/latest-listings-section";
import type { Listing as CardListing } from "@/components/property/cards/property-card";
import type { LatestListingsResponse } from "@/lib/get-latest-listing";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StreamingLatestListingsProps {
  latestListingsPromise: Promise<LatestListingsResponse>;
}

export async function StreamingLatestListings({
  latestListingsPromise,
}: StreamingLatestListingsProps) {
  try {
    const raw: LatestListingsResponse = await latestListingsPromise;

    const isLatestListingsResponse = (
      value: unknown,
    ): value is {
      rentals: LatestListingsResponse["rentals"];
      selling: LatestListingsResponse["selling"];
    } => {
      if (typeof value !== "object" || value === null) return false;
      const v = value as { rentals?: unknown; selling?: unknown };
      return Array.isArray(v.rentals) && Array.isArray(v.selling);
    };

    if (!isLatestListingsResponse(raw)) {
      return (
        <ContentSection
          title="Latest Listings"
          description="View all recent property listings available."
          href="/search/rent?q=ghana&page=1"
          className="pt-14 md:pt-20 lg:pt-24 [&_p]:px-4 [&_h2]:px-4 w-full mx-auto md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]"
        >
          <Alert className="mx-auto max-w-md">
            <AlertTitle>No latest listings available</AlertTitle>
            <AlertDescription>
              There are no recent properties to show right now. Please check
              back later.
            </AlertDescription>
          </Alert>
        </ContentSection>
      );
    }

    const toCardListing = (
      l: LatestListingsResponse["rentals"][number],
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
      return (
        <ContentSection
          title="Latest Listings"
          description="View all recent property listings available."
          href="/search/rent?q=ghana&page=1"
          className="pt-14 md:pt-20 lg:pt-24 w-full [&_p]:px-4 [&_h2]:px-4 md:[&_p]:px-0 md:[&_h2]:px-0"
        >
          <Alert className="mx-auto max-w-md">
            <AlertTitle>No latest listings available</AlertTitle>
            <AlertDescription>
              There are no recent properties to show right now. Please check
              back later.
            </AlertDescription>
          </Alert>
        </ContentSection>
      );
    }

    return (
      <LatestListingsSection rentListings={rentals} saleListings={selling} />
    );
  } catch (error: unknown) {
    console.error("Failed to load latest listings:", error);
    return (
      <ContentSection
        title="Latest Listings"
        description="View all recent property listings available."
        href="/search/rent?q=ghana&page=1"
        className="pt-14 md:pt-20 lg:pt-24 w-full [&_p]:px-4 [&_h2]:px-4 md:[&_p]:px-0 md:[&_h2]:px-0"
      >
        <Alert variant="destructive" className="mx-auto max-w-md">
          <AlertTitle>Unable to load latest listings</AlertTitle>
          <AlertDescription>
            Something went wrong while fetching the latest properties. Please
            try again later.
          </AlertDescription>
        </Alert>
      </ContentSection>
    );
  }
}
