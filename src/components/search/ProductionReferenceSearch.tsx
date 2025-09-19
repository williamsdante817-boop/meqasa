"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Hash,
  Loader2,
  Search,
  AlertCircle,
  Zap,
  TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  processProductionReferenceSearch,
  hybridReferenceNavigation,
  formatReferenceForDisplay,
  getReferenceSearchMetrics,
  type ProductionReferenceResult,
} from "@/lib/production-reference-url-generator";

interface ProductionReferenceSearchProps {
  className?: string;
  onSearch?: (reference: string, url: string, metrics: unknown) => void;
  onError?: (error: string) => void;
  placeholder?: string;
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
  useHybridNavigation?: boolean;
  showPerformanceInfo?: boolean;
}

export function ProductionReferenceSearch({
  className,
  onSearch,
  onError,
  placeholder = "Search by reference (e.g., 086983)",
  size = "default",
  showLabel = false,
  useHybridNavigation = true,
  showPerformanceInfo = false,
}: ProductionReferenceSearchProps) {
  const [reference, setReference] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResult, setSearchResult] =
    useState<ProductionReferenceResult | null>(null);
  const [metrics, setMetrics] = useState<ReturnType<
    typeof getReferenceSearchMetrics
  > | null>(null);

  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const searchStartTime = useRef<number | null>(null);

  // Update metrics periodically
  useEffect(() => {
    if (showPerformanceInfo) {
      const interval = setInterval(() => {
        setMetrics(getReferenceSearchMetrics());
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [showPerformanceInfo]);

  const handleReferenceSearch = useCallback(
    async (ref: string) => {
      if (!ref.trim()) {
        setError("Please enter a reference number");
        return;
      }

      setError(null);
      setIsLoading(true);
      setSearchResult(null);
      searchStartTime.current = performance.now();

      try {
        if (useHybridNavigation) {
          // Hybrid approach: instant navigation + background enhancement
          await hybridReferenceNavigation(
            ref,
            (url, source) => {
              if (source === "fallback") {
                // Instant navigation with fallback
                router.push(url);
                setIsLoading(false);
              } else if (source === "enhanced") {
                // Background enhancement - replace current URL
                router.replace(url);
              }
            },
            (errorMsg) => {
              setError(errorMsg);
              onError?.(errorMsg);
              setIsLoading(false);
            }
          );

          // Get final metrics
          const finalMetrics = getReferenceSearchMetrics();
          const formattedRef = formatReferenceForDisplay(ref);

          onSearch?.(formattedRef, "", finalMetrics);
          setReference("");
          setError(null);
        } else {
          // Standard API-first approach with production optimizations
          const result = await processProductionReferenceSearch(ref, {
            useHybrid: false,
            maxRetries: 2,
            timeout: 5000,
          });

          if (!result.isValid || result.error) {
            setError(result.error ?? "Invalid reference number");
            onError?.(result.error ?? "Invalid reference number");
            setIsLoading(false);
            return;
          }

          // Navigate to the result URL
          router.push(result.url);

          // Update state and metrics
          setSearchResult(result);
          const currentMetrics = getReferenceSearchMetrics();
          setMetrics(currentMetrics);

          // Log analytics
          console.log(
            `[Production Reference Search] ${result.reference} -> ${result.url} (${result.source}, ${result.responseTime?.toFixed(0)}ms)`
          );

          onSearch?.(result.reference, result.url, currentMetrics);
          setReference("");
          setError(null);
          setIsLoading(false);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Search failed";
        setError(errorMessage);
        onError?.(errorMessage);
        setIsLoading(false);
      }
    },
    [router, onSearch, onError, useHybridNavigation]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setReference(value);

    // Clear error when user starts typing
    if (error && value.trim()) {
      setError(null);
    }

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce validation
    if (value.trim()) {
      debounceRef.current = setTimeout(() => {
        const cleanRef = value.trim().replace(/[^a-zA-Z0-9]/g, "");
        if (cleanRef.length > 20) {
          setError("Reference too long (max 20 characters)");
        } else if (cleanRef && !/^[a-zA-Z0-9]+$/.test(cleanRef)) {
          setError("Only letters and numbers allowed");
        }
      }, 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void handleReferenceSearch(reference);
    }
  };

  const handleSearchClick = () => {
    void handleReferenceSearch(reference);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const inputSizeClass = {
    sm: "h-8 text-sm",
    default: "h-10",
    lg: "h-12 text-lg",
  }[size];

  const buttonSizeClass = {
    sm: "h-8 px-2 text-sm",
    default: "h-10 px-4",
    lg: "h-12 px-6 text-lg",
  }[size];

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex items-center gap-2">
          <Hash className="text-brand-primary h-4 w-4" />
          <span className="text-brand-accent text-sm font-medium">
            Quick Find by Reference
          </span>
          {useHybridNavigation && (
            <div className="flex items-center gap-1 rounded bg-green-50 px-2 py-1 text-xs text-green-600">
              <Zap className="h-3 w-3" />
              Instant
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder={placeholder}
            value={reference}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={cn(
              "pr-10 placeholder:!text-sm",
              inputSizeClass,
              error && "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
            disabled={isLoading}
            aria-label="Property reference number"
            aria-describedby={error ? "reference-error" : undefined}
            maxLength={25}
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
            {isLoading ? (
              <Loader2 className="text-brand-primary h-4 w-4 animate-spin" />
            ) : error ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : (
              <Search className="text-muted-foreground h-4 w-4" />
            )}
          </div>
        </div>

        <Button
          onClick={handleSearchClick}
          disabled={!reference.trim() || isLoading}
          className={cn(
            "bg-brand-primary hover:bg-brand-primary-dark font-medium text-white transition-colors duration-200",
            buttonSizeClass
          )}
          aria-label="Search for property"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Find"}
        </Button>
      </div>

      {error && (
        <div
          id="reference-error"
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-600">
          <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />
          <span>
            {useHybridNavigation
              ? "Navigating instantly..."
              : "Searching for property..."}
          </span>
        </div>
      )}

      {reference && !error && !isLoading && (
        <div className="text-muted-foreground text-xs">
          Will search for: {formatReferenceForDisplay(reference)}
        </div>
      )}

      {/* Performance metrics display (dev/debug mode) */}
      {showPerformanceInfo && metrics && (
        <div className="mt-3 space-y-1 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs">
          <div className="flex items-center gap-1 font-medium text-gray-700">
            <TrendingUp className="h-3 w-3" />
            Performance Metrics
          </div>
          <div className="grid grid-cols-2 gap-2 text-gray-600">
            <div>Cache Hit Rate: {metrics.cacheHitRate}</div>
            <div>Total Requests: {metrics.totalRequests}</div>
            <div>Cache Size: {metrics.cacheSize}</div>
            <div>Avg Response: {metrics.avgResponseTime?.toFixed(0)}ms</div>
            <div>Deduplicated: {metrics.deduplicatedRequests}</div>
            <div>Errors: {metrics.errors}</div>
          </div>
          {searchResult && (
            <div className="mt-2 border-t border-gray-300 pt-1">
              <div>
                Last Search: {searchResult.source} (
                {searchResult.responseTime?.toFixed(0)}ms)
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Export simplified version for basic use cases
export function SimpleProductionReferenceSearch({
  className,
  showPerformanceInfo = false,
}: {
  className?: string;
  showPerformanceInfo?: boolean;
}) {
  return (
    <ProductionReferenceSearch
      className={className}
      size="sm"
      placeholder="Enter property reference..."
      useHybridNavigation={true}
      showPerformanceInfo={showPerformanceInfo}
      onSearch={(ref, url, metrics) => {
        console.log(`[Production Reference Search] ${ref} -> ${url}`, metrics);
      }}
      onError={(error) => {
        console.error("[Production Reference Search Error]:", error);
      }}
    />
  );
}
