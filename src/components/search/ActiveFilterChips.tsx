"use client";

import {
  X,
  Home,
  Bed,
  Bath,
  DollarSign,
  Calendar,
  Filter,
  MapPin,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FormState } from "@/types/search";
import Shell from "@/layouts/shell";
import type React from "react";

export interface DeveloperUnitsFormState {
  terms: string;
  unittype: string;
  address: string;
  maxprice: string;
  beds: string;
  baths: string;
}

type IconComponent = React.ComponentType<{ className?: string }>;

interface SharedProps {
  onClearAllFilters: () => void;
}

interface PropertyFilterProps extends SharedProps {
  mode?: "property";
  formState: FormState;
  onRemoveFilter: (filterKey: keyof FormState) => void;
  contractType?: string;
}

interface DeveloperFilterProps extends SharedProps {
  mode: "developer";
  formState: DeveloperUnitsFormState;
  onRemoveFilter: (filterKey: keyof DeveloperUnitsFormState) => void;
}

type ActiveFilterChipsProps = PropertyFilterProps | DeveloperFilterProps;

interface FilterChip<KeyType> {
  key: KeyType;
  label: string;
  value: string;
  icon: IconComponent;
  color: string;
}

const DEFAULT_DEVELOPER_FORM_STATE: DeveloperUnitsFormState = {
  terms: "sale",
  unittype: "all",
  address: "",
  maxprice: "all",
  beds: "0",
  baths: "0",
};

const TERM_LABELS: Record<string, string> = {
  sale: "For Sale",
  rent: "For Rent",
  preselling: "Pre-selling",
};

const formatCurrency = (raw: string): string | null => {
  const value = Number(raw);
  if (Number.isNaN(value) || value <= 0) {
    return null;
  }
  return `GH₵${value.toLocaleString()}`;
};

const renderPropertyChips = ({
  formState,
  onRemoveFilter,
  onClearAllFilters,
  contractType = "rent",
}: PropertyFilterProps) => {
  const getActiveFilters = (): FilterChip<keyof FormState>[] => {
    const filters: FilterChip<keyof FormState>[] = [];

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

    if (formState.bedrooms && formState.bedrooms !== "- Any -") {
      const bedsNum = parseInt(formState.bedrooms, 10);
      if (!Number.isNaN(bedsNum) && bedsNum > 0) {
        filters.push({
          key: "bedrooms",
          label: "Beds",
          value: `${bedsNum} bed${bedsNum === 1 ? "" : "s"}`,
          icon: Bed,
          color: "bg-green-50 text-green-700 border-green-200",
        });
      }
    }

    if (formState.bathrooms && formState.bathrooms !== "- Any -") {
      const bathsNum = parseInt(formState.bathrooms, 10);
      if (!Number.isNaN(bathsNum) && bathsNum > 0) {
        filters.push({
          key: "bathrooms",
          label: "Baths",
          value: `${bathsNum} bath${bathsNum === 1 ? "" : "s"}`,
          icon: Bath,
          color: "bg-purple-50 text-purple-700 border-purple-200",
        });
      }
    }

    const hasMinPrice =
      formState.minPrice && formState.minPrice.trim().length > 0;
    const hasMaxPrice =
      formState.maxPrice && formState.maxPrice.trim().length > 0;

    if (hasMinPrice || hasMaxPrice) {
      let priceLabel = "";
      const minPriceNum = hasMinPrice ? parseInt(formState.minPrice, 10) : NaN;
      const maxPriceNum = hasMaxPrice ? parseInt(formState.maxPrice, 10) : NaN;

      if (!Number.isNaN(minPriceNum) && !Number.isNaN(maxPriceNum)) {
        priceLabel = `GH₵${minPriceNum.toLocaleString()} - GH₵${maxPriceNum.toLocaleString()}`;
      } else if (!Number.isNaN(minPriceNum)) {
        priceLabel = `GH₵${minPriceNum.toLocaleString()}+`;
      } else if (!Number.isNaN(maxPriceNum)) {
        priceLabel = `Up to GH₵${maxPriceNum.toLocaleString()}`;
      }

      if (priceLabel) {
        filters.push({
          key: "minPrice",
          label: "Price",
          value: priceLabel,
          icon: DollarSign,
          color: "bg-orange-50 text-orange-700 border-orange-200",
        });
      }
    }

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

  if (activeFilters.length === 0) {
    return null;
  }

  const handleRemoveFilter = (filterKey: keyof FormState) => {
    if (filterKey === "minPrice") {
      onRemoveFilter("minPrice");
      onRemoveFilter("maxPrice");
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
                className={`${filter.color} flex-shrink-0 whitespace-nowrap border transition-all hover:shadow-sm`}
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
              className="ml-2 h-6 flex-shrink-0 px-2 text-xs text-gray-500 hover:text-gray-700"
              aria-label="Clear all filters"
            >
              Clear all
            </Button>
          )}
        </div>
      </div>
    </Shell>
  );
};

const renderDeveloperChips = ({
  formState,
  onRemoveFilter,
  onClearAllFilters,
}: DeveloperFilterProps) => {
  const activeFilters: FilterChip<keyof DeveloperUnitsFormState>[] = [];

  if (formState.terms && formState.terms !== DEFAULT_DEVELOPER_FORM_STATE.terms) {
    activeFilters.push({
      key: "terms",
      label: "Terms",
      value: TERM_LABELS[formState.terms] ?? formState.terms,
      icon: Tag,
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    });
  }

  if (formState.unittype && formState.unittype !== DEFAULT_DEVELOPER_FORM_STATE.unittype) {
    activeFilters.push({
      key: "unittype",
      label: "Type",
      value:
        formState.unittype.charAt(0).toUpperCase() +
        formState.unittype.slice(1),
      icon: Home,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    });
  }

  if (formState.address.trim().length > 0) {
    activeFilters.push({
      key: "address",
      label: "Location",
      value: formState.address,
      icon: MapPin,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    });
  }

  const beds = Number(formState.beds);
  if (!Number.isNaN(beds) && beds > 0) {
    activeFilters.push({
      key: "beds",
      label: "Beds",
      value: `${beds}+`,
      icon: Bed,
      color: "bg-green-50 text-green-700 border-green-200",
    });
  }

  const baths = Number(formState.baths);
  if (!Number.isNaN(baths) && baths > 0) {
    activeFilters.push({
      key: "baths",
      label: "Baths",
      value: `${baths}+`,
      icon: Bath,
      color: "bg-purple-50 text-purple-700 border-purple-200",
    });
  }

  const formattedPrice = formatCurrency(formState.maxprice);
  if (formattedPrice) {
    activeFilters.push({
      key: "maxprice",
      label: "Max Price",
      value: formattedPrice,
      icon: DollarSign,
      color: "bg-orange-50 text-orange-700 border-orange-200",
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

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
                className={`${filter.color} flex-shrink-0 whitespace-nowrap border transition-all hover:shadow-sm`}
              >
                <IconComponent className="mr-1 h-3 w-3" />
                <span className="text-xs font-medium">
                  {filter.label}: {filter.value}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-1 h-4 w-4 rounded-full p-0 hover:bg-black/10"
                  onClick={() => onRemoveFilter(filter.key)}
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
              className="ml-2 h-6 flex-shrink-0 px-2 text-xs text-gray-500 hover:text-gray-700"
              aria-label="Clear all filters"
            >
              Clear all
            </Button>
          )}
        </div>
      </div>
    </Shell>
  );
};

export function ActiveFilterChips(props: ActiveFilterChipsProps) {
  if (props.mode === "developer") {
    return renderDeveloperChips(props);
  }

  return renderPropertyChips(props);
}
