"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface DevelopmentProjectsFiltersProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function DevelopmentProjectsFilters({
  searchParams,
}: DevelopmentProjectsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentSearchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    (searchParams.search as string) || ""
  );
  const [showAllFilters, setShowAllFilters] = useState(false);

  const normalizeParam = (
    value: string | string[] | undefined
  ): string | undefined => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return value;
  };

  // Update URL with new search parameters
  const updateSearchParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(currentSearchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value && value !== "") {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      router.push(`${pathname}?${params.toString()}`);
    },
    [currentSearchParams, pathname, router]
  );

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    router.push(pathname);
  };

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchParams({ search: searchQuery });
  };

  // Remove individual filter
  const removeFilter = (key: string) => {
    updateSearchParams({ [key]: undefined });
  };

  // Get active filters for display
  const getActiveFilters = () => {
    const filters = [];

    const search = normalizeParam(searchParams.search);
    if (search) {
      filters.push({
        key: "search",
        value: search,
        label: `Search: ${search}`,
      });
    }
    const status = normalizeParam(searchParams.status);
    if (status) {
      filters.push({
        key: "status",
        value: status,
        label: `Status: ${status}`,
      });
    }
    const developer = normalizeParam(searchParams.developer);
    if (developer) {
      filters.push({
        key: "developer",
        value: developer,
        label: `Developer: ${developer}`,
      });
    }
    const location = normalizeParam(searchParams.location);
    if (location) {
      filters.push({
        key: "location",
        value: location,
        label: `Location: ${location}`,
      });
    }
    if (searchParams.featured) {
      filters.push({ key: "featured", value: "true", label: "Featured Only" });
    }

    return filters;
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
          <Input
            type="text"
            placeholder="Search by project name, developer, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" className="px-6">
          Search
        </Button>
      </form>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowAllFilters(!showAllFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          {showAllFilters ? "Hide Filters" : "Show More Filters"}
        </Button>

        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            onClick={clearAllFilters}
            className="text-brand-muted hover:text-brand-accent"
          >
            Clear All Filters
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <Badge
              key={filter.key}
              variant="secondary"
              className="gap-1 pr-1 text-sm"
            >
              {filter.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter(filter.key)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {filter.key} filter</span>
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Extended Filters */}
      <div
        className={cn(
          "space-y-4 overflow-hidden transition-all duration-300",
          showAllFilters ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Project Status</Label>
            <Select
              value={(searchParams.status as string) || "all"}
              onValueChange={(value) =>
                updateSearchParams({
                  status: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Developer Filter */}
          <div className="space-y-2">
            <Label htmlFor="developer">Developer</Label>
            <Select
              value={(searchParams.developer as string) || "all"}
              onValueChange={(value) =>
                updateSearchParams({
                  developer: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All developers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All developers</SelectItem>
                <SelectItem value="premier developments">
                  Premier Developments
                </SelectItem>
                <SelectItem value="skyline properties">
                  Skyline Properties
                </SelectItem>
                <SelectItem value="classic homes ltd">
                  Classic Homes Ltd
                </SelectItem>
                <SelectItem value="devtraco plus">Devtraco Plus</SelectItem>
                <SelectItem value="regimanuel gray">Regimanuel Gray</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select
              value={(searchParams.location as string) || "all"}
              onValueChange={(value) =>
                updateSearchParams({
                  location: value === "all" ? undefined : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                <SelectItem value="east legon">East Legon</SelectItem>
                <SelectItem value="airport residential">
                  Airport Residential
                </SelectItem>
                <SelectItem value="cantonments">Cantonments</SelectItem>
                <SelectItem value="trassaco estate">Trassaco Estate</SelectItem>
                <SelectItem value="tema">Tema</SelectItem>
                <SelectItem value="spintex">Spintex</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Featured Filter */}
          <div className="space-y-2">
            <Label htmlFor="featured">Show Only</Label>
            <Select
              value={searchParams.featured ? "featured" : "all"}
              onValueChange={(value) =>
                updateSearchParams({
                  featured: value === "featured" ? "true" : undefined,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All projects</SelectItem>
                <SelectItem value="featured">Featured only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
