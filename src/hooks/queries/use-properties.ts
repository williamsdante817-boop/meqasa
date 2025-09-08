"use client";

import { useQuery } from "@tanstack/react-query";
import { queryConfig, queryKeys } from "@/lib/query-config";
import type { FeaturedListingsResponse } from "@/lib/get-featured-listings";
import type { LatestListingsResponse } from "@/lib/get-latest-listing";
import {
  getListingDetails,
  type SimilarListings,
} from "@/lib/get-listing-detail";

/**
 * Hook for fetching featured property listings
 * Uses React Query with optimized caching for homepage
 */
export function useFeaturedListings(initialData?: FeaturedListingsResponse) {
  return useQuery({
    queryKey: queryKeys.properties.featured(),
    queryFn: () =>
      fetch("/api/homepage/featured-listings").then((r) => r.json()),
    ...queryConfig.homepage, // Focus-based refresh, longer stale time
    initialData,
  });
}

/**
 * Hook for fetching latest property listings
 * Uses React Query with fresh data strategy for homepage
 */
export function useLatestListings(initialData?: LatestListingsResponse) {
  return useQuery({
    queryKey: queryKeys.properties.latest(),
    queryFn: () => fetch("/api/homepage/latest-listings").then((r) => r.json()),
    ...queryConfig.homepage, // Focus-based refresh, no background polling
    initialData,
  });
}

/**
 * Hook for individual property details
 * Uses longer cache time since property details don't change often
 * Returns complete property data including similar properties, images, and owner info
 */
export function usePropertyDetails(
  propertyId: string,
  initialData?: SimilarListings
) {
  return useQuery({
    queryKey: queryKeys.properties.detail(propertyId),
    queryFn: async () => {
      try {
        return await getListingDetails(propertyId);
      } catch (error) {
        // Enhanced error handling for production
        if (error instanceof Error) {
          // Check for specific error messages from API
          if (
            error.message.toLowerCase().includes("not found") ||
            error.message.toLowerCase().includes("not available")
          ) {
            throw new Error(`Property listing ${propertyId} is not available`);
          }

          if (
            error.message.toLowerCase().includes("network") ||
            error.message.toLowerCase().includes("timeout")
          ) {
            throw new Error(
              "Network error loading property. Please check your connection and try again."
            );
          }
        }

        // Generic fallback error
        throw new Error(
          "Unable to load property details. Please try again later."
        );
      }
    },
    ...queryConfig.static, // Longer cache time for property details
    enabled: !!propertyId && !initialData, // Don't run query if we have initialData
    initialData,
    retry: (failureCount, error) => {
      // Don't retry on "not found" errors
      if (
        error instanceof Error &&
        error.message.toLowerCase().includes("not available")
      ) {
        return false;
      }
      // Retry network errors up to 2 times
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}
