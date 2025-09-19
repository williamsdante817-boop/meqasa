"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCard } from "@/components/common/alert-card";
import Shell from "@/layouts/shell";

export default function SearchError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Search page error:", error);
  }, [error]);

  return (
    <Shell>
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <AlertCard className="max-w-md" />
        <div className="space-y-4 text-center">
          <h2 className="text-brand-accent text-xl font-semibold">
            Something went wrong!
          </h2>
          <p className="text-brand-muted">
            We encountered an error while loading the search results. Please try
            again.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={reset} variant="default">
              Try again
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
            >
              Go home
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
