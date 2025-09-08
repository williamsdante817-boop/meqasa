import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiClient } from "@/lib/axios-client";

export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV !== "production") {
      console.log("🔍 [send-message] Starting request processing");
    }

    const body = await request.formData();

    // Log all form data entries
    if (process.env.NODE_ENV !== "production") {
      console.log("📝 [send-message] All form data entries:");
      for (const [key, value] of body.entries()) {
        console.log(`  ${key}:`, value);
      }
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("📝 [send-message] Form data received:", {
        rfifrom: body.get("rfifrom"),
        rfimessage: body.get("rfimessage"),
        rfifromph: body.get("rfifromph"),
        nurfiname: body.get("nurfiname"),
        rfilid: body.get("rfilid"),
        rfisrc: body.get("rfisrc"),
        reqid: body.get("reqid"),
        app: body.get("app"),
      });
    }

    // Validate required fields
    const rfifrom = body.get("rfifrom") as string;
    const rfimessage = body.get("rfimessage") as string;
    const rfifromph = body.get("rfifromph") as string;
    const nurfiname = body.get("nurfiname") as string;
    const rfilid = body.get("rfilid") as string;
    const rfisrc = body.get("rfisrc") as string;
    const reqid = body.get("reqid") as string;
    const app = body.get("app") as string;

    if (process.env.NODE_ENV !== "production") {
      console.log("🔍 [send-message] Extracted values:", {
        rfifrom,
        rfimessage,
        rfifromph,
        nurfiname,
        rfilid,
        rfisrc,
        reqid,
        app,
      });
    }

    if (!rfifrom || !rfimessage || !rfifromph || !nurfiname || !rfilid) {
      if (process.env.NODE_ENV !== "production") {
        console.error("❌ [send-message] Missing required fields");
        console.error("❌ [send-message] Validation failed:", {
          rfifrom: !!rfifrom,
          rfimessage: !!rfimessage,
          rfifromph: !!rfifromph,
          nurfiname: !!nurfiname,
          rfilid: !!rfilid,
        });
      }
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("🌐 [send-message] Making request to MeQasa API");
    }

    // Prepare the request data
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

    if (process.env.NODE_ENV !== "production") {
      console.log("📤 [send-message] Request data being sent:", requestData);
    }

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

    if (process.env.NODE_ENV !== "production") {
      console.log("✅ [send-message] MeQasa API response received:", response);
      console.log("📊 [send-message] Response data:", response);
      console.log("📊 [send-message] Response type:", typeof response);
      console.log(
        "📊 [send-message] Response keys:",
        Object.keys(response ?? {})
      );
    }

    // Check if we have the expected response format
    if (
      response &&
      typeof response === "object" &&
      "mess" in response &&
      response.mess === "sent"
    ) {
      if (process.env.NODE_ENV !== "production") {
        console.log("✅ [send-message] Message sent successfully");
      }
      // Return the response in the format the frontend expects
      return NextResponse.json(response);
    } else {
      if (process.env.NODE_ENV !== "production") {
        console.error("❌ [send-message] Invalid response format:", response);
      }
      return NextResponse.json(
        { error: "Invalid response from server" },
        { status: 500 }
      );
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("❌ [send-message] Error details:", error);
      console.error(
        "❌ [send-message] Error message:",
        (error as Error).message
      );
      console.error("❌ [send-message] Error stack:", (error as Error).stack);
    }

    return NextResponse.json(
      {
        error: "Failed to send message",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
