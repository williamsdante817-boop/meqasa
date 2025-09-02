import React from "react";
import Lobby from "@/app/(lobby)/_component/lobby";
import type { FeaturedListingsResponse } from "@/lib/get-featured-listings";
import type { LatestListingsResponse } from "@/lib/get-latest-listing";
import type { StaticData } from "@/lib/static-data";
import type { FeaturedProject, Unit, AdLink } from "@/types";
import type { BlogResponse } from "@/types/blog";

interface ServerData {
  staticData: StaticData;
  featuredProjects: FeaturedProject[];
  featuredUnits: Unit[];
  featuredListings: FeaturedListingsResponse;
  latestListings: LatestListingsResponse;
  heroBanner: AdLink;
  flexiBanner: string;
  blogData: BlogResponse;
}

interface StreamingHomepageProps {
  serverData: ServerData;
}

/**
 * Pure SSR Homepage Component
 * Renders directly with server data - no React Query complexity
 * Perfect for real estate where users expect current data on each visit
 */
export function StreamingHomepage({ serverData }: StreamingHomepageProps) {
  return (
    <main>
      {/* Direct rendering with fresh server data - no client-side queries */}
      <Lobby
        staticData={serverData.staticData}
        featuredProjectsPromise={Promise.resolve(serverData.featuredProjects)}
        featuredListingsPromise={Promise.resolve(serverData.featuredListings)}
        latestListingsPromise={Promise.resolve(serverData.latestListings)}
        heroBannerPromise={Promise.resolve(serverData.heroBanner)}
        flexiBannerPromise={Promise.resolve(serverData.flexiBanner)}
        blogDataPromise={Promise.resolve(serverData.blogData)}
      />
    </main>
  );
}