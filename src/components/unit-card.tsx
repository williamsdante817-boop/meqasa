"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";

import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dot } from "lucide-react";
import { PlaceholderImage } from "./placeholder-image";
import { AspectRatio } from "./ui/aspect-ratio";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import type { SimilarUnit } from "@/lib/get-unit-details";
import type { Unit } from "@/types";
import { AddFavoriteButton } from "./add-favorite-button";

export default function UnitCard({ unit }: { unit: SimilarUnit | Unit }) {
  const [imgError, setImgError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Create unit URL once to avoid duplication
  const unitUrl = useMemo(() => {
    const citySlug = unit.city?.split(" ").join("-")?.toLowerCase() || "";
    const typeSlug =
      unit.unittypename?.toLowerCase().split(" ").join("-") || "";
    return `/developer-unit/${unit.beds}-bedroom-${typeSlug}-for-${unit.terms}-in-${citySlug}-unit-${unit.unitid}`;
  }, [unit.beds, unit.city, unit.terms, unit.unitid, unit.unittypename]);

  // Create alt text for image
  const imageAlt = useMemo(
    () =>
      `${unit.title} - ${unit.beds} bedroom, ${unit.baths} bathroom property in ${unit.city}`,
    [unit.title, unit.beds, unit.baths, unit.city],
  );

  // Handle image loading and error states
  const handleImageError = () => setImgError(true);
  const handleImageLoad = () => setIsLoading(false);

  return (
    <Card
      className="size-full rounded-xl p-0 relative gap-0 border-none shadow-none"
      role="article"
      aria-labelledby={`unit-title-${unit.unitid}`}
    >
      <Link
        href={unitUrl}
        aria-label={`View details for ${unit.title}`}
        className="focus:outline-none focus:ring-2 focus:ring-brand-accent rounded-xl block"
      >
        <CardHeader className="p-0 border-b border-b-gray-100 gap-0 rounded-xl shadow-elegant-sm">
          <AspectRatio ratio={4 / 3} className="relative">
            {!imgError ? (
              <Image
                className={cn(
                  "object-cover rounded-xl transition-opacity duration-300",
                  isLoading ? "opacity-0" : "opacity-100",
                )}
                src={`https://meqasa.com/uploads/imgs/${unit.coverphoto}`}
                onError={handleImageError}
                onLoad={handleImageLoad}
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                fill
                priority={false}
                loading="lazy"
                alt={imageAlt}
                aria-hidden={isLoading}
              />
            ) : (
              <PlaceholderImage
                asChild
                aria-label={`Image placeholder for ${unit.title}`}
                role="img"
              />
            )}
            {isLoading && !imgError && (
              <div
                className="absolute inset-0 bg-gray-100 animate-pulse rounded-xl"
                aria-hidden="true"
                role="presentation"
              />
            )}
          </AspectRatio>

          <div
            className="absolute top-3 left-3 z-10 flex gap-2"
            aria-label="Property status"
          >
            <Badge
              className="rounded-sm bg-brand-accent capitalize"
              aria-label={`Property is ${unit.terms === "sale" ? "for sale" : "for rent"}`}
            >
              {unit.terms === "sale" ? "For Sale" : "For Rent"}
            </Badge>
          </div>

          <div className="absolute top-3 right-3 z-10">
            <AddFavoriteButton listingId={Number(unit.unitid)} />
          </div>
        </CardHeader>
      </Link>

      <Link
        href={unitUrl}
        aria-label={`View details for ${unit.title}`}
        className="focus:outline-none focus:ring-2 focus:ring-brand-accent rounded-xl block"
      >
        <CardContent className="px-0 pb-0 space-y-1">
          <CardTitle
            id={`unit-title-${unit.unitid}`}
            className="line-clamp-1 text-xs font-bold text-brand-primary md:text-sm pt-2 capitalize"
          >
            {unit.title}
          </CardTitle>
          <div>
            <span className="text-sm capitalize text-brand-muted line-clamp-1">
              {unit.address}, {unit.city}
            </span>
            <div className="mt-1 flex items-center text-sm text-brand-muted">
              <span>{unit.beds} Beds</span>
              <Dot
                className="h-[12px] w-[12px] text-brand-accent"
                aria-hidden="true"
              />
              <span>{unit.baths} Baths</span>
              <Icons.dot
                className="h-[12px] w-[12px] text-brand-accent"
                aria-hidden="true"
              />
              <span>{unit.floorarea} m²</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
