"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { UnitsResultCard } from "./units-result-card";
import { SEARCH_CONFIG } from "./constants";
import type { DeveloperUnit } from "./types";
import { useResultCount } from "./result-count-context";

interface UnitsSearchResultsProps {
  initialUnits: DeveloperUnit[];
  searchParams: Record<string, string | string[] | undefined>;
  onSearchUpdate?: (params: Record<string, string>) => void;
  initialHasMore?: boolean;
}

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

  const router = useRouter();
  const searchParams = useSearchParams();
  const { setCount } = useResultCount();

  useEffect(() => {
    setCount(initialUnits.length);
  }, [setCount, initialUnits.length]);

  const handleLoadMore = () => {
    const currentPage = getInitialOffset(initialSearchParams) + 1;
    const nextPage = currentPage + 1;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(nextPage));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  if (initialUnits.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Home />
          </EmptyMedia>
          <EmptyTitle>No units found</EmptyTitle>
          <EmptyDescription>
            We couldn&apos;t find any developer units matching your search
            criteria. Try adjusting your filters or check back later for new
            listings.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => (window.location.href = "/units/search")} size="lg" variant="brand-primary" className="w-full sm:w-auto">
            Reset Search
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {initialUnits.map((unit, index) => (
          <UnitsResultCard
            key={buildUnitKey(unit, `render-${index}`)}
            unit={unit}
            priority={index < SEARCH_CONFIG.PRIORITY_IMAGES_COUNT}
          />
        ))}
      </div>

      {initialHasMore && (
        <div className="mt-12 mb-8 text-center">
          <Button
            onClick={handleLoadMore}
            size="lg"
            className="min-w-[160px]"
          >
            Load More Units
          </Button>
        </div>
      )}
    </div>
  );
}
