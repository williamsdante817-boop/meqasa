"use client";

import { type FormState } from "@/types/search";
import { useState } from "react";
import {
  MEQASA_RENT_PERIODS,
  MEQASA_SORT_OPTIONS,
} from "@/lib/search/constants";
import { useMobileSearch } from "@/contexts/mobile-search-context";
import { MobileSearchModal } from "./MobileSearchModal";

// Default form state for each tab
const getDefaultFormState = (): FormState => ({
  search: "",
  propertyType: "all",
  bedrooms: "- Any -",
  bathrooms: "- Any -",
  minPrice: "",
  maxPrice: "",
  minArea: "",
  maxArea: "",
  period: MEQASA_RENT_PERIODS[0],
  sort: MEQASA_SORT_OPTIONS[0],
  furnished: false,
  owner: false,
  howShort: "- Any -",
});

export function MobileSearchOverlay() {
  const { isOpen, closeSearch } = useMobileSearch();

  // Separate form states for each tab
  const [rentFormState, setRentFormState] = useState<FormState>(
    getDefaultFormState()
  );
  const [buyFormState, setBuyFormState] = useState<FormState>(
    getDefaultFormState()
  );
  const [landFormState, setLandFormState] = useState<FormState>({
    ...getDefaultFormState(),
    propertyType: "land",
  });
  const [shortLetFormState, setShortLetFormState] = useState<FormState>(
    getDefaultFormState()
  );

  // Helper function to get current update function based on active tab
  const getCurrentUpdateFunction = (tab: string) => {
    switch (tab) {
      case "rent":
        return setRentFormState;
      case "buy":
        return setBuyFormState;
      case "land":
        return setLandFormState;
      case "short-let":
        return setShortLetFormState;
      default:
        return setRentFormState;
    }
  };

  // Update function that works with the current active tab
  const updateFormState = (tab: string, updates: Partial<FormState>) => {
    const updateFn = getCurrentUpdateFunction(tab);
    updateFn((prev) => ({ ...prev, ...updates }));
  };

  return (
    <MobileSearchModal
      isOpen={isOpen}
      onClose={closeSearch}
      rentFormState={rentFormState}
      buyFormState={buyFormState}
      landFormState={landFormState}
      shortLetFormState={shortLetFormState}
      updateFormState={updateFormState}
    />
  );
}
