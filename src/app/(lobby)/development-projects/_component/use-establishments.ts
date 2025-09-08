import { useState, useEffect, useCallback, useMemo } from "react";
import type { Establishment } from "./establishment-item";
import {
  getEstablishments,
  getEstablishmentTypeCounts,
  type EstablishmentFilters,
  type LocationCoordinates,
} from "./establishments-service";

export interface UseEstablishmentsOptions {
  projectLocation: LocationCoordinates;
  neighborhood?: string;
  autoFetch?: boolean;
  debounceMs?: number;
}

export interface UseEstablishmentsReturn {
  establishments: Establishment[];
  filteredEstablishments: Establishment[];
  typeCounts: Record<Establishment["type"], number>;
  loading: boolean;
  error: string | null;
  activeType: Establishment["type"] | "all";
  searchQuery: string;
  filters: EstablishmentFilters;
  setActiveType: (type: Establishment["type"] | "all") => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: EstablishmentFilters) => void;
  refetch: () => Promise<void>;
  clearFilters: () => void;
  hasEstablishments: boolean;
  hasResults: boolean;
  nearestEstablishment: Establishment | null;
}

const DEFAULT_FILTERS: EstablishmentFilters = {};

export function useEstablishments({
  projectLocation,
  neighborhood,
  autoFetch = true,
  debounceMs = 300,
}: UseEstablishmentsOptions): UseEstablishmentsReturn {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeType, setActiveType] = useState<Establishment["type"] | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<EstablishmentFilters>(DEFAULT_FILTERS);

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [searchQuery, debounceMs]);

  const fetchEstablishments = useCallback(async () => {
    if (!projectLocation) return;
    try {
      setLoading(true);
      setError(null);

      const combinedFilters: EstablishmentFilters = {
        ...filters,
        type: activeType === "all" ? undefined : activeType,
      };

      const data = await getEstablishments(
        projectLocation,
        neighborhood,
        combinedFilters
      );

      setEstablishments(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch establishments";
      setError(errorMessage);
      console.error("Error fetching establishments:", err);
    } finally {
      setLoading(false);
    }
  }, [projectLocation, neighborhood, filters, activeType]);

  const filteredEstablishments = useMemo(() => {
    let filtered = establishments;

    if (activeType !== "all") {
      filtered = filtered.filter((est) => est.type === activeType);
    }

    if (debouncedSearchQuery) {
      const q = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (est) =>
          est.name.toLowerCase().includes(q) ||
          est.address.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [establishments, activeType, debouncedSearchQuery]);

  const typeCounts = useMemo(() => {
    return getEstablishmentTypeCounts(establishments);
  }, [establishments]);

  const hasEstablishments = establishments.length > 0;
  const hasResults = filteredEstablishments.length > 0;
  const nearestEstablishment = useMemo(() => {
    return filteredEstablishments[0] ?? null;
  }, [filteredEstablishments]);

  const clearFilters = useCallback(() => {
    setActiveType("all");
    setSearchQuery("");
    setFilters(DEFAULT_FILTERS);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      void fetchEstablishments();
    }
  }, [fetchEstablishments, autoFetch]);

  const refetch = useCallback(async () => {
    await fetchEstablishments();
  }, [fetchEstablishments]);

  return {
    establishments,
    filteredEstablishments,
    typeCounts,
    loading,
    error,
    activeType,
    searchQuery,
    filters,
    setActiveType,
    setSearchQuery,
    setFilters,
    refetch,
    clearFilters,
    hasEstablishments,
    hasResults,
    nearestEstablishment,
  };
}
