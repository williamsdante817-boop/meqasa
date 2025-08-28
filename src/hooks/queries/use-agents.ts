"use client";

import { useQuery } from "@tanstack/react-query";
import { queryConfig, queryKeys } from "@/lib/query-config";
import type { AgentListing } from "@/types/agent-listings";

interface AgentListingsPaginationResponse {
  listings: AgentListing[];
  totalPages: number;
}

interface AgentListingsPaginationRequest {
  agentId: string | number;
  agentName: string;
  page: number;
  limit: number;
}

/**
 * Hook for fetching paginated agent listings (page 2 and beyond)
 * Page 1 comes from server-side getAgentDetails() call
 * This hook only handles client-side pagination
 */
export function useAgentListingsPagination(
  agentId: string | number,
  agentName: string,
  page: number,
  limit = 16
) {
  return useQuery({
    queryKey: queryKeys.agents.paginatedListings(agentId, page),
    queryFn: async (): Promise<AgentListingsPaginationResponse> => {
      const requestBody: AgentListingsPaginationRequest = {
        agentId,
        agentName,
        page,
        limit,
      };

      const response = await fetch("/api/agent-listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch listings: ${response.status}`);
      }

      return await response.json() as AgentListingsPaginationResponse;
    },
    ...queryConfig.agentListings,
    // Only enable for pages beyond 1 (page 1 comes from server)
    enabled: !!(agentId && agentName && page > 1),
    retry: (failureCount, error) => {
      // Don't retry on client errors (4xx)
      if (error instanceof Error && error.message.includes("400")) {
        return false;
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}