import { NextResponse } from "next/server";
import { getLeaderboardBanner } from "@/lib/get-leaderboard-banner";

export async function GET() {
  try {
    const banner = await getLeaderboardBanner();
    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error fetching default banner:", error);
    return NextResponse.json([], { status: 500 });
  }
}
