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
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCard className="max-w-md" />
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-brand-accent">
            Something went wrong!
          </h2>
          <p className="text-brand-muted">
            We encountered an error while loading the search results. Please try again.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={reset} variant="default">
              Try again
            </Button>
            <Button onClick={() => window.location.href = "/"} variant="outline">
              Go home
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
} 