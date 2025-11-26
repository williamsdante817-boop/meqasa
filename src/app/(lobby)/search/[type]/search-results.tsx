import { CarouselPlugin } from "@/components/search/carousel-plugin";
import { FeaturedPropertyVariantCard } from "@/components/search/featured-property-variant";
import { PremiumPlusPropertyCard } from "@/components/search/premium-plus-card";
import { ResultsCard } from "@/components/search/results-card";
import type { MeqasaListing, MeqasaSearchResponse } from "@/types/meqasa";
import { ClientPagination } from "./client-pagination";
import { MobileLoadMore } from "./mobile-load-more";

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
              <ClientPagination
                currentPage={currentPage}
                totalPages={totalPages}
                searchId={searchId}
                searchParams={searchParams}
              />

              {/* Mobile Load More - Client-side navigation */}
              <MobileLoadMore
                currentPage={currentPage}
                totalPages={totalPages}
                searchId={searchId}
                searchParams={searchParams}
                totalResults={totalResults}
              />
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
