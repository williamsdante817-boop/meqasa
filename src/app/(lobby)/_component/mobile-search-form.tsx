/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Search, SearchIcon } from "lucide-react";
// import { useState } from "react";

import QuickLinks from "@/components/quick-links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteConfig } from "@/config/site";

export default function MobileSearchForm() {
  // const [activeTab, setActiveTab] = useState("buy");

  const propertyTypeOptions = siteConfig.selectOptions?.propertyType ?? [];
  const bedroomsOptions = siteConfig.selectOptions?.bedrooms ?? [];
  const bathroomsOptions = siteConfig.selectOptions?.bathrooms ?? [];
  const landTypeOptions = siteConfig.selectOptions?.landType ?? [];
  const landSizeOptions = siteConfig.selectOptions?.landSize ?? [];

  // Create price options from priceRange
  const priceRange = {
    min: 0,
    max: 1000000,
    step: 10000,
  };

  const priceOptions = Array.from(
    { length: priceRange.max / priceRange.step + 1 },
    (_, i) => ({
      value: (i * priceRange.step).toString(),
      label: `GH₵${(i * priceRange.step).toLocaleString()}`,
    }),
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="lgs:hidden flex justify-between items-center bg-white shadow-elegant border-rose-300 border w-[80%] mx-auto rounded-xl mt-4 px-4 py-2">
          <div className="flex items-center gap-2">
            <SearchIcon size={18} className=" text-gray-400" />
            <p className="text-brand-muted text-sm">Enter Location</p>
          </div>
          <Button className="bg-[#f93a5d] hover:bg-[#f93a5d]/90 cursor-pointer">
            Search
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bottom-0 top-0 translate-y-0">
        <Tabs
          defaultValue="rent"
          // onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="my-6 grid h-12  w-full grid-cols-2">
            <TabsTrigger value="rent" className="text-base ">
              Rent
            </TabsTrigger>
            <TabsTrigger value="buy" className="text-base text-gray-400">
              Buy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rent" className="animate-fade-in mt-0 ">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="sr-only text-sm font-medium text-accent-foreground"
                >
                  Location
                </Label>
                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    id="location"
                    placeholder="Enter a location"
                    className="h-12 rounded-lg pl-10  placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="propertyType"
                    className="text-sm font-medium text-accent-foreground"
                  >
                    Property Type
                  </Label>
                  <div className="relative">
                    <select
                      id="propertyType"
                      name="propertyType"
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      {propertyTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="bedrooms"
                    className="text-sm font-medium text-accent-foreground"
                  >
                    Bedrooms
                  </Label>
                  <div className="relative">
                    <select
                      id="bedrooms"
                      name="bedrooms"
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      {bedroomsOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="minPrice"
                    className="text-sm font-medium text-accent-foreground"
                  >
                    Min Price
                  </Label>
                  <div className="relative">
                    <select
                      id="minPrice"
                      name="minPrice"
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      {priceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="maxPrice"
                    className="text-sm font-medium text-accent-foreground"
                  >
                    Max Price
                  </Label>
                  <div className="relative">
                    <select
                      id="maxPrice"
                      name="maxPrice"
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      {priceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="btn-hover-effect h-12 w-full cursor-pointer rounded-lg bg-[#f93a5d] text-base text-white hover:bg-[#f93a5d]/90"
              >
                <Search size={18} className="mr-2" />
                Search
              </Button>
            </form>
            <QuickLinks />
          </TabsContent>

          <TabsContent value="buy" className="animate-fade-in mt-0">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="sr-only text-sm font-medium text-accent-foreground"
                >
                  Location
                </Label>
                <div className="relative">
                  <MapPin
                    size={18}
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                  />
                  <Input
                    id="location"
                    placeholder="Enter a location"
                    className="h-12 rounded-lg pl-10  placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="propertyType"
                    className="text-sm font-medium text-accent-foreground"
                  >
                    Property Type
                  </Label>
                  <div className="relative">
                    <select
                      id="propertyType"
                      name="propertyType"
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      {propertyTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="bedrooms"
                    className="text-sm font-medium text-accent-foreground"
                  >
                    Bedrooms
                  </Label>
                  <div className="relative">
                    <select
                      id="bedrooms"
                      name="bedrooms"
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      {bedroomsOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="minPrice"
                    className="text-sm font-medium text-accent-foreground"
                  >
                    Min Price
                  </Label>
                  <div className="relative">
                    <select
                      id="minPrice"
                      name="minPrice"
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      {priceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="maxPrice"
                    className="text-sm font-medium text-accent-foreground"
                  >
                    Max Price
                  </Label>
                  <div className="relative">
                    <select
                      id="maxPrice"
                      name="maxPrice"
                      className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    >
                      {priceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="btn-hover-effect h-12 w-full cursor-pointer rounded-lg bg-[#f93a5d] text-base text-white hover:bg-[#f93a5d]/90"
              >
                <Search size={18} className="mr-2" />
                Search
              </Button>
            </form>
            <QuickLinks />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
