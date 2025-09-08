import { NextResponse } from "next/server";
import { getStaticData } from "@/lib/static-data";

export async function GET() {
  try {
    const data = await getStaticData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching static data:", error);
    return NextResponse.json(
      { error: "Failed to fetch static data" },
      { status: 500 }
    );
  }
}
