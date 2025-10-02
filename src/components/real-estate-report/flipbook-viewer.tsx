"use client";

import { useEffect, useRef, useState } from "react";

interface FlipbookViewerProps {
  pdfUrl?: string;
  fallbackUrl?: string;
}

export default function FlipbookViewer({
  pdfUrl: _pdfUrl = "/real-estate-report-2020.pdf",
  fallbackUrl = "/real-estate-report-2020.pdf",
}: FlipbookViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError] = useState(false);

  useEffect(() => {
    // Simulate flipbook loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = fallbackUrl;
    link.download = "Meqasa-Real-Estate-Report-2020.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (hasError) {
    return (
      <div className="bg-brand-gray flex h-full min-h-[600px] items-center justify-center rounded-lg">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-red-100 p-4">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-brand-accent mb-2 text-xl font-semibold">
            Unable to Load Report
          </h3>
          <p className="text-brand-muted mb-4">
            There was an error loading the interactive report viewer.
          </p>
          <button
            onClick={handleDownload}
            className="bg-brand-primary hover:bg-brand-primary-dark rounded-md px-6 py-2 font-medium text-white transition-colors"
          >
            Download PDF Instead
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-brand-gray flex h-full min-h-[600px] items-center justify-center rounded-lg">
        <div className="text-center">
          <div className="mb-4">
            <div className="border-brand-primary mx-auto h-16 w-16 animate-spin rounded-full border-4 border-t-transparent"></div>
          </div>
          <h3 className="text-brand-accent mb-2 text-xl font-semibold">
            Loading Real Estate Report 2020
          </h3>
          <p className="text-brand-muted">
            Please wait while the interactive report loads...
          </p>

          {/* Progress indicator */}
          <div className="mx-auto mt-4 w-64">
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="bg-brand-primary h-full animate-pulse rounded-full"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // This would be replaced with actual flipbook integration
  // For now, we'll show a placeholder that represents the flipbook
  return (
    <div
      ref={containerRef}
      className="h-full min-h-[600px] overflow-hidden rounded-lg bg-white shadow-lg"
    >
      {/* Flipbook Container */}
      <div className="relative h-full">
        {/* Simulated flipbook pages */}
        <div className="flex h-full">
          {/* Left page */}
          <div className="flex w-1/2 items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-8">
            <div className="text-center">
              <div className="mb-4 text-6xl">📊</div>
              <h3 className="text-brand-accent mb-2 text-xl font-bold">
                Market Analysis
              </h3>
              <p className="text-brand-muted">
                Comprehensive insights into Ghana&apos;s real estate market
                during COVID-19
              </p>
            </div>
          </div>

          {/* Right page */}
          <div className="flex w-1/2 items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-8">
            <div className="text-center">
              <div className="mb-4 text-6xl">🏠</div>
              <h3 className="text-brand-accent mb-2 text-xl font-bold">
                Property Trends
              </h3>
              <p className="text-brand-muted">
                Emerging markets and investment opportunities across Ghana
              </p>
            </div>
          </div>
        </div>

        {/* Flipbook controls */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform items-center gap-4 rounded-full bg-white/90 px-6 py-3 shadow-lg backdrop-blur-sm">
          <button className="rounded-full p-2 transition-colors hover:bg-gray-100">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="text-brand-muted text-sm font-medium">
            Page 1 of 24
          </span>
          <button className="rounded-full p-2 transition-colors hover:bg-gray-100">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Fullscreen and download buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-colors hover:bg-white">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          </button>
          <button
            onClick={handleDownload}
            className="rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
