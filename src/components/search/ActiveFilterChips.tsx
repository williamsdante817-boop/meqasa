"use client";

import { X, Home, Bed, Bath, DollarSign, Calendar, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FormState } from "@/types/search";
import Shell from "@/layouts/shell";

interface ActiveFilterChipsProps {
  formState: FormState;
  onRemoveFilter: (filterKey: keyof FormState) => void;
  onClearAllFilters: () => void;
  contractType?: string;
}

interface FilterChip {
  key: keyof FormState;
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export function ActiveFilterChips({
  formState,
  onRemoveFilter,
  onClearAllFilters,
  contractType = "rent",
}: ActiveFilterChipsProps) {
  const getActiveFilters = (): FilterChip[] => {
    const filters: FilterChip[] = [];

    // Property type filter (don't show "land" on land searches as it's the default)
    if (
      formState.propertyType &&
      formState.propertyType !== "all" &&
      !(contractType === "land" && formState.propertyType === "land")
    ) {
      filters.push({
        key: "propertyType",
        label: "Type",
        value:
          formState.propertyType.charAt(0).toUpperCase() +
          formState.propertyType.slice(1),
        icon: Home,
        color: "bg-blue-50 text-blue-700 border-blue-200",
      });
    }

    // Bedrooms filter
    if (formState.bedrooms && formState.bedrooms !== "- Any -") {
      const bedsNum = parseInt(formState.bedrooms);
      if (!isNaN(bedsNum) && bedsNum > 0) {
        filters.push({
          key: "bedrooms",
          label: "Beds",
          value: `${bedsNum} bed${bedsNum === 1 ? "" : "s"}`,
          icon: Bed,
          color: "bg-green-50 text-green-700 border-green-200",
        });
      }
    }

    // Bathrooms filter
    if (formState.bathrooms && formState.bathrooms !== "- Any -") {
      const bathsNum = parseInt(formState.bathrooms);
      if (!isNaN(bathsNum) && bathsNum > 0) {
        filters.push({
          key: "bathrooms",
          label: "Baths",
          value: `${bathsNum} bath${bathsNum === 1 ? "" : "s"}`,
          icon: Bath,
          color: "bg-purple-50 text-purple-700 border-purple-200",
        });
      }
    }

    // Price range filter
    const hasMinPrice = formState.minPrice && formState.minPrice.trim() !== "";
    const hasMaxPrice = formState.maxPrice && formState.maxPrice.trim() !== "";

    if (hasMinPrice || hasMaxPrice) {
      let priceLabel = "";
      const minPriceNum = hasMinPrice ? parseInt(formState.minPrice) : null;
      const maxPriceNum = hasMaxPrice ? parseInt(formState.maxPrice) : null;

      if (minPriceNum && maxPriceNum) {
        priceLabel = `GH₵${minPriceNum.toLocaleString()} - GH₵${maxPriceNum.toLocaleString()}`;
      } else if (minPriceNum) {
        priceLabel = `GH₵${minPriceNum.toLocaleString()}+`;
      } else if (maxPriceNum) {
        priceLabel = `Up to GH₵${maxPriceNum.toLocaleString()}`;
      }

      if (priceLabel) {
        filters.push({
          key: "minPrice", // We'll use minPrice as the key to remove both price filters
          label: "Price",
          value: priceLabel,
          icon: DollarSign,
          color: "bg-orange-50 text-orange-700 border-orange-200",
        });
      }
    }

    // Rent period filter
    if (formState.period && formState.period !== "- Any -") {
      const periodMap: Record<string, string> = {
        shortrent: "Short term",
        longrent: "Long term",
      };

      filters.push({
        key: "period",
        label: "Period",
        value: periodMap[formState.period] ?? formState.period,
        icon: Calendar,
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      });
    }

    // Boolean filters
    if (formState.furnished) {
      filters.push({
        key: "furnished",
        label: "Feature",
        value: "Furnished",
        icon: Filter,
        color: "bg-teal-50 text-teal-700 border-teal-200",
      });
    }

    if (formState.owner) {
      filters.push({
        key: "owner",
        label: "Feature",
        value: "Owner Direct",
        icon: Filter,
        color: "bg-teal-50 text-teal-700 border-teal-200",
      });
    }

    return filters;
  };

  const activeFilters = getActiveFilters();

  // Don't render if no active filters
  if (activeFilters.length === 0) {
    return null;
  }

  const handleRemoveFilter = (filterKey: keyof FormState) => {
    // Special handling for price range - remove both min and max
    if (filterKey === "minPrice") {
      onRemoveFilter("minPrice");
      onRemoveFilter("maxPrice" as keyof FormState);
    } else {
      onRemoveFilter(filterKey);
    }
  };

  return (
    <Shell className="flex items-center gap-3 py-4 pb-10">
      <div className="flex flex-shrink-0 items-center gap-2 text-sm text-gray-600">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Active filters:</span>
      </div>

      <div className="scrollbar-hide flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
        <div className="flex flex-nowrap items-center gap-2">
          {activeFilters.map((filter) => {
            const IconComponent = filter.icon;

            return (
              <Badge
                key={filter.key}
                variant="outline"
                className={`${filter.color} flex-shrink-0 border whitespace-nowrap transition-all hover:shadow-sm`}
              >
                <IconComponent className="mr-1 h-3 w-3" />
                <span className="text-xs font-medium">
                  {filter.label}: {filter.value}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-4 w-4 rounded-full p-0 hover:bg-black/10"
                  onClick={() => handleRemoveFilter(filter.key)}
                  aria-label={`Remove ${filter.label} filter`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            );
          })}

          {activeFilters.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAllFilters}
              className="ml-2 h-6 flex-shrink-0 px-2 text-xs whitespace-nowrap text-gray-500 hover:text-gray-700"
              aria-label="Clear all filters"
            >
              Clear all
            </Button>
          )}
        </div>
      </div>
    </Shell>
  );
}
