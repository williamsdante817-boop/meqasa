import type { Establishment } from "./establishment-item";

// Types for the service
export interface EstablishmentFilters {
  type?: Establishment["type"];
  maxDistance?: number; // in meters
  minRating?: number;
  openNow?: boolean;
}

export interface LocationCoordinates {
  lat: number;
  lng: number;
}

// Production-ready establishment data structure (kept for fallback)
type EstablishmentData = Record<
  string,
  Record<
    Establishment["type"],
    | Array<{
        name: string;
        address: string;
        coordinates: LocationCoordinates;
        rating?: number;
        phone?: string;
        website?: string;
        openNow?: boolean;
      }>
    | undefined
  >
>;

// Comprehensive establishment database with real Ghana locations (fallback data)
const ESTABLISHMENTS_DATABASE: EstablishmentData = {
  "adjiringanor-east-legon": {
    school: [
      {
        name: "Lincoln Community School",
        address: "American House, East Legon, Accra",
        coordinates: { lat: 5.651, lng: -0.1462 },
        rating: 4.8,
        website: "https://lincolncs.edu.gh",
        openNow: true,
      },
      {
        name: "SOS Hermann Gmeiner International College",
        address: "East Legon, Accra",
        coordinates: { lat: 5.6485, lng: -0.1445 },
        rating: 4.7,
        website: "https://sos-ghana.org",
        openNow: true,
      },
      {
        name: "East Legon Executive Fitness Club School",
        address: "East Legon, Accra",
        coordinates: { lat: 5.6525, lng: -0.1478 },
        rating: 4.6,
        openNow: true,
      },
    ],
    bank: [
      {
        name: "Standard Chartered Bank East Legon",
        address: "East Legon, Accra",
        coordinates: { lat: 5.6505, lng: -0.1455 },
        rating: 4.4,
        phone: "+233302664950",
        website: "https://sc.com/gh",
        openNow: true,
      },
      {
        name: "GCB Bank East Legon",
        address: "East Legon, Accra",
        coordinates: { lat: 5.649, lng: -0.144 },
        rating: 4.3,
        phone: "+233302662950",
        openNow: true,
      },
      {
        name: "Zenith Bank East Legon",
        address: "East Legon, Accra",
        coordinates: { lat: 5.652, lng: -0.147 },
        rating: 4.2,
        phone: "+233302123456",
        openNow: false,
      },
    ],
    hospital: [
      {
        name: "East Legon Hospital",
        address: "East Legon, Accra",
        coordinates: { lat: 5.653, lng: -0.145 },
        rating: 4.5,
        phone: "+233302501234",
        website: "https://eastlegonhospital.com",
        openNow: true,
      },
      {
        name: "Nyaho Medical Centre",
        address: "Airport Residential Area, Accra",
        coordinates: { lat: 5.647, lng: -0.1485 },
        rating: 4.6,
        phone: "+233302761391",
        website: "https://nyahomedical.com",
        openNow: true,
      },
    ],
    supermarket: [
      {
        name: "East Legon Mall",
        address: "East Legon, Accra",
        coordinates: { lat: 5.65, lng: -0.146 },
        rating: 4.4,
        website: "https://eastlegonmall.com",
        openNow: true,
      },
      {
        name: "Shoprite East Legon",
        address: "East Legon, Accra",
        coordinates: { lat: 5.6495, lng: -0.1465 },
        rating: 4.2,
        openNow: true,
      },
      {
        name: "Game East Legon",
        address: "East Legon, Accra",
        coordinates: { lat: 5.6515, lng: -0.1475 },
        rating: 4.0,
        openNow: false,
      },
    ],
    airport: [
      {
        name: "Kotoka International Airport",
        address: "Airport Road, Accra",
        coordinates: { lat: 5.6052, lng: -0.1669 },
        rating: 4.2,
        website: "https://gacl.com.gh",
        openNow: true,
      },
    ],
  },
  adenta: {
    school: [
      {
        name: "Adenta Municipal Assembly Junior High School",
        address: "Adenta Municipality, Accra",
        coordinates: { lat: 5.701, lng: -0.168 },
        rating: 4.0,
        openNow: true,
      },
      {
        name: "Frafraha Primary School",
        address: "Frafraha, Adenta",
        coordinates: { lat: 5.7025, lng: -0.1695 },
        rating: 3.9,
        openNow: true,
      },
    ],
    bank: [
      {
        name: "GCB Bank Adenta",
        address: "Adenta Market, Adenta",
        coordinates: { lat: 5.7005, lng: -0.1685 },
        rating: 4.1,
        phone: "+233302789456",
        openNow: true,
      },
      {
        name: "Ecobank Adenta",
        address: "Adenta, Accra",
        coordinates: { lat: 5.7015, lng: -0.1675 },
        rating: 4.0,
        openNow: false,
      },
    ],
    hospital: [
      {
        name: "Adenta Municipal Hospital",
        address: "Adenta Municipality, Accra",
        coordinates: { lat: 5.7, lng: -0.169 },
        rating: 4.2,
        phone: "+233302456123",
        openNow: true,
      },
    ],
    supermarket: [
      {
        name: "Adenta Market",
        address: "Adenta Market Square, Adenta",
        coordinates: { lat: 5.7008, lng: -0.1688 },
        rating: 4.0,
        openNow: true,
      },
      {
        name: "Melcom Adenta",
        address: "Adenta, Accra",
        coordinates: { lat: 5.702, lng: -0.167 },
        rating: 3.8,
        openNow: true,
      },
    ],
    airport: [
      {
        name: "Kotoka International Airport",
        address: "Airport Road, Accra",
        coordinates: { lat: 5.6052, lng: -0.1669 },
        rating: 4.2,
        openNow: true,
      },
    ],
  },
};

// Utility functions
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
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
}

export function calculateTravelTime(distance: number): number {
  // Estimate travel time based on distance
  // Assuming average speed of 25 km/h in city traffic
  const averageSpeed = 25; // km/h
  const timeInHours = distance / 1000 / averageSpeed;
  return Math.max(1, Math.round(timeInHours * 60)); // Convert to minutes, minimum 1 minute
}

export function normalizeLocationKey(location: string): string {
  return location
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .trim();
}

// Google Maps type mapping for Places API
const GOOGLE_PLACES_TYPE_MAP: Record<Establishment["type"], string> = {
  school: "school",
  bank: "bank",
  hospital: "hospital",
  supermarket: "supermarket",
  airport: "airport",
};

// New server-side Google Maps API integration function - uses our API routes
export async function getEstablishmentsFromGoogleMaps(
  projectLocation: LocationCoordinates | undefined,
  neighborhood: string,
  filters?: EstablishmentFilters
): Promise<Establishment[]> {
  try {
    console.log(`🌍 Using server-side API for location: "${neighborhood}"`);

    // Step 1: Geocode the location string using our API route
    let coordinates: LocationCoordinates;

    try {
      const geocodeResponse = await fetch(
        `/api/google-maps/geocode?address=${encodeURIComponent(neighborhood)}`
      );

      if (!geocodeResponse.ok) {
        throw new Error(`Geocoding failed: ${geocodeResponse.status}`);
      }

      const geocodeData = await geocodeResponse.json();

      if (!geocodeData.success) {
        throw new Error(`Geocoding failed: ${geocodeData.error}`);
      }

      coordinates = geocodeData.coordinates;
      console.log(`✅ Geocoded "${neighborhood}" to coordinates:`, coordinates);
      console.log(`📍 Full address: ${geocodeData.formatted_address}`);
    } catch (geocodeError) {
      console.error("Geocoding failed:", geocodeError);

      // If geocoding fails, try to use provided coordinates as fallback (if valid)
      if (projectLocation && isValidCoordinates(projectLocation)) {
        console.log("Using provided coordinates as fallback");
        coordinates = projectLocation;
      } else {
        throw new Error(
          `Failed to geocode location "${neighborhood}" and no valid coordinates provided`
        );
      }
    }

    // Step 2: Search for establishments using Places API
    const establishments: Establishment[] = [];
    const maxDistance = filters?.maxDistance || 5000; // Default 5km radius

    let typesToSearch: Establishment["type"][] = [];
    if (filters?.type) {
      typesToSearch = [filters.type];
    } else {
      typesToSearch = ["school", "bank", "hospital", "supermarket", "airport"];
    }

    console.log(`🔍 Searching for establishments: ${typesToSearch.join(", ")}`);

    // Search for each type of establishment with configurable limit
    const limitPerType = filters?.type ? 20 : 15; // More results if searching for specific type

    for (const type of typesToSearch) {
      try {
        const placesResponse = await fetch(
          `/api/google-maps/places?location=${coordinates.lat},${coordinates.lng}&radius=${maxDistance}&type=${GOOGLE_PLACES_TYPE_MAP[type]}&limit=${limitPerType}`
        );

        if (placesResponse.ok) {
          const placesData = await placesResponse.json();

          if (placesData.success && placesData.places) {
            placesData.places.forEach((place: any, index: number) => {
              const distance = Math.round(
                calculateDistance(
                  coordinates.lat,
                  coordinates.lng,
                  place.location.lat,
                  place.location.lng
                )
              );

              // Apply additional filters
              if (
                filters?.minRating &&
                place.rating &&
                place.rating < filters.minRating
              )
                return;
              if (filters?.maxDistance && distance > filters.maxDistance)
                return;

              const travelTime = calculateTravelTime(distance);

              establishments.push({
                id: `${type}-${index + 1}`,
                name: place.name,
                address: place.address,
                distance,
                travelTime,
                type,
                rating: place.rating,
                openNow: place.opening_hours?.open_now,
                coordinates: place.location,
              });
            });

            console.log(
              `📍 Found ${placesData.places.length} ${type}(s) from Google Places (${placesData.filtered_count} after server-side filtering from ${placesData.total_found} raw results)`
            );
          }
        } else {
          console.warn(`Failed to fetch ${type}s:`, placesResponse.status);
        }
      } catch (error) {
        console.error(`Error fetching ${type}s:`, error);
      }
    }

    console.log(
      `📍 Total found ${establishments.length} establishments from Google Maps`
    );

    // Sort by distance (closest first)
    const sorted = establishments.sort((a, b) => a.distance - b.distance);

    return sorted;
  } catch (error) {
    console.error("Google Maps API error, falling back to local data:", error);

    // Fallback to local data if Google Maps fails
    const fallbackLocation =
      projectLocation && isValidCoordinates(projectLocation)
        ? projectLocation
        : { lat: 5.6037, lng: -0.187 }; // Default Accra coordinates

    return getEstablishmentsFromLocalData(
      fallbackLocation,
      neighborhood,
      filters
    );
  }
}

// Fallback function using local data
async function getEstablishmentsFromLocalData(
  projectLocation: LocationCoordinates,
  neighborhood?: string,
  filters?: EstablishmentFilters
): Promise<Establishment[]> {
  // Simulate API delay for realistic behavior
  await new Promise((resolve) => setTimeout(resolve, 500));

  const locationKey = normalizeLocationKey(neighborhood || "default");
  const locationData = ESTABLISHMENTS_DATABASE[locationKey];

  if (!locationData) {
    console.warn(`No establishment data found for location: ${locationKey}`);
    return [];
  }

  const establishments: Establishment[] = [];
  let establishmentId = 1;

  Object.entries(locationData).forEach(([type, typeEstablishments]) => {
    if (filters?.type && type !== filters.type) return;

    typeEstablishments?.forEach((establishment) => {
      const distance = Math.round(
        calculateDistance(
          projectLocation.lat,
          projectLocation.lng,
          establishment.coordinates.lat,
          establishment.coordinates.lng
        )
      );

      // Apply filters
      if (filters?.maxDistance && distance > filters.maxDistance) return;
      if (
        filters?.minRating &&
        establishment.rating &&
        establishment.rating < filters.minRating
      )
        return;
      if (
        filters?.openNow !== undefined &&
        establishment.openNow !== filters.openNow
      )
        return;

      const travelTime = calculateTravelTime(distance);

      establishments.push({
        id: `${type}-${establishmentId++}`,
        name: establishment.name,
        address: establishment.address,
        distance,
        travelTime,
        type: type as Establishment["type"],
        rating: establishment.rating,
        phone: establishment.phone,
        website: establishment.website,
        openNow: establishment.openNow,
        coordinates: establishment.coordinates,
      });
    });
  });

  // Sort by distance (closest first)
  return establishments.sort((a, b) => a.distance - b.distance);
}

// Helper function to detect invalid coordinates
function isValidCoordinates(coords?: LocationCoordinates): boolean {
  if (!coords) return false;
  return (
    coords.lat !== 0 &&
    coords.lng !== 0 &&
    coords.lat >= -90 &&
    coords.lat <= 90 &&
    coords.lng >= -180 &&
    coords.lng <= 180
  );
}

// Main service function with automatic Google Maps integration
export async function getEstablishments(
  projectLocation?: LocationCoordinates,
  neighborhood?: string,
  filters?: EstablishmentFilters
): Promise<Establishment[]> {
  try {
    // Try Google Maps API first if API key is available
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (apiKey && neighborhood) {
      console.log(`🗺️ Using Google Maps API for location: ${neighborhood}`);

      // Use location string as primary input - Google will geocode it
      return await getEstablishmentsFromGoogleMaps(
        projectLocation,
        neighborhood,
        filters
      );
    } else {
      console.log(
        "Google Maps API key not found or neighborhood not provided, using local data"
      );

      // For local data, we need coordinates, so generate them if missing
      const fallbackLocation =
        projectLocation && isValidCoordinates(projectLocation)
          ? projectLocation
          : { lat: 5.6037, lng: -0.187 }; // Default Accra coordinates

      return await getEstablishmentsFromLocalData(
        fallbackLocation,
        neighborhood,
        filters
      );
    }
  } catch (error) {
    console.error("Error fetching establishments:", error);
    throw new Error("Failed to fetch establishments. Please try again later.");
  }
}

export async function searchEstablishments(
  query: string,
  establishments: Establishment[]
): Promise<Establishment[]> {
  if (!query.trim()) return establishments;

  const searchTerm = query.toLowerCase().trim();

  return establishments.filter(
    (establishment) =>
      establishment.name.toLowerCase().includes(searchTerm) ||
      establishment.address.toLowerCase().includes(searchTerm) ||
      establishment.type.toLowerCase().includes(searchTerm)
  );
}

// Get establishment types with counts
export function getEstablishmentTypeCounts(
  establishments: Establishment[]
): Record<Establishment["type"], number> {
  const counts = {
    school: 0,
    bank: 0,
    hospital: 0,
    supermarket: 0,
    airport: 0,
  } as Record<Establishment["type"], number>;

  establishments.forEach((establishment) => {
    counts[establishment.type]++;
  });

  return counts;
}
