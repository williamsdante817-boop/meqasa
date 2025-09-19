"use client";

import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import Link from "next/link";
import { useState, useCallback } from "react";

export interface DeveloperUnit {
  id: string;
  unitid?: number;
  title: string;
  price: string;
  location: string;
  address?: string;
  city?: string;
  bedrooms: number;
  beds?: number;
  bathrooms: number;
  baths?: number;
  unittype: string;
  unittypename?: string;
  terms: string;
  image?: string;
  coverphoto?: string;
  developer?: string;
  companyname?: string;
  name?: string;
  area?: string;
  floorarea?: number;
  featured?: boolean;
  description?: string;
}

export interface DeveloperUnitCardProps {
  unit: DeveloperUnit;
  priority?: boolean;
}

export default function DeveloperUnitCard({
  unit,
  priority = false,
}: DeveloperUnitCardProps) {
  const [imageLoading, setImageLoading] = useState(true);

  // Use the exact same pattern as the existing unit card
  const imageUrl = unit.coverphoto
    ? `https://meqasa.com/uploads/imgs/${unit.coverphoto}`
    : unit.image || "";

  // Get display values
  const displayContract = unit.terms === "rent" ? "For Rent" : "For Sale";

  // Optimized alt text generation
  const altText =
    `${unit.title} - ${displayContract} in ${unit.location}`.trim();

  // Generate SEO-friendly link URL
  const citySlug =
    unit.city?.split(" ").join("-").toLowerCase() ||
    unit.location?.split(" ").join("-").toLowerCase() ||
    "ghana";
  const typeSlug =
    unit.unittypename?.toLowerCase().split(" ").join("-") ||
    unit.unittype?.toLowerCase() ||
    "apartment";
  const contractSlug = unit.terms === "rent" ? "rent" : "sale";
  const bedrooms = unit.beds || unit.bedrooms || 0;

  const linkUrl = `/developer-unit/${bedrooms}-bedroom-${typeSlug}-for-${contractSlug}-in-${citySlug}-unit-${unit.unitid || unit.id}`;

  // Optimized image load handler
  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  // Error handler for image loading
  const handleImageError = useCallback(() => {
    setImageLoading(false);
  }, []);

  return (
    <article className="group">
      <Link
        href={linkUrl}
        className="focus-visible:ring-brand-primary block rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label={`View details for ${unit.title} - ${displayContract} in ${unit.location}`}
      >
        <div className="hover:border-brand-primary/20 min-h-0 overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {imageLoading && (
              <div className="absolute inset-0 animate-pulse bg-gray-100">
                {/* Badge placeholder to prevent layout shift during image load */}
                <div className="absolute top-3 left-3 opacity-50">
                  <div className="h-6 w-16 animate-pulse rounded bg-gray-200 px-2.5 py-1" />
                </div>
              </div>
            )}

            <ImageWithFallback
              className="object-cover"
              src={imageUrl}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              fill
              priority={priority}
              alt={altText}
              fallbackAlt={`${unit.title} property image`}
              quality={75}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />

            {/* Contract Badge */}

            <Badge className="bg-brand-accent absolute top-4 left-4 z-30 h-6 tracking-wide text-white uppercase shadow-sm">
              {displayContract}
            </Badge>

            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          {/* Content */}
          <div className="p-4 md:p-5">
            <h3
              id={`unit-title-${unit.id}`}
              className="text-brand-accent group-hover:text-brand-primary line-clamp-2 text-sm leading-snug font-semibold transition-colors duration-200"
            >
              {unit.title}
            </h3>
          </div>
        </div>
      </Link>
    </article>
  );
}
