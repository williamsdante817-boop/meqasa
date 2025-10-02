"use client";

import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { ImageCarouselModal } from "@/components/image-carousel-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { preloadImages } from "@/lib/image-preload";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

// Light gray base64 placeholder
const PLACEHOLDER_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=";

// Generate image URL
const getImageUrl = (imagePath: string) => {
  if (!imagePath) return "";

  if (imagePath.includes("dve7rykno93gs.cloudfront.net")) {
    return imagePath;
  }

  const baseUrl = "https://dve7rykno93gs.cloudfront.net";

  if (imagePath.startsWith("/temp/temp/") || /^\d+$/.test(imagePath)) {
    const id = imagePath.split("/").pop();
    return `${baseUrl}/temp/temp/${id}`;
  }

  return `${baseUrl}/uploads/imgs/${imagePath}`;
};

// Skeleton
function PropertyShowcaseSkeleton({ maxImages = 4 }: { maxImages?: number }) {
  const rightImageCount = Math.min(3, maxImages - 1);
  return (
    <div>
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Main skeleton */}
        <div className="relative row-span-2 max-h-[300px] md:col-span-2 md:max-h-[450px]">
          <div className="h-full min-h-[300px] overflow-hidden rounded-lg md:min-h-[450px]">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        </div>
        {/* Right skeletons */}
        <div className="flex max-h-[450px] flex-col gap-4">
          {Array.from({ length: rightImageCount }, (_, i) => (
            <div
              key={`skeleton-${i}`}
              className="relative h-1/3 min-h-[133px] flex-1 overflow-hidden rounded-lg"
            >
              <Skeleton className="h-[200px] w-full rounded-lg md:h-full" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 text-left">
        <Skeleton className="h-5 w-32 rounded" />
      </div>
    </div>
  );
}

// Main showcase
function PropertyShowcaseImages({ images }: { images: string[] }) {
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const gridImages = useMemo(
    () => images.filter(Boolean).slice(0, 4),
    [images]
  );
  const totalImagesCount = images.filter(Boolean).length;

  // Preload a few
  useEffect(() => {
    if (!gridImages.length) return;
    const urls = [gridImages[0]!, ...gridImages.slice(1, 4)].map(getImageUrl);
    const extra = images.slice(4, 6).map(getImageUrl);
    void preloadImages([...urls, ...extra]);
  }, [gridImages, images]);

  if (!gridImages.length) {
    return <PropertyShowcaseSkeleton />;
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsCarouselOpen(true);
  };

  const mainImage = gridImages[0]!;
  const rightImages = gridImages.slice(1, 4);

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Main image */}
        <div className="relative row-span-2 max-h-[300px] md:col-span-2 md:max-h-[450px]">
          <motion.button
            onClick={() => handleImageClick(0)}
            className="group h-full w-full cursor-pointer overflow-hidden rounded-lg shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            aria-label="Open image gallery at main image"
            type="button"
          >
            <motion.div
              className="h-full w-full overflow-hidden"
              whileHover={{ scale: 1.05 }} // ✅ only scales the image
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <ImageWithFallback
                src={getImageUrl(mainImage)}
                alt="Main property image"
                fallbackAlt="Property image not available"
                fallbackSrc="/fallback.png"
                width={900}
                height={600}
                className="h-full w-full cursor-pointer object-cover transition-all duration-300 group-hover:brightness-105"
                sizes="(min-width: 1024px) 66vw, 100vw"
                placeholder="blur"
                blurDataURL={PLACEHOLDER_BLUR}
                priority
                quality={85}
                withBlur
              />
            </motion.div>
            <div className="pointer-events-none absolute inset-0 rounded-lg bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
          </motion.button>
        </div>

        {/* Right column */}
        <div className="flex max-h-[450px] flex-col gap-4">
          {rightImages.map((image, index) => {
            const actualIndex = index + 1;
            const remainingCount = Math.max(0, totalImagesCount - 4);
            const showMoreOverlay =
              index === rightImages.length - 1 && remainingCount > 0;

            return (
              <motion.div
                key={image}
                className="relative h-1/3 flex-1 overflow-hidden rounded-lg"
              >
                <motion.button
                  onClick={() => handleImageClick(actualIndex)}
                  className="group relative h-full w-full cursor-pointer overflow-hidden rounded-lg shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  type="button"
                >
                  <motion.div
                    className="h-full w-full overflow-hidden"
                    whileHover={{ scale: 1.08 }} // ✅ only scales the image
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <ImageWithFallback
                      src={getImageUrl(image)}
                      alt={`Property image ${actualIndex + 1}`}
                      fallbackAlt="Property image not available"
                      fallbackSrc="/fallback.png"
                      width={450}
                      height={300}
                      className="h-[200px] w-full cursor-pointer object-cover transition-all duration-300 group-hover:brightness-105 md:h-full"
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      placeholder="blur"
                      blurDataURL={PLACEHOLDER_BLUR}
                      quality={75}
                      withBlur
                    />
                  </motion.div>
                  {showMoreOverlay && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 via-black/40 to-transparent text-white">
                      <span className="text-lg font-semibold drop-shadow-lg">
                        +{remainingCount} more
                      </span>
                    </div>
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* See more photos */}
      {totalImagesCount > 1 && (
        <motion.div className="mt-4 text-left">
          <motion.button
            className="text-brand-blue inline-flex cursor-pointer items-center gap-2 font-medium hover:underline focus-visible:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            onClick={() => handleImageClick(0)}
          >
            <span>See more photos</span>
            <span aria-hidden="true">→</span>
          </motion.button>
        </motion.div>
      )}

      {/* Modal */}
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

export default function PropertyShowcase({
  images,
  className = "",
}: PropertyShowcaseProps) {
  const stableImages = images?.filter(Boolean) ?? [];

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
