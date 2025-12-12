"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface SearchErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function SearchError({
  title = "Something went wrong",
  message = "We encountered an error while searching for properties. Please try again.",
  onRetry,
}: SearchErrorProps) {
  return (
    <div className="flex w-full max-w-2xl flex-col items-center justify-center rounded-lg border border-red-100 bg-red-50 px-8 py-12 text-center">
      <div className="mb-6 rounded-full bg-red-100 p-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="mb-3 text-xl font-semibold text-red-900">{title}</h3>
      <p className="mb-8 max-w-md text-base text-red-700">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="border-red-200 bg-white text-red-700 hover:bg-red-50 hover:text-red-800"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}
