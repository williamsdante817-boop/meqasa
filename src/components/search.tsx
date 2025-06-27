"use client";

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type FormState } from "@/types/search";
import { SearchForm } from "./search/SearchForm";
import { CommonFilters } from "./search/CommonFilters";
import { PriceInput } from "./search/PriceInput";
import { Separator } from "@/components/ui/separator";
import { searchConfig } from "@/config/search";
import { useRouter } from "next/navigation";

export function SearchFilter() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    search: "ghana",
    propertyType: "all",
    bedrooms: "-Any-",
    bathrooms: "-Any-",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    period: "",
    sort: "",
    furnished: false,
    owner: false,
  });

  const updateFormState = (updates: Partial<FormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = (type: string) => {
    const params = new URLSearchParams();

    // Ensure default location is 'ghana' if not provided
    const searchValue =
      formState.search && formState.search.trim() !== ""
        ? formState.search
        : "ghana";

    // Add search query if present
    if (searchValue) {
      params.set("q", searchValue);
    }

    // Add property type
    if (formState.propertyType !== "all") {
      params.set("type", formState.propertyType);
    }

    // Add bedrooms if not default
    if (formState.bedrooms !== "-Any-") {
      params.set("beds", formState.bedrooms);
    }

    // Add bathrooms if not default
    if (formState.bathrooms !== "-Any-") {
      params.set("baths", formState.bathrooms);
    }

    // Add price range if present
    if (formState.minPrice) {
      params.set("minPrice", formState.minPrice);
    }
    if (formState.maxPrice) {
      params.set("maxPrice", formState.maxPrice);
    }

    // Add area range if present
    if (formState.minArea) {
      params.set("minArea", formState.minArea);
    }
    if (formState.maxArea) {
      params.set("maxArea", formState.maxArea);
    }

    // Add period if present
    if (formState.period) {
      params.set("period", formState.period);
    }

    // Add sort if present
    if (formState.sort) {
      params.set("sort", formState.sort);
    }

    // Add boolean filters
    if (formState.furnished) {
      params.set("furnished", "true");
    }
    if (formState.owner) {
      params.set("owner", "true");
    }

    // Construct SEO-friendly URL
    const searchPath = `/search/${type}${params.toString() ? `?${params.toString()}` : ""}`;
    router.push(searchPath);
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
                className="font-bold data-[state=active]:bg-rose-500 data-[state=active]:text-white lg:text-base text-brand-accent"
              >
                Short Let
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="lg:hidden">
            <Dialog>
              <DialogTrigger className="w-full">
                <div
                  className="mt-2 flex h-[60px] items-center gap-6 rounded-xl bg-white p-2 lg:hidden"
                  role="button"
                  tabIndex={0}
                >
                  <SearchIcon />
                  <p className="text-slate-400">
                    Search for an MRT, project, or area
                  </p>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Search Properties</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Search for location"
                    className="w-full"
                    value={formState.search}
                    onChange={(e) =>
                      updateFormState({ search: e.target.value })
                    }
                  />
                  <Button
                    className="w-full"
                    onClick={() => handleSubmit("rent")}
                  >
                    Search
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="buy">
            <SearchForm
              type="sale"
              formState={formState}
              updateFormState={updateFormState}
              onSubmit={() => handleSubmit("sale")}
            >
              <CommonFilters
                formState={formState}
                updateFormState={updateFormState}
              />
            </SearchForm>
          </TabsContent>
          <TabsContent value="rent">
            <SearchForm
              type="rent"
              formState={formState}
              updateFormState={updateFormState}
              onSubmit={() => handleSubmit("rent")}
            >
              <CommonFilters
                showMoreFilters
                formState={formState}
                updateFormState={updateFormState}
              />
            </SearchForm>
          </TabsContent>
          <TabsContent value="land">
            <SearchForm
              type="land"
              formState={formState}
              updateFormState={updateFormState}
              onSubmit={() => handleSubmit("land")}
            >
              <div className="relative mx-auto mt-3 hidden max-w-max items-end justify-center gap-2 py-1 lg:flex">
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
                <Separator
                  orientation="vertical"
                  className="h-[20px] bg-[#9A9EB5]"
                />
                <PriceInput
                  title="Area range"
                  unit="m²"
                  placeholder={{ min: "Min.area", max: "Max.area" }}
                  range={searchConfig.priceRange}
                  className="h-[20px] border-none px-5 py-0 text-white"
                  minValue={formState.minArea}
                  maxValue={formState.maxArea}
                  onMinChange={(value) => updateFormState({ minArea: value })}
                  onMaxChange={(value) => updateFormState({ maxArea: value })}
                />
              </div>
            </SearchForm>
          </TabsContent>
          <TabsContent value="short-let">
            <SearchForm
              type="short-let"
              formState={formState}
              updateFormState={updateFormState}
              onSubmit={() => handleSubmit("short-let")}
            >
              <CommonFilters
                showMoreFilters
                formState={formState}
                updateFormState={updateFormState}
              />
            </SearchForm>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
