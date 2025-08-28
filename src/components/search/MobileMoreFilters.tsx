"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCcw } from "lucide-react";
import { type FormState } from "@/types/search";
import { searchConfig } from "@/config/search";

interface MobileMoreFiltersProps {
  formState: FormState;
  updateFormState: (updates: Partial<FormState>) => void;
}

// Fallback options
const fallbackSortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
];

const fallbackPeriodOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "annually", label: "Annually" },
];

export function MobileMoreFilters({
  formState,
  updateFormState,
}: MobileMoreFiltersProps) {
  const config = searchConfig?.selectOptions;
  const sortOptions = config?.sort || fallbackSortOptions;
  const periodOptions = config?.period || fallbackPeriodOptions;

  const resetFilters = () => {
    updateFormState({
      sort: "default",
      period: "any",
      furnished: false,
      owner: false,
    });
  };

  const hasActiveFilters =
    (formState.sort && formState.sort !== "default") ||
    (formState.period && formState.period !== "any") ||
    formState.furnished ||
    formState.owner;

  return (
    <div className="space-y-4">
      {/* Advanced Filters Header */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <h3 className="font-medium text-gray-700">Advanced Filters</h3>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="ghost"
            onClick={resetFilters}
            className="flex items-center gap-1 h-auto p-1 text-xs text-gray-500 hover:text-gray-700"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      {/* Sort By */}
      <div className="flex flex-col gap-3 text-left">
        <Label className="text-sm font-medium text-gray-700">Sort By</Label>
        <Select
          value={formState.sort}
          onValueChange={(value) => updateFormState({ sort: value })}
        >
          <SelectTrigger className="h-12 bg-gray-50 border-gray-200 rounded-lg shadow-none">
            <SelectValue placeholder="Default sorting" />
          </SelectTrigger>
          <SelectContent className="z-[999999]" style={{ zIndex: 999999 }}>
            <SelectItem value="default" className="h-12">
              Default
            </SelectItem>
            {sortOptions.map(({ value, label }) => (
              <SelectItem key={value} value={value} className="h-12">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rent Period */}
      <div className="flex flex-col gap-3 text-left">
        <Label className="text-sm font-medium text-gray-700">Rent Period</Label>
        <Select
          value={formState.period}
          onValueChange={(value) => updateFormState({ period: value })}
        >
          <SelectTrigger className="h-12 bg-gray-50 border-gray-200 rounded-lg shadow-none">
            <SelectValue placeholder="Any period" />
          </SelectTrigger>
          <SelectContent className="z-[999999]">
            <SelectItem value="any" className="h-12">
              Any Period
            </SelectItem>
            {periodOptions.map(({ value, label }) => (
              <SelectItem key={value} value={value} className="h-12">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Toggle Filters */}
      <div className="space-y-4">
        {/* Furnished */}
        <div className="flex items-center space-x-3">
          <Checkbox
            id="furnished"
            checked={formState.furnished}
            onCheckedChange={(checked: boolean) =>
              updateFormState({ furnished: checked })
            }
          />
          <div className="space-y-1 text-left">
            <Label
              htmlFor="furnished"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Furnished Properties Only
            </Label>
            <p className="text-xs text-gray-500">
              Show only furnished properties
            </p>
          </div>
        </div>

        {/* Owner */}
        <div className="flex items-center space-x-3">
          <Checkbox
            id="owner"
            checked={formState.owner}
            onCheckedChange={(checked: boolean) =>
              updateFormState({ owner: checked })
            }
          />
          <div className="space-y-1 text-left">
            <Label
              htmlFor="owner"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              For Sale By Owner
            </Label>
            <p className="text-xs text-gray-500">
              Properties sold directly by owners
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
