"use client";

import { useQuery } from "@tanstack/react-query";
import { queryConfig, queryKeys } from "@/lib/query-config";
import { getFeaturedProjects } from "@/lib/get-featured-projects";
import { getFeaturedUnits } from "@/lib/get-featured-units";

/**
 * Hook for fetching featured development projects
 * Uses React Query with optimized caching for homepage
 */
export function useFeaturedProjects() {
  return useQuery({
    queryKey: queryKeys.projects.featured(),
    queryFn: getFeaturedProjects,
    ...queryConfig.properties,
    // Projects change less frequently than regular listings
    staleTime: process.env.NODE_ENV === "development" ? 60 * 1000 : 5 * 60 * 1000, // 1min dev, 5min prod
  });
}

/**
 * Hook for fetching featured units
 * These are featured individual units from development projects
 */
export function useFeaturedUnits() {
  return useQuery({
    queryKey: ["projects", "featured-units"] as const,
    queryFn: getFeaturedUnits,
    ...queryConfig.properties,
    staleTime: process.env.NODE_ENV === "development" ? 60 * 1000 : 3 * 60 * 1000, // 1min dev, 3min prod
  });
}

/**
 * Hook for fetching project details
 * Uses longer cache time since project details are relatively static
 */
export function useProjectDetails(projectId: string) {
  return useQuery({
    queryKey: queryKeys.projects.detail(projectId),
    queryFn: () => {
      // You'll implement this when you create a centralized project details function
      console.log("Fetching project details for:", projectId);
      return Promise.resolve(null);
    },
    ...queryConfig.static, // Longer cache for project details
    enabled: !!projectId,
  });
}

/**
 * Hook for fetching units within a project
 * Uses moderate caching since units can change availability
 */
export function useProjectUnits(projectId: string) {
  return useQuery({
    queryKey: queryKeys.projects.units(projectId),
    queryFn: () => {
      // You'll implement this when needed
      console.log("Fetching units for project:", projectId);
      return Promise.resolve([]);
    },
    ...queryConfig.properties,
    enabled: !!projectId,
  });
}