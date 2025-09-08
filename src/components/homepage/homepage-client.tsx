"use client";

import React from "react";
import {
  useFeaturedListings,
  useLatestListings,
  useFeaturedProjects,
  useFeaturedUnits,
  useHeroBanner,
  useFlexiBanner,
  useStaticData,
} from "@/hooks/queries";
import Lobby from "@/app/(lobby)/_component/lobby";
import type { FeaturedListingsResponse } from "@/lib/get-featured-listings";
import type { LatestListingsResponse } from "@/lib/get-latest-listing";
import type { StaticData } from "@/lib/static-data";
import type { FeaturedProject, Unit, AdLink } from "@/types";
import type { BlogResponse } from "@/types/blog";

interface InitialData {
  staticData: StaticData;
  featuredProjects: FeaturedProject[];
  featuredUnits: Unit[];
  featuredListings: FeaturedListingsResponse;
  latestListings: LatestListingsResponse;
  heroBanner: AdLink;
  flexiBanner: string;
  blogData: BlogResponse;
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
  const featuredListingsQuery = useFeaturedListings(
    initialData.featuredListings
  );
  const latestListingsQuery = useLatestListings(initialData.latestListings);
  const featuredProjectsQuery = useFeaturedProjects(
    initialData.featuredProjects
  );
  const featuredUnitsQuery = useFeaturedUnits(initialData.featuredUnits);
  const heroBannerQuery = useHeroBanner(initialData.heroBanner);
  const flexiBannerQuery = useFlexiBanner(initialData.flexiBanner);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: staticData } = useStaticData(initialData.staticData);

  // Use server data initially, then React Query data once available
  // For staticData, always use initial data since we've disabled refetching entirely
  const resolvedData = {
    staticData: initialData.staticData, // Always use initial - never refetch
    featuredProjects: (featuredProjectsQuery.data ??
      initialData.featuredProjects) as typeof initialData.featuredProjects,
    featuredUnits: (featuredUnitsQuery.data ??
      initialData.featuredUnits) as typeof initialData.featuredUnits,
    featuredListings: (featuredListingsQuery.data ??
      initialData.featuredListings) as typeof initialData.featuredListings,
    latestListings: (latestListingsQuery.data ??
      initialData.latestListings) as typeof initialData.latestListings,
    heroBanner: (heroBannerQuery.data ??
      initialData.heroBanner) as typeof initialData.heroBanner,
    flexiBanner: (flexiBannerQuery.data ??
      initialData.flexiBanner) as typeof initialData.flexiBanner,
    blogData: initialData.blogData, // Always use initial blog data
  };

  return (
    <Lobby
      staticData={resolvedData.staticData}
      heroBannerPromise={Promise.resolve(resolvedData.heroBanner)}
      latestListingsPromise={Promise.resolve(resolvedData.latestListings)}
      featuredProjectsPromise={Promise.resolve(resolvedData.featuredProjects)}
      featuredListingsPromise={Promise.resolve(resolvedData.featuredListings)}
      flexiBannerPromise={Promise.resolve(resolvedData.flexiBanner)}
      blogDataPromise={Promise.resolve(resolvedData.blogData)}
    />
  );
}
