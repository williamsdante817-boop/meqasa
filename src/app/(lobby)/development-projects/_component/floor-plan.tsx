"use client";

import { useState, useCallback, useMemo, memo } from "react";
import { Grid3x3, Bed, Home, Bath, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import type { FloorPlan } from "@/types";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const FLOOR_PLANS = [
  {
    id: "B6aDP",
    sqft: 1012,
    sqm: 94,
    beds: 1,
    baths: 1,
    type: "1BS",
    title: "1-BEDROOM + STUDY",
    imageUrl: "/placeholder.svg?height=400&width=500",
    unitNumbers: "#03-03 to #24-03",
  },
  {
    id: "B6aDP",
    sqft: 1012,
    sqm: 94,
    beds: 2,
    baths: 1,
    type: "2B",
    title: "2-BEDROOM",
    imageUrl: "/placeholder.svg?height=400&width=500",
    unitNumbers: "#03-03 to #24-03",
  },
  {
    id: "B6aDP",
    sqft: 1012,
    sqm: 94,
    beds: 3,
    baths: 3,
    type: "3B",
    title: "3-BEDROOM",
    imageUrl: "/placeholder.svg?height=400&width=500",
    unitNumbers: "#03-03 to #24-03",
  },
  {
    id: "B6aDP",
    sqft: 1012,
    sqm: 94,
    beds: 4,
    baths: 4,
    type: "4B",
    title: "4-BEDROOM",
    imageUrl: "/placeholder.svg?height=400&width=500",
    unitNumbers: "#03-03 to #24-03",
  },
  {
    id: "B6aDP",
    sqft: 1012,
    sqm: 94,
    beds: 2,
    baths: 2,
    type: "2B2B",
    title: "2-BEDROOM + 2 BATH",
    imageUrl: "/placeholder.svg?height=400&width=500",
    unitNumbers: "#03-03 to #24-03",
  },
] satisfies FloorPlan[];

interface FloorPlansProps {
  floorPlans?: FloorPlan[];
  loading?: boolean;
  error?: string | null;
}

function FloorPlansComponent({
  floorPlans = FLOOR_PLANS,
  loading = false,
  error = null,
}: FloorPlansProps = {}) {
  const [selectedPlan, setSelectedPlan] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("type");
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  // Reset selected plan when switching tabs
  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    setSelectedPlan(0);
  }, []);

  // Memoize sorted floor plans for "bed" tab
  const sortedByBeds = useMemo(
    () => [...floorPlans].sort((a, b) => a.beds - b.beds),
    [floorPlans]
  );

  // Get current floor plans based on active tab
  const currentFloorPlans = useMemo(
    () => (activeTab === "bed" ? sortedByBeds : floorPlans),
    [activeTab, sortedByBeds, floorPlans]
  );

  const selectedFloorPlan = currentFloorPlans[selectedPlan];

  // Handle plan selection with bounds checking
  const handlePlanSelect = useCallback(
    (index: number) => {
      if (index >= 0 && index < currentFloorPlans.length) {
        setSelectedPlan(index);
        setImageLoading(true);
      }
    },
    [currentFloorPlans.length]
  );

  // Handle image load events
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
  }, []);

  // Error state
  if (error) {
    return (
      <Card className="p-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Home className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-brand-accent text-lg font-semibold">
            Unable to Load Floor Plans
          </h3>
          <p className="text-brand-muted">{error}</p>
        </div>
      </Card>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Card className="overflow-hidden p-0">
        <div className="grid md:grid-cols-[1fr_1.5fr]">
          <div className="space-y-2 border-r p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
          <div className="p-8">
            <Skeleton className="mb-4 h-8 w-48" />
            <Skeleton className="mb-8 h-4 w-32" />
            <Skeleton className="aspect-[4/3] w-full" />
          </div>
        </div>
      </Card>
    );
  }

  // Empty state
  if (!floorPlans.length) {
    return (
      <Card className="p-8 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Home className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-brand-accent text-lg font-semibold">
            No Floor Plans Available
          </h3>
          <p className="text-brand-muted">
            Floor plans for this project are not available at the moment.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-brand-accent text-2xl font-bold">Floor Plans</h2>
        <Badge
          variant="secondary"
          className="bg-brand-primary/10 text-brand-primary border-brand-primary/20"
        >
          {currentFloorPlans.length}{" "}
          {currentFloorPlans.length === 1 ? "Plan" : "Plans"} Available
        </Badge>
      </div>

      <Card className="overflow-hidden p-0">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid h-auto w-full grid-cols-2 rounded-none bg-gray-50/50">
            <TabsTrigger
              value="type"
              className="data-[state=active]:text-brand-blue flex flex-col items-center px-6 py-4 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              aria-label="View floor plans by type"
            >
              <div className="data-[state=active]:border-brand-blue mb-2 rounded-lg border p-2 transition-colors data-[state=inactive]:border-gray-300">
                <Grid3x3 className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium">By Type</span>
            </TabsTrigger>
            <TabsTrigger
              value="bed"
              className="data-[state=active]:text-brand-blue flex flex-col items-center px-6 py-4 transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              aria-label="View floor plans by bedroom count"
            >
              <div className="data-[state=active]:border-brand-blue mb-2 rounded-lg border p-2 transition-colors data-[state=inactive]:border-gray-300">
                <Bed className="h-5 w-5" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium">By Bedrooms</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="type" className="m-0">
            <FloorPlanContent
              currentFloorPlans={currentFloorPlans}
              selectedPlan={selectedPlan}
              selectedFloorPlan={selectedFloorPlan}
              onPlanSelect={handlePlanSelect}
              imageLoading={imageLoading}
              onImageLoad={handleImageLoad}
              onImageError={handleImageError}
            />
          </TabsContent>

          <TabsContent value="bed" className="m-0">
            <FloorPlanContent
              currentFloorPlans={currentFloorPlans}
              selectedPlan={selectedPlan}
              selectedFloorPlan={selectedFloorPlan}
              onPlanSelect={handlePlanSelect}
              imageLoading={imageLoading}
              onImageLoad={handleImageLoad}
              onImageError={handleImageError}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

// Extracted floor plan content component to avoid duplication
interface FloorPlanContentProps {
  currentFloorPlans: FloorPlan[];
  selectedPlan: number;
  selectedFloorPlan?: FloorPlan;
  onPlanSelect: (index: number) => void;
  imageLoading: boolean;
  onImageLoad: () => void;
  onImageError: () => void;
}

function FloorPlanContent({
  currentFloorPlans,
  selectedPlan,
  selectedFloorPlan,
  onPlanSelect,
  imageLoading,
  onImageLoad,
  onImageError,
}: FloorPlanContentProps) {
  return (
    <div className="grid min-h-[500px] md:grid-cols-[1fr_1.5fr]">
      {/* Floor plan list */}
      <div className="border-r bg-gray-50/30">
        <div className="border-b bg-white p-4">
          <h3 className="text-brand-accent text-lg font-semibold">
            Available Plans
          </h3>
          <p className="text-brand-muted text-sm">
            {currentFloorPlans.length} options to choose from
          </p>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {currentFloorPlans.map((plan, index) => {
            const isSelected = selectedPlan === index;
            return (
              <Button
                key={`${plan.id}-${plan.type}-${index}`}
                variant="ghost"
                className={cn(
                  "focus-visible:ring-brand-blue h-auto w-full justify-start rounded-none border-b p-6 text-left transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset",
                  isSelected
                    ? "bg-brand-blue/5 border-l-brand-blue border-l-4 shadow-sm"
                    : "border-l-4 border-l-transparent hover:bg-gray-50"
                )}
                onClick={() => onPlanSelect(index)}
                aria-pressed={isSelected}
                aria-describedby={`plan-${index}-description`}
              >
                <div className="w-full space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-brand-accent text-lg font-bold">
                      {plan.id}
                    </h4>
                    <Badge
                      variant={isSelected ? "default" : "outline"}
                      className="text-xs"
                    >
                      TYPE {plan.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-brand-blue flex items-center gap-1 font-semibold">
                      <Square className="h-4 w-4" aria-hidden="true" />
                      {plan.sqft} sqft / {plan.sqm} sqm
                    </div>
                  </div>
                  <div className="text-brand-muted flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" aria-hidden="true" />
                      {plan.beds} {plan.beds === 1 ? "Bed" : "Beds"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" aria-hidden="true" />
                      {plan.baths} {plan.baths === 1 ? "Bath" : "Baths"}
                    </div>
                  </div>
                  <div id={`plan-${index}-description`} className="sr-only">
                    {plan.title} floor plan with {plan.beds} bedrooms,{" "}
                    {plan.baths} bathrooms,
                    {plan.sqft} square feet.{" "}
                    {isSelected
                      ? "Currently selected."
                      : "Click to view details."}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Floor plan details */}
      <div className="p-6 md:p-8">
        {selectedFloorPlan ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div className="flex items-center gap-4">
                <div
                  className="bg-brand-primary h-12 w-1 flex-shrink-0 rounded-full"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="text-brand-accent text-xl font-semibold md:text-2xl">
                    {selectedFloorPlan.title}
                  </h2>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      TYPE {selectedFloorPlan.type}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-1 text-right">
                <div className="text-brand-blue flex items-center gap-2 font-semibold">
                  <Square className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {selectedFloorPlan.sqm} sqm ({selectedFloorPlan.sqft} sqft)
                  </span>
                </div>
                {selectedFloorPlan.unitNumbers && (
                  <p className="text-brand-muted text-sm">
                    Units: {selectedFloorPlan.unitNumbers}
                  </p>
                )}
              </div>
            </div>

            {/* Key Features */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2">
                <Bed className="text-brand-blue h-5 w-5" aria-hidden="true" />
                <span className="text-brand-accent font-medium">
                  {selectedFloorPlan.beds}{" "}
                  {selectedFloorPlan.beds === 1 ? "Bedroom" : "Bedrooms"}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2">
                <Bath className="text-brand-blue h-5 w-5" aria-hidden="true" />
                <span className="text-brand-accent font-medium">
                  {selectedFloorPlan.baths}{" "}
                  {selectedFloorPlan.baths === 1 ? "Bathroom" : "Bathrooms"}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2">
                <Square
                  className="text-brand-blue h-5 w-5"
                  aria-hidden="true"
                />
                <span className="text-brand-accent font-medium">
                  {selectedFloorPlan.sqft} sqft
                </span>
              </div>
            </div>

            {/* Floor plan image */}
            <div className="space-y-4">
              <h3 className="text-brand-accent font-semibold">
                Floor Plan Layout
              </h3>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border-2 border-gray-200 bg-white">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="space-y-3 text-center">
                      <Skeleton className="mx-auto h-16 w-16 rounded-full" />
                      <Skeleton className="mx-auto h-4 w-32" />
                    </div>
                  </div>
                )}
                <Image
                  src={
                    selectedFloorPlan.imageUrl ||
                    "/placeholder.svg?height=400&width=500"
                  }
                  alt={`Floor plan layout for ${selectedFloorPlan.title} showing ${selectedFloorPlan.beds} bedrooms and ${selectedFloorPlan.baths} bathrooms`}
                  fill
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className={cn(
                    "object-contain transition-opacity duration-300",
                    imageLoading ? "opacity-0" : "opacity-100"
                  )}
                  onLoad={onImageLoad}
                  onError={onImageError}
                  priority={selectedPlan === 0}
                />
              </div>
              <p className="text-brand-muted text-center text-sm">
                Floor plan is for illustration purposes and may vary from actual
                construction.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex h-full min-h-[400px] items-center justify-center">
            <div className="space-y-4 text-center">
              <Home className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-brand-muted">
                Select a floor plan to view details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Memoized component to prevent unnecessary re-renders
const FloorPlans = memo(FloorPlansComponent);
FloorPlans.displayName = "FloorPlans";

export default FloorPlans;
