"use client";

import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface AmenitiesProps {
  amenities?: string[];
}

export default function Amenities({ amenities = [] }: AmenitiesProps) {
  if (!amenities.length) {
    return null;
  }

  return (
    <Card className="mb-6 rounded-lg border-gray-200 bg-gradient-to-r from-gray-50 to-gray-50 p-4 md:p-6">
      <div
        className="grid grid-cols-2 gap-4 lg:grid-cols-3"
        role="list"
        aria-label="List of available amenities"
      >
        {amenities.map((amenity, index) => (
          <div
            key={`amenity-${amenity}-${index}`}
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:border-gray-300"
            role="listitem"
          >
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700"
              aria-hidden="true"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
            </div>
            <p
              className="text-brand-accent line-clamp-1 flex-1 text-sm font-medium"
              aria-label={`Amenity: ${amenity}`}
            >
              {amenity}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
