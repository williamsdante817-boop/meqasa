"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCard } from "@/components/alert-card";
import Shell from "@/layouts/shell";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Root error:", error);
  }, [error]);

  return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <AlertCard className="max-w-md" />
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-brand-accent">
            Something went wrong!
          </h1>
          <p className="text-brand-muted max-w-md">
            We encountered an error while loading this page. Please try again or
            contact support if the problem persists.
          </p>
          <div className="flex gap-4 justify-center">
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
