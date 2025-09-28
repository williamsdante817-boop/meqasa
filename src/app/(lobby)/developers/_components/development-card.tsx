"use client";

import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { MapPin } from "lucide-react";

interface DevelopmentCardProps {
  id: string;
  imageUrl: string;
  developmentName: string;
  location: string;
  developerName: string;
  developerLogo?: string;
  onClick?: () => void;
  className?: string;
}

export function DevelopmentCard({
  id: _id,
  imageUrl,
  developmentName,
  location,
  developerName,
  developerLogo,
  onClick,
  className = "",
}: DevelopmentCardProps) {
  const handleClick = () => {
    onClick?.();
  };

  return (
    <div
      className={`group relative cursor-pointer overflow-hidden rounded-lg border border-brand-border bg-white transition-all duration-300 hover:shadow-lg ${className}`}
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

        {/* Developer Logo - Bottom Right */}
        {developerLogo && (
          <div className="absolute right-4 bottom-4 flex h-18 w-18 items-center justify-center rounded-md bg-white p-2 shadow-lg">
            <ImageWithFallback
              src={developerLogo}
              alt={developerName}
              width={72}
              height={72}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-brand-accent mb-2 line-clamp-2 text-lg font-semibold">
          {developmentName}
        </h3>
        <div className="text-brand-muted flex items-center text-sm">
          <MapPin className="text-brand-primary mr-2 h-4 w-4 flex-shrink-0" />
          <span className="line-clamp-1 min-w-0">{location}</span>
        </div>
      </div>
    </div>
  );
}
