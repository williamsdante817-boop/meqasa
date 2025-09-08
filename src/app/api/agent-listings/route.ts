import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type {
  AgentListingsRequest,
  AgentListingsResponse,
  AgentListing,
} from "@/types/agent-listings";

const MEQASA_API_BASE = "https://meqasa.com";

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

    // Build URL for agent listings
    const url = `${MEQASA_API_BASE}/properties-listed-by-${encodeURIComponent(agentName)}?g=${encodeURIComponent(agentId)}&app=vercel`;

    // Add pagination parameters if provided
    const searchParams = new URLSearchParams();
    if (page > 1) {
      searchParams.set("page", page.toString());
    }
    if (limit !== 20) {
      searchParams.set("limit", limit.toString());
    }

    const fullUrl = searchParams.toString()
      ? `${url}&${searchParams.toString()}`
      : url;

    console.log("Agent listings API call:", {
      url: fullUrl,
      agentId,
      agentName,
      page,
      limit,
    });

    const response = await fetch(fullUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Meqasa API error: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      listings?: AgentListing[];
      activelistings?: number;
    };

    // Extract listings and calculate pagination info
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
