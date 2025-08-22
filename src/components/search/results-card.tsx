"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Dot, Phone } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

import { AddFavoriteButton } from "@/components/add-favorite-button";
import { ImageWithFallback } from "@/components/image-with-fallback";
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
import { buildInnerHtml, cn } from "@/lib/utils";
import { DeveloperContactCard } from "@/components/developer-contact-card";

export interface ResultData {
  istopad: boolean;
  photocount: string;
  recency: string;
  detailreq: string;
  image: string;
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
  owner: {
    haswan: boolean;
    name: string;
    first: string;
    image: string;
    verification: string;
    type: string;
    page: string;
  };
  pdr: string;
  priceval: number;
  pricepart1: string;
  pricepart2: string;
  availability: string;
}

export function ResultsCard({ result }: { result: ResultData }) {
  const [isOpen, setIsOpen] = useState(false);

  // Compute details page link and cleanPath for listingId extraction
  let detailsLink = "";
  let cleanPath = "";
  if (result.isunit) {
    const citySlug =
      result.locationstring?.split(" ").join("-").toLowerCase() || "";
    const typeSlug = result.type?.toLowerCase().split(" ").join("-") || "";
    detailsLink = `/developer-unit/${result.bedroomcount}-bedroom-${typeSlug}-for-${result.contract}-in-${citySlug}-unit-${result.listingid}`;
    cleanPath = `-${result.listingid}`; // fallback for unit
  } else {
    cleanPath = result.detailreq
      ? result.detailreq.replace(/^https?:\/\/[^/]+\//, "")
      : "";
    detailsLink = `/listings${cleanPath}`;
  }

  // Extract listing ID from cleanPath for the favorite button
  const listingIdMatch = /-(\d+)$/.exec(cleanPath);
  const listingId = parseInt(
    listingIdMatch?.[1] ?? result.listingid ?? "0",
    10,
  );

  const agentImageUrl = result.owner.image?.startsWith("http")
    ? result.owner.image
    : result.owner.image
      ? `https://meqasa.com/fascimos/somics/${result.owner.image}`
      : "";

  return (
    <Card className="flex flex-col gap-4 rounded-lg border-0 py-0 text-brand-accent shadow-none transition-all duration-200 hover:shadow-elegant-sm md:flex-row md:border md:border-brand-border md:p-4 md:hover:shadow-elegant">
      <CardHeader className="min-w-[256px] p-0">
        <div className="relative min-h-[202px] min-w-[256px] overflow-hidden rounded-lg">
          <Link href={detailsLink} className="absolute inset-0 z-10">
            <AspectRatio ratio={4 / 3}>
              {/* Loading Skeleton */}
              <div className="absolute inset-0 z-0">
                <Skeleton className="h-[202px] w-full rounded-lg" />
              </div>

              <ImageWithFallback
                className="relative z-10 h-[202px] w-full rounded-lg object-cover"
                src={result.image}
                alt={result.summary || "Property image"}
                width={256}
                height={202}
                sizes="(max-width: 640px) 100vw, 256px"
                quality={85}
                fallbackAlt={`${result.summary || "Property"} - Image not available`}
                priority={false}
              />
            </AspectRatio>
          </Link>

          {/* Top Ad Badge */}
          {result.istopad && (
            <Badge className="absolute left-4 top-4 z-30 h-6 bg-brand-accent text-white uppercase tracking-wide shadow-sm">
              {result.availability}
            </Badge>
          )}

          {/* Favorite Button */}
          {listingId > 0 && (
            <div className="absolute right-4 top-4 z-20">
              <AddFavoriteButton listingId={listingId} />
            </div>
          )}

          {/* Photo Count Button */}
          <Button
            className="absolute bottom-4 right-4 h-6 w-12 bg-white/95 p-0 text-xs uppercase shadow-sm hover:bg-white transition-colors duration-200"
            aria-label={`${result.photocount} photos available`}
          >
            <Camera
              className="mr-1 h-4 w-4 text-brand-accent"
              strokeWidth="1.5"
            />
            <span className="font-semibold text-brand-accent">
              {result.photocount}
            </span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between px-4 pb-4 md:p-0">
        <Link href={detailsLink} className="group">
          <h3 className="font-bold capitalize text-brand-accent md:text-lg">
            {result.summary}
          </h3>

          {/* Price Section */}
          <div className="flex h-fit items-center gap-2 pt-3">
            <span
              className="text-base font-semibold text-brand-accent"
              dangerouslySetInnerHTML={buildInnerHtml(result.pricepart1)}
            />
            {result.pricepart2 && (
              <span className="text-sm font-normal text-brand-muted">
                {result.pricepart2}
              </span>
            )}
          </div>

          {/* Description */}
          {result.description && (
            <p
              className="line-clamp-2 pt-3 text-sm text-brand-muted leading-relaxed"
              dangerouslySetInnerHTML={buildInnerHtml(result.description)}
            />
          )}

          {/* Property Details */}
          <div className="flex items-center justify-between gap-1 pt-3 text-sm">
            <div className="flex items-center gap-1 text-brand-muted">
              {result.bedroomcount && (
                <>
                  <span className="font-medium">
                    {result.bedroomcount} Beds
                  </span>
                  <Dot className="h-4 w-4 text-brand-accent" />
                </>
              )}
              {result.bathroomcount && (
                <>
                  <span className="font-medium">
                    {result.bathroomcount} Baths
                  </span>
                  {result.garagecount && (
                    <Dot className="h-4 w-4 text-brand-accent" />
                  )}
                </>
              )}
              {result.garagecount && (
                <>
                  <span className="font-medium">
                    {result.garagecount} Parking
                  </span>
                  {result.floorarea && (
                    <Dot className="h-4 w-4 text-brand-accent" />
                  )}
                </>
              )}
              {result.floorarea && (
                <span className="font-medium">{result.floorarea} m²</span>
              )}
            </div>

            {/* Top Ad Badge for Mobile */}
            {result.istopad && (
              <Badge className="bg-transparent uppercase text-brand-accent border border-orange-400 text-xs md:hidden">
                top ad
              </Badge>
            )}
          </div>
        </Link>

        <CardFooter className="mt-4 flex items-center justify-between p-0">
          {/* Agent Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border border-brand-border shadow-sm">
              <AvatarImage
                src={agentImageUrl}
                className="rounded-full object-cover"
                alt={`${result.owner.name || "Agent"} avatar`}
              />
              <AvatarFallback className="flex h-11 w-11 items-center justify-center rounded-full border bg-slate-50 text-sm font-semibold text-brand-accent">
                {result.owner.name
                  ? result.owner.name.slice(0, 2).toUpperCase()
                  : "NA"}
              </AvatarFallback>
            </Avatar>

            <div className="hidden md:block">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="line-clamp-1 w-fit text-left text-sm text-brand-muted cursor-help">
                      Updated {result.recency}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Updated {result.recency}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 text-brand-accent border-brand-border hover:bg-brand-accent hover:text-white transition-colors duration-200"
                  aria-label={`Contact ${result.owner.name || "agent"}`}
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg w-full overflow-hidden p-4 sm:p-6">
                <DeveloperContactCard
                  developerName={result.owner.name || "Agent"}
                  developerId={result.listingid}
                  logoSrc={agentImageUrl}
                  fallbackImage="/placeholder-image.png"
                  onClose={() => setIsOpen(false)}
                />
              </DialogContent>
            </Dialog>

            <Link
              href={detailsLink}
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "w-32 font-semibold bg-brand-primary hover:bg-brand-primary-dark text-white transition-colors duration-200",
              )}
            >
              View details
            </Link>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
