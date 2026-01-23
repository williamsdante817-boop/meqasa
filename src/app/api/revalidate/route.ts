/**
 * On-Demand Revalidation API Route
 *
 * This API endpoint allows manual triggering of ISR page regeneration without waiting
 * for the automatic revalidation period (6 hours for developer pages).
 *
 * Setup:
 * 1. Add REVALIDATION_SECRET to .env.local: REVALIDATION_SECRET=your-secret-here
 * 2. Generate secret: openssl rand -base64 32
 *
 * Usage:
 * POST /api/revalidate
 * Headers: { "Authorization": "Bearer YOUR_SECRET", "Content-Type": "application/json" }
 * Body: { "path": "/projects-by-developer/acme-corp-123", "type": "developer" }
 *
 * Use Cases:
 * - Developer updates profile in CMS → trigger immediate page refresh
 * - Admin panel "Publish" button → call this API to show changes instantly
 * - Webhook from external system → regenerate page when data changes
 *
 * Security:
 * - Requires Bearer token authentication
 * - Secret must match REVALIDATION_SECRET environment variable
 * - All requests logged to Sentry for monitoring
 */

import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

const { logger } = Sentry;

export async function POST(request: NextRequest) {
  try {
    // Extract authorization header from request
    const authHeader = request.headers.get("authorization");
    const secret = process.env.REVALIDATION_SECRET;

    // Verify secret is configured in environment
    if (!secret) {
      logger.error("REVALIDATION_SECRET not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Validate authorization token matches secret
    if (authHeader !== `Bearer ${secret}`) {
      logger.warn("Unauthorized revalidation attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body to get path and optional type
    const body = await request.json();
    const { path, type = "developer" } = body;

    // Validate required path parameter
    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    // Track revalidation in Sentry for monitoring and debugging
    Sentry.startSpan(
      {
        op: "cache.revalidate",
        name: `Revalidate ${type}`,
      },
      (span) => {
        span.setAttribute("path", path);
        span.setAttribute("type", type);
        // Trigger Next.js to regenerate the static page
        revalidatePath(path);
      }
    );

    logger.info(`Revalidated path: ${path}`);

    // Return success response with metadata
    return NextResponse.json({
      revalidated: true,
      path,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Log error to Sentry for debugging
    Sentry.captureException(error);
    logger.error("Revalidation error:", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Failed to revalidate" },
      { status: 500 }
    );
  }
}
