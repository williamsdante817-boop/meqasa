"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { DeveloperUnit } from "./types";
import { UnitsSearchResults } from "./units-search-results";

interface UnitsSearchWrapperProps {
  initialResults: DeveloperUnit[];
  searchParams: Record<string, string | string[] | undefined>;
  initialHasMore?: boolean;
}

export function UnitsSearchWrapper({
  initialResults,
  searchParams,
  initialHasMore = true,
}: UnitsSearchWrapperProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const handleSearchUpdate = (newParams: Record<string, string>) => {
    // Update URL with new search parameters
    const updatedSearchParams = new URLSearchParams(urlSearchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== "" && value !== "all" && value !== "0") {
        updatedSearchParams.set(key, value);
      } else {
        updatedSearchParams.delete(key);
      }
    });

    // Always include default terms if not specified
    if (!updatedSearchParams.get("terms")) {
      updatedSearchParams.set("terms", "sale");
    }

    router.replace(`/units/search?${updatedSearchParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <UnitsSearchResults
      initialUnits={initialResults}
      searchParams={searchParams}
      onSearchUpdate={handleSearchUpdate}
      initialHasMore={initialHasMore}
    />
  );
}
