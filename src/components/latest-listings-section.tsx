"use client";

import { useState } from "react";
import ContentSection from "@/components/content-section";
import {
  LatestListingsTab,
  type Listing as TabListing,
} from "@/components/latest-listings-tab";

interface LatestListingsSectionProps {
  rentListings: TabListing[];
  saleListings: TabListing[];
}

export function LatestListingsSection({
  rentListings,
  saleListings,
}: LatestListingsSectionProps) {
  const [activeTab, setActiveTab] = useState("rent");

  const href =
    activeTab === "rent"
      ? "/search/rent?q=ghana&page=1"
      : "/search/sale?q=ghana&page=1";

  return (
    <ContentSection
      title="Latest Listings"
      description="View all recent property listings available."
      href={href}
      className="pt-14 md:pt-20 lg:pt-24 [&_p]:px-4 [&_h2]:px-4 w-full mx-auto md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]"
    >
      <LatestListingsTab
        rentListings={rentListings}
        saleListings={saleListings}
        onTabChange={setActiveTab}
      />
    </ContentSection>
  );
}
