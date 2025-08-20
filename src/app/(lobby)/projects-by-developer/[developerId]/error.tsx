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
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="mb-6">
        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Something went wrong
      </h1>

      <p className="text-lg text-gray-600 mb-8 max-w-md">
        We encountered an error while loading the developer profile. This might
        be due to a temporary issue or the developer profile may no longer be
        available.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
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
