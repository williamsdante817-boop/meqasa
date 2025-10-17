import { NextResponse } from "next/server";
import { agentDataFetchers } from "@/lib/api/agent-fetchers";

export async function GET() {
  const logos = await agentDataFetchers.getAgentLogos();

  if (!logos || logos.length === 0) {
    return NextResponse.json(
      { error: "Agent logos unavailable" },
      { status: 503 }
    );
  }

  return NextResponse.json(logos);
}
