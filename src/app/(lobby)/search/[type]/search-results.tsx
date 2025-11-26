import { CarouselPlugin } from "@/components/search/carousel-plugin";
import { FeaturedPropertyVariantCard } from "@/components/search/featured-property-variant";
import { PremiumPlusPropertyCard } from "@/components/search/premium-plus-card";
import { ResultsCard } from "@/components/search/results-card";
import { Button } from "@/components/ui/button";
import type { MeqasaListing, MeqasaSearchResponse } from "@/types/meqasa";
import { ServerPagination } from "./server-pagination";

interface SearchResultsProps {
  results: MeqasaListing[];
  totalResults: number;
  currentPage: number;
  searchId: number;
  type: string;
  searchData: MeqasaSearchResponse;
  searchParams: Record<string, string>;
}

export function SearchResults({
  results,
  totalResults,
  currentPage,
  searchId,
  searchData,
  searchParams,
}: SearchResultsProps) {
  const totalPages = Math.ceil(totalResults / 20);

  // Build URL for mobile "Load More" - just goes to next page with pagination
  const buildLoadMoreUrl = () => {
    const nextPage = currentPage + 1;
    const params = new URLSearchParams(searchParams);
    params.set("w", nextPage.toString());
    params.set("y", searchId.toString());
    if (totalPages > 0) {
      params.set("rtotal", totalResults.toString());
    }
    return `?${params.toString()}`;
  };

  return (
    <div className="w-full">
      <div className="">
        <div>
          {/* Top Ads Section */}
          {searchData?.topads && searchData.topads.length > 0 ? (
            searchData.topads.length === 1 && searchData.topads[0] ? (
              // Single Premium Plus card - full width
              <div className="mb-8">
                <PremiumPlusPropertyCard
                  key={searchData.topads[0].listingid}
                  data={searchData.topads[0]}
                />
              </div>
            ) : (
              // Multiple Premium Plus cards - carousel view
              <CarouselPlugin>
                {searchData.topads.map((property) => (
                  <PremiumPlusPropertyCard
                    key={property.listingid}
                    data={property}
                  />
                ))}
              </CarouselPlugin>
            )
          ) : null}

          {/* Featured Project 1 */}
          {searchData?.project1 && !("empty" in searchData.project1) && (
            <FeaturedPropertyVariantCard project={searchData.project1} />
          )}

          {/* Main Search Results */}
          <div className="grid grid-cols-1 gap-8">
            {results.map((property) => (
              <ResultsCard key={property.listingid} result={property} />
            ))}
          </div>

          {/* Pagination - Desktop & Tablet */}
          {results.length > 0 && (
            <>
              <ServerPagination
                currentPage={currentPage}
                totalPages={totalPages}
                searchId={searchId}
                searchParams={searchParams}
              />

              {/* Mobile Load More - Now just a link to next page */}
              <div className="my-8 block w-full text-center md:hidden">
                {currentPage < totalPages && (
                  <Button
                    asChild
                    className="text-brand-accent rounded px-4 py-2 font-semibold"
                    variant="outline"
                  >
                    <a href={buildLoadMoreUrl()}>Load More</a>
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* No Results */}
      {results.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          No properties found. Try adjusting your search criteria.
        </div>
      )}
    </div>
  );
}
