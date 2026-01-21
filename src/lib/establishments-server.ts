import * as Sentry from "@sentry/nextjs";

interface Coordinates {
  lat: number;
  lng: number;
}

interface Establishment {
  id: string;
  name: string;
  address: string;
  distance: number;
  travelTime: number;
  type: "school" | "bank" | "hospital" | "supermarket" | "airport";
  rating?: number;
  phone?: string;
  openNow?: boolean;
  coordinates: Coordinates;
}

const TYPE_KEYWORDS: Record<Establishment["type"], string[]> = {
  school: ["school", "academy", "college", "university"],
  bank: ["bank", "atm"],
  hospital: ["hospital", "clinic", "medical", "health"],
  supermarket: ["supermarket", "grocery", "mall", "market"],
  airport: ["airport"],
};

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number  {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000;
}

function calculateTravelTime(distance: number): number {
  const averageSpeed = 25;
  const timeInHours = distance / 1000 / averageSpeed;
  return Math.max(1, Math.round(timeInHours * 60));
}

function categorizePlace(place: any): Establishment["type"] | null {
  const types = place.types || [];
  const name = place.name?.toLowerCase() || "";

  if (
    types.some((t: string) =>
      ["school", "primary_school", "secondary_school", "university"].includes(t)
    ) ||
    TYPE_KEYWORDS.school.some((k) => name.includes(k))
  ) {
    return "school";
  }

  if (
    types.some((t: string) => ["bank", "atm", "finance"].includes(t)) ||
    TYPE_KEYWORDS.bank.some((k) => name.includes(k))
  ) {
    return "bank";
  }

  if (
    types.some((t: string) =>
      ["hospital", "doctor", "health", "pharmacy"].includes(t)
    ) ||
    TYPE_KEYWORDS.hospital.some((k) => name.includes(k))
  ) {
    return "hospital";
  }

  if (
    types.some((t: string) =>
      ["supermarket", "grocery_or_supermarket", "shopping_mall"].includes(t)
    ) ||
    TYPE_KEYWORDS.supermarket.some((k) => name.includes(k))
  ) {
    return "supermarket";
  }

  if (
    types.includes("airport") ||
    TYPE_KEYWORDS.airport.some((k) => name.includes(k))
  ) {
    return "airport";
  }

  return null;
}

export async function getEstablishmentsServer(
  neighborhood: string,
  propertyLocation?: Coordinates,
  maxDistance = 5000
): Promise<Establishment[]> {
  return Sentry.startSpan(
    {
      op: "function",
      name: "Get Establishments Server",
    },
    async (span) => {
      span.setAttribute("neighborhood", neighborhood);
      span.setAttribute("maxDistance", maxDistance);

      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        throw new Error("Google Maps API key not configured");
      }

      let coordinates = propertyLocation;

      // Only geocode if coordinates are invalid
      if (!coordinates || coordinates.lat === 0 || coordinates.lng === 0) {
        const enhancedAddress = neighborhood.toLowerCase().includes("ghana")
          ? neighborhood
          : `${neighborhood}, Ghana`;

        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(enhancedAddress)}&key=${apiKey}&region=gh`;
        const geocodeResponse = await fetch(geocodeUrl, {
          next: { revalidate: 3600 },
        });
        const geocodeData = await geocodeResponse.json();

        if (geocodeData.status === "OK" && geocodeData.results?.[0]) {
          coordinates = {
            lat: geocodeData.results[0].geometry.location.lat,
            lng: geocodeData.results[0].geometry.location.lng,
          };
        } else {
          throw new Error(`Failed to geocode location: ${neighborhood}`);
        }
      }

      // Single API call - get all nearby places at once
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=${maxDistance}&key=${apiKey}&language=en`;

      const response = await fetch(url, { next: { revalidate: 1800 } });
      const data = await response.json();

      if (data.status !== "OK" || !data.results) {
        span.setAttribute("establishments_count", 0);
        return [];
      }

      const establishments: Establishment[] = [];

      data.results.forEach((place: any, index: number) => {
        const category = categorizePlace(place);
        if (!category) return;

        const distance = Math.round(
          calculateDistance(
            coordinates.lat,
            coordinates.lng,
            place.geometry.location.lat,
            place.geometry.location.lng
          )
        );

        establishments.push({
          id: `${category}-${index}`,
          name: place.name,
          address: place.vicinity || place.formatted_address || "",
          distance,
          travelTime: calculateTravelTime(distance),
          type: category,
          rating: place.rating,
          phone: place.formatted_phone_number,
          openNow: place.opening_hours?.open_now,
          coordinates: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          },
        });
      });

      // Deduplicate by name and address
      const uniqueEstablishments = establishments.filter(
        (est, index, self) =>
          index ===
          self.findIndex(
            (e) => e.name === est.name && e.address === est.address
          )
      );

      span.setAttribute("establishments_count", uniqueEstablishments.length);
      span.setAttribute("api_calls", coordinates === propertyLocation ? 1 : 2);

      return uniqueEstablishments.sort((a, b) => a.distance - b.distance);
    }
  );
}
