export const dynamic = "force-dynamic";
import React from "react";
import Lobby from "./_component/lobby";
import { getFeaturedListings } from "@/lib/get-featured-listings";
import { getFeaturedProjects } from "@/lib/get-featured-projects";
import { getFeaturedUnits } from "@/lib/get-featured-units";
import { getHeroBanner } from "@/lib/get-hero-banner";
import { getLatestListings } from "@/lib/get-latest-listing";
import { getFlexiBanner } from "@/lib/get-flexi-banner";
import { getStaticData } from "@/lib/static-data";
import { LobbySkeleton } from "./_component/lobby-skeleton";

export default async function HomePage() {
  /**
   * Hybrid rendering strategy:
   * - Static data (agent logos, blog, locations, SEO text) is cached and fetched once
   * - Fresh data (listings, featured properties, banners) is fetched on every request
   * This provides better performance while maintaining real-time data for critical content.
   */

  // Static data - cached, fetched once
  const staticData = await getStaticData();

  // Fresh data - always fetched (hot promises for parallel execution)
  const featuredProjects = getFeaturedProjects();
  const featuredUnits = getFeaturedUnits();
  const featuredListings = getFeaturedListings();
  const latestListings = getLatestListings();
  const heroBanner = getHeroBanner();
  const flexiBanner = getFlexiBanner();

  return (
    <React.Suspense fallback={<LobbySkeleton />}>
      <Lobby
        staticData={staticData}
        heroBannerPromise={heroBanner}
        latestListingsPromise={latestListings}
        featuredProjectsPromise={featuredProjects}
        featuredListingsPromise={featuredListings}
        featuredUnitsPromise={featuredUnits}
        flexiBannerPromise={flexiBanner}
      />
    </React.Suspense>
  );
}
