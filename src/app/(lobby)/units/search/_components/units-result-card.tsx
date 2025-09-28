"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Dot, Phone } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, buildInnerHtml } from "@/lib/utils";
import { formatRecency } from "@/lib/date-utils";
import { DeveloperContactCard } from "@/components/developer/cards/developer-contact-card";

interface DeveloperUnit {
  id: string;
  unitid?: number;
  title: string;
  price: string;
  location: string;
  address?: string;
  city?: string;
  bedrooms: number;
  beds?: number;
  bathrooms: number;
  baths?: number;
  unittype: string;
  unittypename?: string;
  terms: string;
  image?: string;
  coverphoto?: string;
  developer?: string;
  companyname?: string;
  name?: string;
  area?: string;
  floorarea?: number;
  featured?: boolean;
  description?: string;
  developermobile?: string;
  developeremail?: string;
  developerlogo?: string;
  timestamp?: string;
  dateadded?: string;
  [key: string]: any;
}

export interface UnitsResultCardProps {
  unit: DeveloperUnit;
  priority?: boolean;
}

export function UnitsResultCard({
  unit,
  priority = false,
}: UnitsResultCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Use consistent image URL logic
  const imageUrl = unit.coverphoto
    ? `https://meqasa.com/uploads/imgs/${unit.coverphoto}`
    : unit.image || "";

  // Calculate actual photo count
  const photoCount = unit.coverphoto || unit.image ? 1 : 0;

  // Get display values
  const displayContract =
    unit.terms === "rent"
      ? "For Rent"
      : unit.terms === "sale"
        ? "For Sale"
        : "Pre-selling";
  const bedrooms = unit.beds || unit.bedrooms || 0;
  const bathrooms = unit.baths || unit.bathrooms || 0;
  const floorArea = unit.floorarea || 0;
  const developer = unit.companyname || unit.developer || unit.name || "";
  const developerLogo = unit.developerlogo;
  const timestamp = unit.updated_at || unit.dateadded;

  // Construct title following live MeQasa pattern: "{bedrooms} Bedroom {property_type} For {transaction_type} in {location}"
  const constructedTitle = (() => {
    const bedroomText = bedrooms === 1 ? "1 Bedroom" : `${bedrooms} Bedroom`;
    const propertyType = unit.unittypename || unit.unittype || "Apartment";
    const transactionType = unit.terms === "rent" ? "For Rent" : "For Sale";
    const location = unit.city || unit.location || "Ghana";

    return `${bedroomText} ${propertyType} ${transactionType} in ${location}`;
  })();

  // Generate alt text using constructed title
  const altText = `${constructedTitle} - ${displayContract}`.trim();

  // Generate SEO-friendly link URL (matching search results card pattern)
  const citySlug =
    unit.city?.split(" ").join("-").toLowerCase() ||
    unit.location?.split(" ").join("-").toLowerCase() ||
    "ghana";
  const typeSlug =
    unit.unittypename?.toLowerCase().split(" ").join("-") ||
    unit.unittype?.toLowerCase() ||
    "apartment";
  const contractSlug = unit.terms === "rent" ? "rent" : "sale";

  const linkUrl = `/developer-unit/${bedrooms}-bedroom-${typeSlug}-for-${contractSlug}-in-${citySlug}-unit-${unit.unitid || unit.id}`;

  // Use MeQasa's exact price display logic for consistency
  const formatPrice = (): { pricepart1: string; pricepart2?: string } => {
    const contractType = unit.terms === "rent" ? "rent" : "sale";

    if (contractType === "rent") {
      // MeQasa's logic: USD properties use 'price' field, GHS properties use raw amount
      const currencySign = unit.rentpricecsignpermonth;

      if (currencySign === "$" && unit.price) {
        // For USD properties: Use MeQasa's converted price field
        if (unit.price.includes("/month")) {
          const parts = unit.price.split("/month");
          const firstPart = parts.length > 0 && parts[0] ? parts[0].trim() : "";
          return {
            pricepart1: firstPart,
            pricepart2: "/month",
          };
        } else if (unit.price.includes("/day")) {
          const parts = unit.price.split("/day");
          const firstPart = parts.length > 0 && parts[0] ? parts[0].trim() : "";
          return {
            pricepart1: firstPart,
            pricepart2: "/day",
          };
        } else if (unit.price.includes("/week")) {
          const parts = unit.price.split("/week");
          const firstPart = parts.length > 0 && parts[0] ? parts[0].trim() : "";
          return {
            pricepart1: firstPart,
            pricepart2: "/week",
          };
        }
        return { pricepart1: unit.price };
      } else if (currencySign === "¢" && unit.rentpricepermonth) {
        // For GHS properties: Use original rent amount to avoid inflated calculations
        const rentDurationType = unit.rentdurationtype || "permonth";

        if (rentDurationType === "perday" && unit.rentpriceperday) {
          return {
            pricepart1: `&#8373;${unit.rentpriceperday.toLocaleString()}`,
            pricepart2: "/day",
          };
        } else if (rentDurationType === "perweek" && unit.rentpriceperweek) {
          return {
            pricepart1: `&#8373;${unit.rentpriceperweek.toLocaleString()}`,
            pricepart2: "/week",
          };
        } else {
          return {
            pricepart1: `&#8373;${unit.rentpricepermonth.toLocaleString()}`,
            pricepart2: "/month",
          };
        }
      }

      // Fallback for rental properties
      if (unit.price) {
        return { pricepart1: unit.price };
      }
    } else {
      // For sale properties: Check currency sign for same logic
      const currencySign = unit.sellingpricecsign;

      if (currencySign === "$" && unit.price) {
        // USD sale properties: Use converted price
        return { pricepart1: unit.price };
      } else if (currencySign === "¢" && unit.sellingprice) {
        // GHS sale properties: Use original selling price
        return {
          pricepart1: `&#8373;${unit.sellingprice.toLocaleString()}`,
        };
      }

      // Fallback for sale properties
      if (unit.price) {
        return { pricepart1: unit.price };
      }
    }

    return { pricepart1: "Contact for Price" };
  };

  const priceData = formatPrice();

  // Use consistent date formatting across the app
  const recencyString = formatRecency(timestamp);

  // Developer image URL - Use the correct MeQasa uploads URL
  const developerImageUrl = developerLogo
    ? `https://meqasa.com/uploads/imgs/${developerLogo}`
    : "";

  return (
    <Card className="text-brand-accent md:border-brand-border md:hover:border-brand-primary/30 flex flex-col gap-4 rounded-lg py-0 shadow-none transition-all duration-300 hover:shadow-md md:flex-row md:border md:p-4 md:hover:shadow-sm">
      <CardHeader className="relative min-w-[256px] p-0 sm:min-w-[300px]">
        <div className="relative min-h-[202px] min-w-[256px] overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-[1.02] sm:min-h-[225px] sm:min-w-[300px]">
          <Link
            href={linkUrl}
            className="absolute inset-0 z-10"
            aria-label={`View details for ${constructedTitle}`}
          >
            <AspectRatio ratio={4 / 3}>
              {/* Loading Skeleton - only show when image hasn't loaded */}
              {!imageLoaded && (
                <div className="absolute inset-0 z-10">
                  <Skeleton className="h-[202px] w-full animate-pulse rounded-lg sm:h-[225px]" />
                </div>
              )}

              <ImageWithFallback
                className={cn(
                  "relative z-20 h-[202px] w-full rounded-lg object-cover transition-all duration-300 sm:h-[225px]",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                src={imageUrl}
                alt={altText}
                width={300}
                height={225}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 300px"
                quality={85}
                fallbackAlt={`${unit.title} - Image not available`}
                priority={priority}
                onLoad={() => setImageLoaded(true)}
              />
            </AspectRatio>
          </Link>

          {/* Contract Badge */}
          <Badge className="bg-brand-accent absolute top-4 left-4 z-30 h-6 tracking-wide text-white uppercase shadow-sm">
            {displayContract}
          </Badge>

          {/* Featured Badge */}
          {unit.featured && (
            <Badge className="bg-brand-primary absolute top-4 right-4 z-30 h-6 tracking-wide text-white uppercase shadow-sm">
              Featured
            </Badge>
          )}

          {/* Photo Count Badge - shows actual number of available photos */}
          {photoCount > 0 && (
            <Badge
              className="absolute right-3 bottom-3 z-30 bg-black/70 text-xs text-white backdrop-blur-sm transition-colors duration-200 hover:bg-black/90 sm:text-sm"
              aria-label={`${photoCount} unit image${photoCount !== 1 ? "s" : ""}`}
            >
              <Camera className="mr-1.5 h-3 w-3 sm:h-4 sm:w-4" />
              <span>{photoCount}</span>
            </Badge>
          )}

          {/* Hover overlay for better interaction feedback */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between px-4 pb-4 md:p-0">
        <div>
          {/* Title - Primary hierarchy */}
          <Link href={linkUrl}>
            <h3 className="text-brand-accent line-clamp-2 text-base leading-tight font-bold capitalize sm:text-lg">
              {constructedTitle}
            </h3>
          </Link>

          {/* Price Section - Secondary hierarchy */}
          <div className="flex h-fit items-baseline gap-2 pt-2 sm:pt-3">
            <span
              className="text-brand-primary text-lg leading-tight font-bold sm:text-xl"
              dangerouslySetInnerHTML={buildInnerHtml(priceData.pricepart1)}
            />
            {priceData.pricepart2 && (
              <span className="text-brand-muted text-sm leading-tight font-medium sm:text-base">
                {priceData.pricepart2}
              </span>
            )}
          </div>

          {/* Description */}
          {(unit.description || unit.address || unit.city || unit.location) && (
            <p
              className="text-brand-muted line-clamp-2 pt-2 text-sm leading-relaxed transition-colors group-hover:text-gray-700 sm:pt-3 sm:text-base"
              dangerouslySetInnerHTML={buildInnerHtml(
                unit.description || unit.address || unit.city || unit.location
              )}
            />
          )}

          {/* Property Details */}
          <div className="flex items-center justify-between gap-2 pt-2 text-sm sm:pt-3 sm:text-base">
            <div className="text-brand-muted flex flex-wrap items-center gap-1 overflow-hidden sm:flex-nowrap">
              {bedrooms > 0 && (
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <span className="font-medium">
                    {bedrooms} Bed{bedrooms !== 1 ? "s" : ""}
                  </span>
                  {(bathrooms || floorArea) && (
                    <Dot className="text-brand-accent h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
                  )}
                </div>
              )}
              {bathrooms > 0 && (
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <span className="font-medium">
                    {bathrooms} Bath{bathrooms !== 1 ? "s" : ""}
                  </span>
                  {floorArea > 0 && (
                    <Dot className="text-brand-accent h-3 w-3 flex-shrink-0 sm:h-4 sm:w-4" />
                  )}
                </div>
              )}
              {floorArea > 0 && (
                <span className="font-medium whitespace-nowrap">
                  {floorArea} m²
                </span>
              )}
            </div>
          </div>
        </div>

        <CardFooter className="mt-4 flex items-center justify-between p-0">
          {/* Developer Info */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Avatar className="border-brand-border h-10 w-10 flex-shrink-0 border shadow-none transition-transform group-hover:scale-105">
              <AvatarImage
                src={developerImageUrl || " "}
                className="rounded-full bg-white object-contain"
                alt={`${developer || "Developer"} logo`}
              />
              <AvatarFallback className="text-brand-accent bg-slate-50 text-sm font-semibold">
                {developer ? developer.slice(0, 2).toUpperCase() : "DV"}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              {/* Developer name - show on both mobile and desktop with ellipsis */}
              {developer && (
                <span className="text-brand-accent max-w-[120px] overflow-hidden text-sm font-medium text-ellipsis whitespace-nowrap sm:text-base md:hidden">
                  {developer}
                </span>
              )}

              {/* Date - desktop with tooltip */}
              <div className="hidden md:block">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-brand-muted hover:text-brand-accent line-clamp-1 w-fit cursor-help text-left text-sm transition-colors sm:text-base">
                        Updated {recencyString}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Updated {recencyString}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Date - mobile */}
              <span className="text-brand-muted text-xs sm:text-sm md:hidden">
                Updated {recencyString}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-brand-accent border-brand-border h-9 w-9 shadow-none hover:shadow-sm"
                  aria-label={`Contact ${developer || "developer"}`}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full max-w-lg overflow-hidden p-4 sm:p-6">
                <DeveloperContactCard
                  developerName={developer || "Developer"}
                  developerId={String(unit.unitid || unit.id)}
                  logoSrc={developerImageUrl}
                  fallbackImage="/placeholder-image.png"
                  onClose={() => setIsOpen(false)}
                />
              </DialogContent>
            </Dialog>

            <Link
              href={linkUrl}
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "bg-brand-primary hover:bg-brand-primary-dark w-28 font-semibold text-white transition-all duration-200 hover:shadow-md active:scale-95 sm:w-32"
              )}
            >
              <span className="text-sm sm:inline">View details</span>
            </Link>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
