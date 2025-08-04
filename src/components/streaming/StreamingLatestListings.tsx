import ContentSection from "@/components/content-section";
import PropertyListings from "@/components/property-listings";
import type { getLatestListings } from "@/lib/get-latest-listing";

interface StreamingLatestListingsProps {
  latestListingsPromise: ReturnType<typeof getLatestListings>;
}

export async function StreamingLatestListings({
  latestListingsPromise,
}: StreamingLatestListingsProps) {
  try {
    const latestListings = await latestListingsPromise;

    if (!latestListings || latestListings.length === 0) {
      return (
        <ContentSection
          title="Latest Listings"
          description="View all recent property listings available."
          href="/search/rent?q=ghana&page=1"
          className="pt-14 md:pt-20 lg:pt-24 [&_p]:px-4 [&_h2]:px-4 w-full mx-auto md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]"
        >
          <div className="text-center py-8 text-brand-muted">
            No latest listings available at the moment.
          </div>
        </ContentSection>
      );
    }

    return (
      <ContentSection
        title="Latest Listings"
        description="View all recent property listings available."
        href="/search/rent?q=ghana&page=1"
        className="pt-14 md:pt-20 lg:pt-24 [&_p]:px-4 [&_h2]:px-4 w-full mx-auto md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]"
      >
        <PropertyListings listings={latestListings} />
      </ContentSection>
    );
  } catch (error) {
    console.error("Failed to load latest listings:", error);
    return (
      <ContentSection
        title="Latest Listings"
        description="View all recent property listings available."
        href="/search/rent?q=ghana&page=1"
        className="pt-14 md:pt-20 lg:pt-24 [&_p]:px-4 [&_h2]:px-4 w-full mx-auto md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]"
      >
        <div className="text-center py-8 text-brand-muted">
          Unable to load latest listings. Please try again later.
        </div>
      </ContentSection>
    );
  }
}
