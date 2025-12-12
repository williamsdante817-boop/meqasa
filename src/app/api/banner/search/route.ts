import { NextResponse } from "next/server";
import { apiClient } from "@/lib/axios-client";

interface LeaderboardBanner {
  html: string;
  type: "leaderboard" | "sidebar";
}

// Search/Results page leaderboard banner (rp-6)
export async function GET() {
  try {
    const response = await apiClient.post<any>(
      "https://meqasa.com/rp-6",
      {
        app: "vercel",
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        responseType: "text",
      }
    );

    if (!response) {
      return NextResponse.json([]);
    }

    // If response is a string (raw HTML), wrap it
    if (typeof response === "string") {
      return NextResponse.json([
        {
          html: response,
          type: "leaderboard",
        },
      ] as LeaderboardBanner[]);
    }

    // If it's already an array, return it
    if (Array.isArray(response)) {
      return NextResponse.json(response as LeaderboardBanner[]);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error("Error fetching search/results leaderboard banner:", error);
    return NextResponse.json([], { status: 500 });
  }
}
