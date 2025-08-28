"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ImageCarouselModal } from "@/components/image-carousel-modal";
import { ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { preloadImages } from "@/lib/image-preload";

// Light gray base64 placeholder - simplified to avoid parsing issues
const PLACEHOLDER_BLUR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=';

// Image URL generation function
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "";

  // If the URL already contains cloudfront domain, return it as is
  if (imagePath.includes("dve7rykno93gs.cloudfront.net")) {
    return imagePath;
  }

  const baseUrl = "https://dve7rykno93gs.cloudfront.net";

  // If the path starts with /temp/temp/ or is just a number, it's a temp image
  if (imagePath.startsWith("/temp/temp/") || /^\d+$/.test(imagePath)) {
    const id = imagePath.split("/").pop();
    return `${baseUrl}/temp/temp/${id}`;
  }

  // For other paths, just append the path directly
  return `${baseUrl}/uploads/imgs/${imagePath}`;
};

function ImagePlaceholder({ className = "", message = "Image not available" }: { 
  className?: string;
  message?: string;
}) {
  return (
    <div
      className={`w-full h-full min-h-full bg-gray-100 flex flex-col items-center justify-center rounded-lg ${className}`}
      role="img"
      aria-label={message}
    >
      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
      <span className="text-gray-500 text-sm">{message}</span>
    </div>
  );
}

// Skeleton component that matches the exact PropertyShowcase layout
function PropertyShowcaseSkeleton({ maxImages = 4 }: { maxImages?: number }) {
  const rightImageCount = Math.min(3, maxImages - 1); // Up to 3 right images
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Main large image skeleton (left, spans two rows) */}
        <div className="md:col-span-2 row-span-2 relative max-h-[300px] md:max-h-[450px]">
          <div className="rounded-lg overflow-hidden h-full">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        </div>

        {/* Right column with smaller image skeletons (stacked vertically) */}
        <div className="flex flex-col gap-4 max-h-[450px]">
          {Array.from({ length: rightImageCount }, (_, index) => (
            <div
              key={`skeleton-right-${index}`}
              className="rounded-lg overflow-hidden h-1/3 flex-1 relative"
            >
              <Skeleton className="w-full h-[200px] md:h-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* See more photos button skeleton */}
      <div className="text-left mt-2">
        <Skeleton className="h-5 w-32 rounded" />
      </div>
    </div>
  );
}

function PropertyShowcaseImages({ images }: { images: string[] }) {
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [imgLoading, setImgLoading] = useState<Record<number, boolean>>({});
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Only show up to 4 images in the grid
  const gridImages = useMemo(() => {
    if (!images?.length) return [];
    return images.filter(Boolean).slice(0, 4);
  }, [images]);

  // Initialize loading states
  useEffect(() => {
    if (gridImages.length > 0) {
      const initialLoading: Record<number, boolean> = {};
      gridImages.forEach((_, index) => {
        initialLoading[index] = true;
      });
      setImgLoading(initialLoading);
    }
  }, [gridImages]);

  // Preload grid images and a bit more for fast modal opening
  useEffect(() => {
    if (!gridImages.length) return;
    const urls = [gridImages[0]!, ...gridImages.slice(1, 4)].map((p) =>
      getImageUrl(p),
    );
    const extra = images.slice(4, 6).map((p) => getImageUrl(p));
    void preloadImages([...urls, ...extra]);
  }, [gridImages, images]);

  if (!gridImages.length) {
    return <PropertyShowcaseSkeleton />;
  }

  // At this point we know gridImages has at least one element
  const mainImage = gridImages[0]!;
  const rightImages = gridImages.slice(1, 4);
  const totalImagesCount = images.filter(Boolean).length;

  const handleImageError = (index: number) => {
    setImgErrors((prev) => ({ ...prev, [index]: true }));
    setImgLoading((prev) => ({ ...prev, [index]: false }));
  };

  const handleImageLoad = (index: number) => {
    setImgLoading((prev) => ({ ...prev, [index]: false }));
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsCarouselOpen(true);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Main large property image (left, spans two rows) */}
        <div className="md:col-span-2 row-span-2 relative max-h-[300px] md:max-h-[450px]">
          <div className="rounded-lg overflow-hidden h-full">
            {imgErrors[0] ? (
              <ImagePlaceholder />
            ) : imgLoading[0] ? (
              <div className="w-full h-full relative">
                <Skeleton className="w-full h-full rounded-lg" />
                {/* Hidden image for actual loading */}
                <Image
                  src={getImageUrl(mainImage)}
                  alt="Main property image"
                  width={900}
                  height={600}
                  className="opacity-0 w-full h-full object-cover"
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  onError={() => handleImageError(0)}
                  onLoad={() => handleImageLoad(0)}
                  priority={true}
                />
              </div>
            ) : (
              <button
                onClick={() => handleImageClick(0)}
                className="w-full h-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
                aria-label="Open image gallery at main image"
                type="button"
              >
                <Image
                  src={getImageUrl(mainImage)}
                  alt="Main property image"
                  width={900}
                  height={600}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  onError={() => handleImageError(0)}
                  onLoad={() => handleImageLoad(0)}
                  placeholder="blur"
                  blurDataURL={PLACEHOLDER_BLUR}
                  priority={true}
                />
              </button>
            )}
          </div>
        </div>

        {/* Right column with up to three smaller property images (stacked vertically) */}
        <div className="flex flex-col gap-4 max-h-[450px]">
          {rightImages.map((image, index) => {
            const actualIndex = index + 1;
            const isLastTile = index === rightImages.length - 1;
            const remainingCount = Math.max(0, totalImagesCount - 4);
            const showMoreOverlay = isLastTile && remainingCount > 0;

            return (
              <div
                key={`right-image-${actualIndex}-${image}`}
                className="rounded-lg overflow-hidden h-1/3 flex-1 relative"
                aria-label={`Additional property image ${actualIndex + 1}`}
              >
                {imgErrors[actualIndex] ? (
                  <ImagePlaceholder />
                ) : imgLoading[actualIndex] ? (
                  <div className="w-full h-full relative">
                    <Skeleton className="w-full h-[200px] md:h-full rounded-lg" />
                    {/* Hidden image for actual loading */}
                    <Image
                      src={getImageUrl(image)}
                      alt={`Property image ${actualIndex + 1}`}
                      width={450}
                      height={300}
                      className="opacity-0 w-full h-[200px] md:h-full object-cover"
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      onError={() => handleImageError(actualIndex)}
                      onLoad={() => handleImageLoad(actualIndex)}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => handleImageClick(actualIndex)}
                    className="relative w-full h-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
                    aria-label={
                      showMoreOverlay
                        ? `Open image gallery at image ${actualIndex + 1}, plus ${remainingCount} more photos`
                        : `Open image gallery at image ${actualIndex + 1}`
                    }
                    type="button"
                  >
                    <Image
                      src={getImageUrl(image)}
                      alt={`Property image ${actualIndex + 1}`}
                      width={450}
                      height={300}
                      className="w-full h-[200px] md:h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      onError={() => handleImageError(actualIndex)}
                      onLoad={() => handleImageLoad(actualIndex)}
                      placeholder="blur"
                      blurDataURL={PLACEHOLDER_BLUR}
                    />
                    {showMoreOverlay && (
                      <span className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-lg font-semibold pointer-events-none">
                        +{remainingCount} more
                      </span>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* See more photos button */}
      <div className="text-left mt-2">
        <button
          className="text-brand-blue font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:underline cursor-pointer"
          onClick={() => handleImageClick(0)}
          aria-label="See more photos"
        >
          See more photos
        </button>
      </div>

      {/* Image Carousel Modal */}
      <ImageCarouselModal
        images={images.filter(Boolean)}
        isOpen={isCarouselOpen}
        onClose={() => setIsCarouselOpen(false)}
        initialIndex={selectedImageIndex}
        getImageUrl={getImageUrl}
      />
    </div>
  );
}

interface PropertyShowcaseProps {
  images: string[];
  maxImages?: number;
  enableModal?: boolean;
  priority?: boolean;
  className?: string;
}

export default function PropertyShowcase({ images, className = "" }: PropertyShowcaseProps) {
  // Ensure we have a stable array on the server side
  const stableImages = images?.filter(Boolean) ?? [];

  // Show skeleton if no images initially
  if (!stableImages.length) {
    return (
      <section className={`property-showcase ${className}`.trim()}>
        <PropertyShowcaseSkeleton />
      </section>
    );
  }

  return (
    <section
      className={`property-showcase ${className}`.trim()}
      aria-labelledby="property-showcase-heading"
    >
      <h2 id="property-showcase-heading" className="sr-only">
        Property Showcase
      </h2>
      <PropertyShowcaseImages images={stableImages} />
    </section>
  );
}