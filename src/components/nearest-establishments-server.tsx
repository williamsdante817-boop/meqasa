import { getEstablishmentsServer } from "@/lib/establishments-server";
import { NearestEstablishmentsClient } from "./nearest-establishments-client";

interface Coordinates {
  lat: number;
  lng: number;
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

interface NearestEstablishmentsServerProps {
  propertyLocation: Coordinates;
  propertyName?: string;
  neighborhood?: string;
  className?: string;
  maxDistance?: number;
  propertyInfo?: PropertyInfo;
}

export async function NearestEstablishmentsServer({
  propertyLocation,
  propertyName = "Property",
  neighborhood = "Accra",
  className,
  maxDistance = 10,
  propertyInfo,
}: NearestEstablishmentsServerProps) {
  try {
    const establishments = await getEstablishmentsServer(
      neighborhood,
      propertyLocation,
      maxDistance * 1000
    );

    if (establishments.length === 0) {
      return (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">
            No Establishments Found
          </h3>
          <p className="text-sm text-gray-600">
            We couldn&apos;t find any establishments within {maxDistance}km of{" "}
            {neighborhood}. This area may not have data available yet.
          </p>
        </div>
      );
    }

    const transformedEstablishments = establishments.map((est) => ({
      ...est,
      type: `${est.type}s`,
    })) as Array<{
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
    }>;

    return (
      <NearestEstablishmentsClient
        establishments={transformedEstablishments}
        propertyLocation={propertyLocation}
        propertyName={propertyName}
        neighborhood={neighborhood}
        className={className}
        maxDistance={maxDistance}
        propertyInfo={propertyInfo}
      />
    );
  } catch (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-red-900">
          Unable to Load Establishments
        </h3>
        <p className="text-sm text-red-700">
          {error instanceof Error
            ? error.message
            : "An error occurred while fetching nearby establishments."}
        </p>
      </div>
    );
  }
}
