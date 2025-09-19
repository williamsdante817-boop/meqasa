"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCard } from "@/components/common/alert-card";
import Shell from "@/layouts/shell";

export default function DevelopersError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Developers page error:", error);
  }, [error]);

  return (
    <Shell>
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-8">
        <AlertCard className="max-w-md" />
        <div className="space-y-4 text-center">
          <h1 className="text-brand-accent text-2xl font-bold">
            Unable to Load Developers
          </h1>
          <p className="text-brand-muted max-w-md">
            We encountered an error while loading the developers list. This
            might be due to a temporary issue with our servers.
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
