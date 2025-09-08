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
      className="w-full mb-6 sm:mb-8"
      onMouseEnter={() => autoplayRef.current?.stop()}
      onMouseLeave={() => autoplayRef.current?.reset()}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-brand-accent mb-1">
            Featured Properties
          </h2>
          <p className="text-sm text-brand-muted">
            Premium listings available.
          </p>
        </div>

        {/* Desktop: Show current/total, Mobile: Show indicators */}
        {childrenArray.length > 1 && (
          <>
            {/* Desktop counter */}
            <div className="hidden md:flex items-center gap-2 text-sm text-brand-muted">
              <span>
                {currentSlide + 1} of {childrenArray.length}
              </span>
              <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-primary rounded-full transition-all duration-300"
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
            className="pl-2 md:pl-4 basis-full md:basis-[calc(100%-120px)] lg:basis-[calc(100%-150px)] xl:basis-[calc(100%-200px)]"
          >
            <div className="h-full">{child}</div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {childrenArray.length > 1 && (
        <>
          <CarouselPrevious className="left-2 md:left-4 h-10 w-10 md:h-12 md:w-12 bg-white/90 backdrop-blur-sm shadow-lg border-brand-border hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hidden md:flex" />
          <CarouselNext className="right-2 md:right-4 h-10 w-10 md:h-12 md:w-12 bg-white/90 backdrop-blur-sm shadow-lg border-brand-border hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hidden md:flex" />
        </>
      )}

      {/* Progress indicator for mobile */}
      {childrenArray.length > 1 && (
        <div className="flex justify-center mt-4 md:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-muted">
              {currentSlide + 1} of {childrenArray.length} • Swipe to explore
            </span>
            <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-primary rounded-full transition-all duration-300"
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
