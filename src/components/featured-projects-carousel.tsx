"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useRef, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { FeaturedProject } from "@/types";
import FeaturedPropertyCard from "./featured-property-variant";

/**
 * A carousel component that displays featured projects.
 *
 * @param properties - An array of featured projects
 * @param delay - The delay time in milliseconds between each slide
 *
 * @returns A JSX element
 */
export default function FeaturedProjectsCarousel({
  properties,
  delay,
}: {
  properties: FeaturedProject[];
  delay: number;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
  });
  const plugin = useRef(
    Autoplay({ delay, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

  // Handle loading state
  useEffect(() => {
    if (properties.length > 0) {
      setIsLoading(false);
    }
  }, [properties]);

  // Handle error state
  useEffect(() => {
    if (!Array.isArray(properties)) {
      setError("Invalid properties data provided");
    }
  }, [properties]);

  // Handle slide changes
  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", () => {
        const index = emblaApi.selectedScrollSnap();
        setCurrentSlide(index);
        const slide = properties[index];
        if (slide) {
          const announcement = `Slide ${index + 1} of ${properties.length}: Featured Project`;
          const liveRegion = document.getElementById("carousel-announcement");
          if (liveRegion) {
            liveRegion.textContent = announcement;
          }
        }
      });
    }
  }, [emblaApi, properties]);

  if (error) {
    return (
      <div role="alert" className="text-brand-primary p-4">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div role="status" className="p-4">
        Loading featured projects...
      </div>
    );
  }

  if (properties.length === 0) {
    return <p role="status">No featured projects available.</p>;
  }

  return (
    <div className="mb-4 overflow-hidden">
      {/* Live region for screen reader announcements */}
      <div id="carousel-announcement" className="sr-only" aria-live="polite" />

      <Carousel
        plugins={[plugin.current]}
        ref={emblaRef}
        className="w-full max-w-full rounded-lg md:border md:px-4 md:pb-6 md:pt-14 relative"
        aria-label="Featured Projects Carousel"
        role="region"
      >
        <CarouselContent
          className="-ml-1 p-1 lg:pt-4"
          role="list"
          aria-label="Featured Projects List"
        >
          {properties.map((item, index) => (
            <CarouselItem
              key={item.projectid}
              className="basis-[350px] md:basis-[500px]  pl-4"
              role="listitem"
              aria-label={`Featured Project ${index + 1} of ${properties.length}`}
            >
              <FeaturedPropertyCard item={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div
          className="absolute right-16 top-8 hidden md:flex gap-4 w-8"
          role="navigation"
          aria-label="Carousel Navigation Controls"
        >
          <CarouselPrevious
            className="h-11 w-11 text-accent-foreground hover:bg-accent focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            aria-label={`Previous slide, currently viewing slide ${currentSlide + 1} of ${properties.length}`}
            tabIndex={0}
          />
          <CarouselNext
            className="h-11 w-11 text-accent-foreground hover:bg-accent focus:ring-2 focus:ring-offset-2 focus:ring-accent"
            aria-label={`Next slide, currently viewing slide ${currentSlide + 1} of ${properties.length}`}
            tabIndex={0}
          />
        </div>
      </Carousel>
    </div>
  );
}
