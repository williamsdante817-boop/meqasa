"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

import { searchConfig } from "@/config/search";
import { type FormState } from "@/types/search";
import {
  MEQASA_RENT_PERIODS,
  MEQASA_SORT_OPTIONS,
} from "@/lib/search/constants";
import { useState } from "react";
import { CommonFilters } from "./search/CommonFilters";
import { PriceRangeSelect } from "@/components/ui/price-range-select";
import { MoreFiltersPopover } from "@/components/ui/more-filters-popover";
import { SearchForm } from "./search/SearchForm";

// Default form state for each tab
const getDefaultFormState = (): FormState => ({
  search: "",
  propertyType: "all",
  bedrooms: "- Any -",
  bathrooms: "- Any -",
  minPrice: "",
  maxPrice: "",
  minArea: "",
  maxArea: "",
  period: MEQASA_RENT_PERIODS[0],
  sort: MEQASA_SORT_OPTIONS[0],
  furnished: false,
  owner: false,
  howShort: "- Any -",
});

export function SearchFilter() {
  // Desktop-only search component
  // Separate form states for each tab
  const [rentFormState, setRentFormState] = useState<FormState>(
    getDefaultFormState()
  );
  const [buyFormState, setBuyFormState] = useState<FormState>(
    getDefaultFormState()
  );
  const [landFormState, setLandFormState] = useState<FormState>({
    ...getDefaultFormState(),
    propertyType: "land",
  });
  const [shortLetFormState, setShortLetFormState] = useState<FormState>(
    getDefaultFormState()
  );

  // Helper function to get current update function based on active tab
  const getCurrentUpdateFunction = (tab: string) => {
    switch (tab) {
      case "rent":
        return setRentFormState;
      case "buy":
        return setBuyFormState;
      case "land":
        return setLandFormState;
      case "short-let":
        return setShortLetFormState;
      default:
        return setRentFormState;
    }
  };

  // Update function that works with the current active tab
  const updateFormState = (tab: string, updates: Partial<FormState>) => {
    const updateFn = getCurrentUpdateFunction(tab);
    updateFn((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="absolute left-1/2 z-50 hidden w-[920px] -translate-x-1/2 -translate-y-1/2 lg:block">
      <h1 className="text-b-accent sr-only mb-4 text-center text-3xl font-extrabold">
        Ghana&apos;s Smarter Property Search
      </h1>
      <Card
        className="mx-auto my-0 h-fit w-full rounded-2xl border-0 p-2 lg:max-w-[928px] lg:p-3"
        style={{ background: "rgba(11,17,52,.65)" }}
      >
        <Tabs defaultValue="rent" className="w-full">
          <div className="mx-auto my-0 w-4/5 lg:max-w-[580px]">
            <TabsList className="text-b-accent grid h-fit w-full grid-cols-5 bg-white p-1.5">
              <TabsTrigger
                value="rent"
                className="data-[state=active]:bg-brand-primary text-brand-accent font-bold data-[state=active]:text-white lg:text-base"
              >
                Rent
              </TabsTrigger>
              <TabsTrigger
                value="buy"
                className="data-[state=active]:bg-brand-primary text-brand-accent font-bold data-[state=active]:text-white lg:text-base"
              >
                Buy
              </TabsTrigger>
              <TabsTrigger
                value="land"
                className="data-[state=active]:bg-brand-primary text-brand-accent font-bold data-[state=active]:text-white lg:text-base"
              >
                Land
              </TabsTrigger>
              <TabsTrigger
                value="short-let"
                className="data-[state=active]:bg-brand-primary lg:text-brand-accent font-bold data-[state=active]:text-white"
              >
                Short Let
              </TabsTrigger>
              {/* All units link with underline active state */}
              <Link
                href="/newly-built-units"
                className="ring-offset-background focus-visible:ring-ring hover:text-brand-primary text-brand-accent inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-bold whitespace-nowrap transition-all hover:underline hover:decoration-2 hover:underline-offset-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 lg:text-base"
              >
                All Units
              </Link>
            </TabsList>
          </div>

          <TabsContent value="buy">
            <SearchForm
              type="buy"
              formState={buyFormState}
              updateFormState={(updates) => updateFormState("buy", updates)}
            >
              <CommonFilters
                showMoreFilters
                contractType="buy"
                formState={buyFormState}
                updateFormState={(updates) => updateFormState("buy", updates)}
              />
            </SearchForm>
          </TabsContent>
          <TabsContent value="rent">
            <SearchForm
              type="rent"
              formState={rentFormState}
              updateFormState={(updates) => updateFormState("rent", updates)}
            >
              <CommonFilters
                showMoreFilters
                contractType="rent"
                formState={rentFormState}
                updateFormState={(updates) => updateFormState("rent", updates)}
              />
            </SearchForm>
          </TabsContent>
          <TabsContent value="land">
            <SearchForm
              type="buy"
              formState={landFormState}
              updateFormState={(updates) => updateFormState("land", updates)}
            >
              <div className="relative mx-auto mt-3 hidden max-w-max items-end justify-center gap-2 py-1 lg:flex">
                <PriceRangeSelect
                  title="Price range"
                  currency="GH₵"
                  placeholder={{ min: "Min.price", max: "Max.price" }}
                  priceRange={
                    searchConfig?.priceRange || {
                      min: 0,
                      max: 1000000,
                      step: 10000,
                    }
                  }
                  variant="home"
                  className="h-[20px] border-none px-5 py-0 text-white"
                  minValue={landFormState.minPrice}
                  maxValue={landFormState.maxPrice}
                  onMinChange={(value) =>
                    updateFormState("land", { minPrice: value })
                  }
                  onMaxChange={(value) =>
                    updateFormState("land", { maxPrice: value })
                  }
                />
                <Separator
                  orientation="vertical"
                  className="h-[20px] bg-[#9A9EB5]"
                />
                <PriceRangeSelect
                  title="Area range"
                  currency="m²"
                  placeholder={{ min: "Min.area", max: "Max.area" }}
                  priceRange={
                    searchConfig?.priceRange || {
                      min: 0,
                      max: 1000000,
                      step: 10000,
                    }
                  }
                  variant="home"
                  className="h-[20px] border-none px-5 py-0 text-white"
                  minValue={landFormState.minArea}
                  maxValue={landFormState.maxArea}
                  onMinChange={(value) =>
                    updateFormState("land", { minArea: value })
                  }
                  onMaxChange={(value) =>
                    updateFormState("land", { maxArea: value })
                  }
                />
                <Separator
                  orientation="vertical"
                  className="h-[20px] bg-[#9A9EB5]"
                />
                <MoreFiltersPopover
                  formState={landFormState}
                  updateFormState={(updates) =>
                    updateFormState("land", updates)
                  }
                  contractType="land"
                  variant="home"
                  className="flex h-5 max-w-[150px] min-w-[150px] cursor-pointer items-center justify-between rounded-none border-0 bg-transparent py-0 text-base font-medium whitespace-nowrap text-white shadow-none focus:border-0 focus:ring-0 focus:ring-transparent"
                />
              </div>
            </SearchForm>
          </TabsContent>
          <TabsContent value="short-let">
            <SearchForm
              type="short-let"
              formState={shortLetFormState}
              updateFormState={(updates) =>
                updateFormState("short-let", updates)
              }
            >
              <CommonFilters
                showMoreFilters
                hidePropertyType
                isShortLet
                contractType="short-let"
                formState={shortLetFormState}
                updateFormState={(updates) =>
                  updateFormState("short-let", updates)
                }
              />
            </SearchForm>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
