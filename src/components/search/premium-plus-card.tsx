"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Dot, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AddFavoriteButton } from "@/components/add-favorite-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PremiumPlusBadge } from "@/components/ui/premium-badge";
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
import { buildInnerHtml, cn } from "@/lib/utils";
import { DeveloperContactCard } from "@/components/developer/cards/developer-contact-card";
import { ImageWithFallback } from "@/components/common/image-with-fallback";

// TypeScript interfaces for the data structure
interface Owner {
  haswan: boolean;
  name: string;
  first: string;
  image: string;
  verification: string;
  type: string;
  page: string;
}

interface PremiumPlusPropertyData {
  istopad: boolean;
  photocount: string;
  recency: string;
  detailreq: string;
  image: string;
  image2: string;
  streetaddress: string;
  locationstring: string;
  floorarea: string;
  bathroomcount: string;
  bedroomcount: string;
  garagecount: string;
  listingid: string;
  isunit: boolean;
  type: string;
  contract: string;
  summary: string;
  description: string | null;
  owner: Owner;
  pdr: string;
  priceval: number;
  pricepart1: string;
  pricepart2: string;
  availability: string;
}

interface PremiumPlusPropertyCardProps {
  data: PremiumPlusPropertyData;
}

export function PremiumPlusPropertyCard({
  data,
}: PremiumPlusPropertyCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Compute details page link
  const detailsLink = data.isunit
    ? `/developer-unit/${data.bedroomcount}-bedroom-${data.type?.toLowerCase().split(" ").join("-")}-for-${data.contract}-in-${data.locationstring?.split(" ").join("-").toLowerCase()}-unit-${data.listingid}`
    : `/listings${data.detailreq?.replace(/^https?:\/\/[^/]+\//, "") || ""}`;

  // Defensive: Fallbacks for data
  const ownerImage =
    avatarError || !data.owner?.image
      ? undefined
      : `https://meqasa.com/fascimos/somics/${data.owner.image}`;
  const ownerName = data.owner?.name || "Agent";
  const summary = data.summary || "Property Listing";

  // Parse numbers safely
  const listingId = Number(data.listingid) || 0;
  const bedroomCount = Number(data.bedroomcount) || 0;
  const bathroomCount = Number(data.bathroomcount) || 0;
  const garageCount = Number(data.garagecount) || 0;
  const floorArea = data.floorarea || "-";
  const recency = data.recency || "recently";
  const pricePart1 = data.pricepart1 || "";
  const pricePart2 = data.pricepart2 || "";

  // Generate fallback avatar initials
  const avatarInitials = ownerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <Card className="relative h-full w-full overflow-hidden rounded-lg border border-gray-200 bg-white p-0 hover:border-brand-primary/30">
      <CardHeader className="p-0">
        <div className="relative w-full rounded-lg min-h-[200px] sm:min-h-[230px] md:min-h-[260px]">
          <Link
            href={detailsLink}
            className="absolute inset-0 z-10"
            aria-label={`View details for ${summary}`}
          />

          {/* Loading Skeleton - only show when image hasn't loaded */}
          {!imageLoaded && (
            <div className="absolute inset-0 z-20">
              <Skeleton className="h-full w-full rounded-t-lg animate-pulse" />
            </div>
          )}

          <ImageWithFallback
            className={cn(
              "relative z-10 h-[200px] sm:h-[230px] md:h-[260px] w-full rounded-t-lg object-cover transition-all duration-500",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            src={data.image2 || data.image || "/placeholder-image.png"}
            alt={summary}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMzAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority
            fill
            quality={85}
            fallbackAlt={`${summary} - Image not available`}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Premium Plus Badge */}
          <div className="absolute left-3 top-3 z-30">
            <PremiumPlusBadge size="sm" />
          </div>

          {/* Favorite Button */}
          {listingId > 0 && (
            <div className="absolute right-3 top-3 z-30 opacity-90 group-hover:opacity-100 transition-opacity duration-200">
              <AddFavoriteButton listingId={listingId} />
            </div>
          )}

          {/* Photo count indicator */}
          {data.photocount && parseInt(data.photocount) > 1 && (
            <Badge
              className="absolute bottom-3 right-3 z-30 bg-black/70 text-white text-xs hover:bg-black/90 transition-colors duration-200"
              aria-label={`View ${data.photocount} photos`}
            >
              <Camera className="mr-1.5 h-3 w-3" />
              <span>{data.photocount}</span>
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1 p-4 space-y-3">
        {/* Property Title */}
        <Link href={detailsLink} className="group/title">
          <h3 className="line-clamp-2 font-bold text-brand-accent text-base sm:text-lg leading-tight transition-colors duration-200 group-hover/title:text-brand-accent-dark">
            {summary}
          </h3>
        </Link>

        {/* Location */}
        {data.streetaddress && (
          <p className="text-sm sm:text-base text-brand-muted line-clamp-1 capitalize">
            {data.streetaddress}
          </p>
        )}

        {/* Property Details */}
        <div className="flex items-center gap-1 text-sm text-brand-muted flex-wrap sm:text-base">
          {bedroomCount > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-medium">
                {bedroomCount} Bed{bedroomCount !== 1 ? "s" : ""}
              </span>
              {(bathroomCount > 0 || garageCount > 0) && (
                <Dot className="h-3 w-3 text-brand-accent flex-shrink-0" />
              )}
            </div>
          )}
          {bathroomCount > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-medium">
                {bathroomCount} Bath{bathroomCount !== 1 ? "s" : ""}
              </span>
              {garageCount > 0 && (
                <Dot className="h-3 w-3 text-brand-accent flex-shrink-0" />
              )}
            </div>
          )}
          {garageCount > 0 && (
            <div className="flex items-center gap-1">
              <span className="font-medium">{garageCount} Parking</span>
              {floorArea !== "-" && (
                <>
                  <Dot className="h-3 w-3 text-brand-accent flex-shrink-0" />
                  <span className="font-medium">{floorArea} m²</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Description if available */}
        {data.description && (
          <p
            className="line-clamp-2 text-sm text-brand-muted leading-relaxed sm:text-base"
            dangerouslySetInnerHTML={buildInnerHtml(data.description)}
          />
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-1">
          {pricePart1 && (
            <span
              className="text-lg font-bold text-brand-primary leading-tight sm:text-xl"
              dangerouslySetInnerHTML={buildInnerHtml(pricePart1)}
            />
          )}
          {pricePart2 && (
            <span className="text-sm font-medium text-brand-muted leading-tight sm:text-base">
              {pricePart2}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 border-t border-gray-100">
        {/* Agent Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-brand-border shadow-sm transition-transform group-hover:scale-105">
            <AvatarImage
              src={ownerImage}
              alt={ownerName}
              onError={() => setAvatarError(true)}
              className="object-cover"
            />
            <AvatarFallback className="bg-slate-50 text-sm font-semibold text-brand-accent">
              {avatarInitials}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            {ownerName !== "Agent" && (
              <span className="text-sm font-medium text-brand-accent line-clamp-1 sm:text-base md:hidden">
                {ownerName}
              </span>
            )}
            <div className="hidden md:block">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="line-clamp-1 w-fit text-left text-sm text-brand-muted cursor-help hover:text-brand-accent transition-colors sm:text-base">
                      Updated {recency}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Updated {recency}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="text-xs text-brand-muted md:hidden sm:text-sm">
              Updated {recency}
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
                className="h-9 w-9 shadow-none text-brand-accent border-brand-border hover:shadow-sm"
                aria-label={`Contact ${ownerName}`}
              >
                <Phone className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg w-full overflow-hidden p-4 sm:p-6">
              <DeveloperContactCard
                developerName={ownerName ?? ""}
                developerId={data.listingid}
                logoSrc={ownerImage ?? ""}
                fallbackImage="/placeholder-image.png"
                onClose={() => setIsOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Link
            href={detailsLink}
            className={cn(
              buttonVariants({ variant: "default", size: "sm" }),
              "w-24 sm:w-32 font-semibold bg-brand-primary hover:bg-brand-primary-dark text-white transition-all duration-200 hover:shadow-md"
            )}
            aria-label={`View details for ${summary}`}
          >
            <span className="hidden sm:inline">View details</span>
            <span className="sm:hidden">Details</span>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
