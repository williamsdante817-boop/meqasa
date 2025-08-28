"use client";

import Link from "next/link";
import type { PropertyErrorDetails } from "@/lib/error-handling";

interface RetryButtonProps {
  onRetry: () => void;
}

function RetryButton({ onRetry }: RetryButtonProps) {
  return (
    <button
      onClick={onRetry}
      className="inline-flex items-center px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-colors whitespace-nowrap shrink-0"
    >
      <svg
        className="mr-2 h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      Try Again
    </button>
  );
}

interface PropertyErrorUIProps {
  errorDetails: PropertyErrorDetails;
  onRetry?: () => void;
}

export function PropertyErrorUI({
  errorDetails,
  onRetry,
}: PropertyErrorUIProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <svg
                className="h-12 w-12 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              {errorDetails.title}
            </h1>
            <p className="text-muted-foreground">{errorDetails.description}</p>
          </div>
        </div>

        <div className="flex flex-row gap-3  flex-nowrap justify-center">
          {errorDetails.showRetry && onRetry && (
            <RetryButton onRetry={onRetry} />
          )}

          {errorDetails.showBackToHome && (
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Back to Home
            </Link>
          )}

          {errorDetails.showBrowseProperties && (
            <Link
              href="/search/rent?q=ghana&page=1"
              className="inline-flex items-center px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Browse Properties
            </Link>
          )}
        </div>

        {errorDetails.showTroubleshootingTips && (
          <div className="mt-8 p-4 bg-muted rounded-lg text-left">
            <h3 className="font-medium text-sm mb-2">Troubleshooting Tips:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Check your internet connection</li>
              <li>• Refresh the page or try again</li>
              <li>• Wait a few moments if the server is busy</li>
              <li>• Contact support if the issue persists</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
