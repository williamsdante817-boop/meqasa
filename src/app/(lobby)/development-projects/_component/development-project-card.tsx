"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { MapPin, Building2, Eye } from "lucide-react";
import Link from "next/link";
import { cn, formatNumber } from "@/lib/utils";
import { useState } from "react";

interface DevelopmentProject {
  projectid: number;
  projectname: string;
  address: string;
  city: string;
  region: string;
  aboutproject: string;
  photoUrl: string | null;
  logoUrl: string | null;
  status: "new" | "ongoing" | "completed";
  isFeatured: boolean;
  location: string;
  fullLocation: string;
  unitcount: number;
  pageviews: number;
  weburl?: string;
  developer?: {
    name: string;
    logo?: string;
  };
}

interface DevelopmentProjectCardProps {
  project: DevelopmentProject;
  priority?: boolean;
}

export default function DevelopmentProjectCard({
  project,
  priority = false,
}: DevelopmentProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500 text-white";
      case "ongoing":
        return "bg-yellow-500 text-white";
      case "completed":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Format unit count
  const formatUnitCount = () => {
    if (!project.unitcount || project.unitcount === 0) {
      return "Units available";
    }
    return `${project.unitcount} unit${project.unitcount !== 1 ? "s" : ""}`;
  };

  return (
    <Card className="group hover:border-brand-primary/30 relative h-full overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg">
      {/* Project Link Overlay */}
      <Link
        href={project.weburl || `/development-projects/${project.projectid}`}
        className="absolute inset-0 z-10"
        aria-label={`View details for ${project.projectname}`}
        {...(project.weburl
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      />

      <CardHeader className="relative p-0">
        <AspectRatio ratio={16 / 10} className="relative overflow-hidden">
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 z-20 animate-pulse bg-gray-100" />
          )}

          {/* Main Project Image */}
          <ImageWithFallback
            src={project.photoUrl || "/images/placeholder-development.jpg"}
            alt={`${project.projectname} development project`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            quality={85}
            priority={priority}
            className={cn(
              "object-cover transition-all duration-500 group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/duYy7cAAAAASUVORK5CYII="
            fallbackAlt={`${project.projectname} - Image not available`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Status badge */}
          <div className="absolute top-3 left-3 z-30">
            <Badge
              className={cn(
                "text-xs font-semibold shadow-lg",
                getStatusColor(project.status)
              )}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
          </div>

          {/* Featured badge */}
          {project.isFeatured && (
            <div className="absolute top-3 right-3 z-30">
              <Badge className="bg-brand-primary text-xs font-semibold text-white shadow-lg">
                Featured
              </Badge>
            </div>
          )}

          {/* Developer logo */}
          {project.logoUrl && (
            <div className="absolute right-3 bottom-3 z-30">
              <div className="h-10 w-10 rounded-md bg-white/90 p-1.5 shadow-md backdrop-blur-sm md:h-12 md:w-12 md:p-2">
                {!logoLoaded && (
                  <div className="h-full w-full animate-pulse rounded bg-gray-200" />
                )}
                <ImageWithFallback
                  src={project.logoUrl}
                  alt={`Developer logo`}
                  width={40}
                  height={40}
                  className={cn(
                    "h-full w-full object-contain transition-opacity duration-300",
                    logoLoaded ? "opacity-100" : "opacity-0"
                  )}
                  fallbackAlt={`Developer logo not available`}
                  onLoad={() => setLogoLoaded(true)}
                />
              </div>
            </div>
          )}
        </AspectRatio>
      </CardHeader>

      <CardContent className="space-y-4 p-4 md:p-6">
        {/* Project Title */}
        <div className="space-y-2">
          <h3 className="text-brand-accent group-hover:text-brand-primary line-clamp-1 text-lg font-bold transition-colors duration-200">
            {project.projectname}
          </h3>
          <p className="text-brand-muted text-sm font-medium">
            {formatUnitCount()} • {formatNumber(project.pageviews)} views
          </p>
        </div>

        {/* Location */}
        <div className="text-brand-muted flex items-center">
          <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1 text-sm">{project.fullLocation}</span>
        </div>

        {/* Description */}
        <p className="text-brand-muted line-clamp-3 text-sm leading-relaxed">
          {project.aboutproject}
        </p>

        {/* Action Section */}
        <div className="flex items-center justify-between border-t pt-2">
          <div className="flex items-center gap-2">
            <Building2 className="text-brand-accent h-4 w-4" />
            <span className="text-brand-accent text-sm font-medium">
              {project.region}
            </span>
          </div>

          {/* View Details Button - Relative positioning to stay above link overlay */}
          <Button
            variant="outline"
            size="sm"
            className="text-brand-accent hover:bg-brand-primary relative z-20 transition-colors duration-200 hover:text-white"
            asChild
          >
            <Link
              href={
                project.weburl || `/development-projects/${project.projectid}`
              }
              {...(project.weburl
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <Eye className="mr-1.5 h-4 w-4" />
              {project.weburl ? "Visit Site" : "View Details"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
