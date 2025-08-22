"use client";

import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { FeaturedProject } from "@/types";
import FeaturedPropertyCard from "./featured-property-variant";
import { Card } from "./ui/card";

export default function FeaturedProjectsCarousel({
  properties,
  delay,
}: {
  properties: FeaturedProject[];
  delay: number;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [shouldAutoplay, setShouldAutoplay] = useState(true);
  const plugin = useRef(
    Autoplay({ delay, stopOnInteraction: false, stopOnMouseEnter: true }),
  );

  // Respect reduced-motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setShouldAutoplay(!media.matches);
    update();
    try {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    } catch {
      media.addListener(update);
      return () => media.removeListener(update);
    }
  }, []);

  // Handle slide changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const index = api.selectedScrollSnap();
      setCurrentSlide(index);
      const slide = properties[index];
      if (slide) {
        const announcement = `Slide ${index + 1} of ${properties.length}: Featured Project`;
        const liveRegion = document.getElementById("carousel-announcement");
        if (liveRegion) {
          liveRegion.textContent = announcement;
        }
      }
    };

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, properties]);

  return (
    <Card className="mb-4 rounded-none border-0 bg-transparent md:border md:rounded-lg md:bg-gray-50 overflow-hidden">
      {/* Live region for screen reader announcements */}
      <div id="carousel-announcement" className="sr-only" aria-live="polite" />

      <Carousel
        plugins={shouldAutoplay ? [plugin.current] : undefined}
        setApi={setApi}
        opts={{ align: "start", loop: true }}
        className="w-full max-w-full md:px-4 md:pb-6 md:pt-14 relative"
        aria-label="Featured Projects Carousel"
      >
        <CarouselContent
          className="-ml-4 lg:pt-4"
          role="list"
          aria-label="Featured Projects List"
        >
          {properties.map((item, index) => (
            <CarouselItem
              key={item.projectid}
              className="basis-[88%] md:basis-[44%] pl-4"
              role="listitem"
              aria-label={`Featured Project ${index + 1} of ${properties.length}`}
            >
              <FeaturedPropertyCard item={item} priority={index === 0} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div
          className="absolute right-16 top-8 hidden md:flex gap-4 w-8"
          role="navigation"
          aria-label="Carousel Navigation Controls"
        >
          <CarouselPrevious
            className="h-10 w-10 rounded-full shadow-none hover:shadow-sm cursor-pointer border-gray-200 transition-all duration-200 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:outline-none"
            aria-label={`Previous slide, currently viewing slide ${currentSlide + 1} of ${properties.length}`}
            tabIndex={0}
          />
          <CarouselNext
            className="h-10 w-10 rounded-full shadow-none hover:shadow-sm cursor-pointer border-gray-200 transition-all duration-200 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:outline-none"
            aria-label={`Next slide, currently viewing slide ${currentSlide + 1} of ${properties.length}`}
            tabIndex={0}
          />
        </div>
      </Carousel>
    </Card>
  );
}
