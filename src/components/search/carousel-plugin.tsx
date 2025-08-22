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

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: false,
          stopOnMouseEnter: true,
        }),
      ]}
      className="w-full mb-8"
    >
      <CarouselContent>
        {childrenArray.map((child, index) => (
          <CarouselItem key={index}>
            <div className="p-1">{child}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {childrenArray.length > 1 && (
        <>
          <CarouselPrevious className="left-5 hidden h-12 w-12 bg-white md:flex" />
          <CarouselNext className="right-5 hidden h-12 w-12 justify-center bg-white md:flex" />
        </>
      )}
    </Carousel>
  );
}
