"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import type { Listing } from "./property-card";
import PropertyCard from "./property-card";
import UnitCard from "./unit-card";
import type { ListingDetails } from "@/types";
import type { SimilarUnit } from "@/lib/get-unit-details";

export default function PropertyListings({
  listings,
  parentContract,
}: {
  listings: Listing[] | SimilarUnit[] | ListingDetails[];
  parentContract?: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
      setCurrentSlide(api.selectedScrollSnap());
    };

    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // console.log('Testing Property Listings',listings);

  const transformedListings = listings.map((listing) => {
    if ("unitid" in listing) return listing;
    if ("baths" in listing) {
      return {
        ...listing,
        bathroomcount: listing.baths,
        bedroomcount: listing.beds,
      };
    }
    return listing;
  });

  if (!listings || listings.length === 0) {
    return (
      <div role="status" className="text-center py-8 text-brand-muted">
        No properties available at the moment.
      </div>
    );
  }

  return (
    <div className="relative">
      <Carousel
        className="w-full max-w-full"
        opts={{
          loop: true,
          align: "start",
        }}
        setApi={setApi}
        aria-label="Property listings carousel"
      >
        <CarouselContent
          className="-ml-1"
          role="list"
          aria-label="Property listings"
        >
          {transformedListings.map((listing, i) => (
            <CarouselItem
              key={i}
              className="basis-[220px] md:basis-[256px]"
              role="listitem"
              aria-label={`Property ${i + 1} of ${listings.length}`}
            >
              {"unitid" in listing ? (
                <UnitCard unit={listing} />
              ) : (
                <PropertyCard
                  listing={listing}
                  parentContract={parentContract}
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        {canScrollPrev && (
          <CarouselPrevious
            className="left-6 hidden h-11 w-11 items-center justify-center bg-white text-accent-foreground shadow-md md:flex"
            aria-label="Previous property"
            tabIndex={0}
          />
        )}
        {canScrollNext && (
          <CarouselNext
            className="right-6 hidden h-11 w-11 items-center justify-center bg-white text-accent-foreground shadow-md md:flex"
            aria-label="Next property"
            tabIndex={0}
          />
        )}
      </Carousel>
    </div>
  );
}
