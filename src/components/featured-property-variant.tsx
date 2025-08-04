"use client";

import { cn } from "@/lib/utils";
import type { FeaturedProject } from "@/types";
import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "./ui/aspect-ratio";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import React from "react";
import { PlaceholderImage } from "./placeholder-image";

interface FeaturedPropertyCardProps {
  item: FeaturedProject;
}

export default function FeaturedPropertyCard({
  item,
}: FeaturedPropertyCardProps) {
  const [imgError, setImgError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

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
      className="relative size-full overflow-hidden rounded-xl p-0 gap-0"
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
          <AspectRatio ratio={16 / 9} className="relative">
            {!imgError ? (
              <>
                <Image
                  src={photoUrl}
                  alt={`${projectname} property image`}
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                  className={cn(
                    "object-cover transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100",
                  )}
                  onError={() => setImgError(true)}
                  onLoad={() => setIsLoading(false)}
                  priority
                />
                {isLoading && (
                  <div
                    className="absolute inset-0 bg-gray-100 animate-pulse rounded-xl"
                    aria-hidden="true"
                  />
                )}
              </>
            ) : (
              <PlaceholderImage
                asChild
                aria-label="Placeholder image for property"
              />
            )}
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/90"
              aria-hidden="true"
            />
          </AspectRatio>
        </CardHeader>
      </Link>

      {/* Card content */}
      <CardContent className="w-full p-4">
        <Link
          href={url}
          aria-label={`View details for ${projectname}`}
          className="block"
        >
          <div className="grid grid-cols-[minmax(0,1fr)_max-content] lg:gap-3">
            <div>
              {/* Project name */}
              <CardTitle
                id={`project-title-${projectid}`}
                className="text-base font-bold line-clamp-1 leading-5 text-brand-accent lg:text-[23px] lg:leading-8"
              >
                {projectname}
              </CardTitle>

              {/* City and location */}
              <div
                className="flex items-center gap-[5px] text-xs font-medium leading-6 text-brand-muted lg:text-sm lg:leading-8"
                aria-label={`Location: ${city}`}
              >
                <span className="line-clamp-1">{city}</span>
              </div>

              {/* Status and bedrooms */}
              <div
                className="mt-1 flex items-center gap-[5px] font-medium leading-5 text-brand-muted"
                aria-label={`Project status: ${status}, Available unit types: ${unittypes || "Not specified"}`}
              >
                <Badge
                  className={cn(
                    "uppercase rounded-sm",
                    status?.toLowerCase() === "completed"
                      ? "bg-green-500/90 text-white"
                      : status?.toLowerCase() === "ongoing"
                        ? "bg-yellow-500/90 text-white"
                        : "bg-gray-500/90 text-white",
                  )}
                >
                  {status}
                </Badge>
                <Dot
                  className="h-[16px] w-[16px] text-brand-accent"
                  aria-hidden="true"
                />
                <span className="text-sm text-brand-accent lg:text-base">
                  <span className="line-clamp-1">
                    {unittypes ? `${unittypes}` : "No Units Available"}
                  </span>
                </span>
              </div>

              {/* Description */}
              <div className="relative mt-2 hidden lg:grid lg:grid-cols-[minmax(0,1fr)_max-content]">
                <p
                  className="mt-2 line-clamp-2 w-full text-brand-muted"
                  aria-label={`Project description: ${text}`}
                >
                  {text}
                </p>
              </div>
            </div>

            {/* Logo */}
            <div
              className="max-w-[90px] max-h-[90px]"
              aria-label={`${projectname} logo`}
            >
              <Image
                src={logoUrl}
                alt={`${projectname} logo`}
                width={50}
                height={50}
                className="h-full w-full object-contain rounded-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/default-logo.jpg";
                }}
              />
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
