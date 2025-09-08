import { NextResponse } from "next/server";
import { getLatestListings } from "@/lib/get-latest-listing";

export async function GET() {
  try {
    const data = await getLatestListings();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching latest listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest listings" },
      { status: 500 }
    );
  }
}
