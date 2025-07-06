"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ImageCarouselModal } from "@/components/image-carousel-modal";
import { AddFavoriteButton } from "@/components/add-favorite-button";

interface CarouselProps {
  isDeveloper?: boolean;
  images?: string[];
  cloudfrontDomain?: string;
  unitId?: number;
}

const getImageUrl = (imagePath: string, cloudfrontDomain: string) => {
  if (!imagePath) return "/placeholder-image.png";

  // Check if the path is already a full URL or path
  if (imagePath.includes("/")) {
    // Remove any leading slashes from the path
    const cleanPath = imagePath.replace(/^\/+/, "");
    return `${cloudfrontDomain}/${cleanPath}`;
  }

  // Handle image ID case
  return `${cloudfrontDomain}/uploads/imgs/${imagePath}`;
};

const CarouselSlide = ({
  image,
  isDeveloper,
  index,
  onImageClick,

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  unitId,
}: {
  image: string;
  isDeveloper?: boolean;
  index: number;
  onImageClick: () => void;
  unitId?: number;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset states when image changes
    setIsLoading(true);
    setHasError(false);

    // Fallback timeout in case onLoad doesn't fire
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [image]);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  return (
    <CarouselItem
      className={cn(isDeveloper ? "pl-0 lg:basis-96 lg:pl-4" : "pl-0")}
      role="group"
      aria-roledescription="slide"
      aria-label={`Slide ${index + 1}`}
    >
      <div>
        <Card className="h-[280px] w-full rounded-none border-0 py-0 shadow-none lg:max-h-[400px] lg:min-h-[400px]">
          <CardContent className="flex items-center justify-center p-0 relative w-full h-full">
            {hasError ? (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-500">
                Failed to load image
              </div>
            ) : (
              <>
                {isLoading && (
                  <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-gray-100">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-400 border-t-transparent" />
                  </div>
                )}
                <button
                  onClick={onImageClick}
                  className="w-full h-full "
                  aria-label={`View image ${index + 1} in full screen`}
                >
                  <Image
                    alt={`Property image ${index + 1}`}
                    src={image}
                    width={1800}
                    height={420}
                    className={cn(
                      "h-full w-full cursor-pointer object-cover transition-opacity duration-300",
                      isLoading ? "opacity-0" : "opacity-100",
                    )}
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority={index === 0}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </CarouselItem>
  );
};

export function DynamicCarousel({
  isDeveloper,
  images = [],
  cloudfrontDomain = "https://dve7rykno93gs.cloudfront.net",
  unitId,
}: CarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const updateCarousel = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
    };

    updateCarousel();
    api.on("select", updateCarousel);

    return () => {
      api.off("select", updateCarousel);
    };
  }, [api]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!api) return;

      switch (event.key) {
        case "ArrowLeft":
          api.scrollPrev();
          break;
        case "ArrowRight":
          api.scrollNext();
          break;
        case "Home":
          api.scrollTo(0);
          break;
        case "End":
          api.scrollTo(count - 1);
          break;
      }
    },
    [api, count],
  );

  const handleImageClick = useCallback((index: number) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  }, []);

  const slides = images.length ? (
    images.map((img, i) => (
      <CarouselSlide
        key={img ? `${img}-${i}` : `slide-${i}`}
        image={getImageUrl(img, cloudfrontDomain)}
        isDeveloper={isDeveloper}
        index={i}
        onImageClick={() => handleImageClick(i)}
        unitId={unitId}
      />
    ))
  ) : (
    <div
      role="status"
      aria-live="polite"
      className="flex h-full items-center justify-center"
    >
      No images available
    </div>
  );

  const containerClass = cn(
    isDeveloper
      ? "border-b border-orange-400 bg-slate-50"
      : "flex justify-center border-b border-orange-400 lg:bg-brand-secondary",
    "relative h-[280px] w-full overflow-hidden lg:max-h-[400px] lg:min-h-[400px]",
  );

  const carouselClass = cn(
    isDeveloper ? "w-full max-w-full" : "max-w-xl",
    "lg:max-h-[400px] lg:min-h-[400px]",
  );

  return (
    <>
      <div
        className={containerClass}
        role="region"
        aria-roledescription="carousel"
        aria-label="Property images"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="absolute top-4 right-4 z-50">
          <AddFavoriteButton listingId={unitId ?? 0} />
        </div>
        <div aria-live="polite" className="sr-only">
          Slide {current} of {count}
        </div>
        <Carousel
          className={carouselClass}
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
            dragFree: false,
          }}
        >
          <CarouselContent>{slides}</CarouselContent>
          <CarouselPrevious
            aria-label="Previous slide"
            className={cn(
              "absolute left-6 top-1/2 -translate-y-1/2 z-10 h-11 w-11 items-center justify-center bg-white text-accent-foreground shadow-md md:flex",
              isDeveloper ? "hidden md:flex" : "hidden md:flex",
            )}
          />
          <CarouselNext
            aria-label="Next slide"
            className={cn(
              "absolute right-6 top-1/2 -translate-y-1/2 z-10 h-11 w-11 items-center justify-center bg-white text-accent-foreground shadow-md hidden md:flex",
            )}
          />
        </Carousel>
        <div
          className="absolute inset-x-2 bottom-2 z-20 py-2 text-center text-sm text-white"
          aria-hidden="true"
        >
          Slide {current} of {count}
        </div>
      </div>

      <ImageCarouselModal
        images={images}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialIndex={selectedImageIndex}
        getImageUrl={(img) => getImageUrl(img, cloudfrontDomain)}
      />
    </>
  );
}
