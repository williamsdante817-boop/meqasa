/**
 * Agent-related type definitions
 * Centralized types for agent data structures
 */

export interface BrokerSocials {
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  youtube: string | null;
  facebook: string | null;
}

export interface BrokerObject {
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

export interface AgentsResponse {
  list: BrokerObject[];
}

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
