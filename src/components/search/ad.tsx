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

function RealEstateAd({
  src,
  href,
  alt = "Ad banner",
  title,
}: RealEstateAdProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const aspectRatio = imageDimensions
    ? `${imageDimensions.width} / ${imageDimensions.height}`
    : "16 / 9";

  return (
    <article
      className="relative w-full"
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
        <div className="relative w-full overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
          <div
            className="relative w-full overflow-hidden bg-gray-100"
            style={{ aspectRatio }}
          >
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 animate-pulse bg-gray-200" />
            )}

            {imageError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                  <Eye className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium">Unavailable</p>
              </div>
            )}

            <Image
              src={src}
              alt={alt}
              fill
              className={`object-cover transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 768px) 100vw, 300px"
              onLoad={(e) => {
                const img = e.target as HTMLImageElement;
                setImageDimensions({
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                });
                setImageLoaded(true);
              }}
              onError={() => setImageError(true)}
            />
          </div>
        </div>
      </a>
    </article>
  );
}

export default RealEstateAd;
export type { RealEstateAdProps };
