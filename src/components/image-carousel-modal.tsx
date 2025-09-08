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
        "w-full h-full flex items-center justify-center bg-gray-100",
        className
      )}
    >
      <ImageIcon className="w-8 h-8 text-gray-400" />
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

    const timeoutId = setTimeout(() => {
      const activeThumb = container.querySelector<HTMLElement>(
        `[data-thumb-index='${currentIndex}']`
      );
      if (!activeThumb) return;

      const containerRect = container.getBoundingClientRect();
      const thumbRect = activeThumb.getBoundingClientRect();

      const thumbCenterInContent =
        thumbRect.left -
        containerRect.left +
        container.scrollLeft +
        thumbRect.width / 2;

      let targetScrollLeft = thumbCenterInContent - container.clientWidth / 2;

      // Clamp within scrollable range
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (targetScrollLeft < 0) targetScrollLeft = 0;
      if (targetScrollLeft > maxScrollLeft) targetScrollLeft = maxScrollLeft;

      container.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentIndex, isOpen]);

  // Memoized navigation handlers to prevent unnecessary re-renders
  const handlePrevious = useCallback(() => {
    const nextIndex =
      currentIndex === 0 ? validImages.length - 1 : currentIndex - 1;
    setCurrentIndex(nextIndex);
    setIsLoading(!isImagePreloaded(imageUrls[nextIndex]));
  }, [currentIndex, validImages.length, imageUrls]);

  const handleNext = useCallback(() => {
    const nextIndex =
      currentIndex === validImages.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(nextIndex);
    setIsLoading(!isImagePreloaded(imageUrls[nextIndex]));
  }, [currentIndex, validImages.length, imageUrls]);

  const handleThumbnailClick = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      setIsLoading(!isImagePreloaded(imageUrls[index]));
    },
    [imageUrls]
  );

  // Touch event handlers for mobile swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.targetTouches[0]) {
      setTouchStart({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      });
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.targetTouches[0]) {
      setTouchEnd({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      });
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontalSwipe && Math.abs(distanceX) > SWIPE_THRESHOLD) {
      if (distanceX > 0) {
        // Swiped left - go to next
        handleNext();
      } else {
        // Swiped right - go to previous
        handlePrevious();
      }
    }

    // Reset touch states
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, handleNext, handlePrevious]);

  // Enhanced keyboard navigation with proper event handling
  const handleKeyDown = useCallback(
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
          onClose();
          break;
        case "Home":
          e.preventDefault();
          setCurrentIndex(0);
          setIsLoading(!isImagePreloaded(imageUrls[0]));
          break;
        case "End":
          e.preventDefault();
          setCurrentIndex(validImages.length - 1);
          setIsLoading(!isImagePreloaded(imageUrls[validImages.length - 1]));
          break;
      }
    },
    [handlePrevious, handleNext, onClose, validImages.length, imageUrls]
  );

  const getImageUrlWithFallback = useCallback(
    (imagePath: string | undefined) => {
      if (!imagePath) return "";
      return getImageUrl(imagePath);
    },
    [getImageUrl]
  );

  // Keep convenience helper for rendering paths that may be empty

  // Handle image loading completion
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Handle image loading errors
  const handleImageError = useCallback((index: number) => {
    setIsLoading(false);
    setImgErrors((prev) => ({ ...prev, [index]: true }));
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
    return null;
  }

  const currentImage = validImages[currentIndex];
  const hasError = (imgErrors[currentIndex] ?? false) || !currentImage;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className={cn(
          "fixed inset-0 w-screen h-screen max-w-none max-h-none p-0 m-0 bg-black border-none flex flex-col translate-x-0 translate-y-0 left-0 top-0 !rounded-none",
          "transition-all duration-300 ease-out",
          isAnimating ? "opacity-0" : "opacity-100"
        )}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label="Image gallery"
        hideCloseButton
      >
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-3 px-4 md:px-6">
          {/* Photo count at top left */}
          <div
            className={cn(
              "absolute top-4 left-4 z-50 text-white text-sm font-medium bg-black/60 rounded-lg px-3 py-2",
              "transition-all duration-300 ease-out",
              isAnimating
                ? "opacity-0 translate-y-2"
                : "opacity-100 translate-y-0"
            )}
          >
            {currentIndex + 1} / {validImages.length}
          </div>

          {/* Close button */}
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute right-6 top-6 z-50 h-11 w-11 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-lg cursor-pointer hover:bg-white hover:shadow-xl hover:scale-105 active:scale-95",
              "transition-all duration-300 ease-out",
              isAnimating
                ? "opacity-0 translate-y-2"
                : "opacity-100 translate-y-0"
            )}
            onClick={onClose}
            aria-label="Close image gallery"
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Previous button - hidden on mobile */}
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "absolute left-6 top-1/2 -translate-y-1/2 z-50 h-11 w-11 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-lg cursor-pointer hidden md:flex hover:bg-white hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              "transition-all duration-300 ease-out",
              isAnimating
                ? "opacity-0 translate-x-2"
                : "opacity-100 translate-x-0"
            )}
            onClick={handlePrevious}
            aria-label="Previous image"
            disabled={validImages.length <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Main Image with touch events for mobile swipe */}
          <div
            ref={mainImageRef}
            className={cn(
              "relative flex items-center justify-center touch-pan-y overflow-hidden rounded-lg bg-gray-900",
              "transition-all duration-300 ease-out",
              isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
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
              <div className="w-full h-full flex items-center justify-center">
                <ImagePlaceholder className="rounded-xl" />
              </div>
            ) : (
              <>
                {/* Loading skeleton overlay */}
                {isLoading && (
                  <div className="absolute inset-0 z-10">
                    <Skeleton className="w-full h-full rounded-lg" />
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
              "absolute right-6 top-1/2 -translate-y-1/2 z-50 h-11 w-11 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 shadow-lg cursor-pointer hidden md:flex hover:bg-white hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              "transition-all duration-300 ease-out",
              isAnimating
                ? "opacity-0 -translate-x-2"
                : "opacity-100 translate-x-0"
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
                "overflow-x-auto bg-black/80 py-3 px-0 flex gap-2 items-center justify-start border-t border-gray-600/40",
                "transition-all duration-300 ease-out",
                isAnimating
                  ? "opacity-0 translate-y-4"
                  : "opacity-100 translate-y-0"
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
                    "relative flex-shrink-0 rounded-md overflow-hidden transition-all origin-center outline-none",
                    idx === currentIndex
                      ? "ring-2 ring-brand-blue ring-offset-2 ring-offset-black z-10"
                      : "opacity-70 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
