import { NextResponse } from "next/server";
import { getFeaturedListings } from "@/lib/get-featured-listings";

export async function GET() {
  try {
    const data = await getFeaturedListings();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching featured listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured listings" },
      { status: 500 }
    );
  }
}