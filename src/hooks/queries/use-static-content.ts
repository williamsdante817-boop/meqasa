"use client";

import { useQuery } from "@tanstack/react-query";
import { queryConfig, queryKeys } from "@/lib/query-config";
import { getHeroBanner } from "@/lib/get-hero-banner";
import { getFlexiBanner } from "@/lib/get-flexi-banner";
import type { AdLink } from "@/types";
import { getStaticData, type StaticData } from "@/lib/static-data";

/**
 * Hook for fetching hero banner data
 * Cached for longer periods since banners don't change frequently
 */
export function useHeroBanner(initialData?: AdLink) {
  return useQuery({
    queryKey: queryKeys.static.banner("hero"),
    queryFn: getHeroBanner,
    ...queryConfig.static,
    // Banners can be cached even longer
    staleTime: process.env.NODE_ENV === "development" ? 2 * 60 * 1000 : 10 * 60 * 1000, // 2min dev, 10min prod
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
    queryFn: getFlexiBanner,
    ...queryConfig.static,
    staleTime: process.env.NODE_ENV === "development" ? 2 * 60 * 1000 : 10 * 60 * 1000, // 2min dev, 10min prod
    initialData,
  });
}

/**
 * Hook for fetching static homepage data
 * This includes agent logos, blog posts, location data, etc.
 * Uses longest cache time since this data rarely changes
 */
export function useStaticData(initialData?: StaticData) {
  return useQuery({
    queryKey: queryKeys.static.config(),
    queryFn: getStaticData,
    ...queryConfig.longCache,
    // Static data can be cached very long
    staleTime: process.env.NODE_ENV === "development" ? 5 * 60 * 1000 : 30 * 60 * 1000, // 5min dev, 30min prod
    initialData,
  });
}