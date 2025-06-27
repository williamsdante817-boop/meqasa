"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip } from "@radix-ui/react-tooltip";
import { Camera, Dot, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

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
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import ContactCard from "../contact-card";

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
  const [imgError, setImgError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
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
    cleanPath = result.detailreq.replace(/^https?:\/\/[^/]+\//, "");
    detailsLink = `/listings${cleanPath}`;
  }
  // Extract listing ID from cleanPath for the favorite button
  const listingIdMatch = /-(\d+)$/.exec(cleanPath);
  const listingId = parseInt(
    listingIdMatch?.[1] ?? result.listingid ?? "0",
    10,
  );

  const agentImageUrl = result.owner.image.startsWith("http")
    ? result.owner.image
    : `https://meqasa.com/fascimos/somics/${result.owner.image}`;

  return (
    <Card className="flex flex-col gap-4 rounded-xl text-brand-accent shadow-none lg:flex-row lg:border lg:border-[##fea3b1] lg:p-4">
      <CardHeader className="min-w-[256px] p-0">
        <div className="relative min-h-[202px] min-w-[256px] rounded-2xl">
          <Link href={detailsLink} className="absolute inset-0 z-10">
            <AspectRatio ratio={4 / 3}>
              {!imgError ? (
                <Image
                  className={cn(
                    "object-cover rounded-2xl transition-opacity duration-300 h-[202px] w-full",
                    isLoading ? "opacity-0" : "opacity-100",
                  )}
                  src={result.image}
                  onError={() => setImgError(true)}
                  onLoad={() => setIsLoading(false)}
                  width={256}
                  height={202}
                  sizes="256px"
                  alt={result.summary}
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
          <Badge className="absolute left-4 top-4 z-30 h-6 bg-b-accent uppercase">
            {result.istopad ? "Premium" : result.availability}
          </Badge>
          {listingId > 0 && (
            <div className="absolute right-4 top-4 z-10">
              <AddFavoriteButton listingId={listingId} />
            </div>
          )}
          <Button className="absolute bottom-4 right-4 h-6 w-12 bg-white p-0 text-xs uppercase shadow-none hover:bg-white">
            <Camera
              className="mr-1 h-5 w-5 text-brand-accent"
              strokeWidth="1.3"
            />
            <p className="font-bold text-brand-accent">{result.photocount}</p>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-between px-4 pb-4 lg:p-0">
        <Link href={detailsLink}>
          <h3 className="font-bold lg:text-lg ">{result.summary}</h3>
          <div className="flex h-fit items-center gap-2 pt-3">
            <span
              className="text-base font-semibold"
              dangerouslySetInnerHTML={{
                __html: result.pricepart1,
              }}
            />
            <span className="text-sm font-normal text-brand-muted">
              {result.pricepart2}
            </span>
          </div>
          <p
            className="line-clamp-2 pt-3 text-sm text-brand-muted"
            dangerouslySetInnerHTML={{
              __html: result.description ?? "",
            }}
          />
          <div className="flex items-center gap-1 pt-2 text-sm">
            <span>{result.bedroomcount} Beds</span>
            <Dot className="h-4 w-4" />
            <span>{result.bathroomcount} Baths</span>
            <Dot className="h-4 w-4" />
            <span>{result.garagecount} Parking</span>
            <Dot className="h-4 w-4" />
            <span>{result.floorarea ? `${result.floorarea} m²` : ""}</span>
          </div>
        </Link>
        <CardFooter className="mt-3 flex items-center justify-between p-0 ">
          <div className="flex items-center gap-2">
            <Avatar className="flex h-11 w-11 items-center rounded-full text-brand-accent shadow-none border">
              <AvatarImage
                src={agentImageUrl}
                className="rounded-full border border-gray-50 object-contain"
              />
              <AvatarFallback className="flex h-11 w-11 items-center justify-center rounded-full border bg-slate-50 text-sm font-bold text-inherit">
                {result.owner.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:block">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="line-clamp-1 w-fit text-left text-sm text-brand-muted">
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
          <div className="flex items-center gap-2">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="flex items-center gap-1.5  font-semibold text-brand-accent"
                  aria-label={`Contact ${result.owner.name}`}
                >
                  <Phone className="h-4 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-fit h-fit overflow-y-auto p-0">
                <div className="h-full">
                  <ContactCard
                    name={result.owner.name}
                    image={result.owner.image || ""}
                    src
                  />
                </div>
              </DialogContent>
            </Dialog>
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
