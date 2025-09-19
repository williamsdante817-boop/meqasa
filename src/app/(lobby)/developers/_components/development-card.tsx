"use client";

import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MapPin } from "lucide-react";

interface DevelopmentCardProps {
  id: string;
  imageUrl: string;
  developmentName: string;
  location: string;
  developerName: string;
  developerLogo?: string;
  projectValue?: string;
  onViewProject?: (id: string) => void;
  onClick?: (id: string) => void;
  className?: string;
}

export function DevelopmentCard({
  id,
  imageUrl,
  developmentName,
  location,
  developerName,
  developerLogo,
  projectValue,
  onViewProject,
  onClick,
  className = "",
}: DevelopmentCardProps) {
  const handleClick = () => {
    onClick?.(id);
  };

  const handleViewProject = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewProject?.(id);
  };

  return (
    <div
      className={`group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 ${className}`}
      onClick={handleClick}
    >
      {/* Main Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={developmentName}
          width={400}
          height={300}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Developer Logo - Bottom Left */}
        {developerLogo ? (
          <div className="absolute bottom-4 left-4 h-12 w-12 rounded-lg bg-white p-2 shadow-lg">
            <ImageWithFallback
              src={developerLogo}
              alt={developerName}
              width={32}
              height={32}
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <div className="absolute bottom-4 left-4 rounded-md bg-white/90 px-3 py-1 shadow-lg backdrop-blur-sm">
            <span className="text-xs font-medium text-gray-900">
              {developerName}
            </span>
          </div>
        )}

        {/* View Project Button - Bottom Right */}
        {projectValue && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleViewProject}
            className="bg-brand-primary hover:bg-brand-primary-dark absolute right-4 bottom-4 text-white shadow-lg"
          >
            <Eye className="mr-1 h-3 w-3" />
            View Project {projectValue}
          </Button>
        )}

        {/* Development Info - Top */}
        <div className="absolute top-4 right-4 left-4">
          <Badge
            variant="secondary"
            className="bg-white/90 text-gray-900 backdrop-blur-sm"
          >
            New Development
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-brand-accent mb-1 line-clamp-1 font-semibold">
          {developmentName}
        </h3>
        <div className="text-brand-muted flex items-center text-sm">
          <MapPin className="text-brand-primary mr-1 h-3 w-3" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
}
