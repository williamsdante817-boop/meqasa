"use client";

import { useState } from "react";
import ContentSection from "@/components/layout/content-section";
import { LatestListingsTab } from "@/components/property/listings/latest-listings-tab";
import type { Listing } from "@/components/property/cards/property-card";

interface FeaturedListingsSectionProps {
  rentListings: Listing[];
  saleListings: Listing[];
}

export function FeaturedListingsSection({
  rentListings,
  saleListings,
}: FeaturedListingsSectionProps) {
  const [activeTab, setActiveTab] = useState("rent");

  const href =
    activeTab === "rent"
      ? "/search/rent?q=ghana&page=1"
      : "/search/sale?q=ghana&page=1";

  return (
    <ContentSection
      title="Featured Listings"
      description="View all featured property listings available."
      href={href}
      className="pt-14 md:pt-20 lg:pt-24 w-full [&_p]:px-4 [&_h2]:px-4 md:[&_p]:px-0 md:[&_h2]:px-0"
    >
      <LatestListingsTab
        rentListings={rentListings}
        saleListings={saleListings}
        onTabChange={setActiveTab}
      />
    </ContentSection>
  );
}
