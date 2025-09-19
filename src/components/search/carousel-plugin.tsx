"use client";

import Autoplay from "embla-carousel-autoplay";
import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselPlugin({ children }: { children: React.ReactNode }) {
  // Convert children to array if it's not already
  const childrenArray = React.Children.toArray(children);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [api, setApi] = React.useState<any>();

  const autoplayRef = React.useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  React.useEffect(() => {
    if (!api) return;

    const updateSlide = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    api.on("select", updateSlide);
    return () => api.off("select", updateSlide) as void;
  }, [api]);

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: "start",
        loop: childrenArray.length > 1,
        slidesToScroll: 1,
        containScroll: "trimSnaps",
        breakpoints: {
          "(min-width: 768px)": {
            slidesToScroll: 1, // Always scroll one at a time on desktop for smooth experience
          },
        },
      }}
      plugins={childrenArray.length > 1 ? [autoplayRef.current] : []}
      className="mb-6 w-full sm:mb-8"
      onMouseEnter={() => autoplayRef.current?.stop()}
      onMouseLeave={() => autoplayRef.current?.reset()}
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-brand-accent mb-1 text-xl font-bold">
            Featured Properties
          </h2>
          <p className="text-brand-muted text-sm">
            Premium listings available.
          </p>
        </div>

        {/* Desktop: Show current/total, Mobile: Show indicators */}
        {childrenArray.length > 1 && (
          <>
            {/* Desktop counter */}
            <div className="text-brand-muted hidden items-center gap-2 text-sm md:flex">
              <span>
                {currentSlide + 1} of {childrenArray.length}
              </span>
              <div className="h-1 w-16 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="bg-brand-primary h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentSlide + 1) / childrenArray.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Mobile indicators */}
            <div className="flex items-center gap-1 md:hidden">
              {childrenArray
                .slice(0, Math.min(5, childrenArray.length))
                .map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                      index === currentSlide
                        ? "bg-brand-primary"
                        : "bg-gray-300"
                    }`}
                    aria-hidden="true"
                  />
                ))}
            </div>
          </>
        )}
      </div>

      <CarouselContent className="-ml-2 md:-ml-4">
        {childrenArray.map((child, index) => (
          <CarouselItem
            key={index}
            className="basis-full pl-2 md:basis-[calc(100%-120px)] md:pl-4 lg:basis-[calc(100%-150px)] xl:basis-[calc(100%-200px)]"
          >
            <div className="h-full">{child}</div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {childrenArray.length > 1 && (
        <>
          <CarouselPrevious className="border-brand-border left-2 hidden h-10 w-10 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 md:left-4 md:flex md:h-12 md:w-12" />
          <CarouselNext className="border-brand-border right-2 hidden h-10 w-10 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 md:right-4 md:flex md:h-12 md:w-12" />
        </>
      )}

      {/* Progress indicator for mobile */}
      {childrenArray.length > 1 && (
        <div className="mt-4 flex justify-center md:hidden">
          <div className="flex items-center gap-2">
            <span className="text-brand-muted text-xs">
              {currentSlide + 1} of {childrenArray.length} • Swipe to explore
            </span>
            <div className="h-1 w-12 overflow-hidden rounded-full bg-gray-200">
              <div
                className="bg-brand-primary h-full rounded-full transition-all duration-300"
                style={{
                  width: `${((currentSlide + 1) / childrenArray.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </Carousel>
  );
}
