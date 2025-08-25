"use client";

import { useQuery } from "@tanstack/react-query";
import { queryConfig, queryKeys } from "@/lib/query-config";
import { getFeaturedListings } from "@/lib/get-featured-listings";
import { getLatestListings } from "@/lib/get-latest-listing";

/**
 * Hook for fetching featured property listings
 * Uses React Query with optimized caching for homepage
 */
export function useFeaturedListings() {
  return useQuery({
    queryKey: queryKeys.properties.featured(),
    queryFn: getFeaturedListings,
    ...queryConfig.properties, // 2min stale time, 10min cache
    // Override for featured content - slightly more aggressive refresh
    staleTime: process.env.NODE_ENV === "development" ? 30 * 1000 : 90 * 1000, // 30s dev, 90s prod
  });
}

/**
 * Hook for fetching latest property listings
 * Uses React Query with fresh data strategy for homepage
 */
export function useLatestListings() {
  return useQuery({
    queryKey: queryKeys.properties.latest(),
    queryFn: getLatestListings,
    ...queryConfig.properties,
    // Latest listings need to be fresher
    staleTime: process.env.NODE_ENV === "development" ? 15 * 1000 : 60 * 1000, // 15s dev, 60s prod
    refetchInterval: process.env.NODE_ENV === "development" ? 30 * 1000 : 2 * 60 * 1000, // 30s dev, 2min prod
  });
}

/**
 * Hook for property search with filters
 * Keeps previous data while fetching new results for smooth UX
 */
export function usePropertySearch(filters: Record<string, any>) {
  return useQuery({
    queryKey: queryKeys.properties.search(filters),
    queryFn: () => {
      // You'll implement this when you create a centralized search function
      // For now, we'll use a placeholder
      console.log("Property search with filters:", filters);
      return Promise.resolve([]);
    },
    ...queryConfig.properties,
    placeholderData: (previousData) => previousData, // Keep previous data while refetching
    enabled: Object.keys(filters).length > 0, // Only run when we have filters
  });
}

/**
 * Hook for individual property details
 * Uses longer cache time since property details don't change often
 */
export function usePropertyDetails(propertyId: string) {
  return useQuery({
    queryKey: queryKeys.properties.detail(propertyId),
    queryFn: () => {
      // You'll implement this when you create a centralized property details function
      console.log("Fetching property details for:", propertyId);
      return Promise.resolve(null);
    },
    ...queryConfig.static, // Longer cache time for property details
    enabled: !!propertyId, // Only run when we have a property ID
  });
}