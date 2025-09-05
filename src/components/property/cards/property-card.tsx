"use client";

import Link from "next/link";
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ListingDetails } from "@/types";
import { Dot } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { buildInnerHtml, cn } from "@/lib/utils";
import { AddFavoriteButton } from "@/components/add-favorite-button";
import { ImageWithFallback } from "@/components/common/image-with-fallback";

// Variants - default preserves your exact current styling
const propertyCardVariants = cva(
  "size-full rounded-lg bg-transparent !p-0 relative gap-0 border-none shadow-none transition-shadow duration-200 cursor-pointer",
  {
    variants: {
      variant: {
        default: "", // Your exact current styling
        featured: "ring-2 ring-brand-primary/20 shadow-sm", // Just adds subtle ring for featured
        compact: "max-w-sm", // Smaller max width for compact view
      },
      hover: {
        subtle: "hover:shadow-sm",
        none: "",
        elevated: "hover:shadow-md hover:scale-[1.02]",
      }
    },
    defaultVariants: {
      variant: "default",
      hover: "none", // Preserves your current hover behavior
    },
  }
);

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
  featured?: boolean;
};

export interface PropertyCardProps extends VariantProps<typeof propertyCardVariants> {
  listing: Listing;
  parentContract?: string;
  priority?: boolean;
  className?: string;
}

const PropertyCard = React.forwardRef<HTMLDivElement, PropertyCardProps>(({
  listing,
  parentContract,
  variant = "default",
  hover = "none", 
  priority = false,
  className,
  ...props
}, ref) => {
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

  // Reset loading state when image changes
  React.useEffect(() => {
    if (image) {
      setIsLoading(true);
    }
  }, [image]);

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

  // Enhanced accessible alt text for the image
  const altTextBase = title?.trim() ?? summary?.trim() ?? "Property";
  const altParts: string[] = [];
  const bedsNum = Number.parseInt(String(bedroomcount ?? ""), 10);
  const bathsNum = Number.parseInt(String(bathroomcount ?? ""), 10);
  const garagesNum = Number.parseInt(String(garages ?? ""), 10);
  
  if (Number.isFinite(bedsNum) && bedsNum > 0)
    altParts.push(`${bedsNum} bed${bedsNum === 1 ? "" : "s"}`);
  if (Number.isFinite(bathsNum) && bathsNum > 0)
    altParts.push(`${bathsNum} bath${bathsNum === 1 ? "" : "s"}`);
  if (Number.isFinite(garagesNum) && garagesNum > 0)
    altParts.push(`${garagesNum} parking space${garagesNum === 1 ? "" : "s"}`);
    
  const locationPart = streetaddress ? `in ${streetaddress}` : "";
  const altText =
    `${altTextBase}${altParts.length ? ` – ${altParts.join(", ")}` : ""} ${locationPart} (${displayContract})`.trim();
  
  // Determine which variant to use - auto-detect featured properties
  const cardVariant = listing.featured ? "featured" : variant;

  return (
    <Link
      href={`/${formattedUrl}`}
      aria-label={`View property: ${title ?? streetaddress ?? "details"}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
      tabIndex={0}
    >
      <Card 
        ref={ref}
        className={cn(propertyCardVariants({ variant: cardVariant, hover, className }))}
        role="article"
        aria-labelledby={`property-title-${listingId}`}
        aria-describedby={`property-details-${listingId}`}
        {...props}
      >
        <CardHeader className="!p-0 border-b border-b-gray-100 gap-0 rounded-lg">
          <AspectRatio ratio={4 / 3} className="relative overflow-hidden rounded-lg">
            <ImageWithFallback
              className={cn(
                "object-cover rounded-lg transition-all duration-300",
                isLoading ? "opacity-0" : "opacity-100",
              )}
              src={image || "/placeholder-image.png"}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 256px, (max-width: 1024px) 300px, 256px"
              fill
              priority={priority}
              alt={altText}
              placeholder="blur"
              blurDataURL={blurDataURL}
              quality={priority ? 85 : 75}
            />
            {isLoading && (
              <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />
            )}
          </AspectRatio>

          <Badge 
            className="absolute top-3 left-3 z-10 rounded-sm bg-brand-accent capitalize"
            aria-label={`Property type: ${displayContract}`}
          >
            {displayContract}
          </Badge>

          {/* Featured badge for featured properties */}
          {listing.featured && (
            <Badge 
              className="absolute top-3 right-14 z-10 rounded-sm bg-amber-500 text-white"
              aria-label="Featured property"
            >
              Featured
            </Badge>
          )}

          {listingId > 0 && (
            <div className="absolute top-2 right-2 z-10">
              <AddFavoriteButton listingId={listingId} />
            </div>
          )}
        </CardHeader>

        <CardContent className="px-0 pb-0 space-y-1">
          <CardTitle 
            id={`property-title-${listingId}`}
            className="line-clamp-1 mb-3 leading-relaxed font-bold text-brand-primary text-base sm:text-lg pt-2 capitalize transition-colors duration-200 group-hover:text-brand-primary-dark"
          >
            {title}
          </CardTitle>
          <div id={`property-details-${listingId}`}>
            <div className="flex h-fit items-center gap-2 mb-1.5 mt-[10px]" aria-label="Property pricing">
              {pricepart1 ? (
                <span
                  className="text-lg font-bold leading-tight text-brand-accent sm:text-xl"
                  dangerouslySetInnerHTML={buildInnerHtml(pricepart1)}
                />
              ) : price ? (
                <span
                  className="text-lg font-bold leading-tight text-brand-accent sm:text-xl"
                  dangerouslySetInnerHTML={buildInnerHtml(price)}
                />
              ) : (
                <span className="text-sm sm:text-base font-semibold text-brand-muted">
                  Price not available
                </span>
              )}
              {pricepart2 && (
                <span className="text-sm sm:text-base font-normal text-brand-muted">
                  {pricepart2}
                </span>
              )}
            </div>
            <span className="text-sm sm:text-base capitalize mb-1 text-brand-muted line-clamp-1">
              {streetaddress}
            </span>
            <div className="mt-1 flex items-center text-sm sm:text-base text-brand-muted flex-nowrap overflow-hidden" aria-label="Property features">
              {Number.isFinite(bedsNum) && bedsNum > 0 && (
                <>
                  <span className="truncate" aria-label={`${bedsNum} bedroom${bedsNum === 1 ? '' : 's'}`}>
                    {bedsNum} Beds
                  </span>
                  {(Number.isFinite(bathsNum) && bathsNum > 0) ||
                  (Number.isFinite(garagesNum) && garagesNum > 0) ? (
                    <Dot className="h-[12px] w-[12px] text-brand-accent flex-shrink-0" aria-hidden="true" />
                  ) : null}
                </>
              )}
              {Number.isFinite(bathsNum) && bathsNum > 0 && (
                <>
                  <span className="truncate" aria-label={`${bathsNum} bathroom${bathsNum === 1 ? '' : 's'}`}>
                    {bathsNum} Baths
                  </span>
                  {Number.isFinite(garagesNum) && garagesNum > 0 ? (
                    <Dot className="h-[12px] w-[12px] text-brand-accent flex-shrink-0" aria-hidden="true" />
                  ) : null}
                </>
              )}
              {Number.isFinite(garagesNum) && garagesNum > 0 && (
                <span className="truncate" aria-label={`${garagesNum} parking space${garagesNum === 1 ? '' : 's'}`}>
                  {garages} Parking
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

PropertyCard.displayName = "PropertyCard";

export default PropertyCard;
export { propertyCardVariants };
