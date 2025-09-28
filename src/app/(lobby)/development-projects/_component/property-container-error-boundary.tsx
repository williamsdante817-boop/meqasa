"use client";

import { Component, type ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

// Enhanced error boundary for production
export class PropertyContainerErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error; errorId?: string }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    // Enhanced error logging for production monitoring
    console.error("PropertyContainer Error:", {
      error: error.message,
      stack: error.stack,
      errorInfo,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <PropertyContainerError
            error={this.state.error!}
            errorId={this.state.errorId}
            retry={() =>
              this.setState({
                hasError: false,
                error: undefined,
                errorId: undefined,
              })
            }
          />
        )
      );
    }

    return this.props.children;
  }
}

// Enhanced error fallback component
export function PropertyContainerError({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error,
  errorId,
  retry,
}: {
  error: Error;
  errorId?: string;
  retry: () => void;
}) {
  return (
    <div
      className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center"
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="mb-4 h-16 w-16 text-red-500" aria-hidden="true" />
      <h2 className="mb-2 text-2xl font-bold text-gray-900">
        Something went wrong
      </h2>
      <p className="mb-4 max-w-md text-gray-600">
        We couldn&apos;t load the project details. Please try again or contact
        support if the problem persists.
      </p>
      {errorId && (
        <p className="mb-6 text-xs text-gray-400">Error ID: {errorId}</p>
      )}
      <button
        onClick={retry}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        aria-label="Retry loading project details"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}