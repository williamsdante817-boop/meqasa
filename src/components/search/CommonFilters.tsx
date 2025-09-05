"use client";

import { Separator } from "@/components/ui/separator";
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
import { PriceRangeSelect } from "@/components/ui/price-range-select";
import { MoreFiltersPopover } from "@/components/ui/more-filters-popover";
import { PriceInput } from "@/components/search/PriceInput";

interface CommonFiltersProps {
  showMoreFilters?: boolean;
  hidePropertyType?: boolean;
  hideBedBath?: boolean;
  showAreaRange?: boolean;
  isShortLet?: boolean; // New prop to identify short-let search
  formState: FormState;
  updateFormState: (updates: Partial<FormState>) => void;
}

// Fallback options in case searchConfig is not loaded
const fallbackOptions = {
  propertyType: [
    { value: "house", label: "House" },
    { value: "apartment", label: "Apartment" },
    { value: "office", label: "Office" },
    { value: "land", label: "Land" },
  ],
  bedrooms: [
    { value: "1", label: "1 Bedroom" },
    { value: "2", label: "2 Bedrooms" },
    { value: "3", label: "3 Bedrooms" },
    { value: "4", label: "4 Bedrooms" },
    { value: "5", label: "5+ Bedrooms" },
  ],
  bathrooms: [
    { value: "1", label: "1 Bathroom" },
    { value: "2", label: "2 Bathrooms" },
    { value: "3", label: "3 Bathrooms" },
    { value: "4", label: "4 Bathrooms" },
    { value: "5", label: "5+ Bathrooms" },
  ],
  howShort: [
    { value: "day", label: "Daily" },
    { value: "week", label: "Weekly" },
    { value: "month", label: "Monthly" },
    { value: "month3", label: "3 Months" },
    { value: "month6", label: "6 Months" },
  ],
};

export function CommonFilters({
  showMoreFilters = false,
  hidePropertyType = false,
  hideBedBath = false,
  showAreaRange = false,
  isShortLet = false, // New prop with default value
  formState,
  updateFormState,
}: CommonFiltersProps) {
  // Safety check to ensure searchConfig is available
  const config = searchConfig?.selectOptions || fallbackOptions;

  return (
    <div className="relative mx-auto mt-3 hidden max-w-max items-end justify-center gap-2 py-1 lg:flex">
      {!hidePropertyType && (
        <>
          <Select
            value={formState.propertyType}
            onValueChange={(value) => updateFormState({ propertyType: value })}
          >
            <SelectTrigger className="h-5 min-w-[150px] max-w-[150px] cursor-pointer rounded-none border-0 bg-transparent py-0 text-base font-medium shadow-none text-white focus:border-0 focus:ring-0 focus:ring-transparent">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  value="all"
                  key="default-type"
                  className="line-clamp-1"
                >
                  Property Type
                </SelectItem>
                {(config.propertyType || fallbackOptions.propertyType).map(
                  ({ value, label }) => (
                    <SelectItem
                      value={value}
                      key={value}
                      className="line-clamp-1"
                    >
                      {label}
                    </SelectItem>
                  ),
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Separator orientation="vertical" className="h-[20px] bg-[#9A9EB5]" />
        </>
      )}
      {isShortLet && (
        <>
          <Select
            value={formState.howShort ?? "- Any -"}
            onValueChange={(value) => updateFormState({ howShort: value })}
          >
            <SelectTrigger className="h-5 min-w-[150px] max-w-[150px] cursor-pointer rounded-none border-0 bg-transparent py-0 text-base font-medium shadow-none text-white focus:border-0 focus:ring-0 focus:ring-transparent">
              <SelectValue placeholder="Duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  value="- Any -"
                  key="default-duration"
                  className="line-clamp-1"
                >
                  Duration
                </SelectItem>
                {(config.howShort || fallbackOptions.howShort).map(
                  ({ value, label }) => (
                    <SelectItem
                      value={value}
                      key={value}
                      className="line-clamp-1"
                    >
                      {label}
                    </SelectItem>
                  ),
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Separator orientation="vertical" className="h-[20px] bg-[#9A9EB5]" />
        </>
      )}
      {!hideBedBath && formState.propertyType !== "land" && (
        <>
          <Select
            value={formState.bedrooms}
            onValueChange={(value) => updateFormState({ bedrooms: value })}
          >
            <SelectTrigger className="h-5 min-w-[150px] max-w-fit cursor-pointer rounded-none border-0 bg-transparent py-0 text-base font-medium shadow-none text-white focus:border-0 focus:ring-0 focus:ring-transparent">
              <SelectValue placeholder="Beds" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  value="- Any -"
                  key="default-beds"
                  className="line-clamp-1"
                >
                  Bedrooms
                </SelectItem>
                {(config.bedrooms || fallbackOptions.bedrooms).map(
                  ({ value, label }) => (
                    <SelectItem
                      value={value}
                      key={value}
                      className="line-clamp-1"
                    >
                      {label}
                    </SelectItem>
                  ),
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Separator orientation="vertical" className="h-[20px] bg-[#9A9EB5]" />
          <Select
            value={formState.bathrooms}
            onValueChange={(value) => updateFormState({ bathrooms: value })}
          >
            <SelectTrigger className="h-5 min-w-[150px] max-w-fit cursor-pointer rounded-none border-0 bg-transparent py-0 text-base font-medium shadow-none text-white focus:border-0 focus:ring-0 focus:ring-transparent">
              <SelectValue placeholder="Baths" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  value="- Any -"
                  key="default-baths"
                  className="line-clamp-1"
                >
                  Bathrooms
                </SelectItem>
                {(config.bathrooms || fallbackOptions.bathrooms).map(
                  ({ value, label }) => (
                    <SelectItem
                      value={value}
                      key={value}
                      className="line-clamp-1"
                    >
                      {label}
                    </SelectItem>
                  ),
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Separator orientation="vertical" className="h-[20px] bg-[#9A9EB5]" />
        </>
      )}
      <PriceRangeSelect
        title="Price range"
        currency="GH₵"
        placeholder={{ min: "Min.price", max: "Max.price" }}
        priceRange={
          searchConfig?.priceRange || { min: 0, max: 1000000, step: 10000 }
        }
        variant="home"
        className="h-[20px] border-none px-5 py-0 text-white"
        minValue={formState.minPrice}
        maxValue={formState.maxPrice}
        onMinChange={(value) => updateFormState({ minPrice: value })}
        onMaxChange={(value) => updateFormState({ maxPrice: value })}
      />

      {(showAreaRange || formState.propertyType === "land") && (
        <>
          <Separator orientation="vertical" className="h-[20px] bg-[#9A9EB5]" />
          <PriceInput
            title="Area range"
            unit="m²"
            placeholder={{ min: "Min.area", max: "Max.area" }}
            range={
              searchConfig?.priceRange || { min: 0, max: 1000000, step: 10000 }
            }
            className="h-[20px] border-none px-5 py-0 text-white"
            minValue={formState.minArea}
            maxValue={formState.maxArea}
            onMinChange={(value) => updateFormState({ minArea: value })}
            onMaxChange={(value) => updateFormState({ maxArea: value })}
          />
        </>
      )}

      {showMoreFilters && (
        <>
          <Separator orientation="vertical" className="h-[20px] bg-[#9A9EB5]" />
          <MoreFiltersPopover
            formState={formState}
            updateFormState={updateFormState}
            variant="home"
            className="h-5 min-w-[150px] max-w-[150px] cursor-pointer rounded-none border-0 bg-transparent py-0 text-base font-medium shadow-none text-white focus:border-0 focus:ring-0 focus:ring-transparent"
          />
        </>
      )}
    </div>
  );
}
