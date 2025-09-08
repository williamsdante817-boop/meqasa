"use client";

import { useQuery } from "@tanstack/react-query";
import { queryConfig, queryKeys } from "@/lib/query-config";
import type { AdLink } from "@/types";
import type { StaticData } from "@/lib/static-data";

/**
 * Hook for fetching hero banner data
 * Cached for longer periods since banners don't change frequently
 */
export function useHeroBanner(initialData?: AdLink) {
  return useQuery({
    queryKey: queryKeys.static.banner("hero"),
    queryFn: () => fetch("/api/homepage/hero-banner").then((r) => r.json()),
    ...queryConfig.homepageBanners, // Focus-based refresh, no background polling
    initialData,
  });
}

/**
 * Hook for fetching flexible banner data
 * Used for various promotional banners
 */
export function useFlexiBanner(initialData?: string) {
  return useQuery({
    queryKey: queryKeys.static.banner("flexi"),
    queryFn: () => fetch("/api/homepage/flexi-banner").then((r) => r.json()),
    ...queryConfig.homepageBanners, // Focus-based refresh, no background polling
    initialData,
  });
}

/**
 * Hook for fetching static homepage data
 * This includes agent logos, blog posts, location data, etc.
 * Uses longest cache time since this data rarely changes
 */
export function useStaticData(initialData?: StaticData) {
  const query = useQuery({
    queryKey: queryKeys.static.config(),
    queryFn: () => fetch("/api/homepage/static-data").then((r) => r.json()),
    ...queryConfig.longCache,
    // Static data can be cached very long
    staleTime:
      process.env.NODE_ENV === "development" ? 5 * 60 * 1000 : 30 * 60 * 1000, // 5min dev, 30min prod
    initialData,
    // Static content like agent logos rarely changes - disable all client-side fetching
    enabled: false, // Disable all fetching - rely only on initialData
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    // Keep data fresh indefinitely since we're not refetching
    gcTime: Infinity, // Keep in cache forever
    // Ensure we never return undefined if we have initial data
    placeholderData: initialData,
  });

  // Always return the data or initial data - never undefined
  return {
    ...query,
    data: (query.data ?? initialData) as StaticData,
  };
}
