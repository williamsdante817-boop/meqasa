export const dynamic = "force-dynamic";
import * as Sentry from "@sentry/nextjs";
import {
  getBlogData,
  getFeaturedListings,
  getFeaturedProjects,
  getFlexiBanner,
  getHeroBanner,
  getLatestListings,
} from "@/lib/cache/dedupe";
import { getHomepagePopup } from "@/lib/get-homepage-popup";
import { getStaticData } from "@/lib/static-data";
import type { Metadata } from "next";
import React from "react";
import Lobby from "./_component/lobby";
import { LobbySkeleton } from "./_component/lobby-skeleton";

import { StructuredData } from "@/components/structured-data";
import {
  generateHomepageMetadata,
  generateOrganizationStructuredData,
  generateWebsiteStructuredData,
} from "@/lib/seo";

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
  } catch (error) {
    Sentry.captureException(error);
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
