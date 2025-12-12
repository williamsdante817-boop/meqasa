"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { UnitsResultCard } from "./units-result-card";
import { UnitsSearchSkeleton } from "./units-search-skeleton";
import { API_CONFIG, SEARCH_CONFIG } from "./constants";
import type { DeveloperUnit } from "./types";
import { useResultCount } from "./result-count-context";

interface UnitsSearchResultsProps {
  initialUnits: DeveloperUnit[];
  searchParams: Record<string, string | string[] | undefined>;
  onSearchUpdate?: (params: Record<string, string>) => void;
  initialHasMore?: boolean;
}

type FetchMode = "reset" | "append";

const getInitialOffset = (
  params: Record<string, string | string[] | undefined>
): number => {
  const raw = params.page;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = value ? Number.parseInt(value, 10) : NaN;
  if (!Number.isFinite(parsed) || parsed <= 1) {
    return 0;
  }
  return parsed - 1;
};

const buildUnitKey = (
  unit: DeveloperUnit,
  fallback: string | number
): string => {
  if (unit.unitid != null) {
    return String(unit.unitid);
  }
  if (unit.id != null) {
    return String(unit.id);
  }
  return `fallback-${fallback}`;
};

export function UnitsSearchResults({
  initialUnits,
  searchParams: initialSearchParams,
  onSearchUpdate: _onSearchUpdate,
  initialHasMore = true,
}: UnitsSearchResultsProps) {
  void _onSearchUpdate;

  const searchParams = useSearchParams();

  const [units, setUnits] = useState<DeveloperUnit[]>(initialUnits);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(
    initialHasMore && initialUnits.length > 0
  );
  const [mounted, setMounted] = useState(false);

  const currentOffsetRef = useRef<number>(getInitialOffset(initialSearchParams));
  const seenUnitKeysRef = useRef<Set<string>>(
    new Set(
      initialUnits.map((unit, index) => buildUnitKey(unit, `initial-${index}`))
    )
  );
  const { setCount } = useResultCount();

  const buildApiQuery = useCallback(
    (offset: number) => {
      const query = new URLSearchParams();
      query.set("app", API_CONFIG.APP_ID);
      query.set("offset", String(offset));

      const terms = searchParams.get("terms") || SEARCH_CONFIG.DEFAULT_TERMS;
      query.set("terms", terms);

      const unittype = searchParams.get("unittype");
      if (unittype && unittype !== "all") {
        query.set("unittype", unittype);
      }

      const address = searchParams.get("address");
      if (address) {
        query.set("address", address);
      }

      const maxprice = searchParams.get("maxprice");
      if (maxprice) {
        const parsed = Number.parseInt(maxprice, 10);
        if (!Number.isNaN(parsed) && parsed > 0) {
          query.set("maxprice", String(parsed));
        }
      }

      const beds = searchParams.get("beds");
      if (beds && beds !== "0") {
        const parsed = Number.parseInt(beds, 10);
        if (!Number.isNaN(parsed) && parsed > 0) {
          query.set("beds", String(parsed));
        }
      }

      const baths = searchParams.get("baths");
      if (baths && baths !== "0") {
        const parsed = Number.parseInt(baths, 10);
        if (!Number.isNaN(parsed) && parsed > 0) {
          query.set("baths", String(parsed));
        }
      }

      return query;
    },
    [searchParams]
  );

  const applyFetchResult = useCallback(
    (fetchedUnits: DeveloperUnit[], mode: FetchMode, offset: number) => {
      if (mode === "reset") {
        const nextSeen = new Set<string>();
        fetchedUnits.forEach((unit, index) => {
          nextSeen.add(buildUnitKey(unit, `reset-${offset}-${index}`));
        });
        seenUnitKeysRef.current = nextSeen;
        currentOffsetRef.current = offset;
        setUnits(fetchedUnits);
        setHasMore(fetchedUnits.length > 0);
        return;
      }

      const seenKeys = seenUnitKeysRef.current;
      const uniqueUnits: DeveloperUnit[] = [];

      fetchedUnits.forEach((unit, index) => {
        const key = buildUnitKey(unit, `append-${offset}-${index}`);
        if (seenKeys.has(key)) {
          return;
        }
        seenKeys.add(key);
        uniqueUnits.push(unit);
      });

      if (uniqueUnits.length > 0) {
        currentOffsetRef.current = offset;
        setUnits((prev) => [...prev, ...uniqueUnits]);
      } else {
        setHasMore(false);
      }

      if (uniqueUnits.length === 0 || fetchedUnits.length === 0) {
        setHasMore(false);
      }
    },
    []
  );

  const fetchUnits = useCallback(
    async (offset: number, mode: FetchMode) => {
      try {
        setIsLoading(true);
        setError(null);

        const params = buildApiQuery(offset);
        const response = await fetch(
          `/api/developer-units?${params.toString()}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
          }
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const payload = await response.json();
        const fetchedUnits = Array.isArray(payload)
          ? (payload as DeveloperUnit[])
          : [];

        applyFetchResult(fetchedUnits, mode, offset);
      } catch (err) {
        console.error(err);
        setError("Failed to load units. Please try again.");
        if (mode === "reset") {
          setUnits([]);
          setHasMore(false);
          seenUnitKeysRef.current = new Set();
          currentOffsetRef.current = 0;
        }
      } finally {
        setIsLoading(false);
      }
    },
    [applyFetchResult, buildApiQuery]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const prevSearchParamsRef = useRef<string>("");

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const currentParams = searchParams.toString();
    
    // Only fetch if params actually changed from previous render
    if (currentParams !== prevSearchParamsRef.current && prevSearchParamsRef.current !== "") {
      prevSearchParamsRef.current = currentParams;
      seenUnitKeysRef.current = new Set();
      currentOffsetRef.current = 0;
      void fetchUnits(0, "reset");
    } else if (prevSearchParamsRef.current === "") {
      // Initialize on first mount
      prevSearchParamsRef.current = currentParams;
    }
  }, [mounted, searchParams, fetchUnits]);

  useEffect(() => {
    setUnits(initialUnits);
    setError(null);
    setHasMore(initialHasMore && initialUnits.length > 0);
    currentOffsetRef.current = getInitialOffset(initialSearchParams);
    seenUnitKeysRef.current = new Set(
      initialUnits.map((unit, index) => buildUnitKey(unit, `initial-${index}`))
    );
  }, [initialHasMore, initialSearchParams, initialUnits]);

  useEffect(() => {
    setCount(units.length);
  }, [setCount, units.length]);

  const handleLoadMore = useCallback(() => {
    if (isLoading || !hasMore) {
      return;
    }
    const nextOffset = currentOffsetRef.current + 1;
    void fetchUnits(nextOffset, "append");
  }, [fetchUnits, hasMore, isLoading]);

  if (isLoading && units.length === 0) {
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
          <Button onClick={() => void fetchUnits(0, "reset")}>Try Again</Button>
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
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {units.map((unit, index) => (
          <UnitsResultCard
            key={buildUnitKey(unit, `render-${index}`)}
            unit={unit}
            priority={index < SEARCH_CONFIG.PRIORITY_IMAGES_COUNT}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 mb-8 text-center">
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            size="lg"
            className="min-w-[160px]"
          >
            {isLoading ? (
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
