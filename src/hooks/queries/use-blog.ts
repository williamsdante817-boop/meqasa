"use client";

import { useQuery } from "@tanstack/react-query";
import { queryConfig, queryKeys } from "@/lib/query-config";
import type { BlogResponse } from "@/types/blog";

/**
 * Hook for fetching featured blog articles and market news
 * Uses React Query with long cache strategy since blog content is relatively static
 */
export function useFeaturedBlog(initialData?: BlogResponse) {
  return useQuery({
    queryKey: queryKeys.blog.featured(),
    queryFn: () => fetch("/api/blog/featured").then((r) => r.json()),
    ...queryConfig.static, // Long cache time since blog posts don't change frequently
    // Override stale time for blog content
    staleTime:
      process.env.NODE_ENV === "development" ? 2 * 60 * 1000 : 30 * 60 * 1000, // 2min dev, 30min prod
    initialData,
    retry: (failureCount, _error) => {
      // Don't retry too aggressively for blog content
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Max 10s delay
  });
}
