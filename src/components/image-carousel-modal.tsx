"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

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
  const thumbnailStripRef = useRef<HTMLDivElement>(null);

  // Reset states when modal opens with a new initial index
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsLoading(true);
      setImgErrors({});
    }
  }, [isOpen, initialIndex]);

  // Scroll the active thumbnail into view
  useEffect(() => {
    if (thumbnailStripRef.current) {
      const activeThumb = thumbnailStripRef.current.querySelector(
        `[data-thumb-index='${currentIndex}']`,
      );
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [currentIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsLoading(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsLoading(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevious();
    } else if (e.key === "ArrowRight") {
      handleNext();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const getImageUrlWithFallback = (imagePath: string | undefined) => {
    if (!imagePath) return "";
    return getImageUrl(imagePath, src);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-[98vw] max-h-[98vh] p-0 bg-black/95 border-none flex flex-col"
        onKeyDown={handleKeyDown}
      >
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          {/* Photo count at top left */}
          <div className="absolute top-4 left-4 z-50 text-white text-lg font-medium bg-black/60 rounded px-3 py-1">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/10"
            onClick={onClose}
            aria-label="Close image gallery"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Previous button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/10"
            onClick={handlePrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          {/* Main Image */}
          <div className="relative w-full flex-1 flex items-center justify-center pb-4">
            {imgErrors[currentIndex] || !images[currentIndex] ? (
              <div className="w-full h-full flex items-center justify-center">
                <ImagePlaceholder className="rounded-xl" />
              </div>
            ) : (
              <Image
                src={getImageUrlWithFallback(images[currentIndex])}
                alt={`Property image ${currentIndex + 1}`}
                fill
                className={cn(
                  "object-contain transition-opacity duration-300 rounded-xl bg-black",
                  isLoading ? "opacity-0" : "opacity-100",
                )}
                priority
                placeholder="blur"
                blurDataURL={PLACEHOLDER_BLUR}
                onLoadingComplete={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setImgErrors((prev) => ({ ...prev, [currentIndex]: true }));
                }}
              />
            )}
          </div>

          {/* Next button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/10"
            onClick={handleNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Thumbnail strip */}
          <div
            ref={thumbnailStripRef}
            className="w-full overflow-x-auto bg-black/80 py-3 px-2 flex gap-2 items-center justify-center border-t border-black/40"
            style={{ minHeight: 90 }}
          >
            {images.map((img, idx) =>
              img ? (
                <button
                  key={img + idx}
                  data-thumb-index={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "relative flex-shrink-0 rounded-md overflow-hidden border-2 transition-all",
                    idx === currentIndex
                      ? "border-brand-blue shadow-lg scale-110 z-10"
                      : "border-transparent opacity-70 hover:opacity-100",
                  )}
                  style={{ width: 80, height: 60 }}
                  aria-label={`Show image ${idx + 1}`}
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
                      sizes="80px"
                      onError={() =>
                        setImgErrors((prev) => ({ ...prev, [idx]: true }))
                      }
                    />
                  )}
                  {/* Highlight overlay for active thumbnail */}
                  {idx === currentIndex && (
                    <span className="absolute inset-0 border-2 border-brand-blue rounded-md pointer-events-none"></span>
                  )}
                </button>
              ) : null,
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
