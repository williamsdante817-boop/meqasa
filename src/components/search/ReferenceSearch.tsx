"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Hash, Loader2, Search, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { 
  processReferenceSearch, 
  formatReferenceForDisplay,
  type ReferenceSearchResult 
} from "@/lib/reference-url-generator";

interface ReferenceSearchProps {
  className?: string;
  onSearch?: (reference: string, url: string) => void;
  onError?: (error: string) => void;
  placeholder?: string;
  size?: "sm" | "default" | "lg";
  showLabel?: boolean;
}

export function ReferenceSearch({
  className,
  onSearch,
  onError,
  placeholder = "Search by reference (e.g., 086983)",
  size = "default",
  showLabel = false,
}: ReferenceSearchProps) {
  const [reference, setReference] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleReferenceSearch = useCallback(async (ref: string) => {
    if (!ref.trim()) {
      setError("Please enter a reference number");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Process the reference using API-first approach
      const result: ReferenceSearchResult = await processReferenceSearch(ref);

      if (!result.isValid || result.error) {
        setError(result.error ?? "Invalid reference number");
        onError?.(result.error ?? "Invalid reference number");
        setIsLoading(false);
        return;
      }

      // Navigate immediately after getting the accurate URL
      router.push(result.url);
      
      // Log the search for analytics/debugging
      console.log(`Reference search: ${result.reference} -> ${result.url}`);
      
      // Call success callback if provided
      onSearch?.(result.reference, result.url);
      
      // Clear the input after successful search
      setReference("");
      setError(null);
      setIsLoading(false);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Search failed";
      setError(errorMessage);
      onError?.(errorMessage);
      setIsLoading(false);
    }
  }, [router, onSearch, onError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setReference(value);
    
    // Clear error when user starts typing
    if (error && value.trim()) {
      setError(null);
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
              "pr-10",
              inputSizeClass,
              error && "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
            disabled={isLoading}
            aria-label="Property reference number"
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
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Find"
          )}
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
          <span>Searching for property...</span>
        </div>
      )}

      {reference && !error && !isLoading && (
        <div className="text-xs text-muted-foreground">
          Will search for: {formatReferenceForDisplay(reference)}
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
      placeholder="Enter property reference..."
      onSearch={(ref, url) => {
        console.log(`Reference search: ${ref} -> ${url}`);
      }}
      onError={(error) => {
        console.error("Reference search error:", error);
      }}
    />
  );
}