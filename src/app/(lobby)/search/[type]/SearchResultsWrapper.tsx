"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SearchResults } from "./search-results";
import type { MeqasaListing, MeqasaSearchResponse } from "@/types/meqasa";

interface SearchResultsWrapperProps {
  type: string;
  location: string;
  initialResults: MeqasaListing[];
  initialTotal: number;
  initialSearchId: number;
  initialPage: number;
  initialSearchData: MeqasaSearchResponse;
}

export function SearchResultsWrapper({
  type,
  location,
  initialResults,
  initialTotal,
  initialSearchId,
  initialPage,
  initialSearchData,
}: SearchResultsWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearchIdUpdate = (searchId: number, page: number) => {
    // Update URL with new y (search ID) and page - matching Meqasa URL structure
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("y", searchId.toString());
    newSearchParams.set("page", page.toString());
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  return (
    <SearchResults
      type={type}
      location={location}
      initialResults={initialResults}
      initialTotal={initialTotal}
      initialSearchId={initialSearchId}
      initialPage={initialPage}
      initialSearchData={initialSearchData}
      onSearchIdUpdate={handleSearchIdUpdate}
    />
  );
}
