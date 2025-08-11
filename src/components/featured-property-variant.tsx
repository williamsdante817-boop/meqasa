"use client";
import { cn } from "@/lib/utils";
import type { FeaturedProject } from "@/types";
import { Dot } from "lucide-react";
import Link from "next/link";
import { AspectRatio } from "./ui/aspect-ratio";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ImageWithFallback } from "./image-with-fallback";

interface FeaturedPropertyCardProps {
  item: FeaturedProject;
}

export default function FeaturedPropertyCard({
  item,
}: FeaturedPropertyCardProps) {
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
      className="relative h-full overflow-hidden rounded-lg p-0 gap-0 flex flex-col"
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
            <ImageWithFallback
              src={photoUrl}
              alt={`${projectname} property image`}
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              className={cn("object-cover")}
              placeholder="blur"
              // 1x1 transparent PNG as a safe minimal LQIP; can be replaced with real blurDataURL from API
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/duYy7cAAAAASUVORK5CYII="
              fallbackAlt="Property image not available"
            />
            <div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50"
              aria-hidden="true"
            />
          </AspectRatio>
        </CardHeader>
      </Link>

      {/* Card content */}
      <CardContent className="p-4 md:p-8 h-full relative gap-0 flex flex-col grow">
        <Link
          href={url}
          aria-label={`View details for ${projectname}`}
          className="block"
        >
          <div className="absolute top-8 right-8">
            <div className="flex items-center gap-3">
              {/* Company Logo Icon */}
              <div className="flex items-center justify-center w-20 h-20 rounded-lg">
                <ImageWithFallback
                  src={logoUrl}
                  alt={`${projectname} logo`}
                  width={50}
                  height={50}
                  className="h-full w-full object-contain rounded-sm"
                  fallbackAlt={`${projectname} logo not available`}
                />
              </div>
            </div>
          </div>
          <CardTitle
            id={`project-title-${projectid}`}
            className="text-lg font-bold line-clamp-1 leading-5 text-brand-accent lg:text-[20px] lg:leading-8"
          >
            {projectname}
          </CardTitle>
          <p className="text-base text-brand-muted line-clamp-1 !pl-0 mb-6">
            {city}
          </p>
          <div className="flex items-center gap-2 mb-6 min-w-0">
            {/* Status Badge */}
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

            {/* Bullet separator */}
            <Dot
              className="h-[16px] w-[16px] text-brand-accent"
              aria-hidden="true"
            />

            {/* Property Type */}
            <span className="text-brand-accent font-medium text-base truncate w-32 md:w-full">
              {unittypes}
            </span>
          </div>
          <p className="text-brand-muted line-clamp-2 !pl-0 text-base leading-relaxed pr-32">
            {text}
          </p>
        </Link>
      </CardContent>
    </Card>
  );
}
