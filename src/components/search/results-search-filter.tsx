"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Search } from "lucide-react";
import { siteConfig } from "@/config/site";
import { searchConfig } from "@/config/search";
import { type FormState } from "@/types/search";
import { ActiveFilterChips } from "./ActiveFilterChips";
import { PriceRangeSelect } from "@/components/ui/price-range-select";
import { MoreFiltersPopover } from "@/components/ui/more-filters-popover";
import { SearchInputWithSuggestions } from "@/components/ui/search-input-with-suggestions";

// Constants for better maintainability
const DEFAULT_LOCATION = "ghana";
const DEFAULT_CONTRACT_TYPE = "sale";

// Extended FormState interface to include listingType
interface ExtendedFormState extends FormState {
  listingType: string;
  howShort?: string; // Add short-let duration field
}

// Helper function to safely convert string to number or return empty string
const safeNumber = (value: string | undefined): string => {
  if (!value || value.trim() === "") return "";
  const num = Number(value);
  return !isNaN(num) && num > 0 ? String(num) : "";
};

// Helper function to handle bedroom/bathroom values
const safeBedBath = (value: string | undefined): string => {
  if (!value || value.trim() === "") return "- Any -";
  // If it's a valid number, return it as string
  const num = Number(value);
  if (!isNaN(num) && num > 0) {
    return String(num);
  }
  // If it's not a valid number, return "- Any -"
  return "- Any -";
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

export function ResultSearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Initialize form state from URL parameters
  const initializeFormState = useCallback((): ExtendedFormState => {
    const searchParamsObj = searchParams
      ? Object.fromEntries(searchParams.entries())
      : {};

    // Extract contract type from URL path (/search/[type])
    const pathSegments = pathname.split("/");
    const urlContractType =
      pathSegments[pathSegments.length - 1] ?? DEFAULT_CONTRACT_TYPE; // Get the last segment with fallback

    // Map API contract types back to UI contract types
    const reverseContractMap: Record<string, string> = {
      rent: "rent",
      sale: "sale",
    };

    const uiContractType =
      reverseContractMap[urlContractType] ?? DEFAULT_CONTRACT_TYPE;

    // Normalize property type for case-insensitive matching
    const normalizePropertyType = (type: string | undefined): string => {
      if (!type || type === "all") return "all";

      // Common property type mappings (case-insensitive)
      const typeMap: Record<string, string> = {
        apartment: "apartment",
        apartments: "apartment",
        house: "house",
        houses: "house",
        townhouse: "townhouse",
        townhouses: "townhouse",
        office: "office",
        offices: "office",
        land: "land",
        commercial: "commercial",
        warehouse: "warehouse",
        shop: "shop",
        studio: "studio",
      };

      const lowercaseType = type.toLowerCase().trim();
      return typeMap[lowercaseType] || lowercaseType;
    };

    return {
      listingType: uiContractType,
      search: searchParamsObj.q ?? "",
      propertyType: normalizePropertyType(searchParamsObj.ftype),
      bedrooms: safeBedBath(searchParamsObj.fbeds),
      bathrooms: safeBedBath(searchParamsObj.fbaths),
      minPrice: safeNumber(searchParamsObj.fmin),
      maxPrice: safeNumber(searchParamsObj.fmax),
      minArea: safeNumber(searchParamsObj.fminarea),
      maxArea: safeNumber(searchParamsObj.fmaxarea),
      period: searchParamsObj.frentperiod ?? "- Any -",
      sort: searchParamsObj.fsort ?? "date",
      furnished: searchParamsObj.fisfurnished === "1",
      owner: searchParamsObj.ffsbo === "1",
      howShort: searchParamsObj.fhowshort ?? "- Any -", // Add short-let duration
    };
  }, [searchParams, pathname]);

  const [formState, setFormState] =
    useState<ExtendedFormState>(initializeFormState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper function to detect if we're on a short-let search page
  const isShortLetSearch = () => {
    const pathSegments = pathname.split("/");
    const urlContractType = pathSegments[pathSegments.length - 1];
    return (
      urlContractType === "rent" &&
      searchParams.get("frentperiod") === "shortrent"
    );
  };

  // Update form state when URL parameters change
  useEffect(() => {
    setFormState(initializeFormState());
    setIsInitialized(true);
  }, [searchParams, pathname, initializeFormState]);

  // Don't render until initialized
  if (!isInitialized) {
    return (
      <div className="border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <div className="container mx-auto flex min-w-fit items-center gap-2 p-4">
            <div className="h-10 w-28 flex-shrink-0 animate-pulse rounded bg-gray-100 sm:h-12 sm:w-32"></div>
            <div className="h-10 min-w-[120px] flex-1 animate-pulse rounded bg-gray-100 sm:h-12 sm:min-w-[200px]"></div>
            <div className="h-10 w-32 flex-shrink-0 animate-pulse rounded bg-gray-100 sm:h-12 sm:w-40"></div>
            <div className="h-10 w-24 flex-shrink-0 animate-pulse rounded bg-gray-100 sm:h-12 sm:w-32"></div>
            <div className="h-10 w-24 flex-shrink-0 animate-pulse rounded bg-gray-100 sm:h-12 sm:w-32"></div>
            <div className="h-10 w-28 flex-shrink-0 animate-pulse rounded bg-gray-100 sm:h-12 sm:w-40"></div>
            <div className="h-10 w-20 flex-shrink-0 animate-pulse rounded bg-gray-100 sm:h-12 sm:w-32"></div>
            <div className="h-10 w-20 flex-shrink-0 animate-pulse rounded bg-gray-100 sm:h-12 sm:w-32"></div>
          </div>
        </div>
        <div className="container mx-auto px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="h-8 w-20 animate-pulse rounded-full bg-gray-100"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const updateFormState = (updates: Partial<ExtendedFormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  // Filter removal handlers for ActiveFilterChips
  const handleRemoveFilter = (filterKey: keyof ExtendedFormState) => {
    const resetValues: Partial<ExtendedFormState> = {};

    // Get current page type from URL to handle land tab logic
    const pathSegments = pathname.split("/");
    const urlContractType = pathSegments[pathSegments.length - 1];
    const isLandSearch =
      urlContractType === "sale" && formState.propertyType === "land";

    switch (filterKey) {
      case "propertyType":
        // Keep land type for land searches, reset to "all" for others
        resetValues.propertyType = isLandSearch ? "land" : "all";
        break;
      case "bedrooms":
        resetValues.bedrooms = "- Any -";
        break;
      case "bathrooms":
        resetValues.bathrooms = "- Any -";
        break;
      case "minPrice":
        resetValues.minPrice = "";
        break;
      case "maxPrice":
        resetValues.maxPrice = "";
        break;
      case "period":
        resetValues.period = "- Any -";
        break;
      case "furnished":
        resetValues.furnished = false;
        break;
      case "owner":
        resetValues.owner = false;
        break;
      default:
        break;
    }

    updateFormState(resetValues);
  };

  const handleClearAllFilters = () => {
    // Get current page type from URL to handle land tab logic
    const pathSegments = pathname.split("/");
    const urlContractType = pathSegments[pathSegments.length - 1];
    const isLandSearch =
      urlContractType === "sale" && formState.propertyType === "land";

    updateFormState({
      propertyType: isLandSearch ? "land" : "all", // Keep land type for land searches
      bedrooms: "- Any -",
      bathrooms: "- Any -",
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      period: "- Any -",
      furnished: false,
      owner: false,
      howShort: "- Any -",
    });
  };

  const handleSearch = async () => {
    try {
      setError(null);
      setIsSearching(true);

      // Set default location to 'ghana' if not provided
      const searchValue =
        formState.search && formState.search.trim() !== ""
          ? formState.search.toLowerCase()
          : DEFAULT_LOCATION;

      // Map UI contract types to API contract types
      const contractMap: Record<string, string> = {
        rent: "rent",
        buy: "sale",
        land: "sale",
        "short-let": "rent",
      };

      // Get the API-compliant contract type
      const apiContract =
        contractMap[formState.listingType] ?? formState.listingType;

      // Build search params according to API documentation
      const searchParams = new URLSearchParams();
      searchParams.set("q", searchValue);

      // Property type
      if (formState.propertyType && formState.propertyType !== "all") {
        searchParams.set("ftype", formState.propertyType);
      }

      // Bedrooms and bathrooms - only add if they have valid numeric values
      if (
        formState.bedrooms &&
        formState.bedrooms !== "- Any -" &&
        formState.bedrooms.trim() !== ""
      ) {
        const bedsNum = Number(formState.bedrooms);
        if (!isNaN(bedsNum) && bedsNum > 0) {
          searchParams.set("fbeds", String(bedsNum));
        }
      }
      if (
        formState.bathrooms &&
        formState.bathrooms !== "- Any -" &&
        formState.bathrooms.trim() !== ""
      ) {
        const bathsNum = Number(formState.bathrooms);
        if (!isNaN(bathsNum) && bathsNum > 0) {
          searchParams.set("fbaths", String(bathsNum));
        }
      }

      // Price range - only add if they have valid numeric values
      if (formState.minPrice && formState.minPrice.trim() !== "") {
        const minPriceNum = Number(formState.minPrice);
        if (!isNaN(minPriceNum) && minPriceNum > 0) {
          searchParams.set("fmin", String(minPriceNum));
        }
      }
      if (formState.maxPrice && formState.maxPrice.trim() !== "") {
        const maxPriceNum = Number(formState.maxPrice);
        if (!isNaN(maxPriceNum) && maxPriceNum > 0) {
          searchParams.set("fmax", String(maxPriceNum));
        }
      }

      // Area range - only add if they have valid numeric values
      if (formState.minArea && formState.minArea.trim() !== "") {
        const minAreaNum = Number(formState.minArea);
        if (!isNaN(minAreaNum) && minAreaNum > 0) {
          searchParams.set("fminarea", String(minAreaNum));
        }
      }
      if (formState.maxArea && formState.maxArea.trim() !== "") {
        const maxAreaNum = Number(formState.maxArea);
        if (!isNaN(maxAreaNum) && maxAreaNum > 0) {
          searchParams.set("fmaxarea", String(maxAreaNum));
        }
      }

      // Rent period and sort
      if (formState.period && formState.period !== "- Any -") {
        searchParams.set("frentperiod", formState.period);
      }
      if (formState.sort) {
        searchParams.set("fsort", formState.sort);
      }

      // Boolean filters
      if (formState.furnished) {
        searchParams.set("fisfurnished", "1");
      }
      if (formState.owner) {
        searchParams.set("ffsbo", "1");
      }

      // Short-let specific parameters
      if (isShortLetSearch()) {
        // Set required short-let parameters
        searchParams.set("frentperiod", "shortrent");
        searchParams.set("ftype", "- Any -"); // Required for short-let searches

        // Add short-let duration only if a specific duration is selected
        if (formState.howShort && formState.howShort !== "- Any -") {
          searchParams.set("fhowshort", formState.howShort);
        }
      }

      // Navigate to search page (no y or page for new search)
      router.push(`/search/${apiContract}?${searchParams.toString()}`);
    } catch (err) {
      console.error("Search error:", err);
      setError(
        "An error occurred while processing your search. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  };

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
            {/* For Sale/Rent Dropdown - Hidden for short-let searches */}
            {!isShortLetSearch() && (
              <Select
                value={formState.listingType}
                onValueChange={(value) =>
                  updateFormState({ listingType: value })
                }
              >
                <SelectTrigger className="text-brand-accent h-10 w-28 flex-shrink-0 cursor-pointer border-gray-200 bg-white text-sm shadow-none hover:bg-gray-50 sm:h-12 sm:w-32 sm:text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="sale" className="text-brand-accent">
                      For sale
                    </SelectItem>
                    <SelectItem value="rent" className="text-brand-accent">
                      For rent
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}

            {/* Search Input */}
            <SearchInputWithSuggestions
              variant="results"
              value={formState.search}
              onChange={(value) => updateFormState({ search: value })}
              placeholder="Location"
              className="text-sm sm:text-base"
              maxSuggestions={5}
            />

            {/* Property Type - Hidden for short-let searches */}
            {!isShortLetSearch() && (
              <Select
                value={formState.propertyType}
                onValueChange={(value) =>
                  updateFormState({ propertyType: value })
                }
              >
                <SelectTrigger className="text-brand-accent h-10 w-32 flex-shrink-0 cursor-pointer border-gray-200 bg-white text-sm shadow-none hover:bg-gray-50 sm:h-12 sm:w-40 sm:text-base">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all" className="text-brand-accent">
                      All Types
                    </SelectItem>
                    {siteConfig.selectOptions.propertyType.map(
                      ({ value, label }) => (
                        <SelectItem
                          value={value}
                          key={value}
                          className="text-brand-accent"
                        >
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}

            {/* Short-let Duration Selector - Only shown for short-let searches */}
            {isShortLetSearch() && (
              <Select
                value={formState.howShort ?? "- Any -"}
                onValueChange={(value) => updateFormState({ howShort: value })}
              >
                <SelectTrigger className="text-brand-accent h-10 w-32 flex-shrink-0 cursor-pointer border-gray-200 bg-white text-sm shadow-none hover:bg-gray-50 sm:h-12 sm:w-40 sm:text-base">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="- Any -" className="text-brand-accent">
                      Any Duration
                    </SelectItem>
                    {searchConfig?.selectOptions?.howShort?.map(
                      ({ value, label }) => (
                        <SelectItem
                          value={value}
                          key={value}
                          className="text-brand-accent"
                        >
                          {label}
                        </SelectItem>
                      )
                    ) || []}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}

            {/* Bedrooms - Hidden for land properties */}
            {formState.propertyType !== "land" && (
              <Select
                value={formState.bedrooms || "- Any -"}
                onValueChange={(value) => updateFormState({ bedrooms: value })}
              >
                <SelectTrigger className="text-brand-accent h-10 w-24 flex-shrink-0 cursor-pointer border-gray-200 bg-white text-sm shadow-none hover:bg-gray-50 sm:h-12 sm:w-32 sm:text-base">
                  <SelectValue placeholder="Beds" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="- Any -" className="text-brand-accent">
                      Any Beds
                    </SelectItem>
                    {siteConfig?.selectOptions?.bedrooms?.map(
                      ({ value, label }) => (
                        <SelectItem
                          value={value}
                          key={value}
                          className="text-brand-accent"
                        >
                          {label}
                        </SelectItem>
                      )
                    ) || []}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}

            {/* Bathrooms - Hidden for land properties */}
            {formState.propertyType !== "land" && (
              <Select
                value={formState.bathrooms || "- Any -"}
                onValueChange={(value) => updateFormState({ bathrooms: value })}
              >
                <SelectTrigger className="text-brand-accent h-10 w-24 flex-shrink-0 cursor-pointer border-gray-200 bg-white text-sm shadow-none hover:bg-gray-50 sm:h-12 sm:w-32 sm:text-base">
                  <SelectValue placeholder="Baths" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="- Any -" className="text-brand-accent">
                      Any Baths
                    </SelectItem>
                    {siteConfig?.selectOptions?.bathrooms?.map(
                      ({ value, label }) => (
                        <SelectItem
                          value={value}
                          key={value}
                          className="text-brand-accent"
                        >
                          {label}
                        </SelectItem>
                      )
                    ) || []}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}

            {/* Price Range */}
            <PriceRangeSelect
              minValue={formState.minPrice}
              maxValue={formState.maxPrice}
              onMinChange={(value) => updateFormState({ minPrice: value })}
              onMaxChange={(value) => updateFormState({ maxPrice: value })}
              priceRange={
                searchConfig?.priceRange || {
                  min: 0,
                  max: 1000000,
                  step: 10000,
                }
              }
              variant="default"
              currency="GH₵"
              title="Price Range"
              showQuickSelections={true}
            />

            {/* More Filters - Mobile responsive */}
            <div className="flex-shrink-0">
              <MoreFiltersPopover
                formState={formState}
                updateFormState={updateFormState}
                contractType={formState.listingType === "rent" ? "rent" : "buy"}
              />
            </div>

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
                  <span className="hidden sm:inline">Update search</span>
                  <span className="sm:hidden">Search</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Active Filter Chips */}
        <ActiveFilterChips
          formState={formState}
          onRemoveFilter={handleRemoveFilter}
          onClearAllFilters={handleClearAllFilters}
          contractType={formState.listingType}
        />
      </div>
    </SearchFilterErrorBoundary>
  );
}
