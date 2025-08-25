"use client";

import { useQuery, useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { queryConfig, queryKeys } from "@/lib/query-config";
import type { MeqasaSearchResponse, MeqasaSearchParams, MeqasaLoadMoreParams } from "@/types/meqasa";

// Search parameters interface
export interface SearchFilters extends MeqasaSearchParams {
  contract: string;
  locality: string;
  searchId?: number; // Optional searchId for pagination
}

/**
 * Hook for property search with caching and smart refetching
 * Maintains compatibility with existing /api/properties endpoint
 */
export function usePropertySearch(filters: SearchFilters, initialData?: MeqasaSearchResponse) {
  return useQuery({
    queryKey: queryKeys.search.properties(filters),
    queryFn: async () => {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "search",
          params: filters,
        }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      return response.json() as Promise<MeqasaSearchResponse>;
    },
    ...queryConfig.properties,
    // Search results can become stale quickly due to new listings
    staleTime: process.env.NODE_ENV === "development" ? 30 * 1000 : 2 * 60 * 1000, // 30s dev, 2min prod
    // Keep previous results while loading new search
    placeholderData: (previousData) => previousData,
    initialData,
    // Enable background refetch for fresh results
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook for loading more properties (pagination)
 * Compatible with existing searchId-based pagination system
 */
export function useLoadMoreProperties() {
  return useMutation({
    mutationFn: async (params: MeqasaLoadMoreParams & { contract: string; locality: string }) => {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "loadMore",
          params,
        }),
      });

      if (!response.ok) {
        throw new Error(`Load more failed: ${response.statusText}`);
      }

      return response.json() as Promise<MeqasaSearchResponse>;
    },
  });
}

/**
 * Hook for infinite scroll search results
 * Alternative to traditional pagination - can be used for enhanced mobile UX
 */
export function useInfinitePropertySearch(baseFilters: SearchFilters, initialData?: MeqasaSearchResponse) {
  return useInfiniteQuery({
    queryKey: queryKeys.search.propertiesInfinite(baseFilters),
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      // For first page, use search endpoint
      if (pageParam === 1) {
        const response = await fetch("/api/properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "search",
            params: baseFilters,
          }),
        });

        if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`);
        }

        return response.json() as Promise<MeqasaSearchResponse>;
      }

      // For subsequent pages, use loadMore endpoint with searchId from context
      // Note: This requires managing searchId state externally
      const searchId = baseFilters.searchId ?? 0;
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "loadMore",
          params: {
            ...baseFilters,
            y: searchId,
            w: pageParam,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Load more failed: ${response.statusText}`);
      }

      return response.json() as Promise<MeqasaSearchResponse>;
    },
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      const totalPages = Math.ceil(lastPage.resultcount / 20); // 20 results per page
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    ...queryConfig.properties,
    staleTime: process.env.NODE_ENV === "development" ? 30 * 1000 : 2 * 60 * 1000, // 30s dev, 2min prod
    initialData: initialData ? {
      pages: [initialData],
      pageParams: [1],
    } : undefined,
  });
}

/**
 * Hook for cached search suggestions
 * Can be used for location/property type autocomplete
 */
export function useSearchSuggestions(searchTerm: string, type: 'location' | 'propertyType') {
  return useQuery({
    queryKey: queryKeys.search.suggestions(type, searchTerm),
    queryFn: async () => {
      // Placeholder for search suggestions API
      // This would call a dedicated suggestions endpoint
      const response = await fetch(`/api/search/suggestions?type=${type}&q=${encodeURIComponent(searchTerm)}`);
      
      if (!response.ok) {
        throw new Error(`Suggestions failed: ${response.statusText}`);
      }

      return response.json() as Promise<string[]>;
    },
    ...queryConfig.static, // Cache suggestions for longer
    // Only search when we have at least 2 characters
    enabled: searchTerm.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutes - suggestions don't change often
  });
}

/**
 * Hook for managing search history
 * Stores recent searches in React Query cache
 */
export function useSearchHistory() {
  return useQuery({
    queryKey: ['search', 'history'],
    queryFn: () => {
      // Get search history from localStorage
      if (typeof window === "undefined") return [];
      
      try {
        const history = localStorage.getItem('meqasa_search_history');
        return history ? JSON.parse(history) as string[] : [];
      } catch {
        return [];
      }
    },
    staleTime: Infinity, // Never goes stale - managed manually
  });
}