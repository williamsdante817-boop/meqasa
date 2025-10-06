"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { isImagePreloaded, preloadImages } from "@/lib/image-preload";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Constants for better maintainability
const THUMBNAIL_WIDTH = 80;
const THUMBNAIL_HEIGHT = 60;
const THUMBNAIL_STRIP_HEIGHT = 90;
const SWIPE_THRESHOLD = 50; // Minimum distance for swipe to trigger navigation

function ImagePlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gray-100",
        className
      )}
    >
      <ImageIcon className="h-8 w-8 text-gray-400" />
    </div>
  );
}

// Light gray base64 placeholder (1x1 pixel)

interface ImageCarouselModalProps {
  images: (string | undefined)[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
  getImageUrl: (imagePath: string) => string;
}

export function ImageCarouselModal({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
  getImageUrl,
}: ImageCarouselModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const [thumbnailSpacerWidth, setThumbnailSpacerWidth] = useState(0);

  // Memoize filtered images to prevent unnecessary re-renders
  const validImages = useMemo(
    () => images.filter((img): img is string => Boolean(img)),
    [images]
  );

  // Compute full URLs early so cache checks are available to effects below
  const imageUrls = useMemo(
    () => validImages.map((img) => getImageUrl(img)),
    [validImages, getImageUrl]
  );

  // Reset states when modal opens with a new initial index or images change
  useEffect(() => {
    if (isOpen) {
      const initial = Number.isFinite(initialIndex) ? initialIndex : 0;
      const safeInitialIndex = Math.max(
        0,
        Math.min(initial, validImages.length - 1)
      );
      setCurrentIndex(safeInitialIndex);
      setImgErrors({});
      setIsAnimating(true);

      // Set loading based on cache status of the initial image
      const initialUrl = imageUrls[safeInitialIndex];
      setIsLoading(!isImagePreloaded(initialUrl));

      // Preload a small window around the initial index
      const toPreload: string[] = [];
      for (let offset = -2; offset <= 2; offset++) {
        const idx = safeInitialIndex + offset;
        if (idx >= 0 && idx < imageUrls.length) toPreload.push(imageUrls[idx]!);
      }
      void preloadImages(toPreload);

      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialIndex, validImages.length, imageUrls]);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && mainImageRef.current) {
      // Focus the main image container for keyboard navigation
      mainImageRef.current.focus();
    }
  }, [isOpen]);

  // Compute leading/trailing spacers so first/last thumbnails can center fully
  useEffect(() => {
    const container = thumbnailStripRef.current;
    if (!container) return;

    const computeSpacer = () => {
      const spacer = Math.max(
        0,
        container.clientWidth / 2 - THUMBNAIL_WIDTH / 2
      );
      setThumbnailSpacerWidth(spacer);
    };

    computeSpacer();

    const resizeObserver = new ResizeObserver(() => computeSpacer());
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [isOpen]);

  // Debounced thumbnail scrolling with manual centering and clamping
  useEffect(() => {
    const container = thumbnailStripRef.current;
    if (!container) return;

    let rafId: number | null = null;

    const centerCurrentThumbnail = () => {
      const thumbnailEl = container.querySelector<HTMLElement>(
        `[data-thumb-index="${currentIndex}"]`
      );
      if (!thumbnailEl) return;

      const containerWidth = container.clientWidth;
      const thumbnailWidth = thumbnailEl.offsetWidth;
      const thumbnailOffset = thumbnailEl.offsetLeft;
      const scrollPosition =
        thumbnailOffset - containerWidth / 2 + thumbnailWidth / 2;

      const clampedScroll = Math.max(
        0,
        Math.min(scrollPosition, container.scrollWidth - containerWidth)
      );

      container.scrollTo({
        left: clampedScroll,
        behavior: "smooth",
      });
    };

    const requestScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(centerCurrentThumbnail);
    };

    requestScroll();

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [currentIndex]);

  // Keyboard navigation support
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          handleNext();
          break;
        case "ArrowLeft":
          event.preventDefault();
          handlePrevious();
          break;
        case "Escape":
          handleClose();
          break;
      }
    },
    []
  );

  // Helper to get image URL with fallback when errors occur
  const getImageUrlWithFallback = useCallback(
    (imagePath: string | undefined) => {
      if (!imagePath) return "";
      const url = getImageUrl(imagePath);
      return url || "/fallback.png";
    },
    [getImageUrl]
  );

  // Navigation handlers
  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  }, [validImages.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const handleThumbnailClick = useCallback((index: number) => {
    if (index < 0 || index >= validImages.length) return;
    setCurrentIndex(index);
  }, [validImages.length]);

  const handleClose = useCallback(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      onClose();
      setIsAnimating(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Swipe gesture handlers for touch devices
  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.targetTouches[0];
    if (touch) {
      setTouchStart({ x: touch.clientX, y: touch.clientY });
    }
  }, []);

  const handleTouchMove = useCallback((event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.targetTouches[0];
    if (touch) {
      setTouchEnd({ x: touch.clientX, y: touch.clientY });
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;

    // Only consider horizontal swipes
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }

    if (deltaX > SWIPE_THRESHOLD) {
      handleNext();
    } else if (deltaX < -SWIPE_THRESHOLD) {
      handlePrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, handleNext, handlePrevious]);

  // Enhanced keyboard navigation with proper event handling
  const handleKeyDownContainer = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          handlePrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          handleNext();
          break;
        case "Escape":
          e.preventDefault();
          handleClose();
          break;
        case "Home":
          e.preventDefault();
          setCurrentIndex(0);
          break;
        case "End":
          e.preventDefault();
          setCurrentIndex(validImages.length - 1);
          break;
      }
    },
    [handlePrevious, handleNext, handleClose, validImages.length]
  );

  // Handle image loading errors
  const handleImageError = useCallback((index: number) => {
    setImgErrors((prev) => ({ ...prev, [index]: true }));
  }, []);

  // Handle image load completion
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Always keep a small buffer of preloaded neighbors as the user navigates
  useEffect(() => {
    if (!isOpen || imageUrls.length === 0) return;
    const toPreload: string[] = [];
    for (let offset = -2; offset <= 2; offset++) {
      const idx = currentIndex + offset;
      if (idx >= 0 && idx < imageUrls.length) toPreload.push(imageUrls[idx]!);
    }
    void preloadImages(toPreload);
  }, [currentIndex, imageUrls, isOpen]);

  // Early return if no valid images
  if (validImages.length === 0) {
    return (
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
      >
        <DialogContent
          className={cn(
            "fixed inset-0 top-0 left-0 m-0 flex h-screen max-h-none w-screen max-w-none translate-x-0 translate-y-0 flex-col !rounded-none border-none bg-black p-0",
            "transition-all duration-300 ease-out",
            isAnimating
              ? "scale-95 opacity-0 backdrop-blur-none"
              : "scale-100 opacity-100 backdrop-blur-sm"
          )}
          role="dialog"
          aria-modal="true"
          hideCloseButton
        >
          <h2 className="sr-only">Image gallery - No images available</h2>
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 px-4 md:px-6">
            <div className="text-center text-white">
              <h2 className="mb-2 text-xl font-semibold">
                No Images Available
              </h2>
              <p className="text-gray-300">
                This property doesn&apos;t have any images to display.
              </p>
            </div>
            <Button variant="outline" className="mt-4" onClick={handleClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const currentImage = validImages[currentIndex];
  const hasError = (imgErrors[currentIndex] ?? false) || !currentImage;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        className={cn(
          "fixed inset-0 top-0 left-0 m-0 flex h-screen max-h-none w-screen max-w-none translate-x-0 translate-y-0 flex-col !rounded-none border-none bg-black p-0",
          "transition-all duration-300 ease-out",
          isAnimating
            ? "scale-95 opacity-0 backdrop-blur-none"
            : "scale-100 opacity-100 backdrop-blur-sm"
        )}
        role="dialog"
        aria-modal="true"
        hideCloseButton
      >
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 px-4 pb-6 pt-10 md:gap-6 md:px-6">
          {/* Close button */}
          <Button
            variant="outline"
            size="icon"
            className="focus-visible:ring-primary absolute right-4 top-4 z-50 h-10 w-10 rounded-full bg-white/90 text-gray-700 shadow-lg backdrop-blur-sm hover:bg-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            onClick={handleClose}
            aria-label="Close image gallery"
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Previous button - visible on all devices but smaller on mobile */}
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "focus-visible:ring-primary absolute top-1/2 left-3 z-50 h-8 w-8 -translate-y-1/2 cursor-pointer rounded-full bg-white/90 text-gray-700 shadow-lg backdrop-blur-sm hover:scale-105 hover:bg-white hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 md:left-6 md:h-11 md:w-11",
              "transition-all duration-300 ease-out",
              isAnimating
                ? "translate-x-2 opacity-0"
                : "translate-x-0 opacity-100"
            )}
            onClick={handlePrevious}
            aria-label="Previous image"
            disabled={validImages.length <= 1}
          >
            <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
          </Button>

          {/* Main Image with touch events for mobile swipe */}
          <div
            ref={mainImageRef}
            className={cn(
              "relative flex touch-pan-y items-center justify-center overflow-hidden rounded-lg bg-gray-900",
              "transition-all duration-300 ease-out",
              isAnimating
                ? "scale-95 opacity-0"
                : "scale-100 opacity-100"
            )}
            style={{ width: "min(800px, 100%)", aspectRatio: "800 / 530" }}
            tabIndex={0}
            role="img"
            aria-roledescription="carousel"
            aria-label={`Property image ${currentIndex + 1} of ${validImages.length}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {hasError ? (
              <div className="flex h-full w-full items-center justify-center">
                <ImagePlaceholder className="rounded-xl" />
              </div>
            ) : (
              <>
                {/* Loading skeleton overlay */}
                {isLoading && (
                  <div className="absolute inset-0 z-10">
                    <Skeleton className="h-full w-full rounded-lg" />
                  </div>
                )}

                <Image
                  src={getImageUrlWithFallback(currentImage)}
                  alt={`Property image ${currentIndex + 1}`}
                  fill
                  className={cn(
                    "object-contain transition-opacity duration-300",
                    isLoading ? "opacity-0" : "opacity-100"
                  )}
                  onLoadingComplete={handleImageLoad}
                  onError={() => handleImageError(currentIndex)}
                  draggable={false}
                  sizes="(max-width: 820px) 100vw, 800px"
                />
              </>
            )}
          </div>

          {/* Next button - hidden on mobile */}
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "focus-visible:ring-primary absolute top-1/2 right-6 z-50 hidden h-11 w-11 -translate-y-1/2 cursor-pointer rounded-full bg-white/90 text-gray-700 shadow-lg backdrop-blur-sm hover:scale-105 hover:bg-white hover:shadow-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 md:flex",
              "transition-all duration-300 ease-out",
              isAnimating
                ? "-translate-x-2 opacity-0"
                : "translate-x-0 opacity-100"
            )}
            onClick={handleNext}
            aria-label="Next image"
            disabled={validImages.length <= 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Thumbnail strip */}
          {validImages.length > 1 && (
            <div
              ref={thumbnailStripRef}
              className={cn(
                "flex items-center justify-start gap-2 overflow-x-auto border-t border-gray-600/40 bg-black/80 px-0 py-3",
                "transition-all duration-300 ease-out",
                isAnimating
                  ? "translate-y-4 opacity-0"
                  : "translate-y-0 opacity-100"
              )}
              style={{
                minHeight: THUMBNAIL_STRIP_HEIGHT,
                width: "min(800px, 100%)",
              }}
              role="tablist"
              aria-label="Image thumbnails"
            >
              <div
                aria-hidden
                style={{
                  flex: "0 0 auto",
                  width: Math.ceil(thumbnailSpacerWidth),
                }}
              />
              {validImages.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  data-thumb-index={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={cn(
                    "relative flex-shrink-0 origin-center overflow-hidden rounded-md transition-all outline-none",
                    idx === currentIndex
                      ? "ring-brand-blue z-10 ring-2 ring-offset-2 ring-offset-black"
                      : "focus-visible:ring-brand-blue opacity-70 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                  )}
                  style={{ width: THUMBNAIL_WIDTH, height: THUMBNAIL_HEIGHT }}
                  aria-label={`Show image ${idx + 1}`}
                  aria-selected={idx === currentIndex}
                  aria-current={idx === currentIndex}
                  role="tab"
                >
                  {imgErrors[idx] ? (
                    <ImagePlaceholder />
                  ) : (
                    <Image
                      src={getImageUrlWithFallback(img)}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes={`${THUMBNAIL_WIDTH}px`}
                      onError={() => handleImageError(idx)}
                      draggable={false}
                    />
                  )}
                  {/* Active state is styled like focus ring; no extra overlay needed */}
                </button>
              ))}
              <div
                aria-hidden
                style={{
                  flex: "0 0 auto",
                  width: Math.ceil(thumbnailSpacerWidth),
                }}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
