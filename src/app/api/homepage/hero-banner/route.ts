import { NextResponse } from "next/server";
import { getHeroBanner } from "@/lib/get-hero-banner";

export async function GET() {
  try {
    const data = await getHeroBanner();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching hero banner:", error);
    return NextResponse.json(
      { error: "Failed to fetch hero banner" },
      { status: 500 }
    );
  }
}