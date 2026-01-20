import { logger } from "@/lib/logger";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiClient } from "@/lib/axios-client";

export async function POST(request: NextRequest) {
  try {
    if (process.env.NODE_ENV !== "production") {
      logger.debug("🔍 [view-number] Starting request processing");
    }

    const body = await request.formData();

    // Log all form data entries
    if (process.env.NODE_ENV !== "production") {
      logger.debug("📝 [view-number] All form data entries:");
      for (const [key, value] of body.entries()) {
        const stringValue =
          value instanceof File ? `[File: ${value.name}]` : value.toString();
        logger.debug(`  ${key}:`, { value: stringValue });
      }
    }

    if (process.env.NODE_ENV !== "production") {
      logger.debug("📝 [view-number] Form data received:", {
        rfifromph: body.get("rfifromph"),
        nurfiname: body.get("nurfiname"),
        rfilid: body.get("rfilid"),
        rfisrc: body.get("rfisrc"),
        reqid: body.get("reqid"),
        app: body.get("app"),
      });
    }

    // Validate required fields
    const rfifromph = body.get("rfifromph") as string;
    const nurfiname = body.get("nurfiname") as string;
    const rfilid = body.get("rfilid") as string;
    const rfisrc = body.get("rfisrc") as string;
    const reqid = body.get("reqid") as string;
    const app = body.get("app") as string;

    if (process.env.NODE_ENV !== "production") {
      logger.debug("🔍 [view-number] Extracted values:", {
        rfifromph,
        nurfiname,
        rfilid,
        rfisrc,
        reqid,
        app,
      });
    }

    if (!rfifromph || !nurfiname || !rfilid) {
      if (process.env.NODE_ENV !== "production") {
        logger.error("❌ [view-number] Missing required fields");
        logger.error("❌ [view-number] Validation failed", {
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
      logger.debug("🌐 [view-number] Making request to MeQasa API");
    }

    // Prepare the request data
    const requestData = {
      rfifromph: rfifromph,
      nurfiname: nurfiname,
      rfilid: rfilid,
      rfisrc: rfisrc ?? "3",
      reqid: reqid ?? "-1",
      app: app ?? "vercel",
    };

    if (process.env.NODE_ENV !== "production") {
      logger.debug("📤 [view-number] Request data being sent:", requestData);
    }

    // Use the same endpoint that works for send message
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
      logger.debug("✅ [view-number] MeQasa API response received:", {
        response: JSON.stringify(response),
      });
      logger.debug("📊 [view-number] Response data:", {
        response: JSON.stringify(response),
      });
      logger.debug("📊 [view-number] Response type:", {
        type: typeof response,
      });
      logger.debug("📊 [view-number] Response keys:", {
        keys: Object.keys(response ?? {}).join(", "),
      });
    }

    // Check if we have the expected response format
    if (
      response &&
      typeof response === "object" &&
      "stph2" in response &&
      "stph3" in response
    ) {
      if (process.env.NODE_ENV !== "production") {
        logger.debug("✅ [view-number] Valid response format received");
      }
      return NextResponse.json(response);
    } else {
      if (process.env.NODE_ENV !== "production") {
        logger.error("❌ [view-number] Invalid response format", {
          response: JSON.stringify(response),
        });
      }
      return NextResponse.json(
        { error: "Invalid response from server" },
        { status: 500 }
      );
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      logger.error("❌ [view-number] Error details", error);
      logger.error("❌ [view-number] Error message", undefined, {
        message: (error as Error).message,
      });
      logger.error("❌ [view-number] Error stack", undefined, {
        stack: (error as Error).stack,
      });
    }

    return NextResponse.json(
      {
        error: "Failed to get phone number",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
