"use client";

import { useEffect, useMemo, useState } from "react";
import { useResultCount } from "./result-count-context";
import { generateSubtitle } from "./metadata-utils";
import type { SearchParams } from "./types";

interface UnitsSearchSubtitleProps {
  initialSubtitle: string;
  searchParams: SearchParams;
}

export function UnitsSearchSubtitle({
  initialSubtitle,
  searchParams,
}: UnitsSearchSubtitleProps) {
  const { count } = useResultCount();
  const [subtitle, setSubtitle] = useState(initialSubtitle);

  const stableParams = useMemo(() => searchParams, [searchParams]);

  useEffect(() => {
    setSubtitle(generateSubtitle(stableParams, count));
  }, [count, stableParams]);

  return <p className="text-brand-muted text-sm">{subtitle}</p>;
}
