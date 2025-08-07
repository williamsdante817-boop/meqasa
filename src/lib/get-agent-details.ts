import { apiClient } from "./axios-client";

export interface AgentDetails {
  name: string;
  id: number;
  verified: "plus" | "agent" | "owner" | "";
  accounttype: string;
  company: string;
  logo: string;
  photo: string;
  regfee: string;
  rentcommission: string;
  salecommission: string;
  locality: string;
  about: string;
  tenure: number;
  activelistings: number;
  listings: AgentListing[];
  haswan: boolean;
  rfilid: number;
  socials: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  commission: {
    rental?: string;
    sale?: string;
  };
  experience?: string;
}

export interface AgentListing {
  photocount: string;
  detailreq: string;
  image: string;
  streetaddress: string;
  locationstring: string;
  floorarea: string;
  bathroomcount: string;
  bedroomcount: string;
  garagecount: string;
  listingid: number;
  type: string;
  contract: string;
  summary: string;
  description: string;
  owner?: {
    name?: string;
    image?: string;
  };
  pricepart1: string;
  pricepart2: string;
  availability: string;
}

/**
 * Fetches agent details from the Meqasa API.
 * @param agentId The agent's ID
 * @param agentName The agent's name (url-encoded)
 * @returns A promise that resolves to the agent details
 */
export async function getAgentDetails(
  agentId: string | number,
  agentName: string,
): Promise<AgentDetails> {
  const url = `https://meqasa.com/properties-listed-by-${encodeURIComponent(agentName)}?g=${encodeURIComponent(agentId)}&app=vercel`;

  return await apiClient.get<AgentDetails>(url, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}
