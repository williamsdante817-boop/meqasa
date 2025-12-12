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

const TRANSACTION_TYPE = {
  RENT: "rent",
  SALE: "sale",
} as const;

const DISPLAY_TEXT = {
  FOR_RENT: "For Rent",
  FOR_SALE: "For Sale",
} as const;

const DEFAULT_VALUES = {
  LOCATION: "Ghana",
  PROPERTY_TYPE: "Apartment",
  BEDROOMS: 1,
} as const;

const SLUG_SEPARATOR = "-";

export default function DeveloperUnitCard({
  unit,
  priority = false,
}: DeveloperUnitCardProps) {
  const [imageLoading, setImageLoading] = useState(true);

  const imageUrl = unit.image || "";
  const isRental = unit.terms === TRANSACTION_TYPE.RENT;
  const displayContract = isRental
    ? DISPLAY_TEXT.FOR_RENT
    : DISPLAY_TEXT.FOR_SALE;

  const bedroomCount = unit.beds || unit.bedrooms || DEFAULT_VALUES.BEDROOMS;
  const bedroomText =
    bedroomCount === 1 ? "1 Bedroom" : `${bedroomCount} Bedroom`;
  const propertyType =
    unit.unittypename || unit.unittype || DEFAULT_VALUES.PROPERTY_TYPE;
  const locationName = unit.city || unit.location || DEFAULT_VALUES.LOCATION;

  const constructedTitle = `${bedroomText} ${propertyType} ${displayContract} in ${locationName}`;
  const altText = `${constructedTitle} - ${displayContract}`.trim();

  const toSlug = (text: string) =>
    text.split(" ").join(SLUG_SEPARATOR).toLowerCase();

  const citySlug = unit.city
    ? toSlug(unit.city)
    : unit.location
      ? toSlug(unit.location)
      : DEFAULT_VALUES.LOCATION.toLowerCase();
  const typeSlug = unit.unittypename
    ? toSlug(unit.unittypename)
    : unit.unittype?.toLowerCase() ||
      DEFAULT_VALUES.PROPERTY_TYPE.toLowerCase();
  const contractSlug = isRental ? TRANSACTION_TYPE.RENT : TRANSACTION_TYPE.SALE;
  const unitIdentifier = unit.unitid || unit.id;

  const linkUrl = `/developer-unit/${bedroomCount}-bedroom-${typeSlug}-for-${contractSlug}-in-${citySlug}-unit-${unitIdentifier}`;

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
  }, []);

  return (
    <article className="group">
      <Link
        href={linkUrl}
        className="focus-visible:ring-brand-primary block rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label={`View details for ${constructedTitle}`}
      >
        <div className="hover:border-brand-primary/20 min-h-0 overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {imageLoading && (
              <div className="absolute inset-0 animate-pulse bg-gray-100">
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
              fallbackAlt={`${constructedTitle} property image`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              unoptimized
            />

            <Badge className="bg-brand-accent absolute top-4 left-4 z-30 h-6 tracking-wide text-white uppercase shadow-sm">
              {displayContract}
            </Badge>

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          {/* Content */}
          <div className="p-4 md:p-5">
            <h3
              id={`unit-title-${unit.id}`}
              className="text-brand-accent group-hover:text-brand-primary line-clamp-2 text-base font-semibold leading-snug transition-colors duration-200"
            >
              {constructedTitle}
            </h3>
          </div>
        </div>
      </Link>
    </article>
  );
}
