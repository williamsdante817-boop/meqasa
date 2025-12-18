import { CarouselPlugin } from "@/components/search/carousel-plugin";
import { FeaturedPropertyVariantCard } from "@/components/search/featured-property-variant";
import { PremiumPlusPropertyCard } from "@/components/search/premium-plus-card";
import { ResultsCard } from "@/components/search/results-card";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";
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
        <Empty className="max-w-2xl mx-auto">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search />
            </EmptyMedia>
            <EmptyTitle>No properties found</EmptyTitle>
            <EmptyDescription>
              We couldn&apos;t find any properties matching your search criteria.
              Try adjusting your filters or search for a different location.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild size="lg" variant="brand-primary" className="w-full sm:w-auto">
              <Link href="/">Browse All Properties</Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}
