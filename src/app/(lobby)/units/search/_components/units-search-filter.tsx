"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchInputWithSuggestions } from "@/components/ui/search-input-with-suggestions";
import { ActiveFilterChips } from "@/components/search/ActiveFilterChips";

interface UnitsSearchFilterProps {
  resultCount?: number;
}

// Form state interface for developer units search
interface DeveloperUnitsFormState {
  terms: string;
  unittype: string;
  address: string;
  maxprice: string;
  beds: string;
  baths: string;
}

// Helper function to handle bedroom/bathroom values
const safeBedBath = (value: string | undefined): string => {
  if (!value || value.trim() === "" || value === "0") return "0";
  const num = Number(value);
  if (!isNaN(num) && num > 0) {
    return String(num);
  }
  return "0";
};

// Helper function to safely convert string to number or return empty string
const safeNumber = (value: string | undefined): string => {
  if (!value || value.trim() === "" || value === "all") return "";
  const num = Number(value);
  return !isNaN(num) && num > 0 ? String(num) : "";
};

// Error boundary component for search filter
function SearchFilterErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="mx-4 my-4 rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center">
          <AlertCircle className="mr-2 h-5 w-5 text-red-400" />
          <div className="text-sm text-red-700 sm:text-base">
            Something went wrong with the search filters. Please refresh the
            page.
          </div>
        </div>
        <button
          onClick={() => setHasError(false)}
          className="mt-2 text-sm text-red-600 underline hover:text-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  return <div onError={() => setHasError(true)}>{children}</div>;
}

export function UnitsSearchFilter({}: UnitsSearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize form state from URL parameters
  const initializeFormState = useCallback((): DeveloperUnitsFormState => {
    const searchParamsObj = searchParams
      ? Object.fromEntries(searchParams.entries())
      : {};

    return {
      terms: searchParamsObj.terms || "sale",
      unittype: searchParamsObj.unittype || "all",
      address: searchParamsObj.address || "",
      maxprice: searchParamsObj.maxprice || "all",
      beds: safeBedBath(searchParamsObj.beds),
      baths: safeBedBath(searchParamsObj.baths),
    };
  }, [searchParams]);

  const [formState, setFormState] =
    useState<DeveloperUnitsFormState>(initializeFormState);

  // All callbacks defined with consistent dependencies
  const updateFormState = useCallback(
    (updates: Partial<DeveloperUnitsFormState>) => {
      setFormState((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const handleRemoveFilter = useCallback(
    (filterKey: keyof DeveloperUnitsFormState) => {
      const resetValues: Partial<DeveloperUnitsFormState> = {};

      switch (filterKey) {
        case "unittype":
          resetValues.unittype = "all";
          break;
        case "beds":
          resetValues.beds = "0";
          break;
        case "baths":
          resetValues.baths = "0";
          break;
        case "maxprice":
          resetValues.maxprice = "all";
          break;
        case "address":
          resetValues.address = "";
          break;
        case "terms":
          resetValues.terms = "sale";
          break;
        default:
          break;
      }

      updateFormState(resetValues);
    },
    [updateFormState]
  );

  const handleClearAllFilters = useCallback(() => {
    updateFormState({
      terms: "sale",
      unittype: "all",
      address: "",
      maxprice: "all",
      beds: "0",
      baths: "0",
    });
  }, [updateFormState]);

  const handleSearch = useCallback(async () => {
    try {
      setError(null);
      setIsSearching(true);

      // Build search params to match live MeQasa site exactly
      const searchParams = new URLSearchParams();

      // Always include terms (required)
      searchParams.set("terms", formState.terms);

      // Unit type - include even if 'all' (as empty value like live site)
      if (formState.unittype && formState.unittype !== "all") {
        searchParams.set("unittype", formState.unittype);
      } else {
        searchParams.set("unittype", ""); // Empty value like live site
      }

      // Address/location - always include, even if empty (like live site)
      searchParams.set("address", formState.address?.trim() || "");

      // Max price - always include, even if 'all' or empty (like live site)
      if (formState.maxprice && formState.maxprice !== "all") {
        const maxPriceNum = Number(formState.maxprice);
        if (!isNaN(maxPriceNum) && maxPriceNum > 0) {
          searchParams.set("maxprice", String(maxPriceNum));
        } else {
          searchParams.set("maxprice", ""); // Empty value like live site
        }
      } else {
        searchParams.set("maxprice", ""); // Empty value like live site
      }

      // Bedrooms - always include, even if 0 (like live site: beds=0)
      const bedsNum = Number(formState.beds) || 0;
      searchParams.set("beds", String(bedsNum));

      // Bathrooms - always include, even if 0 (like live site: baths=0)
      const bathsNum = Number(formState.baths) || 0;
      searchParams.set("baths", String(bathsNum));

      // Navigate to search page
      router.push(`/units/search?${searchParams.toString()}`);
    } catch {
      setError(
        "An error occurred while processing your search. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  }, [formState, router]);

  // Update form state when URL parameters change - must be after all other hooks
  useEffect(() => {
    setFormState(initializeFormState());
    setIsInitialized(true);
  }, [searchParams, initializeFormState]);

  // Don't render until initialized
  if (!isInitialized) {
    return (
      <div className="border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <div className="container mx-auto flex min-w-fit items-center gap-2 p-4">
            <div className="h-10 w-28 flex-shrink-0 animate-pulse rounded bg-gray-100 sm:h-12 sm:w-32"></div>
            <div className="h-10 min-w-[120px] flex-1 animate-pulse rounded bg-gray-100 sm:h-12 sm:min-w-[200px]"></div>
            <div className="h-10 w-32 flex-shrink-0 animate-pulse rounded bg-gray-100 sm:h-12 sm:w-40"></div>
            <div className="h-10 w-24 flex-shrink-0 animate-pulse rounded bg-gray-100 sm:h-12 sm:w-32"></div>
            <div className="h-10 w-24 flex-shrink-0 animate-pulse rounded bg-gray-100 sm:h-12 sm:w-32"></div>
            <div className="h-10 w-28 flex-shrink-0 animate-pulse rounded bg-gray-100 sm:h-12 sm:w-40"></div>
            <div className="h-10 w-20 flex-shrink-0 animate-pulse rounded bg-gray-100 sm:h-12 sm:w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SearchFilterErrorBoundary>
      <div className="border border-gray-200 bg-white">
        {/* Error Display */}
        {error && (
          <div className="mx-4 mt-4 border-l-4 border-red-400 bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="mr-2 h-5 w-5 text-red-400" />
              <div className="text-sm text-red-700 sm:text-base">{error}</div>
            </div>
          </div>
        )}

        {/* Mobile-responsive filter container with horizontal scrolling */}
        <div className="overflow-x-auto">
          <div className="container mx-auto flex min-w-fit items-center gap-2 p-4">
            {/* Contract Type */}
            <Select
              value={formState.terms}
              onValueChange={(value) => updateFormState({ terms: value })}
            >
              <SelectTrigger className="text-brand-accent !h-10 w-28 flex-shrink-0 cursor-pointer border-gray-200 bg-white text-sm shadow-none transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none data-[placeholder]:text-gray-400 sm:!h-12 sm:w-32 sm:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    value="sale"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    For Sale
                  </SelectItem>
                  <SelectItem
                    value="rent"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    For Rent
                  </SelectItem>
                  <SelectItem
                    value="preselling"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    Pre-selling
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Location Search Input */}
            <SearchInputWithSuggestions
              variant="results"
              value={formState.address}
              onChange={(value) => updateFormState({ address: value })}
              placeholder="Location"
              className="text-sm sm:text-base"
              maxSuggestions={5}
              inputProps={{
                className:
                  "h-10 sm:h-12 text-sm sm:text-base bg-white text-brand-accent border-gray-200 hover:bg-gray-50 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none hover:border-gray-300 transition-all duration-200 placeholder:text-gray-400 !h-10 sm:!h-12 pl-8 sm:pl-10",
              }}
            />

            {/* Unit Type */}
            <Select
              value={formState.unittype}
              onValueChange={(value) => updateFormState({ unittype: value })}
            >
              <SelectTrigger className="text-brand-accent !h-10 h-10 w-32 flex-shrink-0 cursor-pointer border-gray-200 bg-white text-sm shadow-none transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none data-[placeholder]:text-gray-400 sm:!h-12 sm:h-12 sm:w-40 sm:text-base">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    value="all"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    All Types
                  </SelectItem>
                  <SelectItem
                    value="apartment"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    Apartment
                  </SelectItem>
                  <SelectItem
                    value="house"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    House
                  </SelectItem>
                  <SelectItem
                    value="detached house"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    Detached House
                  </SelectItem>
                  <SelectItem
                    value="semi-detached house"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    Semi-Detached House
                  </SelectItem>
                  <SelectItem
                    value="townhouse"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    Townhouse
                  </SelectItem>
                  <SelectItem
                    value="studio apartment"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    Studio Apartment
                  </SelectItem>
                  <SelectItem
                    value="penthouse apartment"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    Penthouse Apartment
                  </SelectItem>
                  <SelectItem
                    value="villa"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    Villa
                  </SelectItem>
                  <SelectItem
                    value="condominium"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    Condominium
                  </SelectItem>
                  <SelectItem
                    value="terrace house"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    Terrace House
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Bedrooms */}
            <Select
              value={formState.beds}
              onValueChange={(value) => updateFormState({ beds: value })}
            >
              <SelectTrigger className="text-brand-accent !h-10 h-10 w-24 flex-shrink-0 cursor-pointer border-gray-200 bg-white text-sm shadow-none transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none data-[placeholder]:text-gray-400 sm:!h-12 sm:h-12 sm:w-32 sm:text-base">
                <SelectValue placeholder="Beds" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    value="0"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    Beds
                  </SelectItem>
                  <SelectItem
                    value="1"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    1+ Beds
                  </SelectItem>
                  <SelectItem
                    value="2"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    2+ Beds
                  </SelectItem>
                  <SelectItem
                    value="3"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    3+ Beds
                  </SelectItem>
                  <SelectItem
                    value="4"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    4+ Beds
                  </SelectItem>
                  <SelectItem
                    value="5"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    5+ Beds
                  </SelectItem>
                  <SelectItem
                    value="6"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    6+ Beds
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Bathrooms */}
            <Select
              value={formState.baths}
              onValueChange={(value) => updateFormState({ baths: value })}
            >
              <SelectTrigger className="text-brand-accent !h-10 h-10 w-24 flex-shrink-0 cursor-pointer border-gray-200 bg-white text-sm shadow-none transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none data-[placeholder]:text-gray-400 sm:!h-12 sm:h-12 sm:w-32 sm:text-base">
                <SelectValue placeholder="Baths" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    value="0"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    Baths
                  </SelectItem>
                  <SelectItem
                    value="1"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    1+ Baths
                  </SelectItem>
                  <SelectItem
                    value="2"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    2+ Baths
                  </SelectItem>
                  <SelectItem
                    value="3"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    3+ Baths
                  </SelectItem>
                  <SelectItem
                    value="4"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    4+ Baths
                  </SelectItem>
                  <SelectItem
                    value="5"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    5+ Baths
                  </SelectItem>
                  <SelectItem
                    value="6"
                    className="text-brand-accent text-sm sm:text-base"
                  >
                    6+ Baths
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* Max Price */}
            <Input
              value={formState.maxprice}
              placeholder="Max Price"
              type="number"
              className="text-brand-accent !h-10 h-10 w-28 flex-shrink-0 cursor-pointer border-gray-200 bg-white text-sm shadow-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 hover:bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none sm:!h-12 sm:h-12 sm:w-40 sm:text-base"
              onChange={(e) => updateFormState({ maxprice: e.target.value })}
            />

            {/* Enhanced Search Button with Loading State - Mobile responsive */}
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-brand-primary hover:bg-brand-primary-dark h-10 flex-shrink-0 px-3 text-sm text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:px-6 sm:text-base"
            >
              {isSearching ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Searching...</span>
                  <span className="sm:hidden">...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Search Units</span>
                  <span className="sm:hidden">Search</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Active Filter Chips */}
        <ActiveFilterChips
          formState={{
            search: formState.address,
            propertyType: formState.unittype,
            bedrooms: formState.beds === "0" ? "- Any -" : formState.beds,
            bathrooms: formState.baths === "0" ? "- Any -" : formState.baths,
            minPrice: "",
            maxPrice: safeNumber(formState.maxprice),
            minArea: "",
            maxArea: "",
            period: "- Any -",
            sort: "date",
            furnished: false,
            owner: false,
          }}
          onRemoveFilter={(key) => {
            // Map the filter keys to our form state keys
            const keyMap: Record<string, keyof DeveloperUnitsFormState> = {
              search: "address",
              propertyType: "unittype",
              bedrooms: "beds",
              bathrooms: "baths",
              maxPrice: "maxprice",
              listingType: "terms",
            };
            const mappedKey =
              keyMap[key] || (key as keyof DeveloperUnitsFormState);
            handleRemoveFilter(mappedKey);
          }}
          onClearAllFilters={handleClearAllFilters}
          contractType={formState.terms}
        />
      </div>
    </SearchFilterErrorBoundary>
  );
}
