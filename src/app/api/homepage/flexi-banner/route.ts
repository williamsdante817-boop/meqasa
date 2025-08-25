import { NextResponse } from "next/server";
import { getFlexiBanner } from "@/lib/get-flexi-banner";

export async function GET() {
  try {
    const data = await getFlexiBanner();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching flexi banner:", error);
    return NextResponse.json(
      { error: "Failed to fetch flexi banner" },
      { status: 500 }
    );
  }
}