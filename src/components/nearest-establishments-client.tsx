"use client";

import { useState, useCallback, useMemo } from "react";
import {
  GraduationCap,
  Building,
  Heart,
  ShoppingBag,
  Plane,
  MapPin,
  Clock,
  Star,
  Search,
  Navigation,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

export interface NearestEstablishment {
  id: string;
  name: string;
  address: string;
  distance: number;
  travelTime: number;
  type: "schools" | "banks" | "hospitals" | "supermarkets" | "airports";
  rating?: number;
  phone?: string;
  openNow?: boolean;
  coordinates: { lat: number; lng: number };
}

interface PropertyInfo {
  id?: string;
  name: string;
  location: string;
  image?: string;
  price?: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: string;
  type?: string;
  developer?: string;
}

interface NearestEstablishmentsClientProps {
  establishments: NearestEstablishment[];
  propertyLocation: { lat: number; lng: number };
  propertyName?: string;
  neighborhood?: string;
  className?: string;
  maxDistance?: number;
  propertyInfo?: PropertyInfo;
}

const ESTABLISHMENT_CATEGORIES = {
  schools: {
    label: "Schools",
    icon: GraduationCap,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  supermarkets: {
    label: "Supermarkets",
    icon: ShoppingBag,
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  banks: {
    label: "Banks",
    icon: Building,
    color: "bg-green-50 text-green-700 border-green-200",
  },
  hospitals: {
    label: "Hospitals",
    icon: Heart,
    color: "bg-red-50 text-red-700 border-red-200",
  },
  airports: {
    label: "Airports",
    icon: Plane,
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
} as const;

type EstablishmentType = keyof typeof ESTABLISHMENT_CATEGORIES;

const GOOGLE_MAPS_LIBRARIES: "places"[] = ["places"];
const mapContainerStyle = { width: "100%", height: "100%" };

function formatDistance(distance: number): string {
  if (distance >= 1000) {
    return `${(distance / 1000).toFixed(1)}km`;
  }
  return `${Math.round(distance)}m`;
}

export function NearestEstablishmentsClient({
  establishments,
  propertyLocation,
  propertyName = "Property",
  className,
  maxDistance = 10,
}: NearestEstablishmentsClientProps) {
  const [activeCategory, setActiveCategory] =
    useState<EstablishmentType>("schools");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEstablishment, setSelectedEstablishment] =
    useState<NearestEstablishment | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");
  const [mobileView, setMobileView] = useState<"list" | "map">("list");

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const filteredEstablishments = useMemo(() => {
    let filtered = establishments.filter((est) => est.type === activeCategory);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (est) =>
          est.name.toLowerCase().includes(query) ||
          est.address.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [establishments, activeCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<EstablishmentType, number> = {
      schools: 0,
      supermarkets: 0,
      banks: 0,
      hospitals: 0,
      airports: 0,
    };

    establishments.forEach((est) => {
      counts[est.type]++;
    });

    return counts;
  }, [establishments]);

  const nearestEstablishment = useMemo(() => {
    if (establishments.length === 0) return null;
    return establishments.reduce((nearest, current) =>
      current.distance < nearest.distance ? current : nearest
    );
  }, [establishments]);

  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
      mapTypeId: mapType,
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    }),
    [mapType]
  );

  const onMapLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      setMap(mapInstance);

      const bounds = new google.maps.LatLngBounds();
      bounds.extend(propertyLocation);

      filteredEstablishments.forEach((est) => {
        if (est.coordinates) {
          bounds.extend(est.coordinates);
        }
      });

      if (!bounds.isEmpty()) {
        mapInstance.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
      }
    },
    [propertyLocation, filteredEstablishments]
  );

  const handleEstablishmentClick = useCallback(
    (establishment: NearestEstablishment) => {
      setSelectedEstablishment(establishment);
      if (map) {
        map.panTo(establishment.coordinates);
        map.setZoom(15);
      }
    },
    [map]
  );

  const handleZoomIn = useCallback(() => {
    if (map) map.setZoom((map.getZoom() || 10) + 1);
  }, [map]);

  const handleZoomOut = useCallback(() => {
    if (map) map.setZoom((map.getZoom() || 10) - 1);
  }, [map]);

  const handleToggleMapType = useCallback(() => {
    const newMapType = mapType === "roadmap" ? "satellite" : "roadmap";
    setMapType(newMapType);
    if (map) map.setMapTypeId(newMapType);
  }, [map, mapType]);

  return (
    <Card className={cn("w-full rounded-lg", className)}>
      <CardHeader className="pb-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="bg-brand-blue/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <MapPin className="text-brand-blue h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-brand-accent text-lg sm:text-xl">
                  Nearby Amenities
                </CardTitle>
                <p className="text-brand-muted text-sm">
                  Essential services near {propertyName}
                </p>
              </div>
            </div>
            {nearestEstablishment && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 p-2">
                <Navigation className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Closest: {nearestEstablishment.name} •{" "}
                  {formatDistance(nearestEstablishment.distance)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-1.5">
              <span className="font-medium text-green-700">
                {establishments.length}
              </span>
              <span className="ml-1 text-green-600">locations</span>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5">
              <span className="font-medium text-gray-700">{maxDistance}km</span>
              <span className="ml-1 text-gray-600">radius</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 sm:grid sm:grid-cols-2 lg:flex lg:flex-nowrap">
          {Object.entries(ESTABLISHMENT_CATEGORIES).map(([key, config]) => {
            const Icon = config.icon;
            const count = categoryCounts[key as EstablishmentType];
            const isActive = activeCategory === key;

            return (
              <Button
                key={key}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(key as EstablishmentType)}
                className={cn(
                  "flex min-w-0 flex-shrink-0 items-center gap-1.5 px-2 py-2 text-xs sm:px-3 sm:text-sm",
                  isActive && "bg-brand-blue hover:bg-brand-blue/90"
                )}
              >
                <Icon className="h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
                <span className="truncate">{config.label}</span>
                <Badge
                  variant="secondary"
                  className="ml-1 bg-white/20 px-1 text-xs text-inherit"
                >
                  {count}
                </Badge>
              </Button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={`Search ${ESTABLISHMENT_CATEGORIES[activeCategory].label.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Mobile Toggle */}
        <div className="block lg:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileView(mobileView === "list" ? "map" : "list")}
          >
            {mobileView === "list" ? "Show Map" : "Show List"}
          </Button>
        </div>

        {/* Split View */}
        <div className="grid min-h-[400px] grid-cols-1 gap-6 lg:min-h-[600px] lg:grid-cols-2">
          {/* List */}
          <div
            className={cn(
              "space-y-4 lg:block",
              mobileView === "list" ? "block" : "hidden lg:block"
            )}
          >
            <h3 className="text-brand-accent text-sm font-semibold sm:text-base">
              Found {filteredEstablishments.length}{" "}
              {ESTABLISHMENT_CATEGORIES[activeCategory].label}
            </h3>

            <div className="max-h-[500px] space-y-3 overflow-y-auto">
              {filteredEstablishments.map((establishment) => {
                const config = ESTABLISHMENT_CATEGORIES[establishment.type];
                const Icon = config.icon;
                const isSelected = selectedEstablishment?.id === establishment.id;

                return (
                  <div
                    key={establishment.id}
                    onClick={() => handleEstablishmentClick(establishment)}
                    className={cn(
                      "group flex cursor-pointer items-center justify-between rounded-lg border p-3 sm:p-4",
                      isSelected
                        ? "border-brand-blue bg-brand-blue/5"
                        : "border-gray-200 hover:border-brand-blue/30"
                    )}
                  >
                    <div className="flex min-w-0 flex-1 items-center space-x-3 sm:space-x-4">
                      <div
                        className={cn(
                          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full sm:h-12 sm:w-12",
                          config.color
                        )}
                      >
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="truncate text-sm font-semibold sm:text-base">
                            {establishment.name}
                          </h4>
                          {establishment.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="text-xs">{establishment.rating}</span>
                            </div>
                          )}
                        </div>
                        <p className="line-clamp-1 text-xs text-gray-600 sm:text-sm">
                          {establishment.address}
                        </p>
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{formatDistance(establishment.distance)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{establishment.travelTime} min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map */}
          <div
            className={cn(
              "relative overflow-hidden rounded-lg border lg:block",
              mobileView === "map" ? "block" : "hidden lg:block"
            )}
          >
            {isLoaded && (
              <>
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleMapType}
                    className="bg-white/90 p-2"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    className="h-8 w-8 bg-white/90 p-0"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    className="h-8 w-8 bg-white/90 p-0"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </div>

                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={propertyLocation}
                  zoom={13}
                  options={mapOptions}
                  onLoad={onMapLoad}
                  onUnmount={() => setMap(null)}
                >
                  <Marker position={propertyLocation} />

                  {filteredEstablishments.map((est) => (
                    <Marker
                      key={est.id}
                      position={est.coordinates}
                      onClick={() => setSelectedEstablishment(est)}
                    />
                  ))}

                  {selectedEstablishment && (
                    <InfoWindow
                      position={selectedEstablishment.coordinates}
                      onCloseClick={() => setSelectedEstablishment(null)}
                    >
                      <div className="p-2">
                        <h3 className="font-semibold">{selectedEstablishment.name}</h3>
                        <p className="text-sm text-gray-600">
                          {selectedEstablishment.address}
                        </p>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
