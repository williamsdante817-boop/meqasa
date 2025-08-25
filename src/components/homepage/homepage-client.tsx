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
import { LobbySkeleton } from "@/app/(lobby)/_component/lobby-skeleton";

interface InitialData {
  staticData: any;
  featuredProjects: any;
  featuredUnits: any;
  featuredListings: any;
  latestListings: any;
  heroBanner: any;
  flexiBanner: any;
}

interface HomepageClientProps {
  initialData: InitialData;
}

/**
 * Client-side homepage component that uses React Query for data management
 * Receives initial server-side data and then manages client-side updates
 */
export function HomepageClient({ initialData }: HomepageClientProps) {
  // Use React Query hooks - they will start with initial data, then update
  const { data: featuredListings } = useFeaturedListings();
  const { data: latestListings } = useLatestListings();
  const { data: featuredProjects } = useFeaturedProjects();
  const { data: featuredUnits } = useFeaturedUnits();
  const { data: heroBanner } = useHeroBanner();
  const { data: flexiBanner } = useFlexiBanner();
  const { data: staticData } = useStaticData();

  // Use server data initially, then React Query data once available
  const resolvedData = {
    staticData: staticData || initialData.staticData,
    featuredProjects: featuredProjects || initialData.featuredProjects,
    featuredUnits: featuredUnits || initialData.featuredUnits,
    featuredListings: featuredListings || initialData.featuredListings,
    latestListings: latestListings || initialData.latestListings,
    heroBanner: heroBanner || initialData.heroBanner,
    flexiBanner: flexiBanner || initialData.flexiBanner,
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