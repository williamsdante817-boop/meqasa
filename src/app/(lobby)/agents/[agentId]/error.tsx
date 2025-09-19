"use client";

import Shell from "@/layouts/shell";
import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import { ErrorCard } from "@/components/common/error-card";
import { UserX } from "lucide-react";

interface AgentDetailsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AgentDetailsError({
  error,
  reset,
}: AgentDetailsErrorProps) {
  const isNotFound =
    error.message.toLowerCase().includes("not found") ||
    error.message.toLowerCase().includes("not available");

  return (
    <div>
      <Shell>
        <div className="mb-3 space-y-3">
          <Breadcrumbs
            className="pt-4"
            segments={[
              { title: "Home", href: "/" },
              { title: "Agents", href: "/agents" },
              { title: "Agent Details", href: "#" },
            ]}
          />
        </div>
      </Shell>

      <Shell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="w-full max-w-lg">
            <ErrorCard
              icon={UserX}
              title={
                isNotFound ? "Agent Not Found" : "Unable to Load Agent Details"
              }
              description={
                isNotFound
                  ? "The agent you're looking for doesn't exist or may have been removed from our platform."
                  : "We're having trouble loading this agent's information right now. This could be due to a network issue or temporary server problem."
              }
              reset={!isNotFound ? reset : undefined}
              retryLink="/agents"
              retryLinkText="Browse All Agents"
            />

            {/* Development Error Details */}
            {process.env.NODE_ENV === "development" && (
              <details className="mt-6 rounded-lg bg-gray-100 p-4">
                <summary className="mb-2 cursor-pointer font-medium text-gray-700">
                  Technical Details
                </summary>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Error:</strong> {error.message}
                  </p>
                  {error.digest && (
                    <p>
                      <strong>Digest:</strong> {error.digest}
                    </p>
                  )}
                  <p>
                    <strong>Stack:</strong>
                  </p>
                  <pre className="overflow-x-auto rounded bg-gray-200 p-2 text-xs">
                    {error.stack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      </Shell>
    </div>
  );
}
