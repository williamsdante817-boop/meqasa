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
      className=" relative h-full overflow-hidden rounded-lg p-0 gap-0 flex flex-col border border-gray-200 bg-white transition-all duration-300 hover:border-brand-primary/30"
      role="article"
      aria-labelledby={`project-title-${projectid}`}
    >
      {/* Main link to the project details */}
      <Link
        href={url}
        aria-label={`View details for ${projectname}`}
        className="block"
      >
        <CardHeader className="p-0 gap-0">
          <AspectRatio ratio={16 / 9} className="relative overflow-hidden">
            {/* Loading skeleton - only show when image hasn't loaded */}
            {!imageLoaded && (
              <div className="absolute inset-0 z-20 bg-gray-100 animate-pulse" />
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
      <CardContent className="p-4 md:p-6 h-full relative gap-0 flex flex-col grow">
        <Link
          href={url}
          aria-label={`View details for ${projectname}`}
          className="group/content block"
        >
          {/* Company Logo - Enhanced positioning */}
          {logo && (
            <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-md bg-white/90 backdrop-blur-sm p-2 md:p-3 shadow-md transition-all duration-200">
                {!logoLoaded && (
                  <div className="w-full h-full bg-gray-200 animate-pulse rounded" />
                )}
                <ImageWithFallback
                  src={logoUrl}
                  alt={`${projectname} logo`}
                  width={50}
                  height={50}
                  className={cn(
                    "w-full h-full object-contain transition-opacity duration-300",
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
            className="text-base font-bold line-clamp-1 leading-tight text-brand-accent sm:text-lg lg:text-xl transition-colors duration-200 group-hover/content:text-brand-primary mb-2"
          >
            {projectname}
          </CardTitle>

          <div className="flex items-start gap-2 mb-4 text-brand-muted">
            <p className="text-sm sm:text-base line-clamp-1 capitalize !px-0">
              {city}
            </p>
          </div>

          <div className="flex items-start gap-2 mb-4 min-w-0">
            {/* Unit Types as Badges */}
            <div className="flex flex-wrap gap-1.5">
              {unittypes
                ?.split(/[,|;]/)
                ?.filter((type) => type.trim())
                ?.map((unitType, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs sm:text-sm font-medium bg-gray-50 text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors duration-200 capitalize"
                  >
                    {unitType.trim()}
                  </Badge>
                ))}
              {!unittypes?.split(/[,|;]/)?.filter((type) => type.trim())
                ?.length && (
                <Badge
                  variant="outline"
                  className="text-xs font-medium bg-gray-50 text-gray-500 border border-gray-300"
                >
                  No unit types
                </Badge>
              )}
            </div>
          </div>

          <p className="text-brand-muted line-clamp-3 text-sm sm:text-base leading-relaxed pr-16 md:pr-20 flex-1 !px-0">
            {text}
          </p>
        </Link>
      </CardContent>
    </Card>
  );
}
