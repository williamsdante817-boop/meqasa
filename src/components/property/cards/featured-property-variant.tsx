"use client";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { FeaturedProject } from "@/types";
import Link from "next/link";
import React from "react";

interface FeaturedPropertyCardProps {
  item: FeaturedProject;
  priority?: boolean;
}

export default function FeaturedPropertyCard({
  item,
  priority,
}: FeaturedPropertyCardProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [logoLoaded, setLogoLoaded] = React.useState(false);

  // Destructure properties from the item object with proper fallbacks
  const {
    projectname = "Unknown Project",
    projectid = "unknown-id",
    photo,
    logo,
    city = "Unknown City",
    status,
    text,
    unittypes,
  } = item;

  // Generate dynamic URLs
  const url = `development-projects/${city
    ?.split(" ")
    .join("-")
    .toLowerCase()}-${projectname
    ?.split(" ")
    .join("-")
    .toLowerCase()}-${projectid}`;

  // Fallback for photo and logo URLs with proper error handling
  const photoUrl = photo
    ? `https://dve7rykno93gs.cloudfront.net/uploads/imgs/${photo}`
    : "/default-image.jpg";

  const logoUrl = logo
    ? `https://dve7rykno93gs.cloudfront.net/uploads/imgs/${logo}`
    : "/default-logo.jpg";

  return (
    <Card
      className="hover:border-brand-primary/30 relative flex h-full flex-col gap-0 overflow-hidden rounded-lg border border-gray-200 bg-white p-0 transition-all duration-300"
      role="article"
      aria-labelledby={`project-title-${projectid}`}
    >
      {/* Main link to the project details */}
      <Link
        href={url}
        aria-label={`View details for ${projectname}`}
        className="block"
      >
        <CardHeader className="gap-0 p-0">
          <AspectRatio ratio={16 / 9} className="relative overflow-hidden">
            {/* Loading skeleton - only show when image hasn't loaded */}
            {!imageLoaded && (
              <div className="absolute inset-0 z-20 animate-pulse bg-gray-100" />
            )}

            <ImageWithFallback
              src={photoUrl}
              alt={`${projectname} property image`}
              fill
              sizes="(min-width: 1280px) 45vw, (min-width: 1024px) 45vw, (min-width: 768px) 48vw, (min-width: 640px) 60vw, 90vw"
              quality={90}
              priority={priority}
              className={cn(
                "object-cover transition-all duration-500 group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/duYy7cAAAAASUVORK5CYII="
              fallbackAlt="Property image not available"
              onLoad={() => setImageLoaded(true)}
            />
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/60 transition-all duration-300 group-hover:to-slate-900/70"
              aria-hidden="true"
            />

            {/* Status badge overlay */}
            {status && (
              <div className="absolute bottom-4 left-4 z-30">
                <Badge
                  className={cn(
                    "text-xs font-semibold shadow-lg transition-transform duration-200 group-hover:scale-105",
                    status?.toLowerCase() === "completed"
                      ? "bg-green-500 text-white"
                      : status?.toLowerCase() === "ongoing"
                        ? "bg-yellow-500 text-white"
                        : "bg-gray-500 text-white"
                  )}
                >
                  {status}
                </Badge>
              </div>
            )}
          </AspectRatio>
        </CardHeader>
      </Link>

      {/* Card content */}
      <CardContent className="relative flex h-full grow flex-col gap-0 p-4 md:p-6">
        <Link
          href={url}
          aria-label={`View details for ${projectname}`}
          className="group/content block"
        >
          {/* Company Logo - Enhanced positioning */}
          {logo && (
            <div className="absolute top-4 right-4 z-10 md:top-6 md:right-6">
              <div className="h-12 w-12 rounded-md bg-white/90 p-2 shadow-md backdrop-blur-sm transition-all duration-200 md:h-16 md:w-16 md:p-3">
                {!logoLoaded && (
                  <div className="h-full w-full animate-pulse rounded bg-gray-200" />
                )}
                <ImageWithFallback
                  src={logoUrl}
                  alt={`${projectname} logo`}
                  width={50}
                  height={50}
                  className={cn(
                    "h-full w-full object-contain transition-opacity duration-300",
                    logoLoaded ? "opacity-100" : "opacity-0"
                  )}
                  fallbackAlt={`${projectname} logo not available`}
                  onLoad={() => setLogoLoaded(true)}
                />
              </div>
            </div>
          )}

          <CardTitle
            id={`project-title-${projectid}`}
            className="text-brand-accent group-hover/content:text-brand-primary mb-2 line-clamp-1 text-base leading-tight font-bold transition-colors duration-200 sm:text-lg lg:text-xl"
          >
            {projectname}
          </CardTitle>

          <div className="text-brand-muted mb-4 flex items-start gap-2">
            <p className="line-clamp-1 !px-0 text-sm capitalize sm:text-base">
              {city}
            </p>
          </div>

          <div className="mb-4 flex min-w-0 items-start gap-2">
            {/* Unit Types as Badges */}
            <div className="flex flex-wrap gap-1.5">
              {unittypes
                ?.split(/[,|;]/)
                ?.filter((type) => type.trim())
                ?.map((unitType, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border border-gray-300 bg-gray-50 text-xs font-medium text-gray-700 capitalize transition-colors duration-200 hover:bg-gray-100 sm:text-sm"
                  >
                    {unitType.trim()}
                  </Badge>
                ))}
              {!unittypes?.split(/[,|;]/)?.filter((type) => type.trim())
                ?.length && (
                <Badge
                  variant="outline"
                  className="border border-gray-300 bg-gray-50 text-xs font-medium text-gray-500"
                >
                  No unit types
                </Badge>
              )}
            </div>
          </div>

          <p className="text-brand-muted line-clamp-3 flex-1 !px-0 pr-16 text-sm leading-relaxed sm:text-base md:pr-20">
            {text}
          </p>
        </Link>
      </CardContent>
    </Card>
  );
}
