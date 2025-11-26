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
import { ANY_SENTINEL } from "@/lib/search/constants";
import { isShortLetQuery } from "@/lib/search/short-let";
import type { MeqasaListing, MeqasaSearchResponse } from "@/types/meqasa";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

interface SearchResultsProps {
  type: string;
  location: string;
  initialResults: MeqasaListing[];
  initialTotal: number;
  initialSearchId: number;
  initialPage: number;
  initialSearchData: MeqasaSearchResponse;
  onSearchIdUpdate?: (searchId: number, page: number, total: number) => void;
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
  const [currentPage, setCurrentPage] = useState(initialPage);
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
  const [isLoading, setIsLoading] = useState(false);
  const skipNextFetch = useRef(false);
  const baseTotalRef = useRef<number>(initialTotal);
  const lastSignatureRef = useRef<string | null>(null);
  const latestRequestRef = useRef(0);

  const searchSignature = useMemo(() => {
    const entries = Array.from(searchParams.entries()).filter(
      ([key]) => key !== "y" && key !== "w" && key !== "rtotal"
    );
    entries.sort(([a], [b]) => a.localeCompare(b));
    return entries.map(([key, value]) => `${key}=${value}`).join("&");
  }, [searchParams]);

  useEffect(() => {
    if (lastSignatureRef.current === null && searchSignature) {
      lastSignatureRef.current = searchSignature;
    }
  }, [searchSignature]);

  // Helper function to detect if this is a short-let search
  const isShortLetSearch = () =>
    type === "rent" &&
    isShortLetQuery({
      frentperiod: searchParams.get("frentperiod"),
      fhowshort: searchParams.get("fhowshort"),
    });

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
      baseTotalRef.current = initialTotal;
      setSearch(initialSearchState);
      setSearchId(initialSearchId);
      setCurrentPage(initialPage);
      lastSignatureRef.current = searchSignature;
    }
  }, [
    mounted,
    initialSearchId,
    searchId,
    isLoading,
    initialResults,
    initialTotal,
    initialSearchState,
    initialPage,
    searchSignature,
  ]); // Only depend on stable primitive values

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

  // Sync component state with URL parameters - URL is the source of truth
  // This ensures that when URL changes (direct navigation, back/forward, etc.),
  // the component state updates to match
  useEffect(() => {
    if (!mounted) return;

    const urlPage = parseInt(searchParams.get("w") ?? "1", 10);
    const urlSearchId = searchParams.get("y") ? parseInt(searchParams.get("y")!, 10) : null;

    // Sync page number from URL if it differs from current state
    if (urlPage !== currentPage && urlPage > 0) {
      setCurrentPage(urlPage);
    }

    // Sync search ID from URL if it differs from current state
    if (urlSearchId !== null && urlSearchId !== searchId) {
      setSearchId(urlSearchId);
    }
  }, [mounted, searchParams.get("w"), searchParams.get("y"), currentPage, searchId]);


  // Handle all search parameter changes
  useEffect(() => {
    if (!mounted) return;

    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }

    const urlPage = parseInt(searchParams.get("w") ?? "1", 10);
    const urlSearchId = searchParams.get("y")
      ? parseInt(searchParams.get("y")!, 10)
      : null;

    const fetchResults = async () => {
      const requestId = ++latestRequestRef.current;
      setIsLoading(true);
      try {
        const searchParamsObj = searchParams
          ? Object.fromEntries(searchParams.entries())
          : {};
        delete (searchParamsObj as Record<string, string>).page;
        delete (searchParamsObj as Record<string, string>).rtotal;
        if (isShortLetSearch()) {
          (searchParamsObj as Record<string, string>).ftype = ANY_SENTINEL;
        }

        const locality = searchParamsObj.q;
          if (!locality) {
            console.error("Missing required parameter: locality");
            if (latestRequestRef.current === requestId) {
              setIsLoading(false);
            }
            return;
          }

        const pageParam = urlPage;
        const effectiveSearchId = urlSearchId ?? searchId ?? null;
        const isPaginationFetch = Boolean(effectiveSearchId && pageParam > 1);

        if (isPaginationFetch) {
          const response = await fetch("/api/properties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "loadMore",
              params: {
                y: effectiveSearchId,
                w: pageParam,
                ...searchParamsObj,
                contract: type,
                locality,
                propertyType: searchParamsObj.type ?? "",
                app: "vercel",
                ...(isShortLetSearch() && {
                  frentperiod: "shortrent",
                  ftype: ANY_SENTINEL,
                  ...(searchParamsObj.fhowshort && {
                    fhowshort: searchParamsObj.fhowshort,
                  }),
                }),
              },
            }),
            cache: "no-store",
            next: { revalidate: 0 },
          });

          if (!response.ok) throw new Error("Failed to fetch page");
          const data = (await response.json()) as MeqasaSearchResponse;
          if (latestRequestRef.current !== requestId) {
            return;
          }
          // Debug page 3 fetch
          if (pageParam === 3) {
            console.log("📄 Fetched page 3 via main effect:", {
              firstId: data.results[0]?.listingid,
              count: data.results.length,
            });
          }
          setSearchResults(data.results);
          setTotalResults(baseTotalRef.current);
          setSearch({
            ...data,
            resultcount: baseTotalRef.current,
            searchid: effectiveSearchId ?? data.searchid,
          });
          setSearchId(effectiveSearchId ?? data.searchid ?? null);
          setCurrentPage(pageParam);
          setIsLoading(false);
          return;
        }

        delete (searchParamsObj as Record<string, string>).w;
        delete (searchParamsObj as Record<string, string>).rtotal;
        if (isShortLetSearch()) {
          (searchParamsObj as Record<string, string>).ftype = ANY_SENTINEL;
        }

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
              ...(isShortLetSearch() && {
                frentperiod: "shortrent",
                ftype: ANY_SENTINEL,
                ...(searchParamsObj.fhowshort && {
                  fhowshort: searchParamsObj.fhowshort,
                }),
              }),
            },
          }),
          cache: "no-store",
          next: { revalidate: 0 },
        });

        if (!response.ok) throw new Error("Failed to fetch properties");
        const data = (await response.json()) as MeqasaSearchResponse;
        if (latestRequestRef.current !== requestId) {
          return;
        }
        setSearchResults(data.results);

        const normalizedCount = Number(data.resultcount) || 0;
        const signatureChanged = lastSignatureRef.current !== searchSignature;
        const resultCountChanged = baseTotalRef.current !== normalizedCount;

        if (signatureChanged || resultCountChanged) {
          baseTotalRef.current = normalizedCount;
          lastSignatureRef.current = searchSignature;
        }

        setTotalResults(baseTotalRef.current);

        const nextSearchId = data.searchid ?? effectiveSearchId ?? null;
        setSearch({
          ...data,
          resultcount: baseTotalRef.current,
          searchid: nextSearchId ?? 0,
        });
        setSearchId(nextSearchId);
        setCurrentPage(pageParam);

        const totalFromUrl = searchParams.get("rtotal");
        const needsUrlSync =
          nextSearchId !== urlSearchId ||
          (totalFromUrl !== undefined &&
            totalFromUrl !== baseTotalRef.current.toString());

        if (nextSearchId !== null && onSearchIdUpdate && needsUrlSync) {
          skipNextFetch.current = true;
          onSearchIdUpdate(nextSearchId, pageParam, baseTotalRef.current);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        if (latestRequestRef.current === requestId) {
          setIsLoading(false);
        }
      }
    };

    void fetchResults();
  }, [
    mounted,
    searchParams.get("q"),
    searchParams.get("ftype"),
    searchParams.get("fbeds"),
    searchParams.get("fbaths"),
    searchParams.get("fmin"),
    searchParams.get("fmax"),
    searchParams.get("w"),
    searchParams.get("y"), // Critical: ensures refetch when searchId changes during pagination
    searchParams.get("frentperiod"),
    searchParams.get("fhowshort"),
    searchSignature,
    type,
  ]);

  // When user clicks pagination, provide immediate feedback and update URL
  const handlePageChange = async (pageNumber: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!mounted || !searchId || pageNumber === currentPage) return;

    // Provide immediate visual feedback
    setIsLoading(true);

    // Update URL via callback
    onSearchIdUpdate?.(searchId, pageNumber, baseTotalRef.current);

    // The useEffect will handle fetching the data since page parameter changed
  };

  const handleLoadMore = async () => {
    if (!mounted || !searchId) return;
    const nextPage = currentPage + 1;

    // Update URL via callback
    skipNextFetch.current = true;
    onSearchIdUpdate?.(searchId, nextPage, baseTotalRef.current);
    setIsLoading(true);
    try {
      const searchParamsObj = searchParams
        ? Object.fromEntries(searchParams.entries())
        : {};
      if (isShortLetSearch()) {
        (searchParamsObj as Record<string, string>).ftype = ANY_SENTINEL;
      }
      delete (searchParamsObj as Record<string, string>).page;
      delete (searchParamsObj as Record<string, string>).rtotal;
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
        cache: "no-store",
        next: { revalidate: 0 },
      });
      if (!response.ok) throw new Error("Failed to fetch page");
      const data = (await response.json()) as MeqasaSearchResponse;

      // Only update state if the response searchId matches our current searchId
      if (Number(data.searchid) === Number(searchId)) {
        setSearchResults((prev) => [...prev, ...data.results]);
        setTotalResults(baseTotalRef.current);
        setSearch(data);
        setCurrentPage(nextPage);
      } else {
        console.warn(
          "Ignoring load-more response due to searchId mismatch",
          data.searchid,
          searchId
        );
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
