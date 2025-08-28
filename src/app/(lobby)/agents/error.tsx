"use client";

import { ErrorCard } from "@/components/common/error-card";
import Shell from "@/layouts/shell";
import { AlertTriangle } from "lucide-react";

interface AgentsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AgentsError({ error, reset }: AgentsErrorProps) {
  return (
    <Shell>
      <div className="py-8">
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="max-w-lg w-full">
            <ErrorCard
              icon={AlertTriangle}
              title="Unable to Load Agents"
              description="We're having trouble loading the agents list right now. This could be due to a network issue or temporary server problem."
              reset={reset}
              retryLink="/"
              retryLinkText="Go Home"
            />

            {/* Development Error Details */}
            {process.env.NODE_ENV === "development" && (
              <details className="mt-6 bg-gray-100 rounded-lg p-4">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  Technical Details
                </summary>
                <div className="text-sm text-gray-600 space-y-2">
                  <p><strong>Error:</strong> {error.message}</p>
                  {error.digest && (
                    <p><strong>Digest:</strong> {error.digest}</p>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
}