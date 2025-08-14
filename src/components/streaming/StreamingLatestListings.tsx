import ContentSection from "@/components/content-section";
import { LatestListingsSection } from "@/components/latest-listings-section";
import type { Listing as TabListing } from "@/components/latest-listings-tab";
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
    ): value is { rentals: TabListing[]; selling: TabListing[] } => {
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

    const { rentals, selling } = raw;

    if (rentals.length === 0 && selling.length === 0) {
      return (
        <ContentSection
          title="Latest Listings"
          description="View all recent property listings available."
          href="/search/rent?q=ghana&page=1"
          className="pt-14 md:pt-20 lg:pt-24 [&_p]:px-4 [&_h2]:px-4 w-full"
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
        className="pt-14 md:pt-20 lg:pt-24 [&_p]:px-4 [&_h2]:px-4 w-full mx-auto md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]"
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
