"use client";

import { useEffect } from "react";
import Shell from "@/layouts/shell";
import { getErrorDetails, logPropertyError } from "@/lib/error-handling";
import { PropertyErrorUI } from "@/components/error-ui";

interface PropertyErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PropertyError({ error, reset }: PropertyErrorProps) {
  useEffect(() => {
    logPropertyError(error, "error_boundary");
  }, [error]);

  const errorDetails = getErrorDetails(error);

  return (
    <main>
      <Shell>
        <PropertyErrorUI errorDetails={errorDetails} onRetry={reset} />
      </Shell>
    </main>
  );
}
