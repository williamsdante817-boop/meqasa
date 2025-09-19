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
      <div className="relative h-48 overflow-hidden rounded-lg bg-gray-100">
        {imageLoading && (
          <Skeleton className="absolute inset-0 h-full w-full rounded-lg bg-gray-100" />
        )}

        <ImageWithFallback
          src={src}
          alt={`${location} location image`}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          fill
          priority={priority}
          className={`h-full w-full object-cover transition-all duration-500 group-hover:brightness-105 ${
            imageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setImageLoading(false)}
          onError={() => setImageLoading(false)}
          quality={90}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="mt-4">
        <h3 className="line-clamp-2 font-medium text-gray-900 capitalize transition-colors duration-200 group-hover:text-blue-600 lg:text-lg">
          {location}
        </h3>
        {description && (
          <p
            className="mt-1 line-clamp-2 text-sm text-gray-600"
            aria-label={`Description for ${location}`}
          >
            {description}
          </p>
        )}
      </div>
    </Link>
  );
}
