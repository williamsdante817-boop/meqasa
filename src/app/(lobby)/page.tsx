export const dynamic = "force-dynamic";
import React from "react";
import { getFeaturedListings } from "@/lib/get-featured-listings";
import { getFeaturedProjects } from "@/lib/get-featured-projects";

import { getHeroBanner } from "@/lib/get-hero-banner";
import { getLatestListings } from "@/lib/get-latest-listing";
import { getFlexiBanner } from "@/lib/get-flexi-banner";
import { getStaticData } from "@/lib/static-data";
import { getBlogData } from "@/lib/get-blog-data";
import { getHomepagePopup } from "@/lib/get-homepage-popup";
import { LobbySkeleton } from "./_component/lobby-skeleton";
import Lobby from "./_component/lobby";
import type { Metadata } from "next";

import {
  generateHomepageMetadata,
  generateWebsiteStructuredData,
  generateOrganizationStructuredData,
} from "@/lib/seo";
import { StructuredData } from "@/components/structured-data";

// Generate metadata for SEO using our utility
export async function generateMetadata(): Promise<Metadata> {
  return generateHomepageMetadata();
}

export default async function HomePage() {
  /**
   * Skateshop-inspired streaming pattern:
   * - Create "hot promises" that start executing immediately
   * - Pass promises to components for true parallel execution
   * - Each component awaits its own promise for progressive rendering
   * - Users get fresh data with optimal streaming performance
   */

  // Static data fetched immediately (fast, local data)
  const staticData = await getStaticData();

  // Create "hot promises" - these start executing immediately in parallel
  const featuredProjectsPromise = getFeaturedProjects(); // Starts now
  const featuredListingsPromise = getFeaturedListings(); // Starts now
  const latestListingsPromise = getLatestListings(); // Starts now
  const heroBannerPromise = getHeroBanner(); // Starts now
  const flexiBannerPromise = getFlexiBanner(); // Starts now
  const blogDataPromise = getBlogData(); // Starts now

  // Fetch popup data server-side (non-blocking, fails gracefully)
  let popupData = null;
  try {
    popupData = await getHomepagePopup();
    console.log("✅ Homepage popup data fetched:", {
      hasData: !!popupData,
      imageUrl: popupData?.imageUrl,
      linkUrl: popupData?.linkUrl,
      id: popupData?.id,
    });
  } catch (error) {
    console.error("❌ Failed to fetch homepage popup:", error);
    // Continue without popup if fetch fails
  }

  return (
    <>
      {/* Core Web Vitals Optimizations */}
      <link rel="preconnect" href="https://meqasa.com" />
      <link rel="preconnect" href="https://dve7rykno93gs.cloudfront.net" />
      <link rel="dns-prefetch" href="https://blog.meqasa.com" />

      {/* Structured Data for SEO */}
      <StructuredData data={generateWebsiteStructuredData()} />
      <StructuredData data={generateOrganizationStructuredData()} />
      {/* Streaming rendering with promises - components render as data arrives */}
      <React.Suspense fallback={<LobbySkeleton />}>
        <Lobby
          staticData={staticData}
          featuredProjectsPromise={featuredProjectsPromise}
          featuredListingsPromise={featuredListingsPromise}
          latestListingsPromise={latestListingsPromise}
          heroBannerPromise={heroBannerPromise}
          flexiBannerPromise={flexiBannerPromise}
          blogDataPromise={blogDataPromise}
          popupData={popupData}
        />
      </React.Suspense>
    </>
  );
}
