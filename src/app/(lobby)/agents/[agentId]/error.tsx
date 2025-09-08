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
        <div className="space-y-3 mb-3">
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
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="max-w-lg w-full">
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
              <details className="mt-6 bg-gray-100 rounded-lg p-4">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  Technical Details
                </summary>
                <div className="text-sm text-gray-600 space-y-2">
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
                  <pre className="text-xs bg-gray-200 p-2 rounded overflow-x-auto">
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
