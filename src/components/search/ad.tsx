"use client";

import { Eye } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface RealEstateAdProps {
  src: string;
  href: string;
  alt?: string;
  title?: string;
  description?: string;
  badge?: string;
}

const RealEstateAd = ({
  src,
  href,
  alt = "Ad banner",
  title,
  description,
  badge,
}: RealEstateAdProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <article
      className="group relative w-full"
      role="complementary"
      aria-label="Advertisement"
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block w-full"
        aria-label={`Visit ${title || "advertiser"} - Opens in new tab`}
      >
        <div className="relative w-full overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md">
          {/* Simple Badge */}
          <div className="absolute top-2 left-2 z-10">
            <span className="rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              {badge || "Ad"}
            </span>
          </div>

          {/* Image Container */}
          <div className="relative w-full">
            <div className="relative h-[280px] w-full overflow-hidden bg-gray-100 sm:h-[320px] md:h-[380px]">
              {/* Loading state */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-full animate-pulse bg-gray-200" />
                </div>
              )}

              {/* Error state */}
              {imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                    <Eye className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-medium">Unavailable</p>
                </div>
              )}

              {/* Main image */}
              {!imageError && (
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className={`object-cover transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  sizes="(max-width: 768px) 100vw, 300px"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAMGBP/EACAQAAEDBAICAwAAAAAAAAAAAAECAwQABREGEiExE1HB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAL/xAAYEQEBAQEBAAAAAAAAAAAAAAAAARECEv/aAAwDAQACEQMRAD8A0kup7jLkSktFTqXW4VBwKS2qCWlOKGCUp3BsEjJOD6nVZ/q67kJhp1oYfBBVyCrwB4lfX0o1HqVPUC9TSLsGkKJU0pClJ1gDPJORz4z2BI6bTEMStqRIebTKUVv5S2ppOSCCdoJI+p8fY+oj7z/2Q=="
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  priority={false}
                />
              )}
            </div>
          </div>

          {/* Minimal Content (only if title provided) */}
          {title && (
            <div className="border-t border-gray-50 bg-white p-3">
              <h3 className="text-brand-accent line-clamp-1 text-sm font-semibold">
                {title}
              </h3>
              {description && (
                <p className="text-brand-muted mt-1 line-clamp-1 text-xs">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
      </a>
    </article>
  );
};

export default RealEstateAd;
export type { RealEstateAdProps };
