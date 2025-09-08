"use client";

import { Camera, Dot } from "lucide-react";
import Link from "next/link";
import React from "react";

import { AddFavoriteButton } from "@/components/add-favorite-button";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { AgentListing } from "@/lib/get-agent-details";
import { buildInnerHtml, cn } from "@/lib/utils";

export function AgentPropertyCard({ listing }: { listing: AgentListing }) {
  const [imgError, setImgError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Data validation with fallbacks
  if (!listing) {
    return (
      <Card className="flex flex-col gap-4 rounded-lg text-brand-accent shadow-none lg:flex-row lg:border lg:border-[##fea3b1] lg:p-4">
        <div className="min-h-[202px] min-w-[256px] rounded-lg bg-gray-100 animate-pulse" />
        <div className="px-4 py-4">
          <div className="h-6 bg-gray-100 animate-pulse rounded mb-2" />
          <div className="h-4 bg-gray-100 animate-pulse rounded mb-2" />
          <div className="h-4 bg-gray-100 animate-pulse rounded" />
        </div>
      </Card>
    );
  }

  // Use the listing prop instead of mockData
  const cleanPath = listing.detailreq
    ? listing.detailreq.replace(/^https?:\/\/[^/]+\//, "")
    : "";
  const detailsLink = cleanPath ? `/listings${cleanPath}` : "#";

  // Handle image URL with CDN prefix if needed
  const imageUrl = listing.image?.startsWith("http")
    ? listing.image
    : listing.image
      ? `https://dve7rykno93gs.cloudfront.net${listing.image}`
      : "/placeholder-image.png";

  // Handle avatar image URL with proper prefixing
  const avatarImageUrl = listing.owner?.image
    ? listing.owner.image.startsWith("http")
      ? listing.owner.image
      : `https://dve7rykno93gs.cloudfront.net/fascimos/somics/${listing.owner.image}`
    : "";

  // Safe price rendering using the same pattern as property-card
  const priceDisplay = listing.pricepart1 ? (
    <span
      className="text-lg font-bold sm:text-xl"
      dangerouslySetInnerHTML={buildInnerHtml(listing.pricepart1)}
    />
  ) : null;

  return (
    <Card className="flex flex-col gap-4 rounded-lg text-brand-accent shadow-none lg:flex-row lg:border lg:border-[##fea3b1] lg:p-4">
      <CardHeader className="min-w-[256px] p-0">
        <div className="relative min-h-[202px] min-w-[256px] rounded-t-lg md:rounded-lg overflow-hidden">
          <Link
            href={detailsLink}
            className="absolute inset-0 z-10"
            aria-label={`View details for ${listing.summary ?? "property"}`}
          >
            <AspectRatio ratio={4 / 3}>
              <ImageWithFallback
                src={imageUrl}
                alt={listing.summary ?? "Property image"}
                fill
                className={cn(
                  "object-cover rounded-t-lg md:rounded-lg transition-opacity duration-300",
                  isLoading ? "opacity-0" : "opacity-100"
                )}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 256px, (max-width: 1024px) 300px, 256px"
                quality={90}
                priority={true}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setImgError(true);
                  setIsLoading(false);
                }}
              />
              {isLoading && !imgError && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />
              )}
              {imgError && (
                <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">
                    Image unavailable
                  </span>
                </div>
              )}
            </AspectRatio>
          </Link>
          {listing.availability && (
            <Badge className="absolute left-4 top-4 z-30 h-6 bg-brand-accent uppercase">
              {listing.availability}
            </Badge>
          )}
          <div className="absolute right-4 top-4 z-10">
            <AddFavoriteButton listingId={listing.listingid} />
          </div>
          {listing.photocount && (
            <Button
              className="absolute bottom-4 right-4 h-6 w-12 bg-white p-0 text-xs uppercase shadow-none hover:bg-white"
              aria-label={`${listing.photocount} photos available`}
            >
              <Camera
                className="mr-1 h-5 w-5 text-brand-accent"
                strokeWidth="1.3"
              />
              <p className="font-bold text-brand-accent">
                {listing.photocount}
              </p>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-between px-4 pb-4 lg:p-0">
        <Link href={detailsLink}>
          <h3 className="font-bold text-base sm:text-lg line-clamp-2 capitalize">
            {listing.summary ?? "Property details"}
          </h3>
          <div className="flex h-fit items-center gap-2 pt-3">
            {priceDisplay}
            {listing.pricepart2 && (
              <span className="text-sm sm:text-base font-normal text-brand-muted">
                {listing.pricepart2}
              </span>
            )}
          </div>
          {listing.description && (
            <p className="line-clamp-2 pt-3 text-sm sm:text-base text-brand-muted">
              {listing.description}
            </p>
          )}
          <div className="flex items-center gap-1 pt-2 text-sm sm:text-base">
            {listing.bedroomcount ? (
              <>
                <span>{listing.bedroomcount} Beds</span>
              </>
            ) : null}
            {listing.bathroomcount ? (
              <>
                <Dot className="h-4 w-4" />
                <span>{listing.bathroomcount} Baths</span>
              </>
            ) : null}
            {listing.garagecount ? (
              <>
                <Dot className="h-4 w-4" />
                <span>{listing.garagecount} Parking</span>
              </>
            ) : null}
            {listing.floorarea ? (
              <>
                <Dot className="h-4 w-4" />
                <span>{listing.floorarea} m²</span>
              </>
            ) : null}
          </div>
        </Link>
        <CardFooter className="mt-3 flex items-center justify-between p-0">
          <div className="flex items-center gap-2">
            <Avatar className="flex h-11 w-11 items-center rounded-full text-brand-accent shadow-none border">
              <AvatarImage
                src={avatarImageUrl}
                className="rounded-full border border-gray-50 object-contain"
                alt={`${listing.owner?.name ?? "Agent"} avatar`}
              />
              <AvatarFallback className="flex h-11 w-11 items-center justify-center rounded-full border bg-slate-50 text-sm font-bold text-inherit">
                {listing.owner?.name?.slice(0, 2).toUpperCase() ?? "AG"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <Link
                href={detailsLink}
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "w-32 font-semibold bg-brand-primary hover:bg-brand-primary"
                )}
                aria-label={`View full details for ${listing.summary ?? "property"}`}
              >
                View details
              </Link>
            </div>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
