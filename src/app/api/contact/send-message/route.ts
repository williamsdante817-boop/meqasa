import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiClient } from "@/lib/axios-client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();

    logger.debug("[send-message] Form data received", {
      rfifrom: body.get("rfifrom"),
      rfimessage: body.get("rfimessage"),
      rfifromph: body.get("rfifromph"),
      nurfiname: body.get("nurfiname"),
      rfilid: body.get("rfilid"),
    });

    // Validate required fields
    const rfifrom = body.get("rfifrom") as string;
    const rfimessage = body.get("rfimessage") as string;
    const rfifromph = body.get("rfifromph") as string;
    const nurfiname = body.get("nurfiname") as string;
    const rfilid = body.get("rfilid") as string;
    const rfisrc = body.get("rfisrc") as string;
    const reqid = body.get("reqid") as string;
    const app = body.get("app") as string;

    if (!rfifrom || !rfimessage || !rfifromph || !nurfiname || !rfilid) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    logger.debug("[send-message] Sending to MeQasa API", requestData);

    const requestData = {
      rfifrom: rfifrom,
      rfimessage: rfimessage,
      rfifromph: rfifromph,
      nurfiname: nurfiname,
      rfilid: rfilid,
      rfisrc: rfisrc ?? "3",
      reqid: reqid ?? "-1",
      app: app ?? "vercel",
    };

    logger.debug("[send-message] Sending to MeQasa API", requestData);

    // Use the same pattern as the working getListingDetails API call
    const formEncoded = new URLSearchParams(
      requestData as Record<string, string>
    );
    const response = await apiClient.post(
      "https://meqasa.com/ag-msg",
      formEncoded,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    logger.debug("[send-message] Response received", { response });

    // Check if we have the expected response format
    if (
      response &&
      typeof response === "object" &&
      "mess" in response &&
      response.mess === "sent"
    ) {
      return NextResponse.json(response);
    } else {
      logger.error("[send-message] Invalid response", response);
      return NextResponse.json(
        { error: "Invalid response from server" },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error("[send-message] Failed", error);

    return NextResponse.json(
      {
        error: "Failed to send message",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
