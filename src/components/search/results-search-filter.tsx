"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";

import { useRouter } from "next/navigation";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, ChevronDown, ListFilterPlus } from "lucide-react";

// Mock site config data
const siteConfig = {
  propertyType: [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "villa", label: "Villa" },
    { value: "townhouse", label: "Townhouse" },
    { value: "studio", label: "Studio" },
  ],
  propertyBed: [
    { value: "1", label: "1 Bedroom" },
    { value: "2", label: "2 Bedrooms" },
    { value: "3", label: "3 Bedrooms" },
    { value: "4", label: "4 Bedrooms" },
    { value: "5+", label: "5+ Bedrooms" },
  ],
  priceRange: {
    min: 0,
    max: 1000000,
    step: 10000,
  },
};

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

// Form state interface
interface FormState {
  listingType: string;
  search: string;
  propertyType: string;
  bedrooms: string;
  minPrice: string;
  maxPrice: string;
  period: string;
  sort: string;
  furnished: boolean;
  owner: boolean;
  bedroomRadio: string;
}

// Price Range Component
const PriceRangeSelect = ({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: {
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
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
                min={siteConfig.priceRange.min}
                max={siteConfig.priceRange.max}
                step={siteConfig.priceRange.step}
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
                min={siteConfig.priceRange.min}
                max={siteConfig.priceRange.max}
                step={siteConfig.priceRange.step}
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
  formState: FormState;
  updateFormState: (updates: Partial<FormState>) => void;
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
                  <SelectItem value="day">Daily</SelectItem>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="month">Up to 6 months</SelectItem>
                  <SelectItem value="year">12 months plus</SelectItem>
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
                  <SelectItem value="new">New to old</SelectItem>
                  <SelectItem value="old">Old to new</SelectItem>
                  <SelectItem value="low">Lower to higher</SelectItem>
                  <SelectItem value="high">Higher to lower</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Bedrooms</Label>
          <RadioGroup
            value={formState.bedroomRadio}
            onValueChange={(value) => updateFormState({ bedroomRadio: value })}
            className="flex flex-wrap gap-2 mt-2"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className="flex items-center space-x-1 rounded-full border px-3 py-1.5"
              >
                <RadioGroupItem value={num.toString()} id={`r${num}`} />
                <Label htmlFor={`r${num}`} className="cursor-pointer text-xs">
                  {num} Bed{num > 1 ? "s" : ""}
                </Label>
              </div>
            ))}
          </RadioGroup>
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
  const navigate = useRouter();

  const [formState, setFormState] = useState<FormState>({
    listingType: "sale",
    search: "",
    propertyType: "",
    bedrooms: "",
    minPrice: "",
    maxPrice: "",
    period: "",
    sort: "",
    furnished: false,
    owner: false,
    bedroomRadio: "1",
  });

  const updateFormState = (updates: Partial<FormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  const handleSearch = () => {
    // Ensure default location is 'ghana' if not provided
    const searchValue =
      formState.search && formState.search.trim() !== ""
        ? formState.search
        : "ghana";
    // You may want to update the navigation path to use searchValue if needed
    // For now, just log or use as needed
    navigate.push("/results/1");
  };

  return (
    <div className=" bg-white border border-gray-200  shadow-sm">
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
              <SelectItem value="land">Land</SelectItem>
              <SelectItem value="short-let">Short let</SelectItem>
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
              {siteConfig.propertyType.map(({ value, label }) => (
                <SelectItem value={value} key={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Bedrooms */}
        <Select
          value={formState.bedrooms}
          onValueChange={(value) => updateFormState({ bedrooms: value })}
        >
          <SelectTrigger className="h-12 w-32 bg-white border-gray-200 hover:bg-gray-50">
            <SelectValue placeholder="Bedrooms" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Beds</SelectItem>
              {siteConfig.propertyBed.map(({ value, label }) => (
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
