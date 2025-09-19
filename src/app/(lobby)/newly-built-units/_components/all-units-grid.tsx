"use client";

import { useUnitsData } from "./use-units-data";
import { UnitsGrid } from "./units-grid";
import { UnitsGridSkeleton } from "./units-grid-skeleton";
import { UnitsErrorState } from "./units-error-state";
import { UnitsEmptyState } from "./units-empty-state";

interface AllUnitsGridProps {
  searchParams: Record<string, string | string[] | undefined>;
  sectionType?: string;
}

export default function AllUnitsGrid({
  searchParams,
  sectionType,
}: AllUnitsGridProps) {
  const { units, loading, error } = useUnitsData({ searchParams, sectionType });

  if (loading) {
    return <UnitsGridSkeleton count={sectionType ? 3 : 9} />;
  }

  if (error) {
    return <UnitsErrorState error={error} />;
  }

  if (units.length === 0) {
    return <UnitsEmptyState />;
  }

  return <UnitsGrid units={units} />;
}
