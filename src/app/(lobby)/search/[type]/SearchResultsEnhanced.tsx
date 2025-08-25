"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { usePropertySearch, type SearchFilters } from "@/hooks/queries";
import { SearchResults } from "./search-results";
import type { MeqasaListing, MeqasaSearchResponse } from "@/types/meqasa";

interface SearchResultsEnhancedProps {
  type: string;
  location: string;
  initialResults: MeqasaListing[];
  initialTotal: number;
  initialSearchId: number;
  initialPage: number;
}

/**
 * Enhanced SearchResults component using React Query
 * 
 * Key improvements over original:
 * ✅ Smart caching - instant back/forward navigation  
 * ✅ Background refresh - fresh results without loading states
 * ✅ Better error handling with automatic retries
 * ✅ Optimistic updates - keeps previous results while loading
 * ✅ Deduplication - prevents duplicate requests
 * 
 * Preserves 100% compatibility with existing SearchResults component
 */
export function SearchResultsEnhanced({
  type,
  location,
  initialResults,
  initialTotal,
  initialSearchId,
  initialPage,
}: SearchResultsEnhancedProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  // Build search filters from URL params - memoized for performance
  const searchFilters: SearchFilters = useMemo(() => ({
    contract: type,
    locality: location,
    app: "vercel",
    ...(searchParams ? Object.fromEntries(searchParams.entries()) : {}),
  }), [type, location, searchParams]);

  // Create initial search data structure for React Query
  const initialSearchData: MeqasaSearchResponse = useMemo(() => ({
    results: initialResults,
    resultcount: initialTotal,
    searchid: initialSearchId,
    topads: [],
    project1: { empty: true },
    project2: { empty: true },
    bottomads: [],
    searchdesc: "",
  }), [initialResults, initialTotal, initialSearchId]);

  // React Query search with intelligent caching and background refresh
  const {
    data: searchData,
    isLoading,
    error,
    isFetching,
    isStale,
  } = usePropertySearch(searchFilters, initialSearchData);

  // Track mounted state for safe client-side operations
  useEffect(() => {
    setMounted(true);
  }, []);

  // URL state management - same as original
  const handleSearchIdUpdate = (searchId: number, page: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("searchId", searchId.toString());
    newSearchParams.set("page", page.toString());
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  // Enhanced error handling - fallback to cached or initial data
  if (error) {
    console.warn("Search error (using cached/initial data):", error);
    // React Query will automatically retry, we continue with available data
  }

  // Use React Query data with fallbacks to initial server data
  const resolvedResults = searchData?.results ?? initialResults;
  const resolvedTotal = searchData?.resultcount ?? initialTotal;
  const resolvedSearchId = searchData?.searchid ?? initialSearchId;

  // Show background refresh indicator (optional - could be used for UX)
  const isBackgroundRefreshing = isFetching && !isLoading && mounted;

  // Log React Query benefits in development
  if (process.env.NODE_ENV === "development" && mounted) {
    console.log("🚀 React Query Search State:", {
      isLoading,
      isFetching,
      isStale,
      isBackgroundRefreshing,
      hasError: !!error,
      cacheHit: !isLoading && !!searchData,
      resultsCount: resolvedResults.length,
    });
  }

  return (
    <>
      {/* Optional: Background refresh indicator */}
      {isBackgroundRefreshing && (
        <div className="fixed top-16 right-4 z-50 bg-blue-500 text-white px-3 py-1 rounded-full text-xs animate-pulse">
          Refreshing results...
        </div>
      )}
      
      <SearchResults
        type={type}
        location={location}
        initialResults={resolvedResults}
        initialTotal={resolvedTotal}
        initialSearchId={resolvedSearchId}
        initialPage={initialPage}
        onSearchIdUpdate={handleSearchIdUpdate}
      />
    </>
  );
}