import { isShortLetQuery } from "@/lib/search/short-let";
import { type FormState } from "@/types/search";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// Constants
const DEFAULT_LOCATION = "ghana";
const DEFAULT_CONTRACT_TYPE = "sale";

// Extended FormState interface
export interface ExtendedFormState extends FormState {
  listingType: string;
  howShort?: string;
}

// Helper functions
const safeNumber = (value: string | undefined): string => {
  if (!value || value.trim() === "") return "";
  const num = Number(value);
  return !isNaN(num) && num > 0 ? String(num) : "";
};

const safeBedBath = (value: string | undefined): string => {
  if (!value || value.trim() === "") return "- Any -";
  const num = Number(value);
  return !isNaN(num) && num > 0 ? String(num) : "- Any -";
};

export function useSearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize form state from URL parameters
  const initializeFormState = useCallback((): ExtendedFormState => {
    const searchParamsObj = searchParams
      ? Object.fromEntries(searchParams.entries())
      : {};

    const pathSegments = pathname.split("/");
    const urlContractType =
      pathSegments[pathSegments.length - 1] ?? DEFAULT_CONTRACT_TYPE;

    const reverseContractMap: Record<string, string> = {
      rent: "rent",
      sale: "sale",
    };

    const uiContractType =
      reverseContractMap[urlContractType] ?? DEFAULT_CONTRACT_TYPE;

    const normalizePropertyType = (type: string | undefined): string => {
      if (!type || type === "all") return "all";
      const typeMap: Record<string, string> = {
        apartment: "apartment",
        apartments: "apartment",
        house: "house",
        houses: "house",
        townhouse: "townhouse",
        townhouses: "townhouse",
        office: "office",
        offices: "office",
        land: "land",
        commercial: "commercial",
        warehouse: "warehouse",
        shop: "shop",
        studio: "studio",
      };
      const lowercaseType = type.toLowerCase().trim();
      return typeMap[lowercaseType] || lowercaseType;
    };

    return {
      listingType: uiContractType,
      search: searchParamsObj.q ?? "",
      propertyType: normalizePropertyType(searchParamsObj.ftype),
      bedrooms: safeBedBath(searchParamsObj.fbeds),
      bathrooms: safeBedBath(searchParamsObj.fbaths),
      minPrice: safeNumber(searchParamsObj.fmin),
      maxPrice: safeNumber(searchParamsObj.fmax),
      minArea: safeNumber(searchParamsObj.fminarea),
      maxArea: safeNumber(searchParamsObj.fmaxarea),
      period: searchParamsObj.frentperiod ?? "- Any -",
      sort: searchParamsObj.fsort ?? "date",
      furnished: searchParamsObj.fisfurnished === "1",
      owner: searchParamsObj.ffsbo === "1",
      howShort: searchParamsObj.fhowshort ?? "- Any -",
    };
  }, [searchParams, pathname]);

  const [formState, setFormState] =
    useState<ExtendedFormState>(initializeFormState);

  // Update form state when URL parameters change
  useEffect(() => {
    setFormState(initializeFormState());
    setIsInitialized(true);
  }, [searchParams, pathname, initializeFormState]);

  const updateFormState = (updates: Partial<ExtendedFormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }));
  };

  const isShortLetSearch = useCallback(() => {
    const pathSegments = pathname.split("/");
    const urlContractType = pathSegments[pathSegments.length - 1];
    return (
      urlContractType === "rent" &&
      isShortLetQuery({
        frentperiod: searchParams.get("frentperiod"),
        fhowshort: searchParams.get("fhowshort"),
      })
    );
  }, [pathname, searchParams]);

  const handleRemoveFilter = (filterKey: keyof ExtendedFormState) => {
    const resetValues: Partial<ExtendedFormState> = {};
    const pathSegments = pathname.split("/");
    const urlContractType = pathSegments[pathSegments.length - 1];
    const isLandSearch =
      urlContractType === "sale" && formState.propertyType === "land";

    switch (filterKey) {
      case "propertyType":
        resetValues.propertyType = isLandSearch ? "land" : "all";
        break;
      case "bedrooms":
      case "bathrooms":
        resetValues.bedrooms = "- Any -";
        resetValues.bathrooms = "- Any -";
        break;
      case "minPrice":
      case "maxPrice":
        resetValues.minPrice = "";
        resetValues.maxPrice = "";
        break;
      case "period":
        resetValues.period = "- Any -";
        break;
      case "furnished":
        resetValues.furnished = false;
        break;
      case "owner":
        resetValues.owner = false;
        break;
    }
    updateFormState(resetValues);
  };

  const handleClearAllFilters = () => {
    const pathSegments = pathname.split("/");
    const urlContractType = pathSegments[pathSegments.length - 1];
    const isLandSearch =
      urlContractType === "sale" && formState.propertyType === "land";

    updateFormState({
      propertyType: isLandSearch ? "land" : "all",
      bedrooms: "- Any -",
      bathrooms: "- Any -",
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      period: "- Any -",
      furnished: false,
      owner: false,
      howShort: "- Any -",
    });
  };

  const handleSearch = async () => {
    try {
      setError(null);
      setIsSearching(true);

      const searchValue =
        formState.search && formState.search.trim() !== ""
          ? formState.search.toLowerCase()
          : DEFAULT_LOCATION;

      const contractMap: Record<string, string> = {
        rent: "rent",
        buy: "sale",
        land: "sale",
        "short-let": "rent",
      };

      const apiContract =
        contractMap[formState.listingType] ?? formState.listingType;

      const newSearchParams = new URLSearchParams();
      newSearchParams.set("q", searchValue);

      if (formState.propertyType && formState.propertyType !== "all") {
        newSearchParams.set("ftype", formState.propertyType);
      }

      const addIfValid = (key: string, value: string | undefined) => {
        if (value && value !== "- Any -" && value.trim() !== "") {
          const num = Number(value);
          if (!isNaN(num) && num > 0) {
            newSearchParams.set(key, String(num));
          }
        }
      };

      addIfValid("fbeds", formState.bedrooms);
      addIfValid("fbaths", formState.bathrooms);
      addIfValid("fmin", formState.minPrice);
      addIfValid("fmax", formState.maxPrice);
      addIfValid("fminarea", formState.minArea);
      addIfValid("fmaxarea", formState.maxArea);

      if (formState.period && formState.period !== "- Any -") {
        newSearchParams.set("frentperiod", formState.period);
      }
      if (formState.sort) {
        newSearchParams.set("fsort", formState.sort);
      }
      if (formState.furnished) {
        newSearchParams.set("fisfurnished", "1");
      }
      if (formState.owner) {
        newSearchParams.set("ffsbo", "1");
      }

      if (isShortLetSearch()) {
        newSearchParams.set("frentperiod", "shortrent");
        newSearchParams.set("ftype", "- Any -");
        if (formState.howShort && formState.howShort !== "- Any -") {
          newSearchParams.set("fhowshort", formState.howShort);
        }
      }

      router.push(`/search/${apiContract}?${newSearchParams.toString()}`);
    } catch (err) {
      console.error("Search error:", err);
      setError(
        "An error occurred while processing your search. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  };

  return {
    formState,
    isInitialized,
    isSearching,
    error,
    updateFormState,
    handleSearch,
    handleRemoveFilter,
    handleClearAllFilters,
    isShortLetSearch,
  };
}
