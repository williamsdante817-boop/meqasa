import { NextResponse } from "next/server";
import { logError } from "./logger";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(error: unknown, context?: string) {
  logError("API Error", error, { context });

  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
}

export function withErrorHandling<T>(
  handler: () => Promise<T>,
  context?: string
): Promise<T | NextResponse> {
  return handler().catch((error) => handleApiError(error, context));
}
