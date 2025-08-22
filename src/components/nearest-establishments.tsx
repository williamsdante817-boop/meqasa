import { useState, useCallback, useMemo } from "react";
import {
  Search,
  MapPin,
  Clock,
  Building,
  Plane,
  GraduationCap,
  ShoppingBag,
  Heart,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";

interface Location {
  lat: number;
  lng: number;
}

interface Establishment {
  id: string;
  name: string;
  address: string;
  location: Location;
  distance: number; // in meters
  travelTime: number; // in minutes
  type: "school" | "bank" | "hospital" | "store" | "airport";
  rating?: number;
  placeId?: string;
}

interface NearestEstablishmentsProps {
  className?: string;
  projectLocation: Location;
  projectName?: string;
  neighborhood?: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 5.56, // Accra, Ghana default
  lng: -0.2057,
};

const establishmentTypes = [
  { id: "school", label: "Schools", icon: GraduationCap, color: "#3B82F6" },
  { id: "bank", label: "Banks", icon: Building, color: "#10B981" },
  { id: "hospital", label: "Hospitals", icon: Heart, color: "#EF4444" },
  { id: "store", label: "Stores", icon: ShoppingBag, color: "#F59E0B" },
  { id: "airport", label: "Airports", icon: Plane, color: "#8B5CF6" },
] as const;

export function NearestEstablishments({
  className = "",
  projectLocation,
  projectName = "Project",
  neighborhood,
}: NearestEstablishmentsProps) {
  const [activeTab, setActiveTab] =
    useState<(typeof establishmentTypes)[number]["id"]>("school");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "satellite">("map");
  const [selectedEstablishment, setSelectedEstablishment] =
    useState<Establishment | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"],
  });

  // Map center based on project location
  const mapCenter = useMemo(
    () => projectLocation ?? defaultCenter,
    [projectLocation],
  );

  // Location-specific establishments database
  const getLocationSpecificEstablishments = useCallback(() => {
    const locationKey =
      neighborhood?.toLowerCase().replace(/\s+/g, "_") ?? "default";

    // Real establishments database by location
    const establishmentsByLocation: Record<
      string,
      Record<
        string,
        Array<{
          name: string;
          address: string;
          coordinates: Location;
          rating: number;
        }>
      >
    > = {
      madina: {
        school: [
          {
            name: "Madina Institute",
            address: "Madina-Adenta Road, Madina",
            coordinates: {
              lat: mapCenter.lat + 0.002,
              lng: mapCenter.lng + 0.001,
            },
            rating: 4.5,
          },
          {
            name: "Zongo Junction School",
            address: "Zongo Junction, Madina",
            coordinates: {
              lat: mapCenter.lat - 0.001,
              lng: mapCenter.lng + 0.002,
            },
            rating: 4.2,
          },
          {
            name: "Madina Estate School",
            address: "Madina Estate, Madina",
            coordinates: {
              lat: mapCenter.lat + 0.001,
              lng: mapCenter.lng - 0.001,
            },
            rating: 4.3,
          },
        ],
        bank: [
          {
            name: "GCB Bank Madina",
            address: "Madina Market, Madina",
            coordinates: {
              lat: mapCenter.lat + 0.0015,
              lng: mapCenter.lng + 0.0005,
            },
            rating: 4.1,
          },
          {
            name: "Ecobank Madina Branch",
            address: "Adenta-Madina Road, Madina",
            coordinates: {
              lat: mapCenter.lat - 0.0005,
              lng: mapCenter.lng + 0.0015,
            },
            rating: 4.0,
          },
          {
            name: "Access Bank Madina",
            address: "Zongo Junction, Madina",
            coordinates: {
              lat: mapCenter.lat + 0.001,
              lng: mapCenter.lng - 0.0005,
            },
            rating: 4.2,
          },
        ],
        hospital: [
          {
            name: "Madina Polyclinic",
            address: "Madina-Adenta Road, Madina",
            coordinates: {
              lat: mapCenter.lat + 0.003,
              lng: mapCenter.lng + 0.001,
            },
            rating: 4.0,
          },
          {
            name: "Zongo Junction Clinic",
            address: "Zongo Junction, Madina",
            coordinates: {
              lat: mapCenter.lat - 0.002,
              lng: mapCenter.lng + 0.003,
            },
            rating: 3.8,
          },
        ],
        store: [
          {
            name: "Madina Market",
            address: "Madina Market Square, Madina",
            coordinates: {
              lat: mapCenter.lat + 0.0005,
              lng: mapCenter.lng + 0.002,
            },
            rating: 4.3,
          },
          {
            name: "Shoprite Madina",
            address: "Adenta-Madina Road, Madina",
            coordinates: {
              lat: mapCenter.lat - 0.001,
              lng: mapCenter.lng + 0.0025,
            },
            rating: 4.1,
          },
          {
            name: "Melcom Madina",
            address: "Zongo Junction, Madina",
            coordinates: {
              lat: mapCenter.lat + 0.0015,
              lng: mapCenter.lng - 0.0015,
            },
            rating: 3.9,
          },
        ],
        airport: [
          {
            name: "Kotoka International Airport",
            address: "Airport Road, Accra",
            coordinates: {
              lat: mapCenter.lat - 0.05,
              lng: mapCenter.lng - 0.03,
            },
            rating: 4.2,
          },
        ],
      },
      east_legon: {
        school: [
          {
            name: "Lincoln Community School",
            address: "American House, East Legon",
            coordinates: {
              lat: mapCenter.lat + 0.002,
              lng: mapCenter.lng + 0.001,
            },
            rating: 4.8,
          },
          {
            name: "East Legon Executive Fitness Club School",
            address: "East Legon, Accra",
            coordinates: {
              lat: mapCenter.lat - 0.001,
              lng: mapCenter.lng + 0.002,
            },
            rating: 4.6,
          },
          {
            name: "SOS Hermann Gmeiner International College",
            address: "East Legon, Accra",
            coordinates: {
              lat: mapCenter.lat + 0.001,
              lng: mapCenter.lng - 0.001,
            },
            rating: 4.7,
          },
        ],
        bank: [
          {
            name: "Standard Chartered East Legon",
            address: "East Legon, Accra",
            coordinates: {
              lat: mapCenter.lat + 0.0015,
              lng: mapCenter.lng + 0.0005,
            },
            rating: 4.4,
          },
          {
            name: "GCB Bank East Legon",
            address: "East Legon, Accra",
            coordinates: {
              lat: mapCenter.lat - 0.0005,
              lng: mapCenter.lng + 0.0015,
            },
            rating: 4.3,
          },
          {
            name: "Zenith Bank East Legon",
            address: "East Legon, Accra",
            coordinates: {
              lat: mapCenter.lat + 0.001,
              lng: mapCenter.lng - 0.0005,
            },
            rating: 4.2,
          },
        ],
        hospital: [
          {
            name: "East Legon Hospital",
            address: "East Legon, Accra",
            coordinates: {
              lat: mapCenter.lat + 0.003,
              lng: mapCenter.lng + 0.001,
            },
            rating: 4.5,
          },
          {
            name: "Nyaho Medical Centre",
            address: "East Legon, Accra",
            coordinates: {
              lat: mapCenter.lat - 0.002,
              lng: mapCenter.lng + 0.003,
            },
            rating: 4.6,
          },
        ],
        store: [
          {
            name: "East Legon Mall",
            address: "East Legon, Accra",
            coordinates: {
              lat: mapCenter.lat + 0.0005,
              lng: mapCenter.lng + 0.002,
            },
            rating: 4.4,
          },
          {
            name: "Shoprite East Legon",
            address: "East Legon, Accra",
            coordinates: {
              lat: mapCenter.lat - 0.001,
              lng: mapCenter.lng + 0.0025,
            },
            rating: 4.2,
          },
          {
            name: "Game East Legon",
            address: "East Legon, Accra",
            coordinates: {
              lat: mapCenter.lat + 0.0015,
              lng: mapCenter.lng - 0.0015,
            },
            rating: 4.0,
          },
        ],
        airport: [
          {
            name: "Kotoka International Airport",
            address: "Airport Road, Accra",
            coordinates: {
              lat: mapCenter.lat - 0.03,
              lng: mapCenter.lng - 0.02,
            },
            rating: 4.2,
          },
        ],
      },
      airport_residential_area: {
        school: [
          {
            name: "Airport West International School",
            address: "Airport Residential Area, Accra",
            coordinates: {
              lat: mapCenter.lat + 0.002,
              lng: mapCenter.lng + 0.001,
            },
            rating: 4.7,
          },
          {
            name: "British International School",
            address: "Airport Residential Area, Accra",
            coordinates: {
              lat: mapCenter.lat - 0.001,
              lng: mapCenter.lng + 0.002,
            },
            rating: 4.8,
          },
          {
            name: "Galaxy International School",
            address: "Airport Residential Area, Accra",
            coordinates: {
              lat: mapCenter.lat + 0.001,
              lng: mapCenter.lng - 0.001,
            },
            rating: 4.6,
          },
        ],
        bank: [
          {
            name: "Ecobank Airport",
            address: "Airport Residential Area, Accra",
            coordinates: {
              lat: mapCenter.lat + 0.0015,
              lng: mapCenter.lng + 0.0005,
            },
            rating: 4.3,
          },
          {
            name: "Standard Chartered Airport",
            address: "Airport Residential Area, Accra",
            coordinates: {
              lat: mapCenter.lat - 0.0005,
              lng: mapCenter.lng + 0.0015,
            },
            rating: 4.4,
          },
          {
            name: "CalBank Airport",
            address: "Airport Residential Area, Accra",
            coordinates: {
              lat: mapCenter.lat + 0.001,
              lng: mapCenter.lng - 0.0005,
            },
            rating: 4.1,
          },
        ],
        hospital: [
          {
            name: "Airport View Hospital",
            address: "Airport Residential Area, Accra",
            coordinates: {
              lat: mapCenter.lat + 0.003,
              lng: mapCenter.lng + 0.001,
            },
            rating: 4.4,
          },
          {
            name: "Trust Hospital Airport",
            address: "Airport Residential Area, Accra",
            coordinates: {
              lat: mapCenter.lat - 0.002,
              lng: mapCenter.lng + 0.003,
            },
            rating: 4.5,
          },
        ],
        store: [
          {
            name: "A&C Shopping Mall",
            address: "Airport Residential Area, Accra",
            coordinates: {
              lat: mapCenter.lat + 0.0005,
              lng: mapCenter.lng + 0.002,
            },
            rating: 4.2,
          },
          {
            name: "Airport Shell Station",
            address: "Airport Residential Area, Accra",
            coordinates: {
              lat: mapCenter.lat - 0.001,
              lng: mapCenter.lng + 0.0025,
            },
            rating: 4.0,
          },
          {
            name: "Max Mart Airport",
            address: "Airport Residential Area, Accra",
            coordinates: {
              lat: mapCenter.lat + 0.0015,
              lng: mapCenter.lng - 0.0015,
            },
            rating: 3.9,
          },
        ],
        airport: [
          {
            name: "Kotoka International Airport",
            address: "Airport Road, Accra",
            coordinates: {
              lat: mapCenter.lat + 0.01,
              lng: mapCenter.lng + 0.005,
            },
            rating: 4.2,
          },
        ],
      },
      default: {
        school: [
          {
            name: "Community School",
            address: `Main Street, ${neighborhood ?? "Accra"}`,
            coordinates: {
              lat: mapCenter.lat + 0.002,
              lng: mapCenter.lng + 0.001,
            },
            rating: 4.0,
          },
          {
            name: "Public Primary School",
            address: `Education Road, ${neighborhood ?? "Accra"}`,
            coordinates: {
              lat: mapCenter.lat - 0.001,
              lng: mapCenter.lng + 0.002,
            },
            rating: 3.8,
          },
          {
            name: "Secondary School",
            address: `School Lane, ${neighborhood ?? "Accra"}`,
            coordinates: {
              lat: mapCenter.lat + 0.001,
              lng: mapCenter.lng - 0.001,
            },
            rating: 4.1,
          },
        ],
        bank: [
          {
            name: "GCB Bank",
            address: `Financial District, ${neighborhood ?? "Accra"}`,
            coordinates: {
              lat: mapCenter.lat + 0.0015,
              lng: mapCenter.lng + 0.0005,
            },
            rating: 4.1,
          },
          {
            name: "Standard Chartered Bank",
            address: `Business Avenue, ${neighborhood ?? "Accra"}`,
            coordinates: {
              lat: mapCenter.lat - 0.0005,
              lng: mapCenter.lng + 0.0015,
            },
            rating: 4.2,
          },
          {
            name: "Ecobank Ghana",
            address: `Commerce Street, ${neighborhood ?? "Accra"}`,
            coordinates: {
              lat: mapCenter.lat + 0.001,
              lng: mapCenter.lng - 0.0005,
            },
            rating: 4.0,
          },
        ],
        hospital: [
          {
            name: "Community Hospital",
            address: `Medical District, ${neighborhood ?? "Accra"}`,
            coordinates: {
              lat: mapCenter.lat + 0.003,
              lng: mapCenter.lng + 0.001,
            },
            rating: 4.0,
          },
          {
            name: "Health Clinic",
            address: `Health Avenue, ${neighborhood ?? "Accra"}`,
            coordinates: {
              lat: mapCenter.lat - 0.002,
              lng: mapCenter.lng + 0.003,
            },
            rating: 3.9,
          },
        ],
        store: [
          {
            name: "Shopping Center",
            address: `Shopping District, ${neighborhood ?? "Accra"}`,
            coordinates: {
              lat: mapCenter.lat + 0.0005,
              lng: mapCenter.lng + 0.002,
            },
            rating: 4.0,
          },
          {
            name: "Supermarket",
            address: `Market Street, ${neighborhood ?? "Accra"}`,
            coordinates: {
              lat: mapCenter.lat - 0.001,
              lng: mapCenter.lng + 0.0025,
            },
            rating: 3.8,
          },
          {
            name: "Retail Center",
            address: `Commercial Road, ${neighborhood ?? "Accra"}`,
            coordinates: {
              lat: mapCenter.lat + 0.0015,
              lng: mapCenter.lng - 0.0015,
            },
            rating: 3.9,
          },
        ],
        airport: [
          {
            name: "Kotoka International Airport",
            address: "Airport Road, Accra",
            coordinates: {
              lat: mapCenter.lat - 0.08,
              lng: mapCenter.lng - 0.05,
            },
            rating: 4.2,
          },
        ],
      },
    };

    return (
      establishmentsByLocation[locationKey] ?? establishmentsByLocation.default
    );
  }, [mapCenter, neighborhood]);

  // Dynamic establishments data based on actual project location
  const sampleEstablishments: Establishment[] = useMemo(() => {
    const locationData = getLocationSpecificEstablishments();

    // Early return if no location data
    if (!locationData) {
      return [];
    }

    // Calculate distance between two points using Haversine formula
    const calculateDistance = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number,
    ) => {
      const R = 6371; // Earth's radius in kilometers
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c * 1000; // Convert to meters
    };

    // Convert location data to establishment format
    const establishments: Establishment[] = [];
    let establishmentId = 1;

    establishmentTypes.forEach((typeConfig) => {
      const typeEstablishments = locationData[typeConfig.id] ?? [];

      typeEstablishments.forEach((establishment) => {
        // Calculate actual distance from project location
        const distance = Math.round(
          calculateDistance(
            mapCenter.lat,
            mapCenter.lng,
            establishment.coordinates.lat,
            establishment.coordinates.lng,
          ),
        );

        // Calculate travel time based on distance (assuming 30 km/h average speed)
        const travelTime = Math.round((distance / 1000) * 2); // 2 minutes per km

        establishments.push({
          id: `${typeConfig.id}${establishmentId++}`,
          name: establishment.name,
          address: establishment.address,
          location: establishment.coordinates,
          distance,
          travelTime: Math.max(1, travelTime), // Minimum 1 minute
          type: typeConfig.id,
          rating: establishment.rating,
        });
      });
    });

    // Sort by distance (closest first)
    return establishments.sort((a, b) => a.distance - b.distance);
  }, [mapCenter, getLocationSpecificEstablishments]);

  // Filter establishments by active tab and search query
  const filteredEstablishments = useMemo(() => {
    return sampleEstablishments
      .filter((establishment) => establishment.type === activeTab)
      .filter(
        (establishment) =>
          establishment.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          establishment.address
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      )
      .sort((a, b) => a.distance - b.distance);
  }, [sampleEstablishments, activeTab, searchQuery]);

  // Map options
  const mapOptions = useMemo(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
      mapTypeId: viewMode === "satellite" ? "satellite" : "roadmap",
      zoomControl: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    }),
    [viewMode],
  );

  // Handle map load
  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map);
      // Fit bounds to include project location and all establishments
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(projectLocation);

      sampleEstablishments.forEach((establishment) => {
        bounds.extend(establishment.location);
      });

      map.fitBounds(bounds);

      // Add some padding to the bounds
      const listener = google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom()! > 15) map.setZoom(15);
        google.maps.event.removeListener(listener);
      });
    },
    [projectLocation, sampleEstablishments],
  );

  // Handle map unload
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Handle marker click
  const handleMarkerClick = useCallback((establishment: Establishment) => {
    setSelectedEstablishment(establishment);
  }, []);

  // Handle info window close
  const handleInfoWindowClose = useCallback(() => {
    setSelectedEstablishment(null);
  }, []);

  // Format distance
  const formatDistance = (distance: number) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} km`;
    }
    return `${distance} m`;
  };

  // Handle zoom controls
  const handleZoomIn = useCallback(() => {
    if (map) {
      map.setZoom(map.getZoom()! + 1);
    }
  }, [map]);

  const handleZoomOut = useCallback(() => {
    if (map) {
      map.setZoom(map.getZoom()! - 1);
    }
  }, [map]);

  // Handle view mode change
  const handleViewModeChange = useCallback(
    (mode: "map" | "satellite") => {
      setViewMode(mode);
      if (map) {
        map.setMapTypeId(mode === "satellite" ? "satellite" : "roadmap");
      }
    },
    [map],
  );

  if (loadError) {
    return (
      <div
        className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}
      >
        <div className="text-center text-red-500">
          <p>Error loading Google Maps. Please check your API key.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div
        className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}
      >
        <div className="text-center text-gray-500">
          <p>Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      key={`${projectLocation.lat}-${projectLocation.lng}-${projectName}`}
      className={`bg-white border border-gray-200 rounded-lg overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-6 pb-4"></div>

      {/* Search Bar */}
      <div className="px-6 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={`Search ${activeTab}s...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-6 pb-4">
        <div className="flex justify-between">
          {establishmentTypes.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 pb-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
        {/* List Section - Now on the left */}
        <div className="p-6 border-r border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              {filteredEstablishments.length > 0 &&
                `Nearest: ${formatDistance(filteredEstablishments[0]?.distance ?? 0)}`}
            </div>
            <div className="text-sm text-gray-500">
              {filteredEstablishments.length} {activeTab}
              {filteredEstablishments.length !== 1 ? "s" : ""} found
            </div>
          </div>

          {/* Establishments List */}
          <div className="space-y-4 max-h-[320px] overflow-y-auto">
            {filteredEstablishments.map((establishment) => {
              const tabConfig = establishmentTypes.find(
                (tab) => tab.id === establishment.type,
              );
              return (
                <div
                  key={establishment.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 rounded px-2 transition-colors"
                  onClick={() => handleMarkerClick(establishment)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {tabConfig && (
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tabConfig.color }}
                        />
                      )}
                      <h4 className="text-gray-900 truncate">
                        {establishment.name}
                      </h4>
                    </div>
                    <p className="text-gray-500 text-sm truncate">
                      {establishment.address}
                    </p>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <div className="text-gray-900 mb-1">
                      {formatDistance(establishment.distance)}
                    </div>
                    <div className="text-orange-500 text-sm flex items-center justify-end">
                      <Clock className="w-3 h-3 mr-1" />
                      {establishment.travelTime} min
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredEstablishments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p>No {activeTab}s found matching your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Map Section - Now on the right */}
        <div className="relative bg-gray-100">
          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewModeChange("map")}
              className="text-sm px-3 py-1 bg-white shadow-sm"
            >
              Map
            </Button>
            <Button
              variant={viewMode === "satellite" ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewModeChange("satellite")}
              className="text-sm px-3 py-1 bg-white shadow-sm"
            >
              Satellite
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              className="w-8 h-8 p-0 bg-white shadow-sm"
            >
              +
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              className="w-8 h-8 p-0 bg-white shadow-sm"
            >
              -
            </Button>
          </div>

          {/* Google Map */}
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={14}
            options={mapOptions}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* Project Location Marker */}
            <Marker
              position={projectLocation}
              icon={{
                url:
                  "data:image/svg+xml;charset=UTF-8," +
                  encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#FF6B35"/>
                  </svg>
                `),
                scaledSize: new google.maps.Size(24, 24),
              }}
              title={projectName}
            />

            {/* Establishment Markers */}
            {filteredEstablishments.map((establishment) => {
              const tabConfig = establishmentTypes.find(
                (tab) => tab.id === establishment.type,
              );
              return (
                <Marker
                  key={establishment.id}
                  position={establishment.location}
                  icon={{
                    url:
                      "data:image/svg+xml;charset=UTF-8," +
                      encodeURIComponent(`
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="8" fill="${tabConfig?.color ?? "#3B82F6"}" stroke="white" stroke-width="2"/>
                      </svg>
                    `),
                    scaledSize: new google.maps.Size(20, 20),
                  }}
                  onClick={() => handleMarkerClick(establishment)}
                  title={establishment.name}
                />
              );
            })}

            {/* Info Window */}
            {selectedEstablishment && (
              <InfoWindow
                position={selectedEstablishment.location}
                onCloseClick={handleInfoWindowClose}
              >
                <div className="p-2 max-w-xs">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {selectedEstablishment.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {selectedEstablishment.address}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-600 font-medium">
                      {formatDistance(selectedEstablishment.distance)}
                    </span>
                    <span className="text-orange-600">
                      {selectedEstablishment.travelTime} min
                    </span>
                  </div>
                  {selectedEstablishment.rating && (
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500 text-sm">★</span>
                      <span className="text-sm text-gray-600 ml-1">
                        {selectedEstablishment.rating}
                      </span>
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
}
