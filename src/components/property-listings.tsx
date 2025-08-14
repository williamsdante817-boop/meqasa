"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useMemo } from "react";
import type { Listing } from "./property-card";
import PropertyCard from "./property-card";
import UnitCard from "./unit-card";
import type { ListingDetails } from "@/types";
import type { SimilarUnit } from "@/lib/get-unit-details";
import { AlertCard } from "@/components/alert-card";

export default function PropertyListings({
  listings,
  parentContract,
}: {
  listings: Listing[] | SimilarUnit[] | ListingDetails[];
  parentContract?: string;
}) {
  // console.log('Testing Property Listings',listings);

  const transformedListings = useMemo<Array<Listing | SimilarUnit>>(() => {
    if (!listings || listings.length === 0)
      return [] as Array<Listing | SimilarUnit>;
    return listings.map((listing) => {
      if ("unitid" in listing) return listing;
      if ("baths" in listing) {
        // Cast to align with PropertyCard's expected Listing shape
        return {
          ...listing,
          bathroomcount: listing.baths,
          bedroomcount: listing.beds,
        } as Listing;
      }
      return listing;
    });
  }, [listings]);

  if (!listings || listings.length === 0) {
    return (
      <AlertCard
        title="No properties available at the moment"
        description="Try adjusting your filters or check back later."
        ariaLabel="No properties available"
      />
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
        aria-label="Property listings carousel"
      >
        <CarouselContent
          className="-ml-1"
          role="list"
          aria-label="Property listings"
        >
          {transformedListings.map((listing, i) => {
            const key =
              "unitid" in listing
                ? `unit-${listing.unitid}`
                : "detailreq" in listing
                  ? listing.detailreq
                  : `idx-${i}`;

            return (
              <CarouselItem
                key={key}
                className="basis-[220px] md:basis-[256px]"
                role="listitem"
                aria-label={`Property ${i + 1} of ${transformedListings.length}`}
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
            );
          })}
        </CarouselContent>
        <CarouselPrevious
          className="left-6 hidden h-11 w-11 items-center justify-center bg-white text-accent-foreground shadow-md md:flex"
          aria-label="Previous property"
        />
        <CarouselNext
          className="right-6 hidden h-11 w-11 items-center justify-center bg-white text-accent-foreground shadow-md md:flex"
          aria-label="Next property"
        />
      </Carousel>
    </div>
  );
}
