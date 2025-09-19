"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Shell from "@/layouts/shell";
import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function UnitsSearchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Error is already handled by Next.js error boundary
  }, [error]);

  const segments = [
    { title: "Home", href: "/", key: "home" },
    {
      title: "Newly Built Units",
      href: "/newly-built-units",
      key: "newly-built-units",
    },
    { title: "Search Results", href: "#", key: "search-results" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Shell className="py-6 md:py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs segments={segments} className="mb-6" />

        {/* Error Content */}
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mx-auto max-w-md space-y-6">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-3">
              <h1 className="text-brand-accent text-2xl font-bold">
                Oops! Something went wrong
              </h1>
              <p className="text-brand-muted">
                We encountered an error while loading the developer units
                search. This might be a temporary issue.
              </p>
              {error.message && (
                <details className="mt-4 text-left">
                  <summary className="text-brand-muted hover:text-brand-accent cursor-pointer text-sm">
                    Technical details
                  </summary>
                  <div className="mt-2 rounded bg-gray-100 p-3 font-mono text-sm text-gray-700">
                    {error.message}
                  </div>
                </details>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={reset} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/projects")}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Back to Projects
              </Button>
            </div>

            {/* Help Text */}
            <p className="text-brand-muted text-sm">
              If this problem persists, please try refreshing the page or check
              your internet connection.
            </p>
          </div>
        </div>
      </Shell>
    </div>
  );
}
