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
import { buildPropertyImageUrl, buildAgentLogoUrl } from "@/lib/image-utils";
import { buildInnerHtml, cn } from "@/lib/utils";
import type { AgentListing } from "@/types/agent";

export function AgentPropertyCard({ listing }: { listing: AgentListing }) {
  const [imgError, setImgError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Data validation with fallbacks
  if (!listing) {
    return (
      <Card className="text-brand-accent flex flex-col gap-4 rounded-lg shadow-none lg:flex-row lg:border lg:border-[##fea3b1] lg:p-4">
        <div className="min-h-[202px] min-w-[256px] animate-pulse rounded-lg bg-gray-100" />
        <div className="px-4 py-4">
          <div className="mb-2 h-6 animate-pulse rounded bg-gray-100" />
          <div className="mb-2 h-4 animate-pulse rounded bg-gray-100" />
          <div className="h-4 animate-pulse rounded bg-gray-100" />
        </div>
      </Card>
    );
  }

  // Use the listing prop instead of mockData
  const cleanPath = listing.detailreq
    ? listing.detailreq.replace(/^https?:\/\/[^/]+\//, "")
    : "";
  const detailsLink = cleanPath ? `/listings${cleanPath}` : "#";

  // Use image optimization functions
  const imageUrl = buildPropertyImageUrl(listing.image, "large");
  const avatarImageUrl = buildAgentLogoUrl(listing.owner?.image);

  // Safe price rendering using the same pattern as property-card
  const priceDisplay = listing.pricepart1 ? (
    <span
      className="text-lg font-bold sm:text-xl"
      dangerouslySetInnerHTML={buildInnerHtml(listing.pricepart1)}
    />
  ) : null;

  return (
    <Card className="text-brand-accent flex flex-col gap-4 rounded-lg shadow-none lg:flex-row lg:border lg:border-[##fea3b1] lg:p-4">
      <CardHeader className="min-w-[256px] p-0">
        <div className="relative min-h-[202px] min-w-[256px] overflow-hidden rounded-t-lg md:rounded-lg">
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
                  "rounded-t-lg object-cover transition-opacity duration-300 md:rounded-lg",
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
                imageType="property"
                imageSize="large"
              />
              {isLoading && !imgError && (
                <div className="absolute inset-0 animate-pulse rounded-lg bg-gray-100" />
              )}
              {imgError && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-200">
                  <span className="text-sm text-gray-500">
                    Image unavailable
                  </span>
                </div>
              )}
            </AspectRatio>
          </Link>
          {listing.availability && (
            <Badge className="bg-brand-accent absolute top-4 left-4 z-30 h-6 uppercase">
              {listing.availability}
            </Badge>
          )}
          <div className="absolute top-4 right-4 z-10">
            <AddFavoriteButton listingId={listing.listingid} />
          </div>
          {listing.photocount && (
            <Button
              className="absolute right-4 bottom-4 h-6 w-12 bg-white p-0 text-xs uppercase shadow-none hover:bg-white"
              aria-label={`${listing.photocount} photos available`}
            >
              <Camera
                className="text-brand-accent mr-1 h-5 w-5"
                strokeWidth="1.3"
              />
              <p className="text-brand-accent font-bold">
                {listing.photocount}
              </p>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-between px-4 pb-4 lg:p-0">
        <Link href={detailsLink}>
          <h3 className="line-clamp-2 text-base font-bold capitalize sm:text-lg">
            {listing.summary ?? "Property details"}
          </h3>
          <div className="flex h-fit items-center gap-2 pt-3">
            {priceDisplay}
            {listing.pricepart2 && (
              <span className="text-brand-muted text-sm font-normal sm:text-base">
                {listing.pricepart2}
              </span>
            )}
          </div>
          {listing.description && (
            <p className="text-brand-muted line-clamp-2 pt-3 text-sm sm:text-base">
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
            <Avatar className="text-brand-accent flex h-11 w-11 items-center rounded-full border shadow-none">
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
                  "bg-brand-primary hover:bg-brand-primary w-32 font-semibold"
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
