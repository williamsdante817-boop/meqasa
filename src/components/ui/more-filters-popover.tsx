"use client";

import { Checkbox } from "@/components/ui/checkbox";
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
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import {
  FALLBACK_RENT_PERIOD_OPTIONS,
  FALLBACK_SORT_OPTIONS,
} from "@/lib/search/options";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  period?: FilterOption[];
  sort?: FilterOption[];
}

interface FormState {
  period?: string;
  sort?: string;
  furnished?: boolean;
  owner?: boolean;
}

interface MoreFiltersPopoverProps {
  formState: FormState;
  updateFormState: (updates: Partial<FormState>) => void;
  config?: FilterConfig;

  // Context-specific props
  variant?: "default" | "compact" | "home";
  className?: string;
  title?: string;
  contractType?: "rent" | "buy" | "short-let" | "land";
}

// Default filter options
const defaultConfig: FilterConfig = {
  period: [...FALLBACK_RENT_PERIOD_OPTIONS],
  sort: [...FALLBACK_SORT_OPTIONS],
};

export function MoreFiltersPopover({
  formState,
  updateFormState,
  config = defaultConfig,
  variant = "default",
  className = "",
  title = "More filters",
  contractType = "rent",
}: MoreFiltersPopoverProps) {
  const filterConfig = { ...defaultConfig, ...config };

  // Determine the correct text based on contract type
  const getOwnerText = () => {
    switch (contractType) {
      case "buy":
        return {
          title: "For Sale by Owner",
          description: "Properties sold directly by the owner"
        };
      case "rent":
      case "short-let":
      default:
        return {
          title: "For Rent by Owner",
          description: "Properties rented directly by the owner"
        };
    }
  };

  const ownerText = getOwnerText();

  const getTriggerClassName = () => {
    const base = "transition-all duration-200 group";

    switch (variant) {
      case "home":
        // Use custom className if provided (for search component Select matching), otherwise use default home styles
        return (
          className ||
          `flex min-w-[150px] h-5 max-w-[150px] cursor-pointer items-center justify-between rounded-lg text-base font-medium text-white whitespace-nowrap`
        );
      case "compact":
        return `h-10 shadow-none bg-white border-gray-200 hover:bg-gray-50 hover:border-brand-primary/50 text-brand-accent font-normal text-sm px-2 flex-shrink-0 ${base}`;
      default:
        return `h-10 sm:h-12 shadow-none bg-white border-gray-200 hover:bg-gray-50 hover:border-brand-primary/50 text-brand-accent font-normal text-sm px-2 sm:px-4 flex-shrink-0 ${base}`;
    }
  };

  const getContentClassName = () => {
    switch (variant) {
      case "home":
        // Use the same enhanced styling as default for consistent modal content
        return "w-[65vw] max-w-[296px] sm:w-[296px] z-[101] shadow-2xl border border-gray-200 bg-white rounded-md";
      case "compact":
        return "w-[296px] z-[100] shadow-lg border border-gray-200 bg-white rounded-lg";
      default:
        return "w-[65vw] max-w-[296px] sm:w-[296px] z-[99997] shadow-lg border border-gray-200 bg-white rounded-md";
    }
  };

  const renderContent = () => {
    // All variants now use the same enhanced layout for consistent modal content

    // Enhanced layout for results page
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-base text-brand-accent">
            Additional Filters
          </h4>
          <div className="w-8 h-1 bg-brand-primary/20 rounded-full" />
        </div>

        {/* Filter Controls Section */}
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5">
            {/* Rent Period - Only show for rent tab */}
            {contractType === "rent" && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-brand-accent">
                  Rent Period
                </Label>
                <Select
                  value={formState.period}
                  onValueChange={(value) => updateFormState({ period: value })}
                >
                  <SelectTrigger className="h-12 shadow-none cursor-pointer border-gray-200 focus:border-brand-primary hover:border-gray-300 bg-gray-50/50 focus:bg-white text-sm font-medium transition-all duration-200">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent
                    className="bg-white border border-gray-200 shadow-xl rounded-lg"
                    style={{ zIndex: 99999 }}
                  >
                    <SelectGroup>
                      <SelectItem
                        value="- Any -"
                        className="text-sm py-3 hover:bg-brand-primary/5"
                      >
                        Any Period
                      </SelectItem>
                      {filterConfig.period?.map(({ value, label }, index) => (
                        <SelectItem
                          key={`${value}-${index}`}
                          value={value}
                          className="text-sm py-3 hover:bg-brand-primary/5"
                        >
                          {label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-3">
              <Label className="text-sm font-medium text-brand-accent">
                Sort by
              </Label>
              <Select
                value={formState.sort}
                onValueChange={(value) => updateFormState({ sort: value })}
              >
                <SelectTrigger className="h-12 shadow-none cursor-pointer border-gray-200 focus:border-brand-primary hover:border-gray-300 bg-gray-50/50 focus:bg-white text-sm font-medium transition-all duration-200">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent
                  className="bg-white border border-gray-200 shadow-xl rounded-lg"
                  style={{ zIndex: 99999 }}
                >
                  <SelectGroup>
                    {filterConfig.sort?.map(({ value, label }) => (
                      <SelectItem
                        key={value + label}
                        value={value}
                        className="text-sm py-3 hover:bg-brand-primary/5"
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Property Features Section - Hide furnished and owner options for land */}
        {contractType !== "land" && (
          <div className="space-y-4 border-t border-gray-100 pt-5">
            <Label className="text-sm font-semibold text-brand-accent">
              Property Features
            </Label>
            <div className="">
              <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50/50 transition-colors duration-200">
                <Checkbox
                  id="furnished-results"
                  checked={formState.furnished}
                  onCheckedChange={(checked) =>
                    updateFormState({ furnished: !!checked })
                  }
                  className="mt-0.5 h-5 w-5 border-2 border-gray-300 data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary transition-all duration-200"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="furnished-results"
                    className="text-sm font-medium cursor-pointer text-brand-accent leading-tight"
                  >
                    Furnished Properties
                  </Label>
                  <p className="text-xs text-brand-muted">
                    Properties that come with furniture included
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50/50 transition-colors duration-200">
                <Checkbox
                  id="owner-results"
                  checked={formState.owner}
                  onCheckedChange={(checked) =>
                    updateFormState({ owner: !!checked })
                  }
                  className="mt-0.5 h-5 w-5 border-2 border-gray-300 data-[state=checked]:bg-brand-primary data-[state=checked]:border-brand-primary transition-all duration-200"
                />
                <div className="flex-1">
                  <Label
                    htmlFor="owner-results"
                    className="text-sm font-medium cursor-pointer text-brand-accent leading-tight"
                  >
                    {ownerText.title}
                  </Label>
                  <p className="text-xs text-brand-muted">
                    {ownerText.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTrigger = () => {
    if (variant === "home") {
      // For home variant, render as div but styled to match Select triggers when className is provided
      return (
        <div className={getTriggerClassName()}>
          <span className="flex-shrink-0">{title}</span>
          <SlidersHorizontal className="ml-2 h-4 w-4 flex-shrink-0" />
        </div>
      );
    }

    return (
      <Button variant="outline" className={getTriggerClassName()}>
        <span className="hidden sm:inline flex-shrink-0">{title}</span>
        <span className="sm:hidden flex-shrink-0">More</span>
        <SlidersHorizontal className="ml-1 sm:ml-2 h-4 w-4 flex-shrink-0" />
      </Button>
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild={variant !== "home"}>
        {renderTrigger()}
      </PopoverTrigger>
      <PopoverContent
        className={getContentClassName()}
        align="end"
        side="bottom"
        sideOffset={variant === "home" ? 4 : 8}
        style={{ zIndex: variant === "home" ? 101 : 99997 }}
      >
        {renderContent()}
      </PopoverContent>
    </Popover>
  );
}
