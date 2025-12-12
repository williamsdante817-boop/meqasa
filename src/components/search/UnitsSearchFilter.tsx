"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchInputWithSuggestions } from "@/components/ui/search-input-with-suggestions";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";
import {
  ActiveFilterChips,
  type DeveloperUnitsFormState,
} from "./ActiveFilterChips";

const DEFAULT_FORM_STATE: DeveloperUnitsFormState = {
  terms: "sale",
  unittype: "all",
  address: "",
  maxprice: "all",
  beds: "0",
  baths: "0",
};

const TERMS_OPTIONS: Array<{
  value: DeveloperUnitsFormState["terms"];
  label: string;
}> = [
  { value: "sale", label: "For Sale" },
  { value: "rent", label: "For Rent" },
  { value: "preselling", label: "Pre-selling" },
];

const UNIT_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "detached house", label: "Detached House" },
  { value: "semi-detached house", label: "Semi-Detached House" },
  { value: "townhouse", label: "Townhouse" },
  { value: "studio apartment", label: "Studio Apartment" },
  { value: "penthouse apartment", label: "Penthouse Apartment" },
  { value: "villa", label: "Villa" },
  { value: "condominium", label: "Condominium" },
  { value: "terrace house", label: "Terrace House" },
];

const BED_OPTIONS = [
  { value: "0", label: "Beds" },
  { value: "1", label: "1+ Beds" },
  { value: "2", label: "2+ Beds" },
  { value: "3", label: "3+ Beds" },
  { value: "4", label: "4+ Beds" },
  { value: "5", label: "5+ Beds" },
  { value: "6", label: "6+ Beds" },
];

const BATH_OPTIONS = [
  { value: "0", label: "Baths" },
  { value: "1", label: "1+ Baths" },
  { value: "2", label: "2+ Baths" },
  { value: "3", label: "3+ Baths" },
  { value: "4", label: "4+ Baths" },
  { value: "5", label: "5+ Baths" },
  { value: "6", label: "6+ Baths" },
];

const safeNumericFilter = (value: string | null | undefined): string => {
  if (!value) return "0";
  const trimmed = value.trim();
  if (trimmed.length === 0) return "0";
  const parsed = Number(trimmed);
  if (Number.isNaN(parsed) || parsed < 0) {
    return "0";
  }
  return String(parsed);
};

const safeMaxPrice = (value: string | null | undefined): string => {
  if (!value || value.trim().length === 0) return "all";
  if (value === "all") return "all";
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return "all";
  }
  return String(parsed);
};

const buildFormStateFromParams = (
  params: URLSearchParams | null
): DeveloperUnitsFormState => {
  if (!params) {
    return { ...DEFAULT_FORM_STATE };
  }

  return {
    terms: params.get("terms") ?? DEFAULT_FORM_STATE.terms,
    unittype: params.get("unittype") || DEFAULT_FORM_STATE.unittype,
    address: params.get("address") ?? DEFAULT_FORM_STATE.address,
    maxprice: safeMaxPrice(params.get("maxprice")),
    beds: safeNumericFilter(params.get("beds")),
    baths: safeNumericFilter(params.get("baths")),
  };
};

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
          type="button"
          onClick={() => setHasError(false)}
          className="mt-2 text-sm text-red-600 underline hover:text-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div onError={() => setHasError(true)} role="presentation">
      {children}
    </div>
  );
}

export function UnitsSearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formState, setFormState] = useState<DeveloperUnitsFormState>(() => ({
    ...DEFAULT_FORM_STATE,
  }));
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hydratedState = useMemo(
    () => buildFormStateFromParams(searchParams),
    [searchParams]
  );

  useEffect(() => {
    setFormState(hydratedState);
    setIsInitialized(true);
  }, [hydratedState]);

  const updateFormState = useCallback(
    (updates: Partial<DeveloperUnitsFormState>) => {
      setFormState((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const handleRemoveFilter = useCallback(
    (key: keyof DeveloperUnitsFormState) => {
      setFormState((prev) => ({
        ...prev,
        [key]: DEFAULT_FORM_STATE[key],
      }));
    },
    []
  );

  const handleClearAllFilters = useCallback(() => {
    setFormState({ ...DEFAULT_FORM_STATE });
  }, []);

  const handleSearch = useCallback(() => {
    try {
      setError(null);
      setIsSearching(true);

      const params = new URLSearchParams();
      params.set("terms", formState.terms);

      if (formState.unittype && formState.unittype !== "all") {
        params.set("unittype", formState.unittype);
      } else {
        params.set("unittype", "");
      }

      params.set("address", formState.address.trim());

      if (formState.maxprice && formState.maxprice !== "all") {
        const maxPriceNum = Number(formState.maxprice);
        if (Number.isNaN(maxPriceNum) || maxPriceNum <= 0) {
          setError("Please enter a valid maximum price.");
          return;
        }
        params.set("maxprice", String(maxPriceNum));
      } else {
        params.set("maxprice", "");
      }

      const bedsValue = Number(formState.beds);
      params.set("beds", Number.isNaN(bedsValue) ? "0" : String(bedsValue));

      const bathsValue = Number(formState.baths);
      params.set("baths", Number.isNaN(bathsValue) ? "0" : String(bathsValue));

      router.replace(`/units/search?${params.toString()}`);
    } catch (err) {
      console.error("UnitsSearchFilter::handleSearch", err);
      setError(
        "An error occurred while processing your search. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  }, [formState, router]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSearch();
      }
    },
    [handleSearch]
  );

  if (!isInitialized) {
    return (
      <div className="border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <div className="container mx-auto flex min-w-fit items-center gap-2 p-4">
            <div className="h-10 w-28 flex-shrink-0 animate-pulse rounded bg-gray-100 sm:h-12 sm:w-32" />
            <div className="h-10 min-w-[120px] flex-1 animate-pulse rounded bg-gray-100 sm:h-12 sm:min-w-[200px]" />
            <div className="h-10 w-32 flex-shrink-0 animate-pulse rounded bg-gray-100 sm:h-12 sm:w-40" />
            <div className="h-10 w-24 flex-shrink-0 animate-pulse rounded bg-gray-100 sm:h-12 sm:w-32" />
            <div className="h-10 w-24 flex-shrink-0 animate-pulse rounded bg-gray-100 sm:h-12 sm:w-32" />
            <div className="h-10 w-28 flex-shrink-0 animate-pulse rounded bg-gray-100 sm:h-12 sm:w-40" />
            <div className="h-10 w-20 flex-shrink-0 animate-pulse rounded bg-gray-100 sm:h-12 sm:w-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <SearchFilterErrorBoundary>
      <div
        className="border border-gray-200 bg-white"
        aria-busy={isSearching}
        role="search"
        onKeyDown={handleKeyDown}
      >
        {error && (
          <div className="mx-4 mt-4 border-l-4 border-red-400 bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="mr-2 h-5 w-5 text-red-400" />
              <div className="text-sm text-red-700 sm:text-base">{error}</div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <div className="container mx-auto flex min-w-fit items-center gap-2 p-4">
            <Select
              value={formState.terms}
              onValueChange={(value) => updateFormState({ terms: value })}
            >
              <SelectTrigger className="text-brand-accent !h-10 w-28 flex-shrink-0 cursor-pointer border-gray-200 bg-white text-sm shadow-none transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none sm:!h-12 sm:w-32 sm:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {TERMS_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-brand-accent text-sm sm:text-base"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <SearchInputWithSuggestions
              variant="results"
              value={formState.address}
              onChange={(value) => updateFormState({ address: value })}
              placeholder="Location"
              className="text-sm sm:text-base"
              maxSuggestions={5}
            />

            <Select
              value={formState.unittype}
              onValueChange={(value) => updateFormState({ unittype: value })}
            >
              <SelectTrigger className="text-brand-accent !h-10 w-32 flex-shrink-0 cursor-pointer border-gray-200 bg-white text-sm shadow-none transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none sm:!h-12 sm:w-40 sm:text-base">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {UNIT_TYPE_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-brand-accent text-sm sm:text-base"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={formState.beds}
              onValueChange={(value) => updateFormState({ beds: value })}
            >
              <SelectTrigger className="text-brand-accent !h-10 w-24 flex-shrink-0 cursor-pointer border-gray-200 bg-white text-sm shadow-none transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none sm:!h-12 sm:w-32 sm:text-base">
                <SelectValue placeholder="Beds" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {BED_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-brand-accent text-sm sm:text-base"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select
              value={formState.baths}
              onValueChange={(value) => updateFormState({ baths: value })}
            >
              <SelectTrigger className="text-brand-accent !h-10 w-24 flex-shrink-0 cursor-pointer border-gray-200 bg-white text-sm shadow-none transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none sm:!h-12 sm:w-32 sm:text-base">
                <SelectValue placeholder="Baths" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {BATH_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-brand-accent text-sm sm:text-base"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Input
              value={formState.maxprice === "all" ? "" : formState.maxprice}
              placeholder="Max Price"
              inputMode="numeric"
              type="number"
              className="text-brand-accent !h-10 w-28 flex-shrink-0 border-gray-200 bg-white !text-sm shadow-none transition-all duration-200 placeholder:!text-sm placeholder:text-gray-400 hover:border-gray-300 hover:bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none sm:!h-12 sm:w-40 sm:!text-base sm:placeholder:!text-base"
              onChange={(event) => {
                const nextValue = event.target.value.trim();
                updateFormState({
                  maxprice: nextValue.length === 0 ? "all" : nextValue,
                });
              }}
            />

            <Button
              type="button"
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-brand-primary hover:bg-brand-primary-dark h-10 flex-shrink-0 px-3 text-sm text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:px-6 sm:text-base"
            >
              {isSearching ? (
                <span className="flex items-center gap-1 sm:gap-2">
                  <Loader2 className="h-3 w-3 animate-spin sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Searching…</span>
                  <span className="sm:hidden">...</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 sm:gap-2">
                  <span>Search Units</span>
                </span>
              )}
            </Button>
          </div>
        </div>

        <ActiveFilterChips
          mode="developer"
          formState={formState}
          onRemoveFilter={handleRemoveFilter}
          onClearAllFilters={handleClearAllFilters}
        />
      </div>
    </SearchFilterErrorBoundary>
  );
}
