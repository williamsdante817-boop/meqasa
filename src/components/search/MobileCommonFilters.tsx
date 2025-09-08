"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { searchConfig } from "@/config/search";
import { type FormState } from "@/types/search";
import { MobileMoreFilters } from "./MobileMoreFilters";
import { MobilePriceInput } from "./MobilePriceInput";

interface MobileCommonFiltersProps {
  showMoreFilters?: boolean;
  hidePropertyType?: boolean;
  hideBedBath?: boolean;
  showAreaRange?: boolean;
  isShortLet?: boolean;
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

export function MobileCommonFilters({
  showMoreFilters = false,
  hidePropertyType = false,
  hideBedBath = false,
  showAreaRange = false,
  isShortLet = false,
  formState,
  updateFormState,
}: MobileCommonFiltersProps) {
  const config = searchConfig?.selectOptions || fallbackOptions;

  return (
    <div className="space-y-6 pb-4">
      {/* Property Type */}
      {!hidePropertyType && (
        <div className="flex flex-col gap-3 text-left">
          <Label className="text-base font-medium text-gray-700">
            Property Type
          </Label>
          <Select
            value={formState.propertyType}
            onValueChange={(value) => updateFormState({ propertyType: value })}
          >
            <SelectTrigger className="h-12 bg-gray-50 border-gray-200 rounded-lg shadow-none text-base text-gray-700">
              <SelectValue
                placeholder="Select property type"
                className="text-base text-gray-700"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="h-12 text-base text-gray-700">
                Any Property Type
              </SelectItem>
              {(config.propertyType || fallbackOptions.propertyType).map(
                ({ value, label }) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="h-12 text-base text-gray-700"
                  >
                    {label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Short-let Duration */}
      {isShortLet && (
        <div className="flex flex-col gap-3 text-left">
          <Label className="text-base font-medium text-gray-700">
            Duration
          </Label>
          <Select
            value={formState.howShort ?? "- Any -"}
            onValueChange={(value) => updateFormState({ howShort: value })}
          >
            <SelectTrigger className="h-12 bg-gray-50 border-gray-200 rounded-lg shadow-none text-base text-gray-700">
              <SelectValue
                placeholder="Select duration"
                className="text-base text-gray-700"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value="- Any -"
                className="h-12 text-base text-gray-700"
              >
                Any Duration
              </SelectItem>
              {(config.howShort || fallbackOptions.howShort).map(
                ({ value, label }) => (
                  <SelectItem
                    key={value}
                    value={value}
                    className="h-12 text-base text-gray-700"
                  >
                    {label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Bedrooms & Bathrooms */}
      {!hideBedBath && formState.propertyType !== "land" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3 text-left">
            <Label className="text-base font-medium text-gray-700">
              Bedrooms
            </Label>
            <Select
              value={formState.bedrooms}
              onValueChange={(value) => updateFormState({ bedrooms: value })}
            >
              <SelectTrigger className="h-12 bg-gray-50 border-gray-200 rounded-lg shadow-none text-base text-gray-700">
                <SelectValue
                  placeholder="Any"
                  className="text-base text-gray-700"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="- Any -"
                  className="h-12 text-base text-gray-700"
                >
                  Any
                </SelectItem>
                {(config.bedrooms || fallbackOptions.bedrooms).map(
                  ({ value, label }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="h-12 text-base text-gray-700"
                    >
                      {label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3 text-left">
            <Label className="text-base font-medium text-gray-700">
              Bathrooms
            </Label>
            <Select
              value={formState.bathrooms}
              onValueChange={(value) => updateFormState({ bathrooms: value })}
            >
              <SelectTrigger className="h-12 bg-gray-50 border-gray-200 rounded-lg shadow-none text-base text-gray-700">
                <SelectValue
                  placeholder="Any"
                  className="text-base text-gray-700"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="- Any -"
                  className="h-12 text-base text-gray-700"
                >
                  Any
                </SelectItem>
                {(config.bathrooms || fallbackOptions.bathrooms).map(
                  ({ value, label }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="h-12 text-base text-gray-700"
                    >
                      {label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="flex flex-col gap-3 text-left">
        <Label className="text-base font-medium text-gray-700">
          Price Range (GH₵)
        </Label>
        <MobilePriceInput
          title="Price range"
          unit="GH₵"
          placeholder={{ min: "Min price", max: "Max price" }}
          range={
            searchConfig?.priceRange || { min: 0, max: 1000000, step: 10000 }
          }
          minValue={formState.minPrice}
          maxValue={formState.maxPrice}
          onMinChange={(value) => updateFormState({ minPrice: value })}
          onMaxChange={(value) => updateFormState({ maxPrice: value })}
        />
      </div>

      {/* Area Range */}
      {(showAreaRange || formState.propertyType === "land") && (
        <div className="flex flex-col gap-3 text-left">
          <Label className="text-base font-medium text-gray-700">
            Area Range (m²)
          </Label>
          <MobilePriceInput
            title="Area range"
            unit="m²"
            placeholder={{ min: "Min area", max: "Max area" }}
            range={
              searchConfig?.priceRange || { min: 0, max: 1000000, step: 10000 }
            }
            minValue={formState.minArea}
            maxValue={formState.maxArea}
            onMinChange={(value) => updateFormState({ minArea: value })}
            onMaxChange={(value) => updateFormState({ maxArea: value })}
          />
        </div>
      )}

      {/* More Filters */}
      {showMoreFilters && (
        <MobileMoreFilters
          formState={formState}
          updateFormState={updateFormState}
        />
      )}
    </div>
  );
}
