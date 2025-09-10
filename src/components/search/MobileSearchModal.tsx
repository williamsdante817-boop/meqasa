"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type FormState } from "@/types/search";
import { ChevronRight, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ActiveFilterChips } from "./ActiveFilterChips";
import { MobileCommonFilters } from "./MobileCommonFilters";
import { MobileSearchInput } from "./MobileSearchInput";
import { SearchForm } from "./SearchForm";

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  rentFormState: FormState;
  buyFormState: FormState;
  landFormState: FormState;
  shortLetFormState: FormState;
  updateFormState: (tab: string, updates: Partial<FormState>) => void;
}

export function MobileSearchModal({
  isOpen,
  onClose,
  rentFormState,
  buyFormState,
  landFormState,
  shortLetFormState,
  updateFormState,
}: MobileSearchModalProps) {
  const [activeTab, setActiveTab] = useState("rent");
  const [announcement, setAnnouncement] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  // Get current form state based on active tab
  const getCurrentFormState = (): FormState => {
    switch (activeTab) {
      case "rent":
        return rentFormState;
      case "buy":
        return buyFormState;
      case "land":
        return landFormState;
      case "short-let":
        return shortLetFormState;
      default:
        return rentFormState;
    }
  };

  // Filter management for mobile with screen reader announcements
  const handleRemoveFilter = (filterKey: keyof FormState) => {
    const resetValues: Partial<FormState> = {};
    let filterName = "";

    switch (filterKey) {
      case "propertyType":
        // Keep land type on land tab, reset to "all" for others
        resetValues.propertyType = activeTab === "land" ? "land" : "all";
        filterName = "Property type";
        break;
      case "bedrooms":
        resetValues.bedrooms = "- Any -";
        filterName = "Bedrooms";
        break;
      case "bathrooms":
        resetValues.bathrooms = "- Any -";
        filterName = "Bathrooms";
        break;
      case "minPrice":
        resetValues.minPrice = "";
        filterName = "Minimum price";
        break;
      case "maxPrice":
        resetValues.maxPrice = "";
        filterName = "Maximum price";
        break;
      case "period":
        resetValues.period = "- Any -";
        filterName = "Period";
        break;
      case "furnished":
        resetValues.furnished = false;
        filterName = "Furnished";
        break;
      case "owner":
        resetValues.owner = false;
        filterName = "Owner";
        break;
      default:
        break;
    }

    updateFormState(activeTab, resetValues);
    
    // Announce filter removal to screen readers
    setAnnouncement(`${filterName} filter removed`);
    setTimeout(() => setAnnouncement(""), 1000);
  };

  const handleClearAllFilters = () => {
    updateFormState(activeTab, {
      propertyType: activeTab === "land" ? "land" : "all", // Keep land type on land tab
      bedrooms: "- Any -",
      bathrooms: "- Any -",
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      period: "- Any -",
      furnished: false,
      owner: false,
    });
    
    // Announce all filters cleared to screen readers
    setAnnouncement("All filters cleared");
    setTimeout(() => setAnnouncement(""), 1000);
  };

  // Count active filters for badge
  const getActiveFilterCount = (formState: FormState): number => {
    let count = 0;
    // Don't count "land" property type on land tab as it's the default
    if (
      formState.propertyType &&
      formState.propertyType !== "all" &&
      !(activeTab === "land" && formState.propertyType === "land")
    ) {
      count++;
    }
    if (formState.bedrooms && formState.bedrooms !== "- Any -") count++;
    if (formState.bathrooms && formState.bathrooms !== "- Any -") count++;
    if (formState.minPrice || formState.maxPrice) count++;
    if (formState.period && formState.period !== "- Any -") count++;
    if (formState.furnished) count++;
    if (formState.owner) count++;
    return count;
  };

  // Focus management and keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      // Handle escape key
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Handle tab key for focus trapping
      if (e.key === "Tab") {
        const modal = modalRef.current;
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
          'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
        );
        const focusableArray = Array.from(focusableElements) as HTMLElement[];
        const firstFocusable = focusableArray[0];
        const lastFocusable = focusableArray[focusableArray.length - 1];

        if (e.shiftKey) {
          // Shift + Tab - moving backwards
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          // Tab - moving forwards
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      }
    };

    if (isOpen) {
      // Store the element that was focused before the modal opened
      lastFocusedElementRef.current = document.activeElement as HTMLElement;
      
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
      
      // Focus the close button when modal opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    } else {
      // Restore focus to the element that was focused before modal opened
      if (lastFocusedElementRef.current) {
        lastFocusedElementRef.current.focus();
        lastFocusedElementRef.current = null;
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const currentFormState = getCurrentFormState();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[999998] lg:hidden"
        onClick={onClose}
        style={{ position: "fixed", zIndex: 999998 }}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[999999] pt-4 pb-10 bg-white lg:hidden"
        style={{ position: "fixed", zIndex: 999999 }}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <h2 id="search-modal-title" className="font-semibold text-gray-900">
            Search Properties
          </h2>
          <Button
            ref={closeButtonRef}
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
            aria-label="Close search modal"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Screen Reader Live Region for Announcements */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          role="status"
        >
          {announcement}
        </div>

        {/* Tab Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            // Announce tab change to screen readers
            const tabNames = {
              rent: "Rent",
              buy: "Buy",
              land: "Land",
              "short-let": "Short Let"
            };
            setAnnouncement(`Switched to ${tabNames[value as keyof typeof tabNames]} tab`);
            setTimeout(() => setAnnouncement(""), 1000);
          }}
          className="flex flex-col h-full"
        >
          <div className="px-4 pt-2 pb-1 bg-white border-b border-gray-100 sticky top-[69px] z-10">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger
                value="rent"
                className="font-semibold text-sm data-[state=active]:bg-white data-[state=active]:text-brand-primary data-[state=active]:shadow-sm"
              >
                Rent
              </TabsTrigger>
              <TabsTrigger
                value="buy"
                className="font-semibold text-sm data-[state=active]:bg-white data-[state=active]:text-brand-primary data-[state=active]:shadow-sm"
              >
                Buy
              </TabsTrigger>
              <TabsTrigger
                value="land"
                className="font-semibold text-sm data-[state=active]:bg-white data-[state=active]:text-brand-primary data-[state=active]:shadow-sm"
              >
                Land
              </TabsTrigger>
              <TabsTrigger
                value="short-let"
                className="font-semibold text-sm data-[state=active]:bg-white data-[state=active]:text-brand-primary data-[state=active]:shadow-sm"
              >
                Short Let
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Search Input */}
              <div className="flex flex-col gap-3 text-left">
                <label className="text-base font-medium text-gray-700">
                  Location
                </label>
                <MobileSearchInput
                  value={currentFormState.search}
                  onChange={(value) =>
                    updateFormState(activeTab, { search: value })
                  }
                  placeholder="Search for location, area, or project"
                />
              </div>

              {/* Filters for Each Tab - Always Visible */}
              <TabsContent value="rent" className="mt-0">
                <SearchForm
                  type="rent"
                  formState={rentFormState}
                  updateFormState={(updates) =>
                    updateFormState("rent", updates)
                  }
                >
                  <MobileCommonFilters
                    showMoreFilters
                    contractType="rent"
                    formState={rentFormState}
                    updateFormState={(updates) =>
                      updateFormState("rent", updates)
                    }
                  />
                </SearchForm>
              </TabsContent>

              <TabsContent value="buy" className="mt-0">
                <SearchForm
                  type="buy"
                  formState={buyFormState}
                  updateFormState={(updates) => updateFormState("buy", updates)}
                >
                  <MobileCommonFilters
                    showMoreFilters
                    contractType="buy"
                    formState={buyFormState}
                    updateFormState={(updates) =>
                      updateFormState("buy", updates)
                    }
                  />
                </SearchForm>
              </TabsContent>

              <TabsContent value="land" className="mt-0">
                <SearchForm
                  type="buy"
                  formState={landFormState}
                  updateFormState={(updates) =>
                    updateFormState("land", updates)
                  }
                >
                  <MobileCommonFilters
                    showMoreFilters
                    hidePropertyType
                    showAreaRange
                    contractType="land"
                    formState={landFormState}
                    updateFormState={(updates) =>
                      updateFormState("land", updates)
                    }
                  />
                </SearchForm>
              </TabsContent>

              <TabsContent value="short-let" className="mt-0">
                <SearchForm
                  type="short-let"
                  formState={shortLetFormState}
                  updateFormState={(updates) =>
                    updateFormState("short-let", updates)
                  }
                >
                  <MobileCommonFilters
                    showMoreFilters
                    hidePropertyType
                    isShortLet
                    contractType="short-let"
                    formState={shortLetFormState}
                    updateFormState={(updates) =>
                      updateFormState("short-let", updates)
                    }
                  />
                </SearchForm>
              </TabsContent>
            </div>
          </div>

          {/* Active Filters Display */}
          {getActiveFilterCount(currentFormState) > 0 && (
            <div className="px-4 border-t border-gray-100">
              <ActiveFilterChips
                formState={currentFormState}
                onRemoveFilter={handleRemoveFilter}
                onClearAllFilters={handleClearAllFilters}
                contractType={activeTab}
              />
            </div>
          )}

          {/* Enhanced Footer with Search Button */}
          <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
            <div className="space-y-2">
              <Button
                type="submit"
                form={`search-form-${activeTab}`}
                variant="brand-primary"
                className="w-full h-12 font-semibold rounded-lg"
              >
                <Search className="h-5 w-5 mr-2" />
                Search Properties
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </Tabs>
      </div>
    </>
  );
}
