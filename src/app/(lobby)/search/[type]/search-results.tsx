/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { CarouselPlugin } from "@/components/search/carousel-plugin";
import { FeaturedPropertyVariantCard } from "@/components/search/featured-property-variant";
import { PremiumPlusPropertyCard } from "@/components/search/premium-plus-card";
import { ResultsCard } from "@/components/search/results-card";
import SearchResultsSkeleton from "@/components/search/SearchResultsSkeleton";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { MeqasaListing, MeqasaSearchResponse } from "@/types/meqasa";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface SearchResultsProps {
  type: string;
  location: string;
  initialResults: MeqasaListing[];
  initialTotal: number;
  initialSearchId: number;
  initialPage: number;
  initialSearchData: MeqasaSearchResponse;
  onSearchIdUpdate?: (searchId: number, page: number) => void;
}

function getPaginationItems(current: number, total: number) {
  const pages = [];
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("start-ellipsis");
    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(total - 1, current + 1);
      i++
    ) {
      pages.push(i);
    }
    if (current < total - 2) pages.push("end-ellipsis");
    pages.push(total);
  }
  return pages;
}

export function SearchResults({
  type,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  location,
  initialResults,
  initialTotal,
  initialSearchId,
  initialPage,
  initialSearchData,
  onSearchIdUpdate,
}: SearchResultsProps) {
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();
  const [searchResults, setSearchResults] =
    useState<MeqasaListing[]>(initialResults);
  const [totalResults, setTotalResults] = useState(initialTotal);
  // Use the complete initial search data from server with fallbacks
  const defaultSearchState: MeqasaSearchResponse = {
    topads: [],
    project1: { empty: true },
    project2: { empty: true },
    bottomads: [],
    searchdesc: "",
    results: initialResults,
    resultcount: initialTotal,
    searchid: initialSearchId,
  };

  const initialSearchState: MeqasaSearchResponse = initialSearchData
    ? {
        ...initialSearchData,
        results: initialResults,
        resultcount: initialTotal,
        searchid: initialSearchId,
      }
    : defaultSearchState;

  const [search, setSearch] =
    useState<MeqasaSearchResponse>(initialSearchState);
  const [searchId, setSearchId] = useState<number | null>(initialSearchId);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);

  // Helper function to detect if this is a short-let search
  const isShortLetSearch = () => {
    return type === "rent" && searchParams.get("frentperiod") === "shortrent";
  };

  // Ensure component is mounted before running client-side effects
  useEffect(() => {
    setMounted(true);
  }, []);

  // Track the last processed initial search ID to prevent duplicate processing
  const lastProcessedSearchId = useRef<number | null>(null);

  // Sync component state with new server data when initial props change
  // This handles cases where user clicks property type links and page re-renders with new server data
  useEffect(() => {
    // Only sync if we have genuinely new search data from server that we haven't processed yet
    if (
      mounted &&
      initialSearchId !== null &&
      initialSearchId !== lastProcessedSearchId.current &&
      initialSearchId !== searchId &&
      !isLoading // Don't interfere with ongoing operations
    ) {
      // Mark this searchId as processed to prevent duplicate updates
      lastProcessedSearchId.current = initialSearchId;

      // Reset all state to match new server data
      setSearchResults(initialResults);
      setTotalResults(initialTotal);
      setSearch(initialSearchState);
      setSearchId(initialSearchId);
      setCurrentPage(initialPage);

      // Clear prefetched data since it's for the old search
      setPrefetchedNextPage(null);
      setPrefetchedTotal(null);
      setPrefetchedSearch(null);
      isPrefetching.current = false;

      // Reset the initial data processing flag for the new search
      hasProcessedInitialData.current = false;
    }
  }, [mounted, initialSearchId, searchId, isLoading]); // Only depend on stable primitive values

  // Prefetch next page
  const [prefetchedNextPage, setPrefetchedNextPage] = useState<
    MeqasaListing[] | null
  >(null);
  const [prefetchedTotal, setPrefetchedTotal] = useState<number | null>(null);
  const [prefetchedSearch, setPrefetchedSearch] =
    useState<MeqasaSearchResponse | null>(null);
  const isPrefetching = useRef(false);

  // Flag to prevent re-fetching initial server data
  const hasProcessedInitialData = useRef(false);

  // Store searchId in sessionStorage whenever it changes (for backward compatibility)
  useEffect(() => {
    if (searchId && typeof window !== "undefined") {
      sessionStorage.setItem("meqasa_searchId", searchId.toString());
    }
  }, [searchId]);

  // Scroll to top when loading starts
  useEffect(() => {
    if (isLoading) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isLoading]);

  // Handle all search parameter changes
  useEffect(() => {
    // Only run on client side after component is mounted
    if (!mounted) return;

    const urlPage = parseInt(searchParams.get("page") ?? "1");
    const urlSearchId = searchParams.get("searchId")
      ? parseInt(searchParams.get("searchId")!)
      : null;

    // Skip initial server data on first mount
    if (
      !hasProcessedInitialData.current &&
      urlPage === initialPage &&
      urlSearchId === initialSearchId
    ) {
      hasProcessedInitialData.current = true;
      return;
    }

    // Skip if we already have the correct data (avoid unnecessary refetch)
    if (
      urlPage === currentPage &&
      urlSearchId === searchId &&
      searchId !== null
    ) {
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const searchParamsObj = searchParams
          ? Object.fromEntries(searchParams.entries())
          : {};
        const locality = searchParamsObj.q;
        const pageParam = urlPage;
        const currentSearchId = urlSearchId ?? searchId;

        if (!locality) {
          console.error("Missing required parameter: locality");
          return;
        }

        // If we have a searchId and page param, fetch that specific page
        if (currentSearchId && pageParam > 1) {
          const response = await fetch("/api/properties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "loadMore",
              params: {
                y: currentSearchId,
                w: pageParam,
                ...searchParamsObj,
                contract: type,
                locality,
                propertyType: searchParamsObj.type ?? "",
                app: "vercel",
                // Add short-let specific parameters if this is a short-let search
                ...(isShortLetSearch() && {
                  frentperiod: "shortrent",
                  ftype: "- Any -",
                  ...(searchParamsObj.fhowshort && {
                    fhowshort: searchParamsObj.fhowshort,
                  }),
                }),
              },
            }),
          });

          if (!response.ok) throw new Error("Failed to fetch page");
          const data = (await response.json()) as MeqasaSearchResponse;
          setSearchResults(data.results);
          setTotalResults(data.resultcount);
          setSearch(data);
          setCurrentPage(pageParam);
          setSearchId(currentSearchId);
          setIsLoading(false);
          // Note: URL is already updated by handlePageChange, no need to update again
          return;
        }

        // Initial search - only if search parameters actually changed (not just page)
        const response = await fetch("/api/properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "search",
            params: {
              ...searchParamsObj,
              contract: type,
              locality,
              propertyType: searchParamsObj.type ?? "",
              app: "vercel",
              // Add short-let specific parameters if this is a short-let search
              ...(isShortLetSearch() && {
                frentperiod: "shortrent",
                ftype: "- Any -",
                ...(searchParamsObj.fhowshort && {
                  fhowshort: searchParamsObj.fhowshort,
                }),
              }),
            },
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch properties");
        const data = (await response.json()) as MeqasaSearchResponse;
        setSearchResults(data.results);
        setTotalResults(data.resultcount);
        setSearch(data);

        // When we get a new searchId from filter/location changes, reset to page 1
        const newSearchId = data.searchid;
        const isNewSearch = newSearchId !== searchId;

        setSearchId(newSearchId);

        if (isNewSearch) {
          // Reset to page 1 for new searches
          setCurrentPage(1);
          // Update URL with new searchId via callback
          onSearchIdUpdate?.(newSearchId, 1);
        } else {
          setCurrentPage(pageParam);
          // Update URL with current searchId and page
          onSearchIdUpdate?.(newSearchId, pageParam);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if there are search parameters and it's not just initial load with correct data
    if (searchParams.toString()) {
      void fetchResults();
    }
  }, [
    mounted,
    searchParams.get("q"),
    searchParams.get("ftype"),
    searchParams.get("fbeds"),
    searchParams.get("fbaths"),
    searchParams.get("fmin"),
    searchParams.get("fmax"),
    searchParams.get("page"),
    searchParams.get("frentperiod"), // Add short-let rent period
    searchParams.get("fhowshort"), // Add short-let duration
    type,
  ]);

  // Prefetch next page
  useEffect(() => {
    // Only run on client side after component is mounted
    if (!mounted) return;

    // Clear prefetched data when searchId changes (new search)
    if (searchId !== initialSearchId) {
      setPrefetchedNextPage(null);
      setPrefetchedTotal(null);
      setPrefetchedSearch(null);
      isPrefetching.current = false;
    }

    // Add prefetch debug logging
    // console.log("🔍 Prefetch check:", {
    //   isLoading,
    //   searchId,
    //   currentPage,
    //   totalResults,
    //   maxPages: Math.ceil(totalResults / 20),
    //   isPrefetching: isPrefetching.current,
    //   hasPrefetchedData: !!prefetchedNextPage,
    // });

    if (
      !isLoading &&
      searchId && // Ensure we have a valid searchId
      searchId > 0 && // Ensure valid searchId
      currentPage > 0 && // Ensure valid page
      totalResults > 0 && // Ensure we have results
      currentPage < Math.ceil(totalResults / 20) &&
      !isPrefetching.current
    ) {
      // console.log("🚀 Starting prefetch for page", currentPage + 1);
      isPrefetching.current = true;
      const nextPage = currentPage + 1;
      const searchParamsObj = searchParams
        ? Object.fromEntries(searchParams.entries())
        : {};

      fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "loadMore",
          params: {
            y: searchId,
            w: nextPage,
            ...searchParamsObj,
            contract: type,
            locality: searchParamsObj.q,
            propertyType: searchParamsObj.type ?? "",
            app: "vercel",
            // Add short-let specific parameters if this is a short-let search
            ...(isShortLetSearch() && {
              frentperiod: "shortrent",
              ftype: "- Any -",
              ...(searchParamsObj.fhowshort && {
                fhowshort: searchParamsObj.fhowshort,
              }),
            }),
          },
        }),
      })
        .then((res) => res.json())
        .then((data: MeqasaSearchResponse) => {
          // console.log("✅ Prefetch success:", {
          //   searchId: data.searchid,
          //   expectedSearchId: searchId,
          //   resultsCount: data.results.length,
          // });
          // Only set prefetched data if searchId hasn't changed
          if (data.searchid == searchId) {
            setPrefetchedNextPage(data.results);
            setPrefetchedTotal(data.resultcount);
            setPrefetchedSearch(data);
            // console.log("✅ Prefetched data set for page", currentPage + 1);
          } else {
            // console.log("❌ Prefetch searchId mismatch, discarding data");
          }
          isPrefetching.current = false;
        })
        .catch((error) => {
          console.error("❌ Prefetch failed:", error);
          isPrefetching.current = false;
        });
    }
  }, [mounted, isLoading, currentPage, totalResults, searchId, type]);

  // When user clicks pagination, provide immediate feedback and update URL
  const handlePageChange = async (pageNumber: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!mounted || !searchId || pageNumber === currentPage) return;

    // Check if we have prefetched data for instant navigation
    if (
      prefetchedNextPage &&
      pageNumber === currentPage + 1 &&
      prefetchedSearch &&
      prefetchedSearch.searchid == searchId
    ) {
      // console.log("⚡ Using prefetched data for page", pageNumber);
      // Instant navigation with prefetched data
      setSearchResults(prefetchedNextPage);
      setTotalResults(prefetchedTotal!);
      setSearch(prefetchedSearch);
      setCurrentPage(pageNumber);

      // Clear prefetched data
      setPrefetchedNextPage(null);
      setPrefetchedTotal(null);
      setPrefetchedSearch(null);

      // Update URL via callback
      onSearchIdUpdate?.(searchId, pageNumber);

      return; // Exit early - no need for useEffect to handle this
    }

    // Provide immediate visual feedback for non-prefetched pages
    setIsLoading(true);

    // Update URL via callback
    onSearchIdUpdate?.(searchId, pageNumber);

    // The useEffect will handle fetching the data since page parameter changed
  };

  const handleLoadMore = async () => {
    if (!mounted || !searchId) return;
    const nextPage = currentPage + 1;

    // Update URL via callback
    onSearchIdUpdate?.(searchId, nextPage);
    setIsLoading(true);
    try {
      const searchParamsObj = searchParams
        ? Object.fromEntries(searchParams.entries())
        : {};
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "loadMore",
          params: {
            y: searchId,
            w: nextPage,
            ...searchParamsObj,
            contract: type,
            locality: searchParamsObj.q,
            propertyType: searchParamsObj.type ?? "",
            app: "vercel",
            // Add short-let specific parameters if this is a short-let search
            ...(isShortLetSearch() && {
              frentperiod: "shortrent",
              ftype: "- Any -",
              ...(searchParamsObj.fhowshort && {
                fhowshort: searchParamsObj.fhowshort,
              }),
            }),
          },
        }),
      });
      if (!response.ok) throw new Error("Failed to fetch page");
      const data = (await response.json()) as MeqasaSearchResponse;

      // Only update state if the response searchId matches our current searchId
      if (Number(data.searchid) === Number(searchId)) {
        setSearchResults((prev) => [...prev, ...data.results]);
        setTotalResults(data.resultcount);
        setSearch(data);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error("Error fetching page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Only show skeleton when loading new data, not during initial mount
  if (isLoading && mounted) {
    return <SearchResultsSkeleton />;
  }

  return (
    <div className="w-full">
      <div className="">
        <div>
          {/* Main search results and cards */}

          {search?.topads && search.topads.length > 0 ? (
            search.topads.length === 1 && search.topads[0] ? (
              // Single Premium Plus card - full width
              <div className="mb-8">
                <PremiumPlusPropertyCard
                  key={search.topads[0].listingid}
                  data={search.topads[0]}
                />
              </div>
            ) : (
              // Multiple Premium Plus cards - carousel view
              <CarouselPlugin>
                {search.topads.map((property) => (
                  <PremiumPlusPropertyCard
                    key={property.listingid}
                    data={property}
                  />
                ))}
              </CarouselPlugin>
            )
          ) : null}
          {search?.project1 && !("empty" in search.project1) && (
            <FeaturedPropertyVariantCard project={search.project1} />
          )}
          <div className="grid grid-cols-1 gap-8">
            {searchResults.map((property) => (
              <ResultsCard key={property.listingid} result={property} />
            ))}
          </div>

          {searchResults.length > 0 && (
            <>
              {/* Desktop/tablet pagination */}
              <div className="text-brand-accent my-8 hidden w-full justify-center overflow-x-auto md:flex">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (!isLoading && currentPage > 1) {
                            void handlePageChange(currentPage - 1);
                          }
                        }}
                        aria-disabled={currentPage === 1 || isLoading}
                      />
                    </PaginationItem>
                    {getPaginationItems(
                      currentPage,
                      Math.ceil(totalResults / 20)
                    ).map((item, idx) => (
                      <PaginationItem key={idx}>
                        {item === "start-ellipsis" ||
                        item === "end-ellipsis" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            href="#"
                            isActive={currentPage === item}
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage !== item) {
                                void handlePageChange(item as number);
                              }
                            }}
                          >
                            {item}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (
                            !isLoading &&
                            currentPage < Math.ceil(totalResults / 20)
                          ) {
                            void handlePageChange(currentPage + 1);
                          }
                        }}
                        aria-disabled={
                          currentPage === Math.ceil(totalResults / 20) ||
                          isLoading
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
              {/* Mobile Load More button */}
              <div className="my-8 block w-full text-center md:hidden">
                {searchResults.length < totalResults && (
                  <Button
                    className="text-brand-accent rounded px-4 py-2 font-semibold"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    variant="outline"
                  >
                    {isLoading ? "Loading..." : "Load More"}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {searchResults.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          No properties found. Try adjusting your search criteria.
        </div>
      )}
    </div>
  );
}
