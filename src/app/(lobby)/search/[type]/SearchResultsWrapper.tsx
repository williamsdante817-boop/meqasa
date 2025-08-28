"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SearchResults } from "./search-results";
import type { MeqasaListing } from "@/types/meqasa";

interface SearchResultsWrapperProps {
  type: string;
  location: string;
  initialResults: MeqasaListing[];
  initialTotal: number;
  initialSearchId: number;
  initialPage: number;
}

export function SearchResultsWrapper({
  type,
  location,
  initialResults,
  initialTotal,
  initialSearchId,
  initialPage,
}: SearchResultsWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearchIdUpdate = (searchId: number, page: number) => {
    // Update URL with new searchId and page
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("searchId", searchId.toString());
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
      onSearchIdUpdate={handleSearchIdUpdate}
    />
  );
}
