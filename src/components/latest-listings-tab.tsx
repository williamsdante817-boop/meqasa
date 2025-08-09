"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ListingDetails } from "@/types";
import PropertyListings from "./property-listings";
import { useMemo, useState } from "react";

export type Listing = Pick<
  ListingDetails,
  "detailreq" | "image" | "streetaddress" | "garages" | "title"
> & {
  bathroomcount: string;
  bedroomcount: string;
  contract?: string;
  price?: string;
};

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
  const [activeTab, setActiveTab] = useState<string>("rent");
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
        setActiveTab(value);
        onTabChange?.(value);
      }}
    >
      <div className="flex items-center justify-between gap-4">
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
        <Button
          variant="ghost"
          className="hidden lg:flex text-brand-blue font-semibold hover:text-brand-blue focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
          asChild
        >
          <Link
            href={`/search/${activeTab}?q=ghana&page=1`}
            aria-label={`See All for ${activeTab === "rent" ? "For Rent" : "For Sale"}`}
          >
            See All
          </Link>
        </Button>
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
