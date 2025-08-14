"use client";

import { useState } from "react";
import ContentSection from "@/components/content-section";
import {
  LatestListingsTab,
  type Listing,
} from "@/components/latest-listings-tab";

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
      className="pt-14 md:pt-20 lg:pt-24 w-full"
    >
      <LatestListingsTab
        rentListings={rentListings}
        saleListings={saleListings}
        onTabChange={setActiveTab}
      />
    </ContentSection>
  );
}
