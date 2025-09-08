import type { CategoryData, LocationCategory } from "@/types/location";

// Sample coordinates for Accra, Ghana
const ACCRA_CENTER = {
  latitude: 5.6037,
  longitude: -0.187,
};

// Helper function to generate nearby coordinates
const generateNearbyCoordinates = (
  base: typeof ACCRA_CENTER,
  distanceInKm: number
) => {
  const radius = 6371; // Earth's radius in km
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const randomAngle = Math.random() * 2 * Math.PI;
  const randomDistance = Math.random() * distanceInKm;

  const lat = base.latitude + (randomDistance / radius) * (180 / Math.PI);
  const lng =
    base.longitude +
    ((randomDistance / radius) * (180 / Math.PI)) /
      Math.cos((base.latitude * Math.PI) / 180);

  return { latitude: lat, longitude: lng };
};

// Helper function to format distance
const formatDistance = (distanceInMeters: number): string => {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)} m`;
  }
  return `${(distanceInMeters / 1000).toFixed(1)} km`;
};

// Helper function to format walk time
const formatWalkTime = (distanceInMeters: number): string => {
  const walkSpeed = 1.4; // meters per second
  const walkTimeInMinutes = Math.round(distanceInMeters / walkSpeed / 60);
  return `${walkTimeInMinutes} min (${formatDistance(distanceInMeters)})`;
};

// Generate sample data
const generateLocationData = (): CategoryData => {
  const categories: LocationCategory[] = [
    "Schools",
    "Banks",
    "Hospitals",
    "Stores",
    "Airports",
  ];
  const data: Partial<CategoryData> = {};

  categories.forEach((category) => {
    const count = category === "Airports" ? 3 : 5;
    const locations = Array.from({ length: count }, (_, i) => {
      const distance = Math.random() * 3000; // Random distance up to 3km
      const coordinates = generateNearbyCoordinates(
        ACCRA_CENTER,
        distance / 1000
      );

      return {
        id: `${category.toLowerCase()}-${i + 1}`,
        name: `${category.slice(0, -1)} ${i + 1}`,
        distance: formatDistance(distance),
        walkTime: distance < 2000 ? formatWalkTime(distance) : undefined,
        coordinates,
        category,
        address: `${Math.floor(Math.random() * 100)} ${category} Street, Accra`,
        phone: `+233 ${Math.floor(Math.random() * 1000000000)}`,
        website: `https://${category.toLowerCase()}-${i + 1}.com`,
        openingHours: "Mon-Fri: 8:00 AM - 5:00 PM",
      };
    });

    data[category] = locations;
  });

  return data as CategoryData;
};

export const locationData: CategoryData = generateLocationData();
