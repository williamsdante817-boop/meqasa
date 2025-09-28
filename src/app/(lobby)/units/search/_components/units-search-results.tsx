"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UnitsResultCard } from "./units-result-card";
import { UnitsSearchSkeleton } from "./units-search-skeleton";
import { Home, AlertTriangle } from "lucide-react";

interface DeveloperUnit {
  id: string;
  unitid?: number;
  title: string;
  price: string;
  location: string;
  address?: string;
  city?: string;
  bedrooms: number;
  beds?: number;
  bathrooms: number;
  baths?: number;
  unittype: string;
  unittypename?: string;
  terms: string;
  image?: string;
  coverphoto?: string;
  developer?: string;
  companyname?: string;
  name?: string;
  area?: string;
  floorarea?: number;
  featured?: boolean;
  description?: string;
  [key: string]: any;
}

interface UnitsSearchResultsProps {
  initialUnits: DeveloperUnit[];
  searchParams: Record<string, string | string[] | undefined>;
  onSearchUpdate?: (params: Record<string, string>) => void; // Optional prop for compatibility
}

export function UnitsSearchResults({
  initialUnits,
  searchParams: initialSearchParams,
  onSearchUpdate: _onSearchUpdate,
}: UnitsSearchResultsProps) {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [units, setUnits] = useState<DeveloperUnit[]>(initialUnits);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchUnits = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        setError(null);

        // Build API parameters from current search params
        const apiParams: Record<string, string | number> = {
          app: "vercel",
        };

        // Map search params to API params
        const terms = searchParams.get("terms") || "sale";
        apiParams.terms = terms;

        const unittype = searchParams.get("unittype");
        if (unittype && unittype !== "all") {
          apiParams.unittype = unittype;
        }

        const address = searchParams.get("address");
        if (address) {
          apiParams.address = address;
        }

        const maxprice = searchParams.get("maxprice");
        if (maxprice) {
          const price = parseInt(maxprice);
          if (!isNaN(price) && price > 0) {
            apiParams.maxprice = price;
          }
        }

        const beds = searchParams.get("beds");
        if (beds && beds !== "0") {
          const bedsNum = parseInt(beds);
          if (!isNaN(bedsNum) && bedsNum > 0) {
            apiParams.beds = bedsNum;
          }
        }

        const baths = searchParams.get("baths");
        if (baths && baths !== "0") {
          const bathsNum = parseInt(baths);
          if (!isNaN(bathsNum) && bathsNum > 0) {
            apiParams.baths = bathsNum;
          }
        }

        const response = await fetch("/api/developer-units", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiParams),
        });

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }

        const fetchedUnits = (await response.json()) as DeveloperUnit[];

        if (reset) {
          setUnits(fetchedUnits);
        } else {
          setUnits((prev) => [...prev, ...fetchedUnits]);
        }

        // For now, disable load more since the API doesn't support pagination
        setHasMore(false);
      } catch {
        setError("Failed to load units. Please try again.");
        if (reset) {
          setUnits([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [searchParams]
  );

  // Ensure component is mounted before running client-side effects
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync component state with new initial data when it changes
  useEffect(() => {
    setUnits(initialUnits);
    setError(null);
  }, [initialUnits]);

  // Track when search parameters change (simplified and more reliable)
  useEffect(() => {
    // Only run on client side after component is mounted
    if (!mounted) return;

    // Build current search params string (preserve all params including empty ones)
    const currentParams = searchParams.toString();

    // Build initial search params string for comparison
    const initialParams = new URLSearchParams(
      Object.entries(initialSearchParams).reduce(
        (acc, [key, value]) => {
          const stringValue = Array.isArray(value) ? value[0] : value;
          acc[key] = stringValue || ""; // Include empty values
          return acc;
        },
        {} as Record<string, string>
      )
    ).toString();

    // Only fetch if search params have actually changed
    if (currentParams !== initialParams) {
      void fetchUnits(true);
    } else {
    }
  }, [mounted, searchParams, initialSearchParams, fetchUnits]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      void fetchUnits(false);
    }
  };

  if (loading && units.length === 0) {
    return <UnitsSearchSkeleton />;
  }

  if (error && units.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-brand-accent text-xl font-semibold">
            Error Loading Units
          </h3>
          <p className="text-brand-muted mx-auto max-w-md">{error}</p>
          <Button onClick={() => void fetchUnits(true)}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (units.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Home className="h-16 w-16 text-gray-300" />
          </div>
          <h3 className="text-brand-accent text-xl font-semibold">
            No units found
          </h3>
          <p className="text-brand-muted mx-auto max-w-md">
            We couldn&apos;t find any developer units matching your search
            criteria. Try adjusting your filters or check back later for new
            listings.
          </p>
          <Button onClick={() => (window.location.href = "/units/search")}>
            Reset Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results Grid */}
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {units.map((unit, index) => (
          <UnitsResultCard
            key={`${unit.unitid || unit.id}-${index}`}
            unit={unit}
            priority={index < 8} // Prioritize first 8 images for LCP
          />
        ))}
      </div>

      {/* Load More Section */}
      {hasMore && (
        <div className="mt-12 mb-8 text-center">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            size="lg"
            className="min-w-[160px]"
          >
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                Loading...
              </>
            ) : (
              "Load More Units"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
