import { NextResponse } from "next/server";
import { getLeaderboardBanner as getLeaderboardBanner2 } from "@/lib/banners";

export async function GET() {
  try {
    const banner = await getLeaderboardBanner2();
    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error fetching search banner:", error);
    return NextResponse.json([], { status: 500 });
  }
}
