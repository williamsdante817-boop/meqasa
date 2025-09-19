"use client";

import { useState } from "react";

interface SearchDebugInfoProps {
  mode: "enhanced" | "original";
  searchData?: {
    isLoading?: boolean;
    isFetching?: boolean;
    isStale?: boolean;
    error?: unknown;
    cacheHit?: boolean;
    resultsCount?: number;
  };
}

/**
 * Debug component to help test search functionality in development
 * Shows current mode and React Query state information
 */
export function SearchDebugInfo({ mode, searchData }: SearchDebugInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 max-w-xs rounded-lg bg-gray-900 p-3 text-xs text-white shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-bold">
          🔧 Search Mode: {mode === "enhanced" ? "✨ Enhanced" : "📊 Original"}
        </span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white"
        >
          {isExpanded ? "−" : "+"}
        </button>
      </div>

      {mode === "enhanced" && isExpanded && searchData && (
        <div className="space-y-1 border-t border-gray-700 pt-2">
          <div>Loading: {searchData.isLoading ? "🔄" : "✅"}</div>
          <div>Fetching: {searchData.isFetching ? "🔄" : "✅"}</div>
          <div>Stale: {searchData.isStale ? "⚠️" : "✅"}</div>
          <div>Error: {searchData.error ? "❌" : "✅"}</div>
          <div>Cache Hit: {searchData.cacheHit ? "⚡" : "🔄"}</div>
          <div>Results: {searchData.resultsCount ?? 0}</div>
        </div>
      )}

      {isExpanded && (
        <div className="mt-2 border-t border-gray-700 pt-2 text-gray-400">
          <div>
            Screen:{" "}
            {typeof window !== "undefined" && window.innerWidth < 768
              ? "📱 Mobile"
              : "🖥️ Desktop"}
          </div>
          <div>
            Viewport:{" "}
            {typeof window !== "undefined" ? `${window.innerWidth}px` : "SSR"}
          </div>
        </div>
      )}
    </div>
  );
}
