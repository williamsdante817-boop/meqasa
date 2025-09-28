"use client";

import { useMemo } from "react";
import { formatPrice } from "@/lib/utils";
import type { DeveloperProject } from "@/types";

interface PropertyPriceRangeProps {
  projectData: DeveloperProject;
}

export function PropertyPriceRange({ projectData }: PropertyPriceRangeProps) {
  // Memoize price range display
  const priceRangeDisplay = useMemo(() => {
    if (!projectData.minmax || projectData.minmax.length === 0) {
      return null;
    }

    return projectData.minmax.map((obj, index) => (
      <div
        className="mt-6 flex items-center justify-between rounded-lg border border-orange-200 bg-gradient-to-r from-gray-50 to-gray-50 p-4 shadow-sm transition-shadow md:p-6"
        key={`${projectData.project.projectid}-${index}`}
      >
        <div>
          <div className="mb-3">
            <span className="text-brand-accent text-sm font-semibold lg:text-base">
              Price Range
            </span>
            <span className="text-brand-muted block text-xs"> (minimum)</span>
          </div>
          <span className="text-brand-accent text-xl font-extrabold lg:text-2xl lg:font-bold">
            {formatPrice(obj.minprice, { currency: "GHS" })}
          </span>
        </div>
        <div>
          <div className="mb-3">
            <span className="text-brand-accent text-sm font-semibold lg:text-base">
              Price Range
            </span>
            <span className="text-brand-muted block text-xs"> (maximum)</span>
          </div>
          <span className="text-brand-accent text-xl font-extrabold lg:text-2xl lg:font-bold">
            {formatPrice(obj.maxprice, { currency: "GHS" })}
          </span>
        </div>
      </div>
    ));
  }, [projectData.minmax, projectData.project.projectid]);

  if (!priceRangeDisplay) {
    return (
      <div className="mt-6 rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-50 p-4 text-center md:p-6">
        <p className="text-brand-muted text-sm">
          Price information not available
        </p>
      </div>
    );
  }

  return <>{priceRangeDisplay}</>;
}