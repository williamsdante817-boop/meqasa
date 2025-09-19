"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TERMS_OPTIONS, UNIT_TYPES, BEDROOM_OPTIONS } from "./constants";

interface ProjectsSearchFilterProps {
  resultCount?: number;
}

export function ProjectsSearchFilter({
  resultCount = 0,
}: ProjectsSearchFilterProps) {
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

  const getActiveFilters = () => {
    const active = [];
    if (localFilters.terms !== "sale")
      active.push(`Terms: ${localFilters.terms}`);
    if (localFilters.unittype !== "apartment")
      active.push(`Type: ${localFilters.unittype}`);
    if (localFilters.address)
      active.push(`Location: "${localFilters.address}"`);
    if (localFilters.maxprice)
      active.push(
        `Max Price: GH₵${Number(localFilters.maxprice).toLocaleString()}`
      );
    if (localFilters.beds && localFilters.beds !== "0")
      active.push(`Beds: ${localFilters.beds}`);
    return active;
  };

  const removeFilter = (filter: string) => {
    if (filter.startsWith("Terms:")) {
      updateLocalFilter("terms", "sale");
    } else if (filter.startsWith("Type:")) {
      updateLocalFilter("unittype", "apartment");
    } else if (filter.startsWith("Location:")) {
      updateLocalFilter("address", "");
    } else if (filter.startsWith("Max Price:")) {
      updateLocalFilter("maxprice", "");
    } else if (filter.startsWith("Beds:")) {
      updateLocalFilter("beds", "0");
    }
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
          <div className="relative min-w-[120px] flex-1 sm:min-w-[200px]">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              value={localFilters.address}
              placeholder="Search location..."
              className="h-10 pl-10 text-sm sm:h-12 sm:text-base"
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
            className="h-10 w-24 flex-shrink-0 text-sm sm:h-12 sm:w-32 sm:text-base"
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
                <Search className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Search Units</span>
                <span className="sm:hidden">Search</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {getActiveFilters().length > 0 && (
        <div className="container mx-auto px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {getActiveFilters().map((filter, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
                onClick={() => removeFilter(filter)}
              >
                {filter} ×
              </Badge>
            ))}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground h-6 px-2 text-xs"
            >
              Clear all
            </Button>
          </div>
          {resultCount > 0 && (
            <div className="text-muted-foreground mt-2 text-sm">
              {resultCount.toLocaleString()} developer units found
            </div>
          )}
        </div>
      )}
    </div>
  );
}
