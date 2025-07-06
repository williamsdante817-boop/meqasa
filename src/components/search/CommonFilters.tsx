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
import { PriceInput } from "./PriceInput";
import { MoreFiltersPopover } from "./MoreFiltersPopover";

interface CommonFiltersProps {
  showMoreFilters?: boolean;
  hidePropertyType?: boolean;
  formState: FormState;
  updateFormState: (updates: Partial<FormState>) => void;
}

export function CommonFilters({
  showMoreFilters = false,
  hidePropertyType = false,
  formState,
  updateFormState,
}: CommonFiltersProps) {
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
                {searchConfig.selectOptions.propertyType.map(
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
            {searchConfig.selectOptions.bedrooms.map(({ value, label }) => (
              <SelectItem value={value} key={value} className="line-clamp-1">
                {label}
              </SelectItem>
            ))}
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
            {searchConfig.selectOptions.bathrooms.map(({ value, label }) => (
              <SelectItem value={value} key={value} className="line-clamp-1">
                {label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Separator orientation="vertical" className="h-[20px] bg-[#9A9EB5]" />
      <PriceInput
        title="Price range"
        unit="GH₵"
        placeholder={{ min: "Min.price", max: "Max.price" }}
        range={searchConfig.priceRange}
        className="h-[20px] border-none px-5 py-0 text-white"
        minValue={formState.minPrice}
        maxValue={formState.maxPrice}
        onMinChange={(value) => updateFormState({ minPrice: value })}
        onMaxChange={(value) => updateFormState({ maxPrice: value })}
      />

      {showMoreFilters && (
        <>
          <Separator orientation="vertical" className="h-[20px] bg-[#9A9EB5]" />
          <MoreFiltersPopover
            formState={formState}
            updateFormState={updateFormState}
          />
        </>
      )}
    </div>
  );
}
