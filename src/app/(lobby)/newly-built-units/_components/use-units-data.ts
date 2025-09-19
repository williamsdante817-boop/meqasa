import { useState, useEffect } from "react";
import type { DeveloperUnit } from "./developer-unit-card";
import { API_CONFIG, GRID_CONFIG } from "./constants";

interface UseUnitsDataParams {
  searchParams: Record<string, string | string[] | undefined>;
  sectionType?: string;
}

interface UnitsDataState {
  units: DeveloperUnit[];
  loading: boolean;
  error: string | null;
}

export function useUnitsData({
  searchParams,
  sectionType,
}: UseUnitsDataParams): UnitsDataState {
  const [units, setUnits] = useState<DeveloperUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadUnits() {
      try {
        setLoading(true);
        setError(null);

        // Build API parameters based on search params
        const apiParams: Record<string, string | number> = {
          app: API_CONFIG.APP_PARAM,
        };

        // Map search params to API parameters
        apiParams.terms = Array.isArray(searchParams.terms)
          ? searchParams.terms[0] || "sale"
          : searchParams.terms || "sale";

        if (searchParams.unittype && searchParams.unittype !== "all") {
          apiParams.unittype = Array.isArray(searchParams.unittype)
            ? searchParams.unittype[0] || ""
            : searchParams.unittype || "";
        }

        if (searchParams.address) {
          apiParams.address = Array.isArray(searchParams.address)
            ? searchParams.address[0] || ""
            : searchParams.address || "";
        }

        if (searchParams.maxprice) {
          const maxPriceStr = Array.isArray(searchParams.maxprice)
            ? searchParams.maxprice[0] || ""
            : searchParams.maxprice || "";
          const maxPrice = parseInt(maxPriceStr);
          if (!isNaN(maxPrice) && maxPrice > 0) {
            apiParams.maxprice = maxPrice;
          }
        }

        if (searchParams.beds && searchParams.beds !== "any") {
          const bedsStr = Array.isArray(searchParams.beds)
            ? searchParams.beds[0] || ""
            : searchParams.beds || "";
          const beds = parseInt(bedsStr);
          if (!isNaN(beds) && beds > 0) {
            apiParams.beds = beds;
          }
        }

        if (searchParams.baths && searchParams.baths !== "any") {
          const bathsStr = Array.isArray(searchParams.baths)
            ? searchParams.baths[0] || ""
            : searchParams.baths || "";
          const baths = parseInt(bathsStr);
          if (!isNaN(baths) && baths > 0) {
            apiParams.baths = baths;
          }
        }

        // Call API
        const response = await fetch(API_CONFIG.ENDPOINT, {
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

        // Apply client-side filtering and sorting
        const filteredUnits = applyClientFilters(
          fetchedUnits,
          searchParams,
          sectionType
        );

        setUnits(filteredUnits);
      } catch {
        setError(
          "Failed to load developer units. Please check your connection and try again."
        );
        setUnits([]);
      } finally {
        setLoading(false);
      }
    }

    void loadUnits();
  }, [searchParams, sectionType]);

  return { units, loading, error };
}

function applyClientFilters(
  units: DeveloperUnit[],
  searchParams: Record<string, string | string[] | undefined>,
  sectionType?: string
): DeveloperUnit[] {
  let filteredUnits = [...units];

  // Apply category filters
  if (searchParams.category === "featured") {
    filteredUnits = filteredUnits
      .slice(0, GRID_CONFIG.FEATURED_LIMIT)
      .map((unit) => ({ ...unit, featured: true }));
  }

  if (searchParams.category === "new") {
    filteredUnits = filteredUnits.map((unit) => ({ ...unit, new: true }));
  }

  // Limit units for sections on projects page
  if (sectionType) {
    filteredUnits = filteredUnits.slice(0, GRID_CONFIG.SECTION_LIMIT);
  }

  // Apply sorting
  if (searchParams.sort) {
    switch (searchParams.sort) {
      case "price-low":
        filteredUnits.sort((a, b) => {
          const priceA = parseFloat(a.price) || 0;
          const priceB = parseFloat(b.price) || 0;
          return priceA - priceB;
        });
        break;
      case "price-high":
        filteredUnits.sort((a, b) => {
          const priceA = parseFloat(a.price) || 0;
          const priceB = parseFloat(b.price) || 0;
          return priceB - priceA;
        });
        break;
      case "bedrooms":
        filteredUnits.sort((a, b) => (b.bedrooms || 0) - (a.bedrooms || 0));
        break;
      case "popularity":
        // For now, randomize as popularity proxy
        filteredUnits.sort(() => Math.random() - 0.5);
        break;
      case "newest":
      default:
        // Default is newest first (API already returns in this order)
        break;
    }
  }

  return filteredUnits;
}
