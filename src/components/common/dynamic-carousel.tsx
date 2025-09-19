"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
import { ImageCarouselModal } from "@/components/image-carousel-modal";
import { AddFavoriteButton } from "@/components/add-favorite-button";
import { ImageWithFallback } from "@/components/common/image-with-fallback";

interface CarouselProps {
  isDeveloper?: boolean;
  images?: string[];
  cloudfrontDomain?: string;
  unitId?: number;
  listingId?: number;
}

const getImageUrl = (imagePath: string, cloudfrontDomain: string) => {
  if (!imagePath) return "/placeholder-image.png";

  // If the path is already an absolute URL or a data URI, return as-is
  const isAbsoluteUrl =
    /^https?:\/\//i.test(imagePath) || imagePath.startsWith("data:");
  if (isAbsoluteUrl) return imagePath;

  // Normalize leading slashes
  const cleanPath = imagePath.replace(/^\/+/, "");

  // If the path contains a nested path, prefix with CloudFront domain
  if (cleanPath.includes("/")) {
    return `${cloudfrontDomain}/${cleanPath}`;
  }

  // Handle image ID case
  return `${cloudfrontDomain}/uploads/imgs/${cleanPath}`;
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

  useEffect(() => {
    // Reset loading state when image changes
    setIsLoading(true);

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
          <CardContent className="relative flex h-full w-full items-center justify-center p-0">
            {isLoading && (
              <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-gray-100">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-400 border-t-transparent" />
              </div>
            )}
            <button
              onClick={onImageClick}
              className="h-full w-full cursor-pointer"
              aria-label={`View image ${index + 1} in full screen`}
            >
              <ImageWithFallback
                alt={`Property image ${index + 1}`}
                src={image}
                width={1800}
                height={420}
                className={cn(
                  "h-full w-full cursor-pointer object-cover transition-opacity duration-300",
                  isLoading ? "opacity-0" : "opacity-100"
                )}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                priority={index === 0}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading={index === 0 ? "eager" : "lazy"}
                quality={index === 0 ? 85 : 75}
              />
            </button>
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
  listingId,
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
        case "Home":
          event.preventDefault();
          api.scrollTo(0);
          break;
        case "End":
          event.preventDefault();
          api.scrollTo(count - 1);
          break;
      }
    },
    [api, count]
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
    "relative h-[280px] w-full overflow-hidden lg:max-h-[400px] lg:min-h-[400px]"
  );

  const carouselClass = cn(
    isDeveloper ? "w-full max-w-full" : "w-full max-w-xl",
    "lg:max-h-[400px] lg:min-h-[400px]"
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
          <CarouselContent className="!ml-0">{slides}</CarouselContent>
          <CarouselPrevious
            aria-label="Previous slide"
            className={cn(
              "text-accent-foreground focus-visible:ring-primary absolute top-1/2 left-6 z-10 h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center bg-white shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
              "hidden md:flex"
            )}
          />
          <CarouselNext
            aria-label="Next slide"
            className={cn(
              "text-accent-foreground focus-visible:ring-primary absolute top-1/2 right-6 z-10 hidden h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:flex"
            )}
          />
        </Carousel>
        <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
          <Badge variant="dark">
            Slide {current} of {count}
          </Badge>
        </div>
        {/* Mobile favorite button overlay */}
        {(unitId || listingId) && (
          <div className="absolute top-4 right-4 z-20 block md:hidden">
            <AddFavoriteButton
              listingId={unitId || listingId || 0}
              showLabel={false}
              size="md"
              hideLabelOnMobile={true}
            />
          </div>
        )}
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
