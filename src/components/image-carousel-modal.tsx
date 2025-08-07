"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

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
        className,
      )}
    >
      <ImageIcon className="w-8 h-8 text-gray-400" />
    </div>
  );
}

// Light gray base64 placeholder (1x1 pixel)
const PLACEHOLDER_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQtJSEkMjU1LS0yMi4qLjgyPj4+Oj4+Oj4+Oj4+Oj4+Oj4+Oj4+Oj7/2wBDAR4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

interface ImageCarouselModalProps {
  images: (string | undefined)[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
  getImageUrl: (imagePath: string, src?: boolean) => string;
  src?: boolean;
}

export function ImageCarouselModal({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
  getImageUrl,
  src = false,
}: ImageCarouselModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);

  // Memoize filtered images to prevent unnecessary re-renders
  const validImages = useMemo(
    () => images.filter((img): img is string => Boolean(img)),
    [images],
  );

  // Reset states when modal opens with a new initial index or images change
  useEffect(() => {
    if (isOpen) {
      const safeInitialIndex = Math.min(initialIndex, validImages.length - 1);
      setCurrentIndex(safeInitialIndex);
      setIsLoading(true);
      setImgErrors({}); // Clear error states when switching image sets
      setIsAnimating(true);

      // Reset animation state after animation completes
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialIndex, validImages.length]);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && mainImageRef.current) {
      // Focus the main image container for keyboard navigation
      mainImageRef.current.focus();
    }
  }, [isOpen]);

  // Debounced thumbnail scrolling to prevent excessive DOM operations
  useEffect(() => {
    if (!thumbnailStripRef.current) return;

    const timeoutId = setTimeout(() => {
      const activeThumb = thumbnailStripRef.current?.querySelector(
        `[data-thumb-index='${currentIndex}']`,
      );
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }, 100); // Small delay to prevent rapid scrolling

    return () => clearTimeout(timeoutId);
  }, [currentIndex]);

  // Memoized navigation handlers to prevent unnecessary re-renders
  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
    setIsLoading(true);
  }, [validImages.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
    setIsLoading(true);
  }, [validImages.length]);

  const handleThumbnailClick = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsLoading(true);
  }, []);

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
          setIsLoading(true);
          break;
        case "End":
          e.preventDefault();
          setCurrentIndex(validImages.length - 1);
          setIsLoading(true);
          break;
      }
    },
    [handlePrevious, handleNext, onClose, validImages.length],
  );

  const getImageUrlWithFallback = useCallback(
    (imagePath: string | undefined) => {
      if (!imagePath) return "";
      return getImageUrl(imagePath, src);
    },
    [getImageUrl, src],
  );

  // Handle image loading completion
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Handle image loading errors
  const handleImageError = useCallback((index: number) => {
    setIsLoading(false);
    setImgErrors((prev) => ({ ...prev, [index]: true }));
  }, []);

  // Early return if no valid images
  if (validImages.length === 0) {
    return null;
  }

  const currentImage = validImages[currentIndex];
  const hasError = (imgErrors[currentIndex] ?? false) || !currentImage;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "fixed inset-0 w-screen h-screen max-w-none max-h-none p-0 m-0 bg-black border-none flex flex-col rounded-none translate-x-0 translate-y-0 left-0 top-0",
          "transition-all duration-300 ease-out",
          isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100",
        )}
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
        aria-label="Image gallery"
      >
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {/* Photo count at top left */}
          <div
            className={cn(
              "absolute top-4 left-4 z-50 text-white text-lg font-medium bg-black/60 rounded px-3 py-1",
              "transition-all duration-300 ease-out",
              isAnimating
                ? "opacity-0 translate-y-2"
                : "opacity-100 translate-y-0",
            )}
          >
            {currentIndex + 1} / {validImages.length}
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute top-4 right-4 z-50 text-white hover:bg-white/10",
              "transition-all duration-300 ease-out",
              isAnimating
                ? "opacity-0 translate-y-2"
                : "opacity-100 translate-y-0",
            )}
            onClick={onClose}
            aria-label="Close image gallery"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Previous button - hidden on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/10 hidden md:flex",
              "transition-all duration-300 ease-out",
              isAnimating
                ? "opacity-0 translate-x-2"
                : "opacity-100 translate-x-0",
            )}
            onClick={handlePrevious}
            aria-label="Previous image"
            disabled={validImages.length <= 1}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          {/* Main Image with touch events for mobile swipe */}
          <div
            ref={mainImageRef}
            className={cn(
              "relative w-full flex-1 flex items-center justify-center pb-4 touch-pan-y",
              "transition-all duration-300 ease-out",
              isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100",
            )}
            tabIndex={0}
            role="img"
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
              <Image
                src={getImageUrlWithFallback(currentImage)}
                alt={`Property image ${currentIndex + 1}`}
                fill
                className={cn(
                  "object-contain transition-opacity duration-300 rounded-xl bg-black",
                  isLoading ? "opacity-0" : "opacity-100",
                )}
                priority
                placeholder="blur"
                blurDataURL={PLACEHOLDER_BLUR}
                onLoadingComplete={handleImageLoad}
                onError={() => handleImageError(currentIndex)}
                draggable={false}
              />
            )}
          </div>

          {/* Next button - hidden on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/10 hidden md:flex",
              "transition-all duration-300 ease-out",
              isAnimating
                ? "opacity-0 -translate-x-2"
                : "opacity-100 translate-x-0",
            )}
            onClick={handleNext}
            aria-label="Next image"
            disabled={validImages.length <= 1}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Thumbnail strip */}
          {validImages.length > 1 && (
            <div
              ref={thumbnailStripRef}
              className={cn(
                "w-full overflow-x-auto bg-black/80 py-3 px-2 flex gap-2 items-center justify-center border-t border-black/40",
                "transition-all duration-300 ease-out",
                isAnimating
                  ? "opacity-0 translate-y-4"
                  : "opacity-100 translate-y-0",
              )}
              style={{ minHeight: THUMBNAIL_STRIP_HEIGHT }}
              role="tablist"
              aria-label="Image thumbnails"
            >
              {validImages.map((img, idx) => (
                <button
                  key={`${img}-${idx}`}
                  data-thumb-index={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={cn(
                    "relative flex-shrink-0 rounded-md overflow-hidden border-2 transition-all",
                    idx === currentIndex
                      ? "border-brand-blue shadow-lg scale-110 z-10"
                      : "border-transparent opacity-70 hover:opacity-100",
                  )}
                  style={{ width: THUMBNAIL_WIDTH, height: THUMBNAIL_HEIGHT }}
                  aria-label={`Show image ${idx + 1}`}
                  aria-selected={idx === currentIndex}
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
                      placeholder="blur"
                      blurDataURL={PLACEHOLDER_BLUR}
                      sizes={`${THUMBNAIL_WIDTH}px`}
                      onError={() => handleImageError(idx)}
                      draggable={false}
                    />
                  )}
                  {/* Highlight overlay for active thumbnail */}
                  {idx === currentIndex && (
                    <span className="absolute inset-0 border-2 border-brand-blue rounded-md pointer-events-none"></span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
