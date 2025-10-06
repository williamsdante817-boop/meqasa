"use client";

import { ANY_SENTINEL } from "@/lib/search/constants";
import type { MeqasaListing, MeqasaSearchResponse } from "@/types/meqasa";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchResults } from "./search-results";

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

  const handleSearchIdUpdate = (
    searchId: number,
    page: number,
    total: number
  ) => {
    // Update URL with new y (search ID) and page - matching Meqasa URL structure
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("page");
    newSearchParams.delete("rtotal");
    newSearchParams.set("y", searchId.toString());
    newSearchParams.set("w", page.toString());

    const isShortLet =
      newSearchParams.get("frentperiod") === "shortrent" ||
      newSearchParams.has("fhowshort");

    if (isShortLet) {
      newSearchParams.set("frentperiod", "shortrent");
      newSearchParams.set("ftype", ANY_SENTINEL);
    }

    if (total > 0) {
      newSearchParams.set("rtotal", total.toString());
    }

    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
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
