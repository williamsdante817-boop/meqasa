"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { searchConfig } from "@/config/search";
import { type FormState } from "@/types/search";
import { useState } from "react";
import { CommonFilters } from "./search/CommonFilters";
import { PriceRangeSelect } from "@/components/ui/price-range-select";
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
  period: "any",
  sort: "default",
  furnished: false,
  owner: false,
  howShort: "- Any -",
});

export function SearchFilter() {
  // Desktop-only search component
  // Separate form states for each tab
  const [rentFormState, setRentFormState] = useState<FormState>(
    getDefaultFormState(),
  );
  const [buyFormState, setBuyFormState] = useState<FormState>(
    getDefaultFormState(),
  );
  const [landFormState, setLandFormState] = useState<FormState>({
    ...getDefaultFormState(),
    propertyType: "land",
  });
  const [shortLetFormState, setShortLetFormState] = useState<FormState>(
    getDefaultFormState(),
  );

  // Helper function to get current form state based on active tab
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getCurrentFormState = (tab: string): FormState => {
    switch (tab) {
      case "rent":
        return rentFormState;
      case "buy":
        return buyFormState;
      case "land":
        return landFormState;
      case "short-let":
        return shortLetFormState;
      default:
        return rentFormState;
    }
  };

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
    <div className="hidden lg:block absolute left-1/2 w-[920px] -translate-x-1/2 -translate-y-1/2 z-50">
        <h1 className="sr-only mb-4 text-center text-3xl font-extrabold text-b-accent">
          Ghana&apos;s Smarter Property Search
        </h1>
        <Card
          className="mx-auto my-0 h-fit w-full rounded-2xl border-0 p-2 lg:max-w-[928px] lg:p-3"
          style={{ background: "rgba(11,17,52,.65)" }}
        >
          <Tabs defaultValue="rent" className="w-full">
            <div className="mx-auto my-0 w-4/5 lg:max-w-[460px]">
              <TabsList className="grid h-fit w-full grid-cols-4 bg-white p-1.5 text-b-accent">
                <TabsTrigger
                  value="rent"
                  className="font-bold data-[state=active]:bg-rose-500 data-[state=active]:text-white lg:text-base text-brand-accent"
                >
                  Rent
                </TabsTrigger>
                <TabsTrigger
                  value="buy"
                  className="font-bold data-[state=active]:bg-rose-500 data-[state=active]:text-white lg:text-base text-brand-accent"
                >
                  Buy
                </TabsTrigger>
                <TabsTrigger
                  value="land"
                  className="font-bold data-[state=active]:bg-rose-500 data-[state=active]:text-white lg:text-base text-brand-accent"
                >
                  Land
                </TabsTrigger>
                <TabsTrigger
                  value="short-let"
                  className="font-bold data-[state=active]:bg-rose-500 data-[state=active]:text-white lg:text-brand-accent"
                >
                  Short Let
                </TabsTrigger>
              </TabsList>
            </div>

          <TabsContent value="buy">
            <SearchForm
              type="buy"
              formState={buyFormState}
              updateFormState={(updates) => updateFormState("buy", updates)}
            >
              <CommonFilters
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
