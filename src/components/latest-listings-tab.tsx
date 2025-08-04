"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ListingDetails } from "@/types";
import PropertyListings from "./property-listings";
import { useMemo } from "react";

export type Listing = Pick<
  ListingDetails,
  | "detailreq"
  | "image"
  | "streetaddress"
  | "garages"
  | "title"
  | "contract"
  | "price"
> & {
  bathroomcount: string;
  bedroomcount: string;
};

interface LatestListingsTabProps {
  rentListings: Listing[];
  saleListings: Listing[];
  isLoading?: boolean;
  error?: Error | null;
  onTabChange?: (activeTab: string) => void;
}

export function LatestListingsTab({
  rentListings,
  saleListings,
  isLoading = false,
  error = null,
  onTabChange,
}: LatestListingsTabProps) {
  const tabs = useMemo(
    () => [
      { value: "rent", label: "For Rent", listings: rentListings },
      { value: "sale", label: "For Sale", listings: saleListings },
    ],
    [rentListings, saleListings],
  );

  if (error) {
    return (
      <div role="alert" className="text-red-500">
        Error loading listings: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return <div aria-busy="true">Loading listings...</div>;
  }

  return (
    <Tabs defaultValue="rent" className="w-full" onValueChange={onTabChange}>
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
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="mt-8"
          aria-labelledby={`tab-${tab.value}`}
        >
          {tab.listings.length > 0 ? (
            <PropertyListings listings={tab.listings} />
          ) : (
            <p role="status" aria-live="polite">
              No properties currently available for {tab.label.toLowerCase()}.
              Please check back later.
            </p>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
