"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { UnitsSearchResults } from "./units-search-results";
import type { DeveloperUnit } from "./types";

interface UnitsSearchWrapperProps {
  initialResults: DeveloperUnit[];
  searchParams: Record<string, string | string[] | undefined>;
}

export function UnitsSearchWrapper({
  initialResults,
  searchParams,
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

    router.push(`/units/search?${updatedSearchParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <UnitsSearchResults
      initialUnits={initialResults}
      searchParams={searchParams}
      onSearchUpdate={handleSearchUpdate}
    />
  );
}
