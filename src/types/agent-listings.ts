export interface AgentListingsRequest {
  agentId: string | number;
  agentName: string;
  page?: number;
  limit?: number;
}

export interface AgentListingsResponse {
  listings: AgentListing[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
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
