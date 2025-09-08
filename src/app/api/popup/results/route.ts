import { type NextRequest, NextResponse } from "next/server";
import { getResultsPopup } from "@/lib/popups";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const contract = searchParams.get("contract");

    if (!type || !contract) {
      return NextResponse.json(
        { error: "Missing required parameters: type and contract" },
        { status: 400 }
      );
    }

    if (contract !== "rent" && contract !== "sale") {
      return NextResponse.json(
        { error: "Contract must be either 'rent' or 'sale'" },
        { status: 400 }
      );
    }

    const popupData = await getResultsPopup({ type, contract });

    if (!popupData) {
      return NextResponse.json(
        { error: "No popup data available" },
        { status: 404 }
      );
    }

    return NextResponse.json(popupData);
  } catch (error) {
    console.error("Failed to fetch results popup:", error);
    return NextResponse.json(
      { error: "Failed to fetch popup data" },
      { status: 500 }
    );
  }
}
