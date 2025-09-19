"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Developer profile page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
      <div className="mb-6">
        <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
      </div>

      <h1 className="mb-4 text-3xl font-bold text-gray-900">
        Something went wrong
      </h1>

      <p className="mb-8 max-w-md text-lg text-gray-600">
        We encountered an error while loading the developer profile. This might
        be due to a temporary issue or the developer profile may no longer be
        available.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          onClick={reset}
          variant="default"
          size="lg"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="flex items-center gap-2"
        >
          <Link href="/developers">
            <Home className="h-4 w-4" />
            Back to Developers
          </Link>
        </Button>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>If this problem persists, please contact our support team.</p>
        <p className="mt-2">Error ID: {error.digest ?? "Unknown"}</p>
      </div>
    </div>
  );
}
