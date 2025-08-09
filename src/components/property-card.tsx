"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ListingDetails } from "@/types";
import { Dot } from "lucide-react";
import { PlaceholderImage } from "./placeholder-image";
import { AspectRatio } from "./ui/aspect-ratio";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { AddFavoriteButton } from "./add-favorite-button";

export type Listing = Pick<
  ListingDetails,
  "detailreq" | "image" | "streetaddress" | "garages" | "title"
> & {
  summary?: string;
  pricepart1?: string;
  pricepart2?: string;
  bathroomcount: string;
  bedroomcount: string;
  price?: string;
  contract?: string;
};

export default function PropertyCard({
  listing,
  parentContract,
}: {
  listing: Listing;
  parentContract?: string;
}) {
  const [imgError, setImgError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const {
    summary,
    title,
    bathroomcount,
    bedroomcount,
    garages,
    detailreq,
    image,
    price,
    streetaddress,
    contract,
    pricepart1,
    pricepart2,
  } = listing;

  const displayContract =
    parentContract?.toLowerCase() === "sale" || contract === "sale"
      ? "For Sale"
      : "For Rent";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const location = streetaddress.split(",")[0]?.trim().split(" ").join("-");

  // Clean up the detailreq by removing domain if present
  const cleanPath = detailreq.replace(/^https?:\/\/[^/]+\//, "");
  const formattedUrl = `listings${cleanPath}`;

  // Extract listing ID from detailreq for the favorite button
  const listingIdMatch = /-(\d+)$/.exec(cleanPath);
  const listingId = parseInt(listingIdMatch?.[1] ?? "0", 10);

  return (
    <Card className="size-full rounded-xl p-0 relative gap-0 border-none shadow-none">
      <Link href={`/${formattedUrl}`} aria-label={title}>
        <CardHeader className="p-0 border-b border-b-gray-100 gap-0 rounded-xl shadow-elegant-sm">
          <AspectRatio ratio={4 / 3} className="relative">
            {!imgError ? (
              <Image
                className={cn(
                  "object-cover rounded-xl transition-opacity duration-300",
                  isLoading ? "opacity-0" : "opacity-100",
                )}
                src={image}
                onError={() => setImgError(true)}
                onLoad={() => setIsLoading(false)}
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                fill
                loading="lazy"
                alt={title ?? summary ?? "Property image"}
              />
            ) : (
              <PlaceholderImage
                asChild
                aria-label="Property image placeholder"
              />
            )}
            {isLoading && !imgError && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-xl" />
            )}
          </AspectRatio>

          <Badge className="absolute top-3 left-3 z-10 rounded-sm bg-brand-accent capitalize">
            {displayContract}
          </Badge>

          {listingId > 0 && (
            <div className="absolute top-2 right-2 z-10">
              <AddFavoriteButton listingId={listingId} />
            </div>
          )}
        </CardHeader>
      </Link>
      <Link href={`/${formattedUrl}`} aria-label={title}>
        <CardContent className="px-0 pb-0 space-y-1">
          <CardTitle className="line-clamp-1 text-xs font-bold text-brand-primary md:text-sm pt-2 capitalize">
            {title}
          </CardTitle>
          <div>
            <h3
              className="mb-1 mt-[10px] text-base font-bold leading-[19px] text-brand-accent md:text-[19px]"
              dangerouslySetInnerHTML={{
                __html: summary
                  ? (`${pricepart1 ?? ""} ${pricepart2 ?? ""}`.trim() ??
                    "Price not available")
                  : (price ?? "Price not available"),
              }}
            ></h3>
            <span className="text-sm capitalize text-brand-muted line-clamp-1">
              {streetaddress}
            </span>
            <div className="mt-1 flex items-center text-sm text-brand-muted">
              {bedroomcount} Beds{" "}
              <Dot className="h-[12px] w-[12px] text-brand-accent" />{" "}
              {bathroomcount} Baths{" "}
              <Icons.dot className="h-[12px] w-[12px] text-brand-accent" />{" "}
              {garages} Parking
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
