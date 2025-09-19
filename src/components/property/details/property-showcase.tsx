"use client";

import { ImageCarouselModal } from "@/components/image-carousel-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { preloadImages } from "@/lib/image-preload";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

// Light gray base64 placeholder - simplified to avoid parsing issues
const PLACEHOLDER_BLUR =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=";

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

function ImagePlaceholder({
  className = "",
  message = "Image not available",
}: {
  className?: string;
  message?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "flex h-full min-h-full w-full flex-col items-center justify-center rounded-lg border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100",
        className
      )}
      role="img"
      aria-label={message}
    >
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
        <span className="text-center text-sm text-gray-500">{message}</span>
      </motion.div>
    </motion.div>
  );
}

// Skeleton component that matches the exact PropertyShowcase layout
function PropertyShowcaseSkeleton({ maxImages = 4 }: { maxImages?: number }) {
  const rightImageCount = Math.min(3, maxImages - 1); // Up to 3 right images

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Main large image skeleton (left, spans two rows) - matches exact dimensions */}
        <div className="relative row-span-2 max-h-[300px] md:col-span-2 md:max-h-[450px]">
          <div className="h-full min-h-[300px] overflow-hidden rounded-lg md:min-h-[450px]">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        </div>

        {/* Right column with smaller image skeletons (stacked vertically) */}
        <div className="flex max-h-[450px] flex-col gap-4">
          {Array.from({ length: rightImageCount }, (_, index) => (
            <div
              key={`skeleton-right-${index}`}
              className="relative h-1/3 min-h-[133px] flex-1 overflow-hidden rounded-lg"
            >
              <Skeleton className="h-[200px] w-full rounded-lg md:h-full" />
            </div>
          ))}
        </div>
      </div>

      {/* See more photos button skeleton */}
      <div className="mt-2 text-left">
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
      getImageUrl(p)
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
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Main large property image (left, spans two rows) */}
        <div className="relative row-span-2 max-h-[300px] md:col-span-2 md:max-h-[450px]">
          <div className="h-full overflow-hidden rounded-lg">
            {imgErrors[0] ? (
              <ImagePlaceholder />
            ) : imgLoading[0] ? (
              <div className="relative h-full w-full">
                <Skeleton className="h-full w-full rounded-lg" />
                {/* Hidden image for actual loading */}
                <Image
                  src={getImageUrl(mainImage)}
                  alt="Main property image"
                  width={900}
                  height={600}
                  className="h-full w-full object-cover opacity-0"
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  onError={() => handleImageError(0)}
                  onLoad={() => handleImageLoad(0)}
                  priority={true}
                  quality={85}
                />
              </div>
            ) : (
              <motion.button
                onClick={() => handleImageClick(0)}
                className="group focus-visible:ring-primary h-full w-full cursor-pointer overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                aria-label="Open image gallery at main image"
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.div
                  className="h-full w-full overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Image
                    src={getImageUrl(mainImage)}
                    alt="Main property image"
                    width={900}
                    height={600}
                    className="h-full w-full cursor-pointer object-cover transition-all duration-300 group-hover:brightness-105"
                    sizes="(min-width: 1024px) 66vw, 100vw"
                    onError={() => handleImageError(0)}
                    onLoad={() => handleImageLoad(0)}
                    placeholder="blur"
                    blurDataURL={PLACEHOLDER_BLUR}
                    priority={true}
                    quality={85}
                  />
                </motion.div>
                <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                {/* Hover overlay with subtle zoom icon */}
                <motion.div
                  className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm">
                    <svg
                      className="h-6 w-6 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </motion.div>
              </motion.button>
            )}
          </div>
        </div>

        {/* Right column with up to three smaller property images (stacked vertically) */}
        <div className="flex max-h-[450px] flex-col gap-4">
          {rightImages.map((image, index) => {
            const actualIndex = index + 1;
            const isLastTile = index === rightImages.length - 1;
            const remainingCount = Math.max(0, totalImagesCount - 4);
            const showMoreOverlay = isLastTile && remainingCount > 0;

            return (
              <motion.div
                key={`right-image-${actualIndex}-${image}`}
                className="relative h-1/3 flex-1 overflow-hidden rounded-lg"
                aria-label={`Additional property image ${actualIndex + 1}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.2 + index * 0.1,
                  duration: 0.4,
                  ease: "easeOut",
                }}
              >
                {imgErrors[actualIndex] ? (
                  <ImagePlaceholder />
                ) : imgLoading[actualIndex] ? (
                  <div className="relative h-full w-full">
                    <Skeleton className="h-[200px] w-full rounded-lg md:h-full" />
                    {/* Hidden image for actual loading */}
                    <Image
                      src={getImageUrl(image)}
                      alt={`Property image ${actualIndex + 1}`}
                      width={450}
                      height={300}
                      className="h-[200px] w-full object-cover opacity-0 md:h-full"
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      onError={() => handleImageError(actualIndex)}
                      onLoad={() => handleImageLoad(actualIndex)}
                      quality={75}
                    />
                  </div>
                ) : (
                  <motion.button
                    onClick={() => handleImageClick(actualIndex)}
                    className="group focus-visible:ring-primary relative h-full w-full cursor-pointer overflow-hidden rounded-lg shadow-sm transition-shadow duration-300 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    aria-label={
                      showMoreOverlay
                        ? `Open image gallery at image ${actualIndex + 1}, plus ${remainingCount} more photos`
                        : `Open image gallery at image ${actualIndex + 1}`
                    }
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <motion.div
                      className="h-full w-full overflow-hidden"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <Image
                        src={getImageUrl(image)}
                        alt={`Property image ${actualIndex + 1}`}
                        width={450}
                        height={300}
                        className="h-[200px] w-full cursor-pointer object-cover transition-all duration-300 group-hover:brightness-105 md:h-full"
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        onError={() => handleImageError(actualIndex)}
                        onLoad={() => handleImageLoad(actualIndex)}
                        placeholder="blur"
                        blurDataURL={PLACEHOLDER_BLUR}
                        quality={75}
                      />
                    </motion.div>
                    {showMoreOverlay && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 via-black/40 to-transparent text-white backdrop-blur-[1px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <motion.span
                          className="text-lg font-semibold drop-shadow-lg"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.3 }}
                        >
                          +{remainingCount} more
                        </motion.span>
                      </motion.div>
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* See more photos button */}
      <motion.div
        className="mt-4 text-left"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      >
        <motion.button
          className="group text-brand-blue focus-visible:ring-primary inline-flex cursor-pointer items-center gap-2 font-medium transition-colors hover:underline focus-visible:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          onClick={() => handleImageClick(0)}
          aria-label="See more photos"
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <span>See more photos</span>
          <motion.span
            initial={{ x: 0 }}
            animate={{ x: [0, 3, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
              repeatDelay: 3,
            }}
          >
            →
          </motion.span>
        </motion.button>
      </motion.div>

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

export default function PropertyShowcase({
  images,
  className = "",
}: PropertyShowcaseProps) {
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
