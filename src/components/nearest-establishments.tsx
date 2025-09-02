"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  Loader2,
  AlertCircle,
  Navigation,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Bed,
  Bath,
  Maximize,
  Home,
  User
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

// Types
export interface PropertyLocation {
  lat: number;
  lng: number;
}

export interface NearestEstablishment {
  id: string;
  name: string;
  address: string;
  distance: number; // in meters
  travelTime: number; // in minutes
  type: 'schools' | 'supermarkets' | 'banks' | 'hospitals' | 'airports';
  rating?: number;
  phone?: string;
  openNow?: boolean;
  coordinates: PropertyLocation;
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
  description?: string;
  developer?: string;
}

interface NearestEstablishmentsProps {
  propertyLocation: PropertyLocation;
  propertyName?: string;
  neighborhood?: string;
  className?: string;
  maxResults?: number;
  maxDistance?: number; // in km
  propertyInfo?: PropertyInfo;
}

// Configuration for establishment categories
const ESTABLISHMENT_CATEGORIES = {
  schools: {
    label: 'Schools',
    icon: GraduationCap,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Educational institutions'
  },
  supermarkets: {
    label: 'Supermarkets',
    icon: ShoppingBag,
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    description: 'Supermarkets & stores'
  },
  banks: {
    label: 'Banks',
    icon: Building,
    color: 'bg-green-50 text-green-700 border-green-200',
    description: 'Financial institutions'
  },
  hospitals: {
    label: 'Hospitals',
    icon: Heart,
    color: 'bg-red-50 text-red-700 border-red-200',
    description: 'Healthcare facilities'
  },
  airports: {
    label: 'Airports',
    icon: Plane,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    description: 'Transportation hubs'
  }
} as const;

type EstablishmentType = keyof typeof ESTABLISHMENT_CATEGORIES;

// Google Maps configuration
const GOOGLE_MAPS_LIBRARIES: ("places")[] = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 5.6037, // Accra, Ghana
  lng: -0.1870,
};

// Utility functions

// function calculateTravelTime(distance: number): number {
//   // Estimate travel time based on distance (assuming 30 km/h average city speed)
//   const averageSpeed = 30; // km/h
//   const timeInHours = distance / averageSpeed;
//   return Math.max(2, Math.round(timeInHours * 60)); // Minimum 2 minutes
// }

function formatDistance(distance: number): string {
  if (distance >= 1) {
    return `${distance.toFixed(1)}km`;
  }
  return `${Math.round(distance * 1000)}m`;
}

function normalizeLocationKey(location: string): string {
  return location
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .trim();
}

// Static mock data removed - now uses Google Maps API via establishments-service

export function NearestEstablishments({
  propertyLocation,
  propertyName = "Property",
  neighborhood = "Accra",
  className,
  maxDistance = 10, // 10km radius
  propertyInfo
}: NearestEstablishmentsProps) {
  console.log('🏢 NearestEstablishments component instantiated with:', { propertyLocation, neighborhood });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [establishments, setEstablishments] = useState<NearestEstablishment[]>([]);
  const [activeCategory, setActiveCategory] = useState<EstablishmentType>('schools');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEstablishment, setSelectedEstablishment] = useState<NearestEstablishment | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapType, setMapType] = useState<"roadmap" | "satellite">("roadmap");
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [showPropertyInfo, setShowPropertyInfo] = useState(false);
  
  // Load Google Maps API
  // For production: Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local
  // Example: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "demo-key",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  // Map center based on property location with validation
  const mapCenter = useMemo(() => {
    if (propertyLocation && 
        typeof propertyLocation.lat === 'number' && 
        typeof propertyLocation.lng === 'number' &&
        propertyLocation.lat !== 0 && 
        propertyLocation.lng !== 0) {
      return propertyLocation;
    }
    
    // Use neighborhood-specific defaults if available
    const neighborhoodDefaults: Record<string, PropertyLocation> = {
      'adenta': { lat: 5.7010, lng: -0.1680 },
      'east-legon': { lat: 5.6500, lng: -0.1460 },
      'adjiringanor': { lat: 5.6520, lng: -0.1445 },
      'airport-residential': { lat: 5.6000, lng: -0.1700 },
    };
    
    const normalizedNeighborhood = normalizeLocationKey(neighborhood);
    return neighborhoodDefaults[normalizedNeighborhood] || defaultCenter;
  }, [propertyLocation, neighborhood]);

  // Test geocoding first - get location string, pass to server-side Google Geocoding API, log coordinates
  const testGeocode = async (locationString: string) => {
    console.log(`🌍 GEOCODING TEST: Starting for "${locationString}" via server-side API`);
    
    try {
      console.log(`📡 Making request to /api/google-maps/geocode...`);
      
      const response = await fetch(`/api/google-maps/geocode?address=${encodeURIComponent(locationString)}`);
      console.log(`📊 Response status: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`📝 Server response:`, data);
      
      if (data.success && data.coordinates) {
        const coordinates = data.coordinates;
        
        console.log(`✅ GEOCODING SUCCESS!`);
        console.log(`📍 Location: "${locationString}"`);
        console.log(`🎯 Latitude: ${coordinates.lat}`);
        console.log(`🎯 Longitude: ${coordinates.lng}`);
        console.log(`📮 Full address: ${data.formatted_address}`);
        
        return coordinates as { lat: number; lng: number };
      } else {
        console.log(`❌ Geocoding failed: ${data.error || 'No coordinates returned'}`);
        return null;
      }
    } catch (error) {
      console.error(`🚨 Geocoding error:`, error);
      return null;
    }
  };

  // Fetch establishments using our Google Maps API service
  const fetchEstablishments = useCallback(async () => {
    console.log('🚀 fetchEstablishments called with:', { propertyLocation, neighborhood });
    
    // STEP 1: Test geocoding first!
    if (neighborhood) {
      console.log(`🔍 TESTING GEOCODING for neighborhood: "${neighborhood}"`);
      const geocodedCoords = await testGeocode(neighborhood);
      
      if (geocodedCoords) {
        console.log(`🎉 GEOCODING WORKED! Got coordinates:`, geocodedCoords);
      } else {
        console.log(`⚠️ Geocoding failed, will use fallback data`);
      }
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Use our new Google Maps API service
      console.log('📦 Importing establishments-service...');
      const { getEstablishments } = await import('@/app/(lobby)/development-projects/_component/establishments-service');
      
      const establishmentsData = await getEstablishments(
        propertyLocation,
        neighborhood,
        { maxDistance: maxDistance * 1000 } // Convert km to meters
      );
      
      // Transform the data format to match our component interface
      const transformedEstablishments: NearestEstablishment[] = establishmentsData.map(est => ({
        id: est.id,
        name: est.name,
        address: est.address,
        distance: est.distance,
        travelTime: est.travelTime || 0,
        type: est.type === 'school' ? 'schools' : 
              est.type === 'bank' ? 'banks' :
              est.type === 'hospital' ? 'hospitals' :
              est.type === 'supermarket' ? 'supermarkets' :
              est.type === 'airport' ? 'airports' : 'schools',
        rating: est.rating,
        phone: est.phone,
        openNow: est.openNow,
        coordinates: est.coordinates || { lat: 0, lng: 0 }
      }));
      
      setEstablishments(transformedEstablishments);
    } catch (err) {
      setError('Failed to load nearby establishments. Please try again.');
      console.error('Error fetching establishments:', err);
    } finally {
      setLoading(false);
    }
  }, [propertyLocation, neighborhood, maxDistance]);
  
  useEffect(() => {
    console.log('⚡ useEffect triggered, calling fetchEstablishments');
    void fetchEstablishments();
  }, [fetchEstablishments]);
  
  // Filter establishments by category and search
  const filteredEstablishments = useMemo(() => {
    let filtered = establishments.filter(est => est.type === activeCategory);
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(est => 
        est.name.toLowerCase().includes(query) ||
        est.address.toLowerCase().includes(query)
      );
    }
    
    return filtered; // Show all results, no artificial limit
  }, [establishments, activeCategory, searchQuery]);
  
  // Get counts for each category
  const categoryCounts = useMemo(() => {
    const counts: Record<EstablishmentType, number> = {
      schools: 0,
      supermarkets: 0,
      banks: 0,
      hospitals: 0,
      airports: 0
    };
    
    establishments.forEach(est => {
      counts[est.type]++;
    });
    
    return counts;
  }, [establishments]);
  
  // Get nearest establishment overall
  const nearestEstablishment = useMemo(() => {
    if (establishments.length === 0) return null;
    return establishments.reduce((nearest, current) => 
      current.distance < nearest.distance ? current : nearest
    );
  }, [establishments]);

  // Map options
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

  // Handle map load
  const onMapLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      setMap(mapInstance);
      
      // Validate property location before using it
      if (!propertyLocation || typeof propertyLocation.lat !== 'number' || typeof propertyLocation.lng !== 'number') {
        console.warn('Invalid property location, using default center');
        mapInstance.setCenter(defaultCenter);
        mapInstance.setZoom(12);
        return;
      }
      
      // Create bounds that include property location and all establishments
      const bounds = new google.maps.LatLngBounds();
      
      try {
        // Add property location to bounds
        bounds.extend({ lat: propertyLocation.lat, lng: propertyLocation.lng });
        
        // Add valid establishment coordinates to bounds
        filteredEstablishments.forEach((establishment) => {
          if (establishment.coordinates && 
              typeof establishment.coordinates.lat === 'number' && 
              typeof establishment.coordinates.lng === 'number') {
            bounds.extend({
              lat: establishment.coordinates.lat,
              lng: establishment.coordinates.lng
            });
          }
        });
        
        // Only fit bounds if we have valid data
        if (!bounds.isEmpty()) {
          mapInstance.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
          
          // Set max zoom level
          const listener = google.maps.event.addListener(mapInstance, "idle", () => {
            const currentZoom = mapInstance.getZoom();
            if (currentZoom && currentZoom > 16) {
              mapInstance.setZoom(16);
            }
            google.maps.event.removeListener(listener);
          });
        } else {
          // Fallback to center on property location
          mapInstance.setCenter({ lat: propertyLocation.lat, lng: propertyLocation.lng });
          mapInstance.setZoom(14);
        }
      } catch (error) {
        console.error('Error setting map bounds:', error);
        // Fallback to property location or default
        const center = propertyLocation?.lat && propertyLocation?.lng 
          ? { lat: propertyLocation.lat, lng: propertyLocation.lng }
          : defaultCenter;
        mapInstance.setCenter(center);
        mapInstance.setZoom(12);
      }
    },
    [propertyLocation, filteredEstablishments]
  );

  // Handle map unload
  const onMapUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Handle establishment click (from list)
  const handleEstablishmentClick = useCallback((establishment: NearestEstablishment) => {
    setSelectedEstablishment(establishment);
    
    // Pan to establishment on map
    if (map) {
      map.panTo(establishment.coordinates);
      map.setZoom(15);
    }
  }, [map]);

  // Handle marker click
  const handleMarkerClick = useCallback((establishment: NearestEstablishment) => {
    setSelectedEstablishment(establishment);
  }, []);

  // Handle info window close
  const handleInfoWindowClose = useCallback(() => {
    setSelectedEstablishment(null);
  }, []);

  // Handle property marker click
  const handlePropertyMarkerClick = useCallback(() => {
    setShowPropertyInfo(true);
  }, []);

  // Handle property info window close
  const handlePropertyInfoClose = useCallback(() => {
    setShowPropertyInfo(false);
  }, []);

  // Map controls
  const handleZoomIn = useCallback(() => {
    if (map) {
      const currentZoom = map.getZoom() || 10;
      map.setZoom(currentZoom + 1);
    }
  }, [map]);

  const handleZoomOut = useCallback(() => {
    if (map) {
      const currentZoom = map.getZoom() || 10;
      map.setZoom(currentZoom - 1);
    }
  }, [map]);

  const handleToggleMapType = useCallback(() => {
    const newMapType = mapType === "roadmap" ? "satellite" : "roadmap";
    setMapType(newMapType);
    if (map) {
      map.setMapTypeId(newMapType);
    }
  }, [map, mapType]);
  
  if (error) {
    return (
      <Card className={cn("w-full border-red-100 bg-red-50/30", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center text-center py-8">
            <div className="space-y-6 max-w-md">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center border-2 border-red-200">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Service Temporarily Unavailable</h3>
                <p className="text-red-700 mb-6 text-sm leading-relaxed">
                  We&apos;re having trouble loading nearby amenities right now. This might be due to a network issue or temporary service disruption.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={fetchEstablishments} 
                    variant="outline" 
                    size="sm"
                    className="border-red-200 text-red-700 hover:bg-red-50 transition-all hover:scale-105"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Refresh Page
                  </Button>
                </div>
              </div>
              
              {/* Technical details for debugging (hidden in production) */}
              {process.env.NODE_ENV === 'development' && (
                <details className="text-left bg-red-100 rounded p-3 text-xs">
                  <summary className="cursor-pointer text-red-800 font-medium">Technical Details</summary>
                  <p className="text-red-700 mt-2">{error}</p>
                </details>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-brand-blue/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-brand-blue" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl text-brand-accent">Nearby Amenities</CardTitle>
                <p className="text-brand-muted text-sm">
                  Essential services near {propertyName}
                </p>
              </div>
            </div>
            {nearestEstablishment && (
              <div className="flex items-center gap-2 mt-3 p-2 bg-blue-50 rounded-lg border border-blue-100">
                <Navigation className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800 font-medium">
                  Closest: {nearestEstablishment.name} • {formatDistance(nearestEstablishment.distance / 1000)}
                </span>
              </div>
            )}
          </div>
          
          {/* Quick Stats Badge */}
          {!loading && establishments.length > 0 && (
            <div className="flex items-center gap-3 text-sm">
              <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                <span className="text-green-700 font-medium">{establishments.length}</span>
                <span className="text-green-600 ml-1">locations found</span>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                <span className="text-gray-700 font-medium">{maxDistance}km</span>
                <span className="text-gray-600 ml-1">radius</span>
              </div>
            </div>
          )}
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
                  "flex items-center gap-1.5 transition-all duration-200 min-w-0 flex-shrink-0",
                  "text-xs sm:text-sm px-2 sm:px-3 py-2",
                  isActive && "bg-brand-blue hover:bg-brand-blue/90"
                )}
                aria-pressed={isActive}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">{config.label}</span>
                <Badge variant="secondary" className="ml-1 bg-white/20 text-inherit text-xs px-1">
                  {count}
                </Badge>
              </Button>
            );
          })}
        </div>
        
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <Input
            placeholder={`Search ${ESTABLISHMENT_CATEGORIES[activeCategory].label.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-all duration-200 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <div className="w-4 h-4 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center transition-colors">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </button>
          )}
          
          {/* Search results count */}
          {searchQuery && (
            <div className="absolute -bottom-6 left-0 text-xs text-brand-muted">
              {filteredEstablishments.length} results for &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </div>
        
        {/* Mobile/Tablet Toggle for Map View */}
        <div className="block lg:hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-brand-accent">
              Found {filteredEstablishments.length} {ESTABLISHMENT_CATEGORIES[activeCategory].label}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMobileView(mobileView === "list" ? "map" : "list")}
              className="lg:hidden"
            >
              {mobileView === "list" ? "Show Map" : "Show List"}
            </Button>
          </div>
        </div>

        {/* Split View: List + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px] lg:min-h-[600px]">
          {/* Left Side: Results List */}
          <div className={cn(
            "space-y-4",
            "lg:block", // Always show on desktop
            mobileView === "list" ? "block" : "hidden lg:block" // Show/hide based on mobile view mode
          )}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-brand-accent text-sm sm:text-base">
                Found {filteredEstablishments.length} {ESTABLISHMENT_CATEGORIES[activeCategory].label}
              </h3>
              {nearestEstablishment && (
                <div className="text-xs sm:text-sm text-brand-blue">
                  Nearest: {formatDistance(nearestEstablishment.distance / 1000)}
                </div>
              )}
            </div>
            
            <div className="space-y-3 max-h-[350px] sm:max-h-[400px] lg:max-h-[500px] overflow-y-auto pr-2">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 border rounded-lg bg-gradient-to-r from-gray-50 to-white">
                      <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0" />
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-32 sm:w-48" />
                          <Skeleton className="h-3 w-8 rounded-full" />
                        </div>
                        <Skeleton className="h-3 w-full max-w-64" />
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-3 w-12" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <div className="hidden sm:block">
                        <Skeleton className="h-6 w-12 rounded-full" />
                      </div>
                    </div>
                  ))}
                  
                  {/* Loading indicator */}
                  <div className="flex items-center justify-center py-6">
                    <div className="flex items-center gap-3 text-brand-muted">
                      <Loader2 className="w-5 h-5 animate-spin text-brand-blue" />
                      <span className="text-sm">Finding nearby amenities...</span>
                    </div>
                  </div>
                </div>
              ) : filteredEstablishments.length > 0 ? (
                filteredEstablishments.map((establishment) => {
                  const config = ESTABLISHMENT_CATEGORIES[establishment.type];
                  const Icon = config.icon;
                  const isSelected = selectedEstablishment?.id === establishment.id;
                  
                  return (
                    <div
                      key={establishment.id}
                      onClick={() => handleEstablishmentClick(establishment)}
                      className={cn(
                        "flex items-center justify-between p-3 sm:p-4 border rounded-lg transition-all duration-200 cursor-pointer group touch-manipulation",
                        "active:scale-95 sm:active:scale-100", // Subtle press feedback on mobile
                        isSelected 
                          ? "border-brand-blue bg-brand-blue/5 shadow-sm" 
                          : "border-gray-200 hover:border-brand-blue/30 hover:shadow-sm"
                      )}
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                        <div className={cn(
                          "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 flex-shrink-0",
                          config.color,
                          isSelected && "ring-2 ring-brand-blue ring-offset-2"
                        )}>
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className={cn(
                              "font-semibold transition-colors text-sm sm:text-base truncate",
                              isSelected ? "text-brand-blue" : "text-brand-accent group-hover:text-brand-blue"
                            )}>
                              {establishment.name}
                            </h4>
                            {establishment.rating && (
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span className="text-xs text-brand-muted">
                                  {establishment.rating}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {establishment.openNow !== undefined && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs w-fit",
                                establishment.openNow
                                  ? "text-green-600 border-green-200 bg-green-50"
                                  : "text-red-600 border-red-200 bg-red-50"
                              )}
                            >
                              {establishment.openNow ? 'Open' : 'Closed'}
                            </Badge>
                          )}
                          
                          <p className="text-xs sm:text-sm text-brand-muted line-clamp-1">
                            {establishment.address}
                          </p>
                          <div className="flex items-center gap-3 sm:gap-4 text-xs text-brand-muted">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{formatDistance(establishment.distance / 1000)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{establishment.travelTime} min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-brand-muted">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-6 border-2 border-gray-200">
                    {(() => {
                      const Icon = ESTABLISHMENT_CATEGORIES[activeCategory].icon;
                      return <Icon className="w-8 h-8 text-gray-400" />;
                    })()}
                  </div>
                  <h3 className="font-medium text-brand-accent mb-2">
                    No {ESTABLISHMENT_CATEGORIES[activeCategory].label.toLowerCase()} found
                  </h3>
                  <p className="text-sm mb-4">
                    {searchQuery 
                      ? `No results match "${searchQuery}" in this area`
                      : `We couldn't find any ${ESTABLISHMENT_CATEGORIES[activeCategory].label.toLowerCase()} within ${maxDistance}km of this location`
                    }
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    {searchQuery && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchQuery('')}
                        className="transition-all hover:scale-105"
                      >
                        Clear search
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchEstablishments}
                      className="transition-all hover:scale-105"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Refresh search
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Interactive Map */}
          <div className={cn(
            "relative border border-gray-200 rounded-lg overflow-hidden bg-gray-100",
            "lg:block", // Always show on desktop
            mobileView === "map" ? "block" : "hidden lg:block" // Show/hide based on mobile view mode
          )}>
            {/* Map Loading/Error States */}
            {loadError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-4">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                  <div>
                    <p className="text-brand-accent font-medium">Map unavailable</p>
                    <p className="text-sm text-brand-muted">Please check your internet connection</p>
                  </div>
                </div>
              </div>
            ) : !isLoaded ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                <div className="text-center space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-brand-blue mx-auto" />
                  <p className="text-brand-muted">Loading map...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Map Controls */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-col gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleMapType}
                    className="bg-white/90 backdrop-blur-sm shadow-sm p-2 sm:p-2.5"
                    title={`Switch to ${mapType === "roadmap" ? "satellite" : "map"} view`}
                  >
                    <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
                
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex flex-col gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    className="w-8 h-8 sm:w-9 sm:h-9 p-0 bg-white/90 backdrop-blur-sm shadow-sm touch-manipulation"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    className="w-8 h-8 sm:w-9 sm:h-9 p-0 bg-white/90 backdrop-blur-sm shadow-sm touch-manipulation"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>

                {/* Google Map */}
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={13}
                  options={mapOptions}
                  onLoad={onMapLoad}
                  onUnmount={onMapUnmount}
                >
                  {/* Property Location Marker - only render if valid coordinates */}
                  {propertyLocation && 
                   typeof propertyLocation.lat === 'number' && 
                   typeof propertyLocation.lng === 'number' && (
                    <Marker
                      position={{ lat: propertyLocation.lat, lng: propertyLocation.lng }}
                      icon={{
                        url: "data:image/svg+xml;charset=UTF-8," +
                          encodeURIComponent(`
                            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="18" cy="18" r="14" fill="#FF6B35" stroke="white" stroke-width="4"/>
                              <circle cx="18" cy="18" r="6" fill="white"/>
                              <path d="M18 10L20 14H22L18 18L16 14H14L18 10Z" fill="#FF6B35"/>
                            </svg>
                          `),
                        scaledSize: new google.maps.Size(36, 36),
                        anchor: new google.maps.Point(18, 18),
                      }}
                      title={`Click to view ${propertyName} details`}
                      onClick={handlePropertyMarkerClick}
                    />
                  )}

                  {/* Establishment Markers - only render if valid coordinates */}
                  {filteredEstablishments
                    .filter(establishment => 
                      establishment.coordinates &&
                      typeof establishment.coordinates.lat === 'number' &&
                      typeof establishment.coordinates.lng === 'number'
                    )
                    .map((establishment) => {
                      const config = ESTABLISHMENT_CATEGORIES[establishment.type];
                      const isSelected = selectedEstablishment?.id === establishment.id;
                      
                      return (
                        <Marker
                          key={establishment.id}
                          position={{
                            lat: establishment.coordinates.lat,
                            lng: establishment.coordinates.lng
                          }}
                          icon={{
                            url: "data:image/svg+xml;charset=UTF-8," +
                              encodeURIComponent(`
                                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <circle cx="14" cy="14" r="12" fill="${config.color.includes('blue') ? '#3B82F6' : 
                                    config.color.includes('orange') ? '#F97316' :
                                    config.color.includes('green') ? '#10B981' :
                                    config.color.includes('red') ? '#EF4444' :
                                    '#8B5CF6'}" stroke="white" stroke-width="${isSelected ? '4' : '2'}"/>
                                  <circle cx="14" cy="14" r="4" fill="white"/>
                                </svg>
                              `),
                            scaledSize: new google.maps.Size(28, 28),
                            anchor: new google.maps.Point(14, 14),
                          }}
                          onClick={() => handleMarkerClick(establishment)}
                          title={establishment.name}
                        />
                      );
                    })}

                  {/* Info Window for Establishments */}
                  {selectedEstablishment && (
                    <InfoWindow
                      position={selectedEstablishment.coordinates}
                      onCloseClick={handleInfoWindowClose}
                    >
                      <div className="p-3 max-w-xs">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-brand-accent">
                              {selectedEstablishment.name}
                            </h3>
                            {selectedEstablishment.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span className="text-xs font-medium">
                                  {selectedEstablishment.rating}
                                </span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-brand-muted">
                            {selectedEstablishment.address}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-brand-blue font-medium">
                              <MapPin className="w-3 h-3" />
                              <span>{formatDistance(selectedEstablishment.distance / 1000)}</span>
                            </div>
                            <div className="flex items-center gap-1 text-brand-muted">
                              <Clock className="w-3 h-3" />
                              <span>{selectedEstablishment.travelTime} min</span>
                            </div>
                          </div>
                          {selectedEstablishment.openNow !== undefined && (
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs w-fit",
                                selectedEstablishment.openNow
                                  ? "text-green-600 border-green-200 bg-green-50"
                                  : "text-red-600 border-red-200 bg-red-50"
                              )}
                            >
                              {selectedEstablishment.openNow ? 'Currently Open' : 'Currently Closed'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </InfoWindow>
                  )}

                  {/* Info Window for Property */}
                  {showPropertyInfo && propertyLocation && (
                    <InfoWindow
                      position={propertyLocation}
                      onCloseClick={handlePropertyInfoClose}
                    >
                      <div className="p-3 max-w-sm">
                        <div className="space-y-3">
                          {/* Property Header */}
                          <div className="flex items-start gap-3">
                            {propertyInfo?.image ? (
                              <Image
                                src={propertyInfo.image}
                                alt={propertyInfo.name}
                                width={64}
                                height={64}
                                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                unoptimized
                              />
                            ) : (
                              <div className="w-16 h-16 bg-brand-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Home className="w-8 h-8 text-brand-blue" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <h3 className="font-semibold text-brand-accent text-sm leading-tight">
                                {propertyInfo?.name || propertyName}
                              </h3>
                              <div className="flex items-center gap-1 text-xs text-brand-muted mt-1">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{propertyInfo?.location || neighborhood}</span>
                              </div>
                              {propertyInfo?.price && (
                                <div className="mt-2">
                                  <span className="bg-brand-blue text-white px-2 py-1 rounded text-xs font-semibold">
                                    {propertyInfo.price}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Property Features */}
                          {(propertyInfo?.bedrooms || propertyInfo?.bathrooms || propertyInfo?.size) && (
                            <div className="flex items-center gap-4 text-xs bg-gray-50 rounded p-2">
                              {propertyInfo.bedrooms && (
                                <div className="flex items-center gap-1">
                                  <Bed className="w-3 h-3 text-brand-blue" />
                                  <span>{propertyInfo.bedrooms} bed</span>
                                </div>
                              )}
                              {propertyInfo.bathrooms && (
                                <div className="flex items-center gap-1">
                                  <Bath className="w-3 h-3 text-brand-blue" />
                                  <span>{propertyInfo.bathrooms} bath</span>
                                </div>
                              )}
                              {propertyInfo.size && (
                                <div className="flex items-center gap-1">
                                  <Maximize className="w-3 h-3 text-brand-blue" />
                                  <span>{propertyInfo.size}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Property Type */}
                          {propertyInfo?.type && (
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-xs">
                                {propertyInfo.type}
                              </Badge>
                            </div>
                          )}

                          {/* Developer */}
                          {propertyInfo?.developer && (
                            <div className="flex items-center gap-2 text-xs text-brand-muted">
                              <User className="w-3 h-3" />
                              <span>Listed by {propertyInfo.developer}</span>
                            </div>
                          )}

                          {/* Nearby amenities count */}
                          {establishments.length > 0 && (
                            <div className="text-xs text-brand-blue bg-blue-50 rounded p-2">
                              <span className="font-medium">{establishments.length} amenities</span> found nearby
                            </div>
                          )}
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </>
            )}
          </div>
        </div>
        
        {/* Footer Stats */}
        {!loading && establishments.length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-brand-muted">
              <div className="flex items-center gap-1">
                <span className="font-medium">Total:</span>
                <span>{establishments.length}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium">Radius:</span>
                <span>{maxDistance}km</span>
              </div>
              {nearestEstablishment && (
                <div className="flex items-center gap-1 col-span-2 sm:col-span-1">
                  <span className="font-medium">Nearest:</span>
                  <span>{formatDistance(nearestEstablishment.distance / 1000)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
    </Card>
  );
}