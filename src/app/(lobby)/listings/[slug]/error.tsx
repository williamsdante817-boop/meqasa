"use client";
import { ErrorCard } from "@/components/common/error-card";
import Shell from "@/layouts/shell";
import React from "react";

export default function Error({
  error,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Check if it's a "listing not published" error
  const isListingNotPublished = error.message.includes("listing not published");

  return (
    <Shell>
      <div className="max-w-md mx-auto my-20">
        <ErrorCard
          title={
            isListingNotPublished
              ? "Listing Not Available"
              : "Property listing not found"
          }
          description={
            isListingNotPublished
              ? "This property listing is not currently published or available for viewing."
              : "The property listing may have expired or you may have been removed"
          }
          retryLink="/"
          retryLinkText="Go to Home"
        />
      </div>
    </Shell>
  );
}
