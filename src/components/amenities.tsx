"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface AmenitiesProps {
  amenities?: string[];
}

export default function Amenities({ amenities = [] }: AmenitiesProps) {
  if (!amenities.length) {
    return null;
  }

  return (
    <Card
      className="w-full p-0 border-none bg-transparent shadow-none"
      role="region"
      aria-label="Amenities"
    >
      <CardContent className="p-0">
        <div
          className="grid grid-cols-2 gap-4 md:grid-cols-3"
          role="list"
          aria-label="List of available amenities"
        >
          {amenities.map((amenity, index) => (
            <div
              key={`amenity-${amenity}-${index}`}
              className="flex items-center gap-3 rounded-lg border bg-white p-3"
              role="listitem"
            >
              <div
                className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-green-500/10 flex-shrink-0"
                aria-hidden="true"
              >
                <Check
                  className="h-4 w-4 md:h-5 md:w-5 text-brand-badge-completed"
                  aria-hidden="true"
                />
              </div>
              <p
                className="text-sm md:text-base text-brand-accent line-clamp-1"
                aria-label={`Amenity: ${amenity}`}
              >
                {amenity}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
