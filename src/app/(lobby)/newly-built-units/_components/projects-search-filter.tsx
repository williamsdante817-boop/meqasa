"use client";

import {
  ActiveFilterChips,
  type DeveloperUnitsFormState,
} from "@/components/search/ActiveFilterChips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { BEDROOM_OPTIONS, TERMS_OPTIONS, UNIT_TYPES } from "./constants";

interface ProjectsSearchFilterProps {
  resultCount?: number;
}

export function ProjectsSearchFilter({}: ProjectsSearchFilterProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [isSearching, setIsSearching] = useState(false);

  // Get current values from URL (map to API parameters)
  const currentValues = {
    terms: searchParams.get("terms") || "sale", // sale | rent | preselling
    unittype: searchParams.get("unittype") || "apartment",
    address: searchParams.get("address") || "",
    maxprice: searchParams.get("maxprice") || "",
    beds: searchParams.get("beds") || "0",
  };

  // Local state for filter values (don't update URL until search is clicked)
  const [localFilters, setLocalFilters] = useState(currentValues);

  const updateLocalFilter = useCallback((key: string, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleSearch = () => {
    // Build search params for navigation to units search page
    const searchParams = new URLSearchParams();

    // Add all filter values (including empty ones to match live site format)
    searchParams.set("terms", localFilters.terms);
    searchParams.set("unittype", localFilters.unittype);
    searchParams.set("address", localFilters.address || "");
    searchParams.set("maxprice", localFilters.maxprice || "");
    searchParams.set("beds", localFilters.beds);

    // Use startTransition for smooth navigation without flicker
    // Set loading briefly for user feedback, then navigate
    setIsSearching(true);
    startTransition(() => {
      router.push(`/units/search?${searchParams.toString()}`);
    });

    // Reset loading state after a brief moment for UX feedback
    setTimeout(() => setIsSearching(false), 100);
  };

  const clearFilters = () => {
    startTransition(() => {
      router.push("/newly-built-units");
    });
  };

  const handleRemoveFilter = (filterKey: keyof DeveloperUnitsFormState) => {
    const resetValues: Record<string, string> = {
      terms: "sale",
      unittype: "apartment",
      address: "",
      maxprice: "",
      beds: "0",
      baths: "0",
    };
    updateLocalFilter(filterKey, resetValues[filterKey] || "");
  };

  const handleClearAllFilters = () => {
    setLocalFilters({
      terms: "sale",
      unittype: "apartment",
      address: "",
      maxprice: "",
      beds: "0",
    });
  };

  return (
    <div className="border border-gray-200 bg-white">
      {/* Mobile-responsive filter container with horizontal scrolling */}
      <div className="overflow-x-auto">
        <div className="container mx-auto flex min-w-fit items-center gap-2 p-4">
          {/* Terms Dropdown (sale | rent | preselling) */}
          <Select
            value={localFilters.terms}
            onValueChange={(value) => updateLocalFilter("terms", value)}
          >
            <SelectTrigger className="text-brand-accent h-10 w-28 flex-shrink-0 cursor-pointer border-gray-200 bg-white text-sm shadow-none hover:bg-gray-50 sm:h-12 sm:w-32 sm:text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TERMS_OPTIONS.map((term) => (
                <SelectItem key={term.value} value={term.value}>
                  {term.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Location Search Input */}
          <div className="relative min-w-[180px] flex-1 sm:min-w-[280px]">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              value={localFilters.address}
              placeholder="Search location..."
              className="!h-10 pl-10 !text-sm placeholder:!text-sm placeholder:text-gray-400 sm:!h-12 sm:!text-base sm:placeholder:!text-base"
              onChange={(e) => updateLocalFilter("address", e.target.value)}
            />
          </div>

          {/* Unit Type */}
          <Select
            value={localFilters.unittype}
            onValueChange={(value) => updateLocalFilter("unittype", value)}
          >
            <SelectTrigger className="text-brand-accent h-10 w-32 flex-shrink-0 cursor-pointer border-gray-200 bg-white text-sm shadow-none hover:bg-gray-50 sm:h-12 sm:w-40 sm:text-base">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {UNIT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "all"
                    ? "All Types"
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Max Price */}
          <Input
            value={localFilters.maxprice}
            placeholder="Max Price"
            type="number"
            className="!h-10 w-24 flex-shrink-0 !text-sm placeholder:!text-sm placeholder:text-gray-400 sm:!h-12 sm:w-32 sm:!text-base sm:placeholder:!text-base"
            onChange={(e) => updateLocalFilter("maxprice", e.target.value)}
          />

          {/* Bedrooms */}
          <Select
            value={localFilters.beds}
            onValueChange={(value) => updateLocalFilter("beds", value)}
          >
            <SelectTrigger className="text-brand-accent h-10 w-20 flex-shrink-0 cursor-pointer border-gray-200 bg-white text-sm shadow-none hover:bg-gray-50 sm:h-12 sm:w-28 sm:text-base">
              <SelectValue placeholder="Beds" />
            </SelectTrigger>
            <SelectContent>
              {BEDROOM_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search Button */}
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
                <span>Search Units</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      <ActiveFilterChips
        mode="developer"
        formState={{
          terms: localFilters.terms,
          unittype: localFilters.unittype,
          address: localFilters.address,
          maxprice: localFilters.maxprice,
          beds: localFilters.beds,
          baths: "0",
        }}
        onRemoveFilter={handleRemoveFilter}
        onClearAllFilters={handleClearAllFilters}
      />
    </div>
  );
}
