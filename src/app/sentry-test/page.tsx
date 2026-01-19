"use client";

import * as Sentry from "@sentry/nextjs";

export default function SentryTestPage() {
  const testError = () => {
    try {
      throw new Error("Test error from Sentry verification");
    } catch (error) {
      Sentry.captureException(error);
      alert("Error sent to Sentry! Check your Sentry dashboard.");
    }
  };

  const testLog = () => {
    const { logger } = Sentry;
    logger.info("Test log from Sentry verification", { test: true });
    alert("Log sent to Sentry! Check your Sentry dashboard.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold">Sentry Test Page</h1>
        <div className="flex gap-4">
          <button
            onClick={testError}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Test Error Capture
          </button>
          <button
            onClick={testLog}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Test Logger
          </button>
        </div>
      </div>
    </div>
  );
}
