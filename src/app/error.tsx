"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Shell from "@/layouts/shell";
import { logError } from "@/lib/logger";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    // Log error with context for monitoring
    logError("Root error boundary triggered", error, {
      component: "RootErrorBoundary",
      digest: error.digest,
      message: error.message,
      stack: error.stack,
    });
  }, [error]);

  const handleReset = () => {
    setIsResetting(true);
    try {
      reset();
    } catch (resetError) {
      logError("Error during reset", resetError, {
        component: "RootErrorBoundary",
      });
      window.location.href = "/";
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Shell>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-8 w-8 text-red-600" aria-hidden="true" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-brand-accent text-2xl font-bold sm:text-3xl">
              Oops! Something went wrong
            </h1>
            <p className="text-brand-muted text-sm sm:text-base">
              We apologize for the inconvenience. An unexpected error occurred while loading this page.
            </p>
          </div>

          {process.env.NODE_ENV === "development" && error.message && (
            <div className="rounded-lg bg-gray-50 p-4 text-left">
              <p className="text-xs font-mono text-gray-600 break-words">
                {error.message}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-center">
            <Button 
              onClick={handleReset} 
              disabled={isResetting}
              className="w-full sm:w-auto"
            >
              {isResetting ? "Retrying..." : "Try again"}
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Go to homepage
            </Button>
          </div>

          <p className="text-brand-muted text-xs pt-4">
            If this problem persists, please contact our support team.
          </p>
        </div>
      </div>
    </Shell>
  );
}
