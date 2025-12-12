"use client";

import { Checkbox } from "@/components/ui/checkbox";
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
import { searchConfig } from "@/config/search";
import { type FormState } from "@/types/search";
import { SlidersHorizontal } from "lucide-react";

interface MoreFiltersPopoverProps {
  formState: FormState;
  updateFormState: (updates: Partial<FormState>) => void;
  contractType?: "rent" | "buy" | "short-let" | "land";
}

// Fallback options for MoreFiltersPopover
const fallbackMoreOptions = {
  period: [
    { value: "shortrent", label: "Daily" },
    { value: "shortrent", label: "Weekly" },
    { value: "longrent", label: "Up to 6 months" },
    { value: "longrent", label: "12 months plus" },
  ],
  sort: [
    { value: "date", label: "New to old" },
    { value: "date2", label: "Old to new" },
    { value: "price", label: "Lower to higher" },
    { value: "price2", label: "Higher to lower" },
  ],
};

export function MoreFiltersPopover({
  formState,
  updateFormState,
  contractType = "rent",
}: MoreFiltersPopoverProps) {
  // Safety check to ensure searchConfig is available
  const config = searchConfig?.selectOptions || fallbackMoreOptions;

  // Determine the correct text based on contract type
  const getOwnerText = () => {
    switch (contractType) {
      case "buy":
        return "For Sale By Owner";
      case "rent":
      case "short-let":
      default:
        return "For Rent By Owner";
    }
  };

  return (
    <Popover>
      <PopoverTrigger className="flex h-5 max-w-[150px] min-w-[150px] cursor-pointer items-center justify-between rounded-lg text-base font-medium whitespace-nowrap text-white">
        <span className="flex-shrink-0">More filters</span>
        <SlidersHorizontal className="ml-2 h-4 w-4 flex-shrink-0" />
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-4">
        <div
          className={`mb-4 ${contractType === "rent" ? "grid grid-cols-2" : "grid grid-cols-1"} items-center gap-2`}
        >
          {/* Rent Period - Only show for rent tab */}
          {contractType === "rent" && (
            <Select
              value={formState.period}
              onValueChange={(value) => updateFormState({ period: value })}
            >
              <SelectTrigger className="text-b-accent h-11 min-w-fit font-semibold">
                <SelectValue placeholder="Rent period" />
              </SelectTrigger>
              <SelectContent className="text-b-accent">
                <SelectGroup>
                  <SelectItem value="- Any -">Any Period</SelectItem>
                  {(config.period || fallbackMoreOptions.period).map(
                    ({ value, label }, index) => (
                      <SelectItem value={value} key={`${value}-${index}`}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
          <Select
            value={formState.sort}
            onValueChange={(value) => updateFormState({ sort: value })}
          >
            <SelectTrigger className="text-b-accent h-11 min-w-full font-semibold">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="text-b-accent shadow-spread border-none">
              <SelectGroup>
                <SelectItem value="- Any -">Any Sort</SelectItem>
                {(config.sort || fallbackMoreOptions.sort).map(
                  ({ value, label }) => (
                    <SelectItem value={value} key={value + label}>
                      {label}
                    </SelectItem>
                  )
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="text-b-accent flex items-start justify-between pt-8 text-sm font-semibold">
          <span>Only show...</span>
          <div>
            {/* Hide furnished for land */}
            {contractType !== "land" && (
              <div className="mb-2 flex items-center space-x-2">
                <Checkbox
                  id="furnished"
                  checked={formState.furnished}
                  onCheckedChange={(checked) =>
                    updateFormState({ furnished: !!checked })
                  }
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-0 data-[state=checked]:text-white"
                />
                <label
                  htmlFor="furnished"
                  className="cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Furnished Properties
                </label>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="owner"
                checked={formState.owner}
                onCheckedChange={(checked) =>
                  updateFormState({ owner: !!checked })
                }
                className="data-[state=checked]:bg-primary data-[state=checked]:border-0 data-[state=checked]:text-white"
              />
              <label
                htmlFor="owner"
                className="cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {getOwnerText()}
              </label>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
