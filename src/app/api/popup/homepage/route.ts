import { NextResponse } from "next/server";
import { getHomepagePopup } from "@/lib/popups";

export async function GET() {
  try {
    const popupData = await getHomepagePopup();

    if (!popupData) {
      return NextResponse.json(
        { error: "No popup data available" },
        { status: 404 }
      );
    }

    return NextResponse.json(popupData);
  } catch (error) {
    console.error("Failed to fetch homepage popup:", error);
    return NextResponse.json(
      { error: "Failed to fetch popup data" },
      { status: 500 }
    );
  }
}
