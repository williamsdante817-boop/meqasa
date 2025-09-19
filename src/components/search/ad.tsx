"use client";

import Image from "next/image";
import { useState } from "react";
import { ExternalLink, Eye } from "lucide-react";

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
        className="block w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
        aria-label={`Visit ${title || "advertiser"} - Opens in new tab`}
      >
        <div className="hover:border-brand-primary/30 relative w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
          {/* Ad Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center rounded-full bg-gray-100/90 px-2 py-1 text-xs font-medium text-gray-600 backdrop-blur-sm">
              {badge || "Sponsored"}
            </span>
          </div>

          {/* External Link Indicator */}
          <div className="absolute top-3 right-3 z-10 opacity-0 transition-all duration-200 group-hover:opacity-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm">
              <ExternalLink className="text-brand-primary h-4 w-4" />
            </div>
          </div>

          {/* Image Container */}
          <div className="relative w-full">
            <div className="relative h-[280px] w-full overflow-hidden bg-gray-50 sm:h-[320px] md:h-[380px]">
              {/* Loading state */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-full animate-pulse rounded-lg bg-gray-200" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Eye className="h-8 w-8 animate-pulse text-gray-400" />
                  </div>
                </div>
              )}

              {/* Error state */}
              {imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-200">
                    <Eye className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium">Ad content unavailable</p>
                  <p className="mt-1 text-xs text-gray-400">
                    Click to visit advertiser
                  </p>
                </div>
              )}

              {/* Main image */}
              {!imageError && (
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className={`object-cover transition-all duration-500 group-hover:scale-105 ${
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

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="from-brand-primary/5 to-brand-primary/5 absolute inset-0 bg-gradient-to-r via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          </div>

          {/* Content section (if title or description provided) */}
          {(title || description) && (
            <div className="border-t border-gray-100 bg-white p-4">
              {title && (
                <h3 className="text-brand-accent group-hover:text-brand-primary mb-2 line-clamp-2 text-sm font-semibold transition-colors duration-200">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-brand-muted line-clamp-3 text-xs leading-relaxed">
                  {description}
                </p>
              )}

              {/* Call-to-action indicator */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-brand-primary text-xs font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Learn more
                </span>
                <div className="flex items-center text-xs text-gray-400">
                  <ExternalLink className="mr-1 h-3 w-3" />
                  <span>External</span>
                </div>
              </div>
            </div>
          )}

          {/* Hover effect border */}
          <div className="ring-brand-primary/20 pointer-events-none absolute inset-0 rounded-xl opacity-0 ring-2 transition-opacity duration-200 ring-inset group-hover:opacity-100" />
        </div>
      </a>
    </article>
  );
};

export default RealEstateAd;
export type { RealEstateAdProps };
