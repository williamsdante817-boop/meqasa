"use client";

import { Suspense } from "react";
import AllUnitsGrid from "./all-units-grid";
import { UnitsGridSkeleton } from "./units-grid-skeleton";

interface ProjectsClientProps {
  searchParams: Record<string, string | string[] | undefined>;
  sectionType?: string;
}

export function ProjectsClient({
  searchParams,
  sectionType,
}: ProjectsClientProps) {
  return (
    <Suspense fallback={<UnitsGridSkeleton count={3} />}>
      <AllUnitsGrid searchParams={searchParams} sectionType={sectionType} />
    </Suspense>
  );
}
