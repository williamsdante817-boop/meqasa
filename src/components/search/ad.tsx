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
  badge 
}: RealEstateAdProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group relative w-full" role="complementary" aria-label="Advertisement">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
        aria-label={`Visit ${title || 'advertiser'} - Opens in new tab`}
      >
        <div className="relative w-full rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all duration-300">
          {/* Ad Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100/90 text-gray-600 rounded-full backdrop-blur-sm">
              {badge || 'Sponsored'}
            </span>
          </div>
          
          {/* External Link Indicator */}
          <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <div className="flex items-center justify-center w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
              <ExternalLink className="w-4 h-4 text-brand-primary" />
            </div>
          </div>

          {/* Image Container */}
          <div className="relative w-full">
            <div className="relative h-[280px] sm:h-[320px] md:h-[380px] w-full overflow-hidden bg-gray-50">
              {/* Loading state */}
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-pulse bg-gray-200 rounded-lg w-full h-full" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Eye className="w-8 h-8 text-gray-400 animate-pulse" />
                  </div>
                </div>
              )}
              
              {/* Error state */}
              {imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                    <Eye className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium">Ad content unavailable</p>
                  <p className="text-xs text-gray-400 mt-1">Click to visit advertiser</p>
                </div>
              )}
              
              {/* Main image */}
              {!imageError && (
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  sizes="(max-width: 768px) 100vw, 300px"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ci8+PC9zdmc+"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                  priority={false}
                />
              )}
              
              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/5 via-transparent to-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
          
          {/* Content section (if title or description provided) */}
          {(title || description) && (
            <div className="p-4 bg-white border-t border-gray-100">
              {title && (
                <h3 className="font-semibold text-sm text-brand-accent line-clamp-2 mb-2 group-hover:text-brand-primary transition-colors duration-200">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-brand-muted line-clamp-3 leading-relaxed">
                  {description}
                </p>
              )}
              
              {/* Call-to-action indicator */}
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs font-medium text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Learn more
                </span>
                <div className="flex items-center text-xs text-gray-400">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  <span>External</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Hover effect border */}
          <div className="absolute inset-0 rounded-xl ring-2 ring-brand-primary/20 ring-inset opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
        </div>
      </a>
    </article>
  );
};

export default RealEstateAd;
export type { RealEstateAdProps };
