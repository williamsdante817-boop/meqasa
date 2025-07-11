"use client";

import { Camera, Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { AddFavoriteButton } from "@/components/add-favorite-button";
import { PlaceholderImage } from "@/components/placeholder-image";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { AgentListing } from "@/lib/get-agent-details";

export function AgentPropertyCard({ listing }: { listing: AgentListing }) {
  const [imgError, setImgError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

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
      : "";

  // Handle avatar image URL with proper prefixing
  const avatarImageUrl = listing.owner?.image
    ? listing.owner.image.startsWith("http")
      ? listing.owner.image
      : `https://dve7rykno93gs.cloudfront.net/fascimos/somics/${listing.owner.image}`
    : "";

  return (
    <Card className="flex flex-col gap-4 rounded-xl text-brand-accent shadow-none lg:flex-row lg:border lg:border-[##fea3b1] lg:p-4">
      <CardHeader className="min-w-[256px] p-0">
        <div className="relative min-h-[202px] min-w-[256px] rounded-2xl">
          <Link href={detailsLink} className="absolute inset-0 z-10">
            <AspectRatio ratio={4 / 3}>
              {!imgError ? (
                <Image
                  className={cn(
                    "object-cover rounded-xl transition-opacity duration-300 h-[202px] w-full",
                    isLoading ? "opacity-0" : "opacity-100",
                  )}
                  src={imageUrl}
                  onError={() => setImgError(true)}
                  onLoad={() => setIsLoading(false)}
                  width={256}
                  height={202}
                  sizes="256px"
                  alt={listing.summary}
                />
              ) : (
                <PlaceholderImage
                  asChild
                  aria-label="Property image placeholder"
                />
              )}
              {isLoading && !imgError && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-2xl" />
              )}
            </AspectRatio>
          </Link>
          <Badge className="absolute left-4 top-4 z-30 h-6 bg-brand-accent uppercase">
            {listing.availability}
          </Badge>
          <div className="absolute right-4 top-4 z-10">
            <AddFavoriteButton listingId={listing.listingid} />
          </div>
          <Button className="absolute bottom-4 right-4 h-6 w-12 bg-white p-0 text-xs uppercase shadow-none hover:bg-white">
            <Camera
              className="mr-1 h-5 w-5 text-brand-accent"
              strokeWidth="1.3"
            />
            <p className="font-bold text-brand-accent">{listing.photocount}</p>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-between px-4 pb-4 lg:p-0">
        <Link href={detailsLink}>
          <h3 className="font-bold lg:text-lg line-clamp-2 capitalize">
            {listing.summary}
          </h3>
          <div className="flex h-fit items-center gap-2 pt-3">
            <span
              className="text-base font-semibold"
              dangerouslySetInnerHTML={{ __html: listing.pricepart1 }}
            ></span>
            <span className="text-sm font-normal text-brand-muted">
              {listing.pricepart2}
            </span>
          </div>
          <p className="line-clamp-2 pt-3 text-sm text-brand-muted">
            {listing.description}
          </p>
          <div className="flex items-center gap-1 pt-2 text-sm">
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
                <span>
                  {listing.floorarea ? `${listing.floorarea} m²` : ""}
                </span>
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
              />
              <AvatarFallback className="flex h-11 w-11 items-center justify-center rounded-full border bg-slate-50 text-sm font-bold text-inherit">
                {listing.owner?.name?.slice(0, 2).toUpperCase() ?? ""}
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:block">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="line-clamp-1 w-fit text-left text-sm text-brand-muted">
                      {/* If you have a recency field, use it here */}
                      {/* Updated {listing.recency} */}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{/* Updated {listing.recency} */}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <Link
                href={detailsLink}
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "w-32 font-semibold bg-brand-primary hover:bg-brand-primary",
                )}
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
