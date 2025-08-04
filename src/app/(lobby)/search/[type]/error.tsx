"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Search page error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-6">
          We encountered an error while loading the search results. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="default">
            Try again
          </Button>
          <Button onClick={() => window.history.back()} variant="outline">
            Go back
          </Button>
        </div>
      </Card>
    </div>
  );
} 