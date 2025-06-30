"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ChevronDown, ListFilterPlus } from "lucide-react";
import { siteConfig } from "@/config/site";
import { searchConfig } from "@/config/search";
import { type FormState } from "@/types/search";

// Mock location data for suggestions
const mockLocations = [
  "Accra, Greater Accra",
  "Kumasi, Ashanti",
  "Tamale, Northern",
  "Cape Coast, Central",
  "Takoradi, Western",
  "Ho, Volta",
  "Koforidua, Eastern",
  "Sunyani, Brong Ahafo",
  "Wa, Upper West",
  "Bolgatanga, Upper East",
  "East Legon, Accra",
  "Cantonments, Accra",
  "Airport Residential, Accra",
  "Labone, Accra",
  "Osu, Accra",
];

// Extended FormState interface to include listingType
interface ExtendedFormState extends FormState {
  listingType: string;
}

// Price Range Component
const PriceRangeSelect = ({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  priceRange,
}: {
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  priceRange: { min: number; max: number; step: number };
}) => {
  const getDisplayText = () => {
    const min = minValue ? Number.parseInt(minValue) : null;
    const max = maxValue ? Number.parseInt(maxValue) : null;

    const formatNumber = (num: number) => num.toLocaleString();

    if (min && max) {
      return `GH₵${formatNumber(min)} - GH₵${formatNumber(max)}`;
    } else if (min) {
      return `GH₵${formatNumber(min)}+`;
    } else if (max) {
      return `Up to GH₵${formatNumber(max)}`;
    }

    return "Price range";
  };

  const isInvalid = () => {
    if (!minValue || !maxValue) return false;
    const minNum = Number.parseInt(minValue);
    const maxNum = Number.parseInt(maxValue);
    return minNum >= maxNum;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-12 justify-between bg-white border-gray-200 hover:bg-gray-50 text-gray-700 font-normal"
        >
          {getDisplayText()}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Price Range</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-price">Min (GH₵)</Label>
              <Input
                id="min-price"
                placeholder="Min price"
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                step={priceRange.step}
                value={minValue}
                onChange={(e) => onMinChange(e.target.value)}
                className={`${isInvalid() ? "border-red-500 focus:border-red-500" : ""}`}
              />
            </div>
            <div>
              <Label htmlFor="max-price">Max (GH₵)</Label>
              <Input
                id="max-price"
                placeholder="Max price"
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                step={priceRange.step}
                value={maxValue}
                onChange={(e) => onMaxChange(e.target.value)}
                className={`${isInvalid() ? "border-red-500 focus:border-red-500" : ""}`}
              />
            </div>
          </div>
          {isInvalid() && (
            <p className="text-red-500 text-xs mt-1">
              Max price must be greater than min price
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Search Input with Suggestions
const SearchInput = ({
  searchValue,
  onSearchChange,
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedSearch = useCallback((searchQuery: string) => {
    const timeout = setTimeout(() => {
      if (searchQuery.length > 0) {
        const filtered = mockLocations.filter((location) =>
          location.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setSuggestions(filtered.slice(0, 5));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const cleanup = debouncedSearch(searchValue);
    return cleanup;
  }, [searchValue, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          const suggestion = suggestions[selectedIndex];
          if (suggestion) {
            selectSuggestion(suggestion);
          }
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectSuggestion = (location: string) => {
    onSearchChange(location);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search location"
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => searchValue && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="h-12 pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
            {suggestions.map((location, index) => (
              <div
                key={location}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                  index === selectedIndex
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700"
                }`}
                onClick={() => selectSuggestion(location)}
              >
                <div className="flex items-center">
                  <Search className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-sm">{location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// More Filters Popover
const MoreFiltersPopover = ({
  formState,
  updateFormState,
}: {
  formState: ExtendedFormState;
  updateFormState: (updates: Partial<ExtendedFormState>) => void;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className="h-12 bg-white border-gray-200 hover:bg-gray-50 text-gray-700 font-normal"
      >
        More filters
        <ListFilterPlus className="ml-2 h-4 w-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-[400px]" align="end">
      <div className="space-y-4">
        <h4 className="font-medium leading-none">Additional Filters</h4>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Rent Period</Label>
            <Select
              value={formState.period}
              onValueChange={(value) => updateFormState({ period: value })}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="- Any -">Any Period</SelectItem>
                  <SelectItem value="shortrent">Short Term</SelectItem>
                  <SelectItem value="longrent">Long Term</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Sort by</Label>
            <Select
              value={formState.sort}
              onValueChange={(value) => updateFormState({ sort: value })}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="date">Newest First</SelectItem>
                  <SelectItem value="date2">Oldest First</SelectItem>
                  <SelectItem value="price">Lowest Price</SelectItem>
                  <SelectItem value="price2">Highest Price</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Property Features</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="furnished"
                checked={formState.furnished}
                onCheckedChange={(checked) =>
                  updateFormState({ furnished: !!checked })
                }
              />
              <Label htmlFor="furnished" className="text-sm cursor-pointer">
                Furnished Properties
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="owner"
                checked={formState.owner}
                onCheckedChange={(checked) =>
                  updateFormState({ owner: !!checked })
                }
              />
              <Label htmlFor="owner" className="text-sm cursor-pointer">
                For Sale by Owner
              </Label>
            </div>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
);

export function ResultSearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize form state from URL parameters
  const initializeFormState = (): ExtendedFormState => {
    const searchParamsObj = Object.fromEntries(searchParams.entries());

    // Helper function to safely convert string to number or return empty string
    const safeNumber = (value: string | undefined): string => {
      if (!value || value.trim() === "") return "";
      const num = Number(value);
      return !isNaN(num) && num > 0 ? String(num) : "";
    };

    // Helper function to handle bedroom/bathroom values
    const safeBedBath = (value: string | undefined): string => {
      if (!value || value.trim() === "") return "";
      // If it's a valid number, return it as string
      const num = Number(value);
      if (!isNaN(num) && num > 0) {
        return String(num);
      }
      // If it's not a valid number, return empty string (will default to "- Any -")
      return "";
    };

    return {
      listingType: searchParamsObj.contract ?? "sale",
      search: searchParamsObj.q ?? "",
      propertyType: searchParamsObj.ftype ?? "",
      bedrooms: safeBedBath(searchParamsObj.fbeds),
      bathrooms: safeBedBath(searchParamsObj.fbaths),
      minPrice: safeNumber(searchParamsObj.fmin),
      maxPrice: safeNumber(searchParamsObj.fmax),
      minArea: safeNumber(searchParamsObj.fminarea),
      maxArea: safeNumber(searchParamsObj.fmaxarea),
      period: searchParamsObj.frentperiod ?? "",
      sort: searchParamsObj.fsort ?? "",
      furnished: searchParamsObj.fisfurnished === "1",
      owner: searchParamsObj.ffsbo === "1",
    };
  };

  const [formState, setFormState] =
    useState<ExtendedFormState>(initializeFormState);

  // Update form state when URL parameters change
  useEffect(() => {
    setFormState(initializeFormState());
  }, [searchParams]);

  const updateFormState = (updates: Partial<ExtendedFormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  const handleSearch = async () => {
    // Set default location to 'ghana' if not provided
    const searchValue =
      formState.search && formState.search.trim() !== ""
        ? formState.search
        : "ghana";

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

    // Navigate to search page
    router.push(`/search/${apiContract}?${searchParams.toString()}`);
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 p-4 container mx-auto">
        {/* For Sale/Rent Dropdown */}
        <Select
          value={formState.listingType}
          onValueChange={(value) => updateFormState({ listingType: value })}
        >
          <SelectTrigger className="h-12 w-32 bg-white border-gray-200 hover:bg-gray-50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="sale">For sale</SelectItem>
              <SelectItem value="rent">For rent</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Search Input */}
        <SearchInput
          searchValue={formState.search}
          onSearchChange={(value) => updateFormState({ search: value })}
        />

        {/* Property Type */}
        <Select
          value={formState.propertyType}
          onValueChange={(value) => updateFormState({ propertyType: value })}
        >
          <SelectTrigger className="h-12 w-40 bg-white border-gray-200 hover:bg-gray-50">
            <SelectValue placeholder="Property type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Types</SelectItem>
              {siteConfig.selectOptions.propertyType.map(({ value, label }) => (
                <SelectItem value={value} key={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Bedrooms */}
        <Select
          value={formState.bedrooms || "- Any -"}
          onValueChange={(value) => updateFormState({ bedrooms: value })}
        >
          <SelectTrigger className="h-12 w-32 bg-white border-gray-200 hover:bg-gray-50">
            <SelectValue placeholder="Bedrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="- Any -">Any Beds</SelectItem>
              {siteConfig.selectOptions.bedrooms.map(({ value, label }) => (
                <SelectItem value={value} key={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Bathrooms */}
        <Select
          value={formState.bathrooms || "- Any -"}
          onValueChange={(value) => updateFormState({ bathrooms: value })}
        >
          <SelectTrigger className="h-12 w-32 bg-white border-gray-200 hover:bg-gray-50">
            <SelectValue placeholder="Bathrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="- Any -">Any Baths</SelectItem>
              {siteConfig.selectOptions.bathrooms.map(({ value, label }) => (
                <SelectItem value={value} key={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Price Range */}
        <PriceRangeSelect
          minValue={formState.minPrice}
          maxValue={formState.maxPrice}
          onMinChange={(value) => updateFormState({ minPrice: value })}
          onMaxChange={(value) => updateFormState({ maxPrice: value })}
          priceRange={searchConfig.priceRange}
        />

        {/* More Filters */}
        <MoreFiltersPopover
          formState={formState}
          updateFormState={updateFormState}
        />

        {/* Update Search Button */}
        <Button
          onClick={handleSearch}
          className="h-12 bg-brand-primary hover:bg-brand-primary-dark text-white px-6"
        >
          Update search
        </Button>
      </div>
    </div>
  );
}
