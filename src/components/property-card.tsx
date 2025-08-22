"use client";

import Link from "next/link";
import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ListingDetails } from "@/types";
import { Dot } from "lucide-react";
import { AspectRatio } from "./ui/aspect-ratio";
import { Badge } from "./ui/badge";
import { buildInnerHtml, cn } from "@/lib/utils";
import { AddFavoriteButton } from "./add-favorite-button";
import { ImageWithFallback } from "./image-with-fallback";

export type Listing = Pick<
  ListingDetails,
  "detailreq" | "image" | "streetaddress" | "garages" | "title" | "listingid"
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
  const [isLoading, setIsLoading] = React.useState(true);
  // Generic lightweight blur placeholder for remote images
  const blurDataURL =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="12"><rect width="100%" height="100%" fill="#f3f4f6"/></svg>',
    );
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
    parentContract?.toLowerCase() === "sale" ||
    contract?.toLowerCase() === "sale"
      ? "For Sale"
      : "For Rent";

  // Location slug not currently used; compute only when needed to avoid unused vars

  // Clean up and normalize the path
  const cleanPath = detailreq
    .replace(/^https?:\/\/[^/]+\//, "")
    .replace(/^\/+/, "");
  const formattedUrl = cleanPath.startsWith("listings/")
    ? cleanPath
    : `listings/${cleanPath}`;

  // Extract listing ID from detailreq for the favorite button, with fallback to prop
  const listingIdMatch = /-(\d+)$/.exec(cleanPath);
  const listingId = (() => {
    const fromPath = parseInt(listingIdMatch?.[1] ?? "0", 10);
    if (Number.isFinite(fromPath) && fromPath > 0) return fromPath;
    const fromProp = parseInt(String(listing.listingid ?? "0"), 10);
    return Number.isFinite(fromProp) && fromProp > 0 ? fromProp : 0;
  })();

  // Accessible alt text for the image
  const altTextBase = title?.trim() ?? summary?.trim() ?? "Property";
  const altParts: string[] = [];
  const bedsNum = Number.parseInt(String(bedroomcount ?? ""), 10);
  const bathsNum = Number.parseInt(String(bathroomcount ?? ""), 10);
  if (Number.isFinite(bedsNum) && bedsNum > 0)
    altParts.push(`${bedsNum} bed${bedsNum === 1 ? "" : "s"}`);
  if (Number.isFinite(bathsNum) && bathsNum > 0)
    altParts.push(`${bathsNum} bath${bathsNum === 1 ? "" : "s"}`);
  const locationPart = streetaddress ? `in ${streetaddress}` : "";
  const altText =
    `${altTextBase}${altParts.length ? ` – ${altParts.join(", ")}` : ""} ${locationPart} (${displayContract})`.trim();

  return (
    <Link
      href={`/${formattedUrl}`}
      aria-label={`View property: ${title ?? streetaddress ?? "details"}`}
      className="block"
    >
      <Card className="size-full rounded-lg bg-transparent !p-0 relative gap-0 border-none shadow-none  transition-shadow duration-200 cursor-pointer">
        <CardHeader className="!p-0 border-b border-b-gray-100 gap-0 rounded-lg">
          <AspectRatio ratio={4 / 3} className="relative">
            <ImageWithFallback
              className={cn(
                "object-cover rounded-lg transition-opacity duration-300",
                isLoading ? "opacity-0" : "opacity-100",
              )}
              src={image || "/placeholder-image.png"}
              onLoad={() => setIsLoading(false)}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 256px, (max-width: 1024px) 300px, 256px"
              fill
              loading="lazy"
              alt={altText}
              placeholder="blur"
              blurDataURL={blurDataURL}
              quality={90}
            />
            {isLoading && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />
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

        <CardContent className="px-0 pb-0 space-y-1">
          <CardTitle className="line-clamp-1 mb-3 leading-relaxed font-bold text-brand-primary text-sm pt-2 capitalize">
            {title}
          </CardTitle>
          <div>
            <div className="flex h-fit items-center gap-2 mb-1.5 mt-[10px]">
              {pricepart1 ? (
                <span
                  className="text-base font-bold leading-[19px] text-brand-accent md:text-[19px]"
                  dangerouslySetInnerHTML={buildInnerHtml(pricepart1)}
                />
              ) : price ? (
                <span
                  className="text-base font-bold leading-[19px] text-brand-accent md:text-[19px]"
                  dangerouslySetInnerHTML={buildInnerHtml(price)}
                />
              ) : (
                <span className="text-base font-semibold text-brand-muted">
                  Price not available
                </span>
              )}
              {pricepart2 && (
                <span className="text-sm font-normal text-brand-muted">
                  {pricepart2}
                </span>
              )}
            </div>
            <span className="text-base capitalize mb-1 text-brand-muted line-clamp-1">
              {streetaddress}
            </span>
            <div className="mt-1 flex items-center text-base text-brand-muted">
              {Number.isFinite(bedsNum) && bedsNum > 0 && (
                <>
                  <span>{bedsNum} Beds</span>
                  {(Number.isFinite(bathsNum) && bathsNum > 0) ||
                  (Number.isFinite(Number(garages)) && Number(garages) > 0) ? (
                    <Dot className="h-[12px] w-[12px] text-brand-accent" />
                  ) : null}
                </>
              )}
              {Number.isFinite(bathsNum) && bathsNum > 0 && (
                <>
                  <span>{bathsNum} Baths</span>
                  {Number.isFinite(Number(garages)) && Number(garages) > 0 ? (
                    <Dot className="h-[12px] w-[12px] text-brand-accent" />
                  ) : null}
                </>
              )}
              {Number.isFinite(Number(garages)) && Number(garages) > 0 && (
                <span>{garages} Parking</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
