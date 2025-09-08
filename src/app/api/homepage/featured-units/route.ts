import { NextResponse } from "next/server";
import { getFeaturedUnits } from "@/lib/get-featured-units";

export async function GET() {
  try {
    const data = await getFeaturedUnits();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching featured units:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured units" },
      { status: 500 }
    );
  }
}
