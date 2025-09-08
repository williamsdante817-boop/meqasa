export enum PropertyErrorType {
  INVALID_SLUG = "INVALID_SLUG",
  PROPERTY_NOT_FOUND = "PROPERTY_NOT_FOUND",
  LISTING_NOT_PUBLISHED = "LISTING_NOT_PUBLISHED",
  CONNECTION_ERROR = "CONNECTION_ERROR",
  RATE_LIMIT_ERROR = "RATE_LIMIT_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  CORS_ERROR = "CORS_ERROR",
  MALFORMED_DATA = "MALFORMED_DATA",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface PropertyErrorDetails {
  type: PropertyErrorType;
  title: string;
  description: string;
  showRetry: boolean;
  showBackToHome: boolean;
  showBrowseProperties: boolean;
  showTroubleshootingTips: boolean;
  originalError?: Error;
}

export class PropertyError extends Error {
  public readonly type: PropertyErrorType;

  constructor(type: PropertyErrorType, message: string, originalError?: Error) {
    super(message);
    this.name = "PropertyError";
    this.type = type;

    if (originalError) {
      this.stack = originalError.stack;
      this.cause = originalError;
    }
  }
}

export function createPropertyError(
  error: unknown,
  context?: string
): PropertyError {
  if (error instanceof PropertyError) {
    return error;
  }

  const errorMessage = error instanceof Error ? error.message : String(error);
  const lowerMessage = errorMessage.toLowerCase();

  // Invalid slug pattern
  if (context === "invalid_slug") {
    return new PropertyError(
      PropertyErrorType.INVALID_SLUG,
      "Invalid property URL format",
      error instanceof Error ? error : undefined
    );
  }

  // Specific error type detection
  if (lowerMessage.includes("listing not published")) {
    return new PropertyError(
      PropertyErrorType.LISTING_NOT_PUBLISHED,
      "Listing is not currently published",
      error instanceof Error ? error : undefined
    );
  }

  if (lowerMessage.includes("not found") || lowerMessage.includes("404")) {
    return new PropertyError(
      PropertyErrorType.PROPERTY_NOT_FOUND,
      "Property listing not found",
      error instanceof Error ? error : undefined
    );
  }

  if (
    lowerMessage.includes("network") ||
    lowerMessage.includes("timeout") ||
    lowerMessage.includes("fetch failed") ||
    lowerMessage.includes("connection")
  ) {
    return new PropertyError(
      PropertyErrorType.CONNECTION_ERROR,
      "Network connection failed",
      error instanceof Error ? error : undefined
    );
  }

  if (
    lowerMessage.includes("rate limit") ||
    lowerMessage.includes("too many requests") ||
    lowerMessage.includes("429")
  ) {
    return new PropertyError(
      PropertyErrorType.RATE_LIMIT_ERROR,
      "Too many requests made",
      error instanceof Error ? error : undefined
    );
  }

  if (
    lowerMessage.includes("server error") ||
    lowerMessage.includes("internal server") ||
    lowerMessage.includes("500") ||
    lowerMessage.includes("503")
  ) {
    return new PropertyError(
      PropertyErrorType.SERVER_ERROR,
      "Server error occurred",
      error instanceof Error ? error : undefined
    );
  }

  if (
    lowerMessage.includes("unauthorized") ||
    lowerMessage.includes("forbidden") ||
    lowerMessage.includes("401") ||
    lowerMessage.includes("403")
  ) {
    return new PropertyError(
      PropertyErrorType.AUTHENTICATION_ERROR,
      "Authentication required",
      error instanceof Error ? error : undefined
    );
  }

  if (lowerMessage.includes("cors") || lowerMessage.includes("cross-origin")) {
    return new PropertyError(
      PropertyErrorType.CORS_ERROR,
      "Cross-origin request blocked",
      error instanceof Error ? error : undefined
    );
  }

  if (
    lowerMessage.includes("invalid json") ||
    lowerMessage.includes("malformed") ||
    lowerMessage.includes("parse")
  ) {
    return new PropertyError(
      PropertyErrorType.MALFORMED_DATA,
      "Invalid data format received",
      error instanceof Error ? error : undefined
    );
  }

  return new PropertyError(
    PropertyErrorType.UNKNOWN_ERROR,
    "An unexpected error occurred",
    error instanceof Error ? error : undefined
  );
}

export function getErrorDetails(error: unknown): PropertyErrorDetails {
  const propertyError =
    error instanceof PropertyError ? error : createPropertyError(error);

  const baseDetails = {
    type: propertyError.type,
    originalError: propertyError.cause as Error | undefined,
  };

  switch (propertyError.type) {
    case PropertyErrorType.INVALID_SLUG:
      return {
        ...baseDetails,
        title: "Invalid Property URL",
        description:
          "The property URL format is not valid. Please check the link and try again.",
        showRetry: false,
        showBackToHome: true,
        showBrowseProperties: true,
        showTroubleshootingTips: false,
      };

    case PropertyErrorType.PROPERTY_NOT_FOUND:
      return {
        ...baseDetails,
        title: "Property Not Found",
        description:
          "The property you're looking for doesn't exist or has been removed.",
        showRetry: false,
        showBackToHome: true,
        showBrowseProperties: true,
        showTroubleshootingTips: false,
      };

    case PropertyErrorType.LISTING_NOT_PUBLISHED:
      return {
        ...baseDetails,
        title: "Listing Not Available",
        description:
          "This property listing is not currently published or available for viewing.",
        showRetry: false,
        showBackToHome: true,
        showBrowseProperties: true,
        showTroubleshootingTips: false,
      };

    case PropertyErrorType.CONNECTION_ERROR:
      return {
        ...baseDetails,
        title: "Connection Error",
        description:
          "Unable to load property details due to network issues. Please check your connection and try again.",
        showRetry: true,
        showBackToHome: true,
        showBrowseProperties: true,
        showTroubleshootingTips: true,
      };

    case PropertyErrorType.RATE_LIMIT_ERROR:
      return {
        ...baseDetails,
        title: "Too Many Requests",
        description:
          "You've made too many requests. Please wait a moment and try again.",
        showRetry: true,
        showBackToHome: true,
        showBrowseProperties: false,
        showTroubleshootingTips: false,
      };

    case PropertyErrorType.SERVER_ERROR:
      return {
        ...baseDetails,
        title: "Server Error",
        description:
          "Our servers are experiencing issues. Please try again in a few minutes.",
        showRetry: true,
        showBackToHome: true,
        showBrowseProperties: false,
        showTroubleshootingTips: false,
      };

    case PropertyErrorType.AUTHENTICATION_ERROR:
      return {
        ...baseDetails,
        title: "Access Denied",
        description: "You don't have permission to view this property listing.",
        showRetry: false,
        showBackToHome: true,
        showBrowseProperties: false,
        showTroubleshootingTips: false,
      };

    case PropertyErrorType.CORS_ERROR:
      return {
        ...baseDetails,
        title: "Access Blocked",
        description:
          "Unable to access the property data due to security restrictions.",
        showRetry: true,
        showBackToHome: true,
        showBrowseProperties: false,
        showTroubleshootingTips: false,
      };

    case PropertyErrorType.MALFORMED_DATA:
      return {
        ...baseDetails,
        title: "Data Error",
        description:
          "The property data is corrupted or in an unexpected format.",
        showRetry: true,
        showBackToHome: true,
        showBrowseProperties: true,
        showTroubleshootingTips: true,
      };

    case PropertyErrorType.UNKNOWN_ERROR:
    default:
      return {
        ...baseDetails,
        title: "Something Went Wrong",
        description:
          "We encountered an unexpected error while loading this property. Please try again.",
        showRetry: true,
        showBackToHome: true,
        showBrowseProperties: true,
        showTroubleshootingTips: false,
      };
  }
}

export function logPropertyError(error: unknown, context?: string): void {
  const propertyError =
    error instanceof PropertyError
      ? error
      : createPropertyError(error, context);

  // Only log detailed errors in development or when debugging is enabled
  if (process.env.NODE_ENV === "development" || process.env.DEBUG_ERRORS) {
    console.error("Property page error:", {
      type: propertyError.type,
      message: propertyError.message,
      context,
      stack: propertyError.stack,
      timestamp: new Date().toISOString(),
    });
  } else {
    // In production, log minimal info to console and send to monitoring service
    console.error(
      `Property error: ${propertyError.type} - ${propertyError.message}`
    );
  }

  // In production, send to error monitoring service
  if (process.env.NODE_ENV === "production" && typeof window !== "undefined") {
    // Example integrations (uncomment as needed):
    // Sentry
    // if (window.Sentry) {
    //   window.Sentry.captureException(propertyError, {
    //     tags: { context, errorType: propertyError.type },
    //   });
    // }
    // LogRocket
    // if (window.LogRocket) {
    //   window.LogRocket.captureException(propertyError);
    // }
    // Custom analytics
    // if (window.gtag) {
    //   window.gtag('event', 'exception', {
    //     description: `${propertyError.type}: ${propertyError.message}`,
    //     fatal: false,
    //   });
    // }
  }
}
