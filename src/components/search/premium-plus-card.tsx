"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Dot, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { AddFavoriteButton } from "@/components/add-favorite-button";
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
import { buildInnerHtml, cn } from "@/lib/utils";
import { DeveloperContactCard } from "@/components/developer-contact-card";
import { ImageWithFallback } from "@/components/image-with-fallback";

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
    <Card className="group relative h-fit w-full overflow-hidden rounded-lg border border-gray-200 bg-white p-0 shadow-none transition-all duration-200 hover:shadow-elegant hover:border-brand-primary/20">
      <CardHeader className="p-0">
        <div className="relative w-full rounded-lg min-h-[230px] md:min-h-[279px] md:min-w-[256px]">
          <Link
            href={detailsLink}
            className="absolute inset-0 z-10"
            aria-label={`View details for ${summary}`}
          />

          {/* Loading Skeleton */}
          <div className="absolute inset-0 z-0">
            <Skeleton className="h-[202px] w-full rounded-t-lg md:h-[279px] lg:rounded-none lg:rounded-t-lg" />
          </div>

          <ImageWithFallback
            className="relative z-10 h-[202px] w-full rounded-t-lg object-cover md:h-[279px] lg:rounded-none lg:rounded-t-lg transition-opacity duration-300"
            src={data.image2 || "/placeholder-image.png"}
            alt={summary}
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzI4IiBoZWlnaHQ9IjI3OSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciPjxzdG9wIHN0b3AtY29sb3I9IiNmNmY3ZjgiIG9mZnNldD0iMCUiLz48c3RvcCBzdG9wLWNvbG9yPSIjZWRlZWYxIiBvZmZzZXQ9IjIwJSIvPjxzdG9wIHN0b3AtY29sb3I9IiNmNmY3ZjgiIG9mZnNldD0iNDAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iI2Y2ZjdmOCIgb2Zmc2V0PSI3MCUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjZmN2Y4Ii8+PHJlY3QgaWQ9InIiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48YW5pbWF0ZSB4bGlua3M6aHJlZj0iI3IiIGF0dHJpYnV0ZU5hbWU9IngiIGZyb209Ii03MjgiIHRvPSI3MjgiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmZpbml0ZSIgLz48L3N2Zz4="
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 256px, (max-width: 1024px) 300px, 256px"
            priority
            fill
            quality={90}
            fallbackAlt={`${summary} - Image not available`}
          />

          {/* Premium Plus Badge */}
          <Badge className="absolute left-3 top-3 z-20 bg-brand-primary text-white uppercase tracking-wide">
            Premium Plus
          </Badge>

          {/* Favorite Button */}
          {listingId > 0 && (
            <div className="absolute right-3 top-3 z-30">
              <AddFavoriteButton listingId={listingId} />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-4">
        {/* Property Title */}
        <h3 className="line-clamp-2 font-bold text-brand-primary transition-colors group-hover:text-brand-accent">
          <Link
            href={detailsLink}
            title={summary}
            aria-label={`View details for ${summary}`}
            className="hover:underline"
          >
            {summary}
          </Link>
        </h3>

        {/* Property Details */}
        <div className="flex items-center gap-2 text-sm text-brand-muted">
          {bedroomCount > 0 && (
            <>
              <span>{bedroomCount} Beds</span>
              <Dot className="h-3 w-3 text-brand-accent" />
            </>
          )}
          {bathroomCount > 0 && (
            <>
              <span>{bathroomCount} Baths</span>
              {garageCount > 0 && <Dot className="h-3 w-3 text-brand-accent" />}
            </>
          )}
          {garageCount > 0 && (
            <>
              <span>{garageCount} Parking</span>
              <Dot className="h-3 w-3 text-brand-accent" />
              <span>{floorArea} m²</span>
            </>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          {pricePart1 && (
            <span
              className="text-lg font-bold text-brand-accent"
              dangerouslySetInnerHTML={buildInnerHtml(pricePart1)}
            />
          )}
          {pricePart2 && (
            <span className="text-sm font-normal text-brand-muted">
              {pricePart2}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center gap-3 border-t border-gray-100 p-4">
        {/* Agent Avatar */}
        <Avatar className="h-10 w-10 border border-gray-200 shadow-sm">
          {/* Avatar Loading Skeleton */}
          <div className="absolute inset-0 z-0">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>

          <AvatarImage
            src={ownerImage}
            alt={ownerName}
            onError={() => setAvatarError(true)}
            className="relative z-10 object-fit"
          />
          <AvatarFallback className="relative z-10 bg-slate-50 text-sm font-semibold text-brand-accent">
            {avatarInitials}
          </AvatarFallback>
        </Avatar>

        {/* Update Time */}
        <div className="hidden lg:block flex-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="line-clamp-1 text-xs text-brand-muted">
                  Updated {recency} ago
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Updated {recency} ago</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-8">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 text-brand-accent"
                aria-label={`Contact ${ownerName}`}
              >
                <Phone className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg w-full overflow-hidden p-4 sm:p-6">
              <DeveloperContactCard
                developerName={ownerName}
                developerId={data.listingid}
                logoSrc={
                  data.owner?.image
                    ? `https://meqasa.com/fascimos/somics/${data.owner.image}`
                    : ""
                }
                fallbackImage="/placeholder-image.png"
                onClose={() => setIsOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <Link
            href={detailsLink}
            className={cn(
              buttonVariants({ variant: "default" }),
              "h-9 bg-brand-primary text-white hover:bg-brand-primary-dark font-semibold",
            )}
            aria-label={`View details for ${summary}`}
          >
            View details
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
