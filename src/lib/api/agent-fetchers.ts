/**
 * Agent-related data fetching functions
 * Centralized agent data access with proper error handling and typing
 */

import type { AgentDetails, AgentListing } from "@/types/agent";
import { meqasaApiClient } from "./client";

// Agent logo type for homepage display
export interface BrokerDetail {
  imbroker: string;
  first: string;
  name: string;
  name2: string;
}

interface BrokerSocials {
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  youtube: string | null;
  facebook: string | null;
}

interface BrokerObject {
  name: string;
  photo: string;
  company: string;
  logo: string;
  about: string;
  locality: string;
  type: string;
  verified: string;
  listings: string;
  id: string;
  socials: BrokerSocials;
}

interface AgentsResponse {
  list: BrokerObject[];
}

/**
 * Get agent logos for homepage display
 */
export async function getAgentLogos(): Promise<BrokerDetail[]> {
  try {
    const response = await meqasaApiClient.postForm<BrokerDetail[]>("/hp-9", {
      app: "vercel",
    });
    return response ?? [];
  } catch (error) {
    console.error("Failed to fetch agent logos:", error);
    return [];
  }
}

/**
 * Get all agents for agents page
 */
export async function getAllAgents(): Promise<AgentsResponse> {
  try {
    const response = await meqasaApiClient.postForm<AgentsResponse>(
      "/real-estate-agents",
      { app: "vercel" }
    );
    return response ?? { list: [] };
  } catch (error) {
    console.error("Failed to fetch all agents:", error);
    return { list: [] };
  }
}

/**
 * Get agent details by ID and name
 */
export async function getAgentDetails(
  agentId: string | number,
  agentName: string
): Promise<AgentDetails> {
  try {
    const url = `/properties-listed-by-${encodeURIComponent(agentName)}?g=${encodeURIComponent(agentId)}&app=vercel`;
    const response = await meqasaApiClient.get<AgentDetails>(url);
    return response;
  } catch (error) {
    console.error(`Failed to fetch agent details for ${agentId}:`, error);
    throw error;
  }
}

/**
 * Get paginated agent listings
 */
export async function getAgentListings(
  agentId: string | number,
  agentName: string,
  page: number,
  limit = 16
): Promise<{ listings: AgentListing[]; totalPages: number }> {
  try {
    const response = await meqasaApiClient.postForm<{
      listings: AgentListing[];
      totalPages: number;
    }>("/agent-listings", {
      agentId: String(agentId),
      agentName,
      page: String(page),
      limit: String(limit),
    });
    return response ?? { listings: [], totalPages: 0 };
  } catch (error) {
    console.error(`Failed to fetch agent listings for ${agentId}:`, error);
    return { listings: [], totalPages: 0 };
  }
}

// Combined export for easy importing
export const agentDataFetchers = {
  getAgentLogos,
  getAllAgents,
  getAgentDetails,
  getAgentListings,
};
