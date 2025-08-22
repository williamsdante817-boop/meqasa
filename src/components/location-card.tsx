"use client";

import React from "react";
import Link from "next/link";
import { ImageWithFallback } from "./image-with-fallback";
import { Skeleton } from "@/components/ui/skeleton";

export interface LocationCardProps {
  href: string;
  location: string;
  src: string;
  description?: string;
  priority?: boolean;
}

export default function LocationCard({
  href,
  location,
  src,
  description,
  priority = false,
}: LocationCardProps) {
  const [imageLoading, setImageLoading] = React.useState(true);

  return (
    <Link
      href={href}
      className="group block cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
      aria-label={`View properties in ${location}`}
      role="article"
    >
      <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
        {imageLoading && (
          <Skeleton className="absolute inset-0 w-full h-full bg-gray-100 rounded-lg" />
        )}

        <ImageWithFallback
          src={src}
          alt={`${location} location image`}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          fill
          priority={priority}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:brightness-105 ${
            imageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
          quality={90}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="mt-4">
        <h3 className="text-gray-900 font-medium transition-colors duration-200 group-hover:text-blue-600 capitalize line-clamp-2 lg:text-lg">
          {location}
        </h3>
        {description && (
          <p
            className="mt-1 text-sm text-gray-600 line-clamp-2"
            aria-label={`Description for ${location}`}
          >
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
