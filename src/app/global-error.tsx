"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { logger } from "@/lib/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
          <div className="w-full max-w-md space-y-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Application Error
              </h1>
              <p className="text-sm text-gray-600">
                A critical error occurred. Please refresh the page or contact
                support if the problem persists.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={reset}>Try again</Button>
              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
              >
                Go home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
