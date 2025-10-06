"use client";

import type { AgentListing } from "@/types/agent";
import { useCallback, useEffect, useState } from "react";

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

interface UseAgentListingsReturn {
  data: AgentListing[];
  loading: boolean;
  error: string | null;
  totalPages: number;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching paginated agent listings (page 2 and beyond)
 * Page 1 comes from server-side getAgentDetails() call
 * This hook only handles client-side pagination
 */
export function useAgentListings(
  agentId: string | number,
  agentName: string,
  page: number,
  limit = 16
): UseAgentListingsReturn {
  const [data, setData] = useState<AgentListing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchListings = useCallback(async () => {
    if (!agentId || !agentName || page <= 1) {
      return; // Don't fetch for page 1 (handled server-side)
    }

    try {
      setLoading(true);
      setError(null);

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

      const result = (await response.json()) as AgentListingsPaginationResponse;
      setData(result.listings);
      setTotalPages(result.totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Failed to fetch agent listings:", err);
    } finally {
      setLoading(false);
    }
  }, [agentId, agentName, page, limit]);

  useEffect(() => {
    void fetchListings();
  }, [fetchListings]);

  return {
    data,
    loading,
    error,
    totalPages,
    refetch: fetchListings,
  };
}
