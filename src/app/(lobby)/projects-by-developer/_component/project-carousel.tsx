"use client";

import Image from "next/image";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
// import { ThumbnailCarousel } from "@/components/carousel/thumbnail-carousel"
import { ExpandIcon } from "lucide-react";
import type { Photo } from "@/types";

// const slides = images.map((img, i) => (
//   // <div key={i} className="h-full  w-full min-w-full flex-1">

//   // </div>
// ));

export function ProjectCarousel({ photos }: { photos: Photo[] }) {
  // export function ProjectCarousel({ photos }: { photos: Photo[] }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return (
    <Carousel className="w-full max-w-full" setApi={setApi}>
      <CarouselContent>
        {/* get one photo for now */}
        {photos.slice(0, 1).map((photo, index) => (
          <Slides key={photo.projectid + index} image={photo.photo} />
        ))}
      </CarouselContent>
      <CarouselPrevious className="top-3/4 left-3/4 z-20 hidden h-12 w-12 translate-y-6 bg-white lg:flex" />
      <CarouselNext className="top-3/4 right-60 z-20 hidden h-12 w-12 translate-y-6 bg-white lg:flex" />
      <Button
        className="text-b-accent absolute top-[80.5%] right-[305px] z-20 hidden h-12 w-12 rounded-full bg-white hover:bg-white/90 lg:flex"
        size="icon"
      >
        {/* <Icons.expand className="h-4 w-4" /> */}
        <ExpandIcon className="h-4 w-4" />
      </Button>
      <div
        className="absolute inset-x-0 bottom-0 z-10 h-8 lg:hidden"
        style={{
          backgroundImage:
            "linear-gradient(180deg,rgba(0,0,0,.2),rgba(0,0,0,.1) 16.31%,transparent 37.79%),linear-gradient(1turn,rgba(0,0,0,.8),transparent 79.49%)",
        }}
      />
      <div className="text-muted-foreground absolute right-0 bottom-0 left-0 z-20 py-2 text-center text-sm text-white lg:hidden">
        Slide {current} of {count}
      </div>
    </Carousel>
  );
}

function Slides({ image }: { image: string }) {
  return (
    <CarouselItem className="h-full w-full min-w-full flex-1">
      <div className="p-0">
        <Card className="rounded-none border-0">
          <CardContent className="relative flex aspect-[16/9] items-center justify-center p-0">
            {/* <Image
            alt="test"
            src={img}
            width={1800}
            height={457}
            className="h-full w-full object-cover"
          /> */}
            <Image
              src={`https://meqasa.com/uploads/imgs/${image}`}
              // src={`https://dve7rykno93gs.cloudfront.net/uploads/imgs/${image}`}
              alt={image}
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              className="object-cover"
            />
          </CardContent>
        </Card>
      </div>
    </CarouselItem>
  );
}
