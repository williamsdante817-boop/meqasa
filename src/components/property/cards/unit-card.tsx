"use client";
import Link from "next/link";
import React, { useMemo } from "react";

import { AddFavoriteButton } from "@/components/add-favorite-button";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { Icons } from "@/components/icons";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SimilarUnit } from "@/lib/get-unit-details";
import type { Unit } from "@/types";
import { Dot } from "lucide-react";

export default function UnitCard({ unit }: { unit: SimilarUnit | Unit }) {
  const [imageLoading, setImageLoading] = React.useState(true);

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

  return (
    <Card
      className="size-full bg-transparent rounded-lg !p-0 relative gap-0 border-none shadow-none group"
      role="article"
      aria-labelledby={`unit-title-${unit.unitid}`}
    >
      <Link
        href={unitUrl}
        aria-label={`View details for ${unit.title}`}
        className="block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-accent rounded-lg transition-all duration-200"
      >
        <CardHeader className="!p-0 border-b border-b-gray-100 gap-0 rounded-lg shadow-none">
          <AspectRatio ratio={4 / 3} className="relative overflow-hidden rounded-lg">
            {imageLoading && (
              <Skeleton className="absolute inset-0 z-10 rounded-lg" />
            )}
            <ImageWithFallback
              className="object-cover rounded-lg"
              src={`https://meqasa.com/uploads/imgs/${unit.coverphoto}`}
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              fill
              priority={false}
              alt={imageAlt}
              fallbackAlt={`Image placeholder for ${unit.title}`}
              quality={75}
              onLoad={() => setImageLoading(false)}
            />
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
            <div className="mt-1 flex items-center text-sm text-brand-muted flex-nowrap overflow-hidden">
              <span className="truncate">{unit.beds} Beds</span>
              <Dot
                className="h-[12px] w-[12px] text-brand-accent flex-shrink-0"
                aria-hidden="true"
              />
              <span className="truncate">{unit.baths} Baths</span>
              <Icons.dot
                className="h-[12px] w-[12px] text-brand-accent flex-shrink-0"
                aria-hidden="true"
              />
              <span className="truncate">{unit.floorarea} m²</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
