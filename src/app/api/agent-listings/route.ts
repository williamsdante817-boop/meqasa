import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type {
  AgentListingsRequest,
  AgentListingsResponse,
  AgentListing,
} from "@/types/agent-listings";
import { apiClient } from "@/lib/axios-client";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AgentListingsRequest;
    const { agentId, agentName, page = 1, limit = 20 } = body;

    if (!agentId || !agentName) {
      return NextResponse.json(
        { error: "Missing required fields: agentId and agentName" },
        { status: 400 }
      );
    }

    const url = `https://meqasa.com/properties-listed-by-${encodeURIComponent(agentName)}?g=${encodeURIComponent(agentId)}&app=vercel&page=${page}&limit=${limit}`;

    const data = await apiClient.get<{
      listings?: AgentListing[];
      activelistings?: number;
    }>(url);

    const listings = data.listings ?? [];
    const totalCount = data.activelistings ?? listings.length;
    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    const result: AgentListingsResponse = {
      listings,
      totalCount,
      currentPage: page,
      totalPages,
      hasMore,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in agent listings API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent listings" },
      { status: 500 }
    );
  }
}
