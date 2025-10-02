"use client";

import type { PropertyListing } from "@/types/property-standardized";
import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface FeaturedPropertiesAsideProps {
  initialData?: {
    rentals: PropertyListing[];
    selling: PropertyListing[];
  };
}

export default function FeaturedPropertiesAside({
  initialData,
}: FeaturedPropertiesAsideProps) {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);

  // Combine all properties
  const allProperties = [
    ...(initialData?.rentals || []),
    ...(initialData?.selling || []),
  ];

  // Show 4 properties per page
  const propertiesPerPage = 4;
  const totalPages = Math.ceil(allProperties.length / propertiesPerPage);

  // Get current page properties
  const startIndex = currentPage * propertiesPerPage;
  const featuredProperties = allProperties.slice(
    startIndex,
    startIndex + propertiesPerPage
  );

  const handleImageError = (propertyId: string) => {
    setImageErrors((prev) => new Set(prev).add(propertyId));
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  if (!allProperties.length) {
    return (
      <p className="text-brand-muted text-sm">
        No featured properties available
      </p>
    );
  }

  return (
    <>
      {/* Navigation Buttons */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-brand-accent text-base font-bold uppercase">
          Featured Properties
        </h2>
        <div className="flex gap-1">
          <button
            onClick={handlePrevious}
            className="flex h-6 w-6 items-center justify-center rounded bg-gray-300 text-white transition-colors hover:bg-gray-400 disabled:opacity-50"
            aria-label="Previous"
            disabled={totalPages <= 1}
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="flex h-6 w-6 items-center justify-center rounded bg-gray-300 text-white transition-colors hover:bg-gray-400 disabled:opacity-50"
            aria-label="Next"
            disabled={totalPages <= 1}
          >
            ›
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {featuredProperties.map((property) => {
          const propertyId = property.id || "";
          const hasError = imageErrors.has(propertyId);
          const bedsNum = property.bedrooms || 0;
          const bathsNum = property.bathrooms || 0;
          const floorAreaNum = property.floorArea || 0;

          // Access description/summary from raw API data if available
          const description =
            ((property as unknown as Record<string, unknown>)
              .summary as string) ||
            ((property as unknown as Record<string, unknown>)
              .description as string) ||
            "";

          // Construct proper detail page URL using reference (detailreq)
          const cleanPath = property.reference
            .replace(/^https?:\/\/[^/]+\//, "")
            .replace(/^\/+/, "");
          const detailUrl = cleanPath.startsWith("listings/")
            ? `/${cleanPath}`
            : `/listings/${cleanPath}`;

          return (
            <Link
              key={propertyId}
              href={detailUrl}
              className="group hover:border-brand-primary/30 flex overflow-hidden rounded-lg border border-gray-100 bg-white p-2 transition-colors duration-200"
              aria-label={`View property: ${property.title || "details"}`}
            >
              {/* Property Image - Left Side */}
              <div className="relative h-24 w-28 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                <Image
                  src={
                    hasError
                      ? "/placeholder-image.png"
                      : property.coverImage || "/placeholder-image.png"
                  }
                  alt={property.title || "Property"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="96px"
                  onError={() => handleImageError(propertyId)}
                />
              </div>

              {/* Property Details - Right Side */}
              <div className="flex flex-1 flex-col justify-between pl-2">
                <div className="space-y-1">
                  {/* Title - Always one line */}
                  <h3 className="text-brand-accent line-clamp-1 text-sm leading-tight font-bold">
                    {property.title || "Property"}
                  </h3>

                  {/* Location */}
                  <p className="text-brand-muted line-clamp-1 text-xs">
                    {property.location}
                  </p>

                  {/* Description - Two lines */}
                  {description && (
                    <p className="text-brand-muted line-clamp-2 text-xs leading-snug">
                      {description}
                    </p>
                  )}
                </div>

                {/* Amenities - Bottom with Dot separators */}
                <div className="text-brand-muted mt-2 flex flex-wrap items-center gap-x-1 text-xs">
                  {bedsNum > 0 && (
                    <>
                      <span className="flex-shrink-0">
                        {bedsNum} {bedsNum === 1 ? "Bed" : "Beds"}
                      </span>
                      {(bathsNum > 0 || floorAreaNum > 0) && (
                        <Dot
                          className="text-brand-accent h-[12px] w-[12px] flex-shrink-0"
                          aria-hidden="true"
                        />
                      )}
                    </>
                  )}
                  {bathsNum > 0 && (
                    <>
                      <span className="flex-shrink-0">
                        {bathsNum} {bathsNum === 1 ? "Bath" : "Baths"}
                      </span>
                      {floorAreaNum > 0 && (
                        <Dot
                          className="text-brand-accent h-[12px] w-[12px] flex-shrink-0"
                          aria-hidden="true"
                        />
                      )}
                    </>
                  )}
                  {floorAreaNum > 0 && (
                    <span className="flex-shrink-0">{floorAreaNum} m²</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
