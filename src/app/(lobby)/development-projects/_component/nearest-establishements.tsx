"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  BanknoteIcon,
  Building,
  Store,
  Plane,
  Search,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useLocations } from "@/hooks/useLocations";
import type { Location, LocationCategory, MapViewType } from "@/types/location";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Categories with their icons
const categories = [
  { name: "Schools" as LocationCategory, icon: Building2 },
  { name: "Banks" as LocationCategory, icon: BanknoteIcon },
  { name: "Hospitals" as LocationCategory, icon: Building },
  { name: "Stores" as LocationCategory, icon: Store },
  { name: "Airports" as LocationCategory, icon: Plane },
];

export default function NearbyLocation() {
  const [activeCategory, setActiveCategory] =
    useState<LocationCategory>("Schools");
  const [mapType, setMapType] = useState<MapViewType>("Map");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // const accraCenter = { latitude: 5.6037, longitude: -0.187 };

  const {
    data: locationData,
    loading,
    error,
    userLocation,
    refreshLocations,
    refreshUserLocation,
  } = useLocations();

  console.log(locationData);
  console.log(userLocation);
  console.log(activeCategory);

  // Use userLocation if available, otherwise static Accra center
  // const mapCenter = userLocation ?? accraCenter;

  // Filter locations based on search query
  const filteredLocations =
    locationData?.[activeCategory]?.filter((location) =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()),
    ) ?? [];

  // Handle category change
  const handleCategoryChange = (category: LocationCategory) => {
    setActiveCategory(category);
    setSelectedLocation(null);
    setSearchQuery("");
  };

  // Handle location selection
  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location.id === selectedLocation?.id ? null : location);
  };

  // Toggle fullscreen
  // const toggleFullscreen = () => {
  //   setIsFullscreen(!isFullscreen);
  // };

  // Handle escape key for fullscreen
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isFullscreen]);

  if (error) {
    return (
      <Alert variant="destructive" className="mx-auto max-w-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>{error.message}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refreshLocations();
              refreshUserLocation();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div
      className={`mx-auto ${isFullscreen ? "fixed inset-0 z-50 bg-white" : "max-w-full"}`}
      role="region"
      aria-label="Nearby locations map and list"
    >
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Search and Category Navigation */}
        <div className="border-b">
          {/* Search Bar */}
          <div className="px-8 py-4 border-b">
            <div className="relative">
              <Input
                type="search"
                placeholder={`Search ${activeCategory.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label={`Search ${activeCategory.toLowerCase()}`}
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
                aria-hidden="true"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 rounded-full p-1"
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Category Navigation */}
          <nav
            className="flex justify-between px-8 py-6"
            role="tablist"
            aria-label="Location categories"
          >
            {categories.map((category) => (
              <button
                key={category.name}
                role="tab"
                aria-selected={activeCategory === category.name}
                aria-controls={`${category.name.toLowerCase()}-panel`}
                className="flex flex-col items-center gap-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 rounded-md p-2"
                onClick={() => handleCategoryChange(category.name)}
              >
                <category.icon
                  size={24}
                  className={`${
                    activeCategory === category.name
                      ? "text-brand-blue"
                      : "text-gray-600"
                  } transition-colors duration-200`}
                  aria-hidden="true"
                />
                <span
                  className={`text-sm ${
                    activeCategory === category.name
                      ? "text-brand-blue font-medium"
                      : "text-gray-600"
                  } transition-colors duration-200`}
                >
                  {category.name}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex flex-col md:flex-row">
          {/* Left Side - List */}
          <div
            className="w-full md:w-1/2 border-r"
            role="tabpanel"
            id={`${activeCategory.toLowerCase()}-panel`}
            aria-label={`${activeCategory} list`}
          >
            {loading ? (
              <div className="flex items-center justify-center h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
              </div>
            ) : filteredLocations.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredLocations.map((location) => (
                  <li key={location.id}>
                    <button
                      className={`w-full flex justify-between items-center py-4 px-6 transition-colors duration-200 ${
                        selectedLocation?.id === location.id
                          ? "bg-blue-50"
                          : "hover:bg-gray-50"
                      } focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2`}
                      onClick={() => handleLocationSelect(location)}
                      aria-pressed={selectedLocation?.id === location.id}
                    >
                      <div className="text-left">
                        <div className="font-medium text-[#333]">
                          {location.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {location.address}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-gray-600">{location.distance}</div>
                        {location.walkTime && (
                          <div className="flex items-center text-sm">
                            <span
                              className="text-orange-600 mr-1"
                              aria-hidden="true"
                            >
                              🚶
                            </span>
                            <span className="text-orange-600">
                              {location.walkTime}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-600">
                No locations found
              </div>
            )}
          </div>

          {/* Right Side - Map */}
          <div
            className="w-full md:w-1/2 relative"
            role="region"
            aria-label="Map view"
          >
            {/* Map Type Toggle */}
            <div
              className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-md shadow-sm flex"
              role="radiogroup"
              aria-label="Map type selection"
            >
              <button
                role="radio"
                aria-checked={mapType === "Map"}
                className={`px-4 py-2 text-sm ${
                  mapType === "Map"
                    ? "bg-white font-medium"
                    : "bg-gray-50 text-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2`}
                onClick={() => setMapType("Map")}
              >
                Map
              </button>
              <button
                role="radio"
                aria-checked={mapType === "Satellite"}
                className={`px-4 py-2 text-sm ${
                  mapType === "Satellite"
                    ? "bg-white font-medium"
                    : "bg-gray-50 text-gray-600"
                } focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2`}
                onClick={() => setMapType("Satellite")}
              >
                Satellite
              </button>
            </div>

            {/* Map Component */}
            <div
              className={`${
                isFullscreen ? "h-[calc(100vh-180px)]" : "h-[400px]"
              }`}
            >
              {/* <Map
                center={mapCenter}
                locations={filteredLocations}
                selectedLocation={selectedLocation}
                mapType={mapType}
                onLocationSelect={handleLocationSelect}
                className="h-full"
              /> */}
              <p>Map</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
