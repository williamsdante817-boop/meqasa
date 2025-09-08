/**
 * Centralized error handling utilities
 * Based on production patterns from skateshop repository
 */

import { toast } from "sonner";
import { z } from "zod";

/**
 * Extract a user-friendly error message from any error type
 */
export function getErrorMessage(err: unknown): string {
  // Handle Zod validation errors
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => issue.message);
    return errors.join(", ");
  }

  // Handle API response errors with structured error format
  if (err && typeof err === "object" && "message" in err) {
    return String(err.message);
  }

  // Handle string errors
  if (typeof err === "string") {
    return err;
  }

  // Handle network errors
  if (err instanceof Error) {
    if (err.name === "AbortError") {
      return "Request was cancelled";
    }
    if (err.message.includes("fetch")) {
      return "Network error. Please check your connection and try again.";
    }
    return err.message;
  }

  // Fallback for unknown error types
  return "Something went wrong. Please try again.";
}

/**
 * Display error toast notification to user
 */
export function showErrorToast(err: unknown): void {
  const errorMessage = getErrorMessage(err);
  console.error("Error occurred:", err);
  toast.error(errorMessage);
}

/**
 * Log error for debugging/monitoring purposes
 */
export function logError(err: unknown, context?: string): void {
  const errorMessage = getErrorMessage(err);
  const logContext = context ? `[${context}]` : "";

  console.error(`${logContext} Error:`, {
    message: errorMessage,
    error: err,
    timestamp: new Date().toISOString(),
    userAgent:
      typeof window !== "undefined" ? window.navigator.userAgent : "server",
  });

  // In production, you might want to send this to an error tracking service
  // Example: Sentry, LogRocket, etc.
  if (process.env.NODE_ENV === "production") {
    // sendToErrorTracking(err, context)
  }
}

/**
 * Higher-order function to wrap async functions with error handling
 */
export function withErrorHandling<
  T extends (...args: unknown[]) => Promise<unknown>,
>(fn: T, context?: string): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error, context);
      throw error;
    }
  }) as T;
}

/**
 * Property-specific error messages for better UX
 */
export const PropertyErrors = {
  NOT_FOUND:
    "Property not found. It may have been removed or the link is incorrect.",
  INVALID_REFERENCE:
    "Invalid property reference number. Please check and try again.",
  LISTING_UNAVAILABLE: "This listing is no longer available.",
  SEARCH_FAILED: "Search failed. Please try with different criteria.",
  API_ERROR: "Unable to load properties. Please try again later.",
  NETWORK_ERROR: "Network error. Please check your connection.",
} as const;

/**
 * Contact form specific error messages
 */
export const ContactErrors = {
  INVALID_EMAIL: "Please enter a valid email address.",
  INVALID_PHONE: "Please enter a valid Ghana phone number.",
  MESSAGE_TOO_SHORT: "Message must be at least 10 characters long.",
  SEND_FAILED: "Failed to send message. Please try again.",
} as const;

/**
 * Create property-specific error with context
 */
export function createPropertyError(
  error: unknown,
  type?: keyof typeof PropertyErrors
): Error {
  const message = type ? PropertyErrors[type] : getErrorMessage(error);
  const propertyError = new Error(message);
  propertyError.cause = error;
  return propertyError;
}
