"use client";

import React from "react";
import { 
  useFeaturedListings, 
  useLatestListings, 
  useFeaturedProjects,
  useFeaturedUnits,
  useHeroBanner,
  useFlexiBanner,
  useStaticData 
} from "@/hooks/queries";
import Lobby from "@/app/(lobby)/_component/lobby";
import type { FeaturedListingsResponse } from "@/lib/get-featured-listings";
import type { LatestListingsResponse } from "@/lib/get-latest-listing";
import type { StaticData } from "@/lib/static-data";
import type { FeaturedProject, Unit, AdLink } from "@/types";

interface InitialData {
  staticData: StaticData;
  featuredProjects: FeaturedProject[];
  featuredUnits: Unit[];
  featuredListings: FeaturedListingsResponse;
  latestListings: LatestListingsResponse;
  heroBanner: AdLink;
  flexiBanner: string;
}

interface HomepageClientProps {
  initialData: InitialData;
}

/**
 * Client-side homepage component that uses React Query for data management
 * Receives initial server-side data and then manages client-side updates
 */
export function HomepageClient({ initialData }: HomepageClientProps) {
  // Use React Query hooks with initial data from server
  const { data: featuredListings } = useFeaturedListings(initialData.featuredListings);
  const { data: latestListings } = useLatestListings(initialData.latestListings);
  const { data: featuredProjects } = useFeaturedProjects(initialData.featuredProjects);
  const { data: featuredUnits } = useFeaturedUnits(initialData.featuredUnits);
  const { data: heroBanner } = useHeroBanner(initialData.heroBanner);
  const { data: flexiBanner } = useFlexiBanner(initialData.flexiBanner);
  const { data: staticData } = useStaticData(initialData.staticData);

  // Use server data initially, then React Query data once available
  const resolvedData = {
    staticData: staticData ?? initialData.staticData,
    featuredProjects: featuredProjects ?? initialData.featuredProjects,
    featuredUnits: featuredUnits ?? initialData.featuredUnits,
    featuredListings: featuredListings ?? initialData.featuredListings,
    latestListings: latestListings ?? initialData.latestListings,
    heroBanner: heroBanner ?? initialData.heroBanner,
    flexiBanner: flexiBanner ?? initialData.flexiBanner,
  };

  return (
    <Lobby
      staticData={resolvedData.staticData}
      heroBannerPromise={Promise.resolve(resolvedData.heroBanner)}
      latestListingsPromise={Promise.resolve(resolvedData.latestListings)}
      featuredProjectsPromise={Promise.resolve(resolvedData.featuredProjects)}
      featuredListingsPromise={Promise.resolve(resolvedData.featuredListings)}
      featuredUnitsPromise={Promise.resolve(resolvedData.featuredUnits)}
      flexiBannerPromise={Promise.resolve(resolvedData.flexiBanner)}
    />
  );
}