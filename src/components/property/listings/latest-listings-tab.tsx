"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyListings from "./property-listings";
import { useMemo } from "react";
import { AlertCard } from "@/components/common/alert-card";
import type { Listing } from "../cards/property-card";

interface LatestListingsTabProps {
  rentListings: Listing[];
  saleListings: Listing[];
  onTabChange?: (activeTab: string) => void;
}

export function LatestListingsTab({
  rentListings,
  saleListings,
  onTabChange,
}: LatestListingsTabProps) {
  const tabs = useMemo(
    () => [
      { value: "rent", label: "For Rent", listings: rentListings },
      { value: "sale", label: "For Sale", listings: saleListings },
    ],
    [rentListings, saleListings],
  );

  return (
    <Tabs
      defaultValue="rent"
      className="w-full"
      onValueChange={(value) => {
        onTabChange?.(value);
      }}
    >
      <div className="flex items-center justify-between gap-4 mx-4 md:mx-0">
        <TabsList
          className="grid w-full md:w-[400px] grid-cols-2"
          aria-label="Property listing categories"
        >
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              aria-label={`View properties ${tab.label.toLowerCase()}`}
              className="data-[state=active]:bg-brand-accent font-semibold data-[state=active]:text-white text-brand-muted"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="mt-8"
          aria-labelledby={`tab-${tab.value}`}
        >
          {tab.listings.length > 0 ? (
            <PropertyListings
              listings={tab.listings}
              parentContract={tab.value}
            />
          ) : (
            <AlertCard
              title={`No properties currently available for ${tab.label.toLowerCase()}.`}
              description="Please check back later."
              className="mt-4"
            />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
