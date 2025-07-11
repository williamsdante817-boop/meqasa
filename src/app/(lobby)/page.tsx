export const dynamic = "force-dynamic";
import React from "react";
import Lobby from "./_component/lobby";
import { getAgentLogos } from "@/lib/get-agents-logos";
import { getFeaturedListings } from "@/lib/get-featured-listings";
import { getFeaturedProjects } from "@/lib/get-featured-projects";
import { getFeaturedUnits } from "@/lib/get-featured-units";
import { getHeroBanner } from "@/lib/get-hero-banner";
import { getLatestListings } from "@/lib/get-latest-listing";
import { getFlexiBanner } from "@/lib/get-flexi-banner";
import { LobbySkeleton } from "./_component/lobby-skeleton";

export default async function HomePage() {
  /**
   * To avoid sequential waterfall requests, multiple promises are passed to fetch data parallelly.
   * These promises are also passed to the `Lobby` component, making them hot promises. This means they can execute without being awaited, further preventing sequential requests.
   * @see https://www.youtube.com/shorts/A7GGjutZxrs
   * @see https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#parallel-data-fetching
   */

  const featuredProjects = getFeaturedProjects();
  const featuredUnits = getFeaturedUnits();
  const agentLogos = getAgentLogos();
  const featuredListings = getFeaturedListings();
  const latestListings = getLatestListings();
  const heroBanner = getHeroBanner();
  const flexiBanner = getFlexiBanner();

  return (
    <React.Suspense fallback={<LobbySkeleton />}>
      {" "}
      {/* Use a proper skeleton loader */}
      <Lobby
        agentsLogosPromise={agentLogos}
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
