"use client";

import { QueryClient } from "@tanstack/react-query";

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

/**
 * Create a new QueryClient with production-ready configuration
 * Optimized for real estate data patterns
 */
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Real estate data freshness strategy
        staleTime: isProduction ? 5 * 60 * 1000 : 30 * 1000, // 5min prod, 30s dev
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        
        // Error handling
        retry: (failureCount, error: any) => {
          // Don't retry on client errors (4xx)
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          // Retry up to 3 times for server errors
          return failureCount < 3;
        },
        
        // Retry delay with exponential backoff
        retryDelay: (attemptIndex) => 
          Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Conservative refetching for production
        refetchOnWindowFocus: isDevelopment,
        refetchOnReconnect: true,
        refetchOnMount: true,
      },
      mutations: {
        retry: 1, // Only retry mutations once
        retryDelay: 1000, // 1 second delay for mutations
      },
    },
  });
}

let clientSingleton: QueryClient | undefined = undefined;

/**
 * Get the global QueryClient instance
 * Creates a singleton in browser, new instance on server
 */
export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server: always create a new query client
    return createQueryClient();
  }
  
  // Browser: create singleton
  if (!clientSingleton) {
    clientSingleton = createQueryClient();
  }
  
  return clientSingleton;
}