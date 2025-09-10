"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Hash, Loader2, Search, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  formatReferenceForDisplay,
  type ReferenceSearchResult,
} from "@/lib/reference-url-generator";
import {
  type UnifiedSearchResult,
} from "@/lib/unified-reference-search";
import {
  processProductionReferenceSearch,
  type ProductionReferenceResult,
} from "@/lib/production-reference-url-generator";
import {
  processUnitReferenceSearch,
  type UnitReferenceSearchResult,
} from "@/lib/unit-reference-url-generator";
import { buildCompressedUrl } from "@/lib/compressed-data-utils";

interface ReferenceSearchProps {
  className?: string;
  onSearch?: (reference: string, url: string) => void;
  onError?: (error: string) => void;
  placeholder?: string;
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
  // New unified search options
  enableUnifiedSearch?: boolean; // Enable property + unit search
  searchTimeout?: number; // Search timeout in ms
  includeAlternatives?: boolean; // Show alternative results
}

export function ReferenceSearch({
  className,
  onSearch,
  onError,
  placeholder = "Search by reference (e.g., 086983, UNIT12345)",
  size = "default",
  showLabel = false,
  // New unified search options with defaults
  enableUnifiedSearch = true, // Enable by default for new functionality
  searchTimeout = 8000, // 8 second timeout
  includeAlternatives: _includeAlternatives = false,
}: ReferenceSearchProps) {
  const [reference, setReference] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<string | null>(null); // Track what we're searching
  const [suggestion, setSuggestion] = useState<string | null>(null); // Show helpful suggestions
  const router = useRouter();

  const handleReferenceSearch = useCallback(
    async (ref: string) => {
      if (!ref.trim()) {
        setError("Please enter a reference number");
        return;
      }

      setError(null);
      setSuggestion(null);
      setIsLoading(true);
      setSearchType("properties and units");

      try {
        let result:
          | ReferenceSearchResult
          | UnifiedSearchResult
          | ProductionReferenceResult
          | UnitReferenceSearchResult;

        if (enableUnifiedSearch) {
          // First try the working production property search
          setSearchType("property");
          result = await processProductionReferenceSearch(ref, {
            useHybrid: false,
            maxRetries: 2,
            timeout: searchTimeout || 5000,
          });

          // If property search failed, try unit search
          if (!result.isValid) {
            setSearchType("unit");
            const unitResult = await processUnitReferenceSearch(ref);

            if (unitResult.isValid) {
              // Convert unit result to compatible ProductionReferenceResult format
              result = {
                reference: unitResult.reference,
                url: unitResult.url,
                isValid: unitResult.isValid,
                source: unitResult.source || "fallback",
                responseTime: unitResult.responseTime,
                error: unitResult.error,
                unitData: unitResult.unitData, // Include the unit data!
              } as ProductionReferenceResult;
              setSearchType("unit");
            }
            // If both failed, keep the property error as the primary error
          }
        } else {
          // Use the working production property search for backward compatibility
          result = await processProductionReferenceSearch(ref, {
            useHybrid: false,
            maxRetries: 2,
            timeout: searchTimeout || 5000,
          });
          setSearchType("property");
        }

        if (!result.isValid || result.error) {
          setError(result.error ?? "Reference not found");
          onError?.(result.error ?? "Reference not found");
          setIsLoading(false);
          return;
        }

        // Pass data via compressed URL parameters (SSR-compatible)
        const propertyData = (result as any).propertyData;
        const unitData = (result as any).unitData;
        let navigationUrl = result.url;

        console.log(`🔍 Checking data to compress:`, {
          hasPropertyData: !!propertyData,
          hasUnitData: !!unitData,
          searchType: searchType,
        });

        if (propertyData) {
          // Compress property data and build URL
          navigationUrl = buildCompressedUrl(result.url, propertyData);
          console.log(`🗜️ Built compressed URL for property data`);
        } else if (unitData) {
          // Compress unit data and build URL
          navigationUrl = buildCompressedUrl(result.url, unitData);
          console.log(`🗜️ Built compressed URL for unit data`);
        } else {
          console.warn(
            `⚠️ No data to compress - neither property nor unit data available`
          );
        }

        router.push(navigationUrl);

        // Enhanced logging for analytics/debugging
        const searchInfo = enableUnifiedSearch
          ? `${(result as UnifiedSearchResult).searchType} search: ${result.reference} -> ${result.url}`
          : `Property search: ${result.reference} -> ${result.url}`;
        console.log(searchInfo);

        // Call success callback if provided
        onSearch?.(result.reference, result.url);

        // Clear the input after successful search
        setReference("");
        setError(null);
        setSuggestion(null);
        setIsLoading(false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Search failed";
        setError(errorMessage);
        onError?.(errorMessage);
        setIsLoading(false);
        setSearchType(null);
      }
    },
    [
      router,
      onSearch,
      onError,
      enableUnifiedSearch,
      searchTimeout,
      searchType,
    ]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setReference(value);

    // Clear error and suggestions when user starts typing
    if (error && value.trim()) {
      setError(null);
    }
    if (suggestion && value.trim()) {
      setSuggestion(null);
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

  const inputSizeClass = {
    sm: "h-8 text-sm",
    default: "h-10 ",
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
          <Hash className="h-4 w-4 text-brand-primary" />
          <span className="text-sm font-medium text-brand-accent">
            Quick Find by Reference
          </span>
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder={placeholder}
            value={reference}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={cn(
              "pr-10 !text-sm",
              inputSizeClass,
              error && "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
            disabled={isLoading}
            aria-label={
              enableUnifiedSearch
                ? "Property or unit reference number"
                : "Property reference number"
            }
            aria-describedby={error ? "reference-error" : undefined}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
            ) : error ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : (
              <Search className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </div>

        <Button
          onClick={handleSearchClick}
          disabled={!reference.trim() || isLoading}
          className={cn(
            "bg-brand-primary hover:bg-brand-primary-dark text-white font-medium transition-colors duration-200",
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
          className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
          <span>
            {enableUnifiedSearch
              ? `Searching ${searchType || "properties and units"}...`
              : "Searching for property..."}
          </span>
        </div>
      )}

      {suggestion && !error && !isLoading && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{suggestion}</span>
        </div>
      )}

      {reference && !error && !isLoading && !suggestion && (
        <div className="text-xs text-muted-foreground">
          {enableUnifiedSearch
            ? `Will search properties and units for: ${formatReferenceForDisplay(reference)}`
            : `Will search for: ${formatReferenceForDisplay(reference)}`}
        </div>
      )}
    </div>
  );
}

// Export a simplified version for basic use cases
export function SimpleReferenceSearch({ className }: { className?: string }) {
  return (
    <ReferenceSearch
      className={className}
      size="sm"
      placeholder="Enter property or unit reference..."
      enableUnifiedSearch={true}
      onSearch={(ref, url) => {
        console.log(`Reference search: ${ref} -> ${url}`);
      }}
      onError={(error) => {
        console.error("Reference search error:", error);
      }}
    />
  );
}

// Export backward-compatible property-only search
export function PropertyReferenceSearch({ className }: { className?: string }) {
  return (
    <ReferenceSearch
      className={className}
      size="sm"
      placeholder="Enter property reference..."
      enableUnifiedSearch={false} // Property-only for backward compatibility
      onSearch={(ref, url) => {
        console.log(`Property search: ${ref} -> ${url}`);
      }}
      onError={(error) => {
        console.error("Property search error:", error);
      }}
    />
  );
}
