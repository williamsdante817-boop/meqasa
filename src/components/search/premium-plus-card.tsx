"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip } from "@radix-ui/react-tooltip";
import { Dot, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ContactCard from "../contact-card";

// Add missing utility functions
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="0%" />
      <stop stop-color="#edeef1" offset="20%" />
      <stop stop-color="#f6f7f8" offset="40%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageError, setImageError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // Compute details page link and cleanPath for listingId extraction
  let detailsLink = "";
  let cleanPath = "";
  if (data.isunit) {
    const citySlug =
      data.locationstring?.split(" ").join("-").toLowerCase() || "";
    const typeSlug = data.type?.toLowerCase().split(" ").join("-") || "";
    detailsLink = `/developer-unit/${data.bedroomcount}-bedroom-${typeSlug}-for-${data.contract}-in-${citySlug}-unit-${data.listingid}`;
    cleanPath = `-${data.listingid}`; // fallback for unit
  } else {
    cleanPath =
      typeof data.detailreq === "string"
        ? data.detailreq.replace(/^https?:\/\/[^/]+\//, "")
        : "";
    detailsLink = `/listings${cleanPath.startsWith("/") ? cleanPath : "/" + cleanPath}`;
  }

  // Defensive: Fallbacks for images and text
  const ownerImage =
    avatarError || !data.owner?.image
      ? undefined
      : `https://meqasa.com/fascimos/somics/${data.owner.image}`;
  const ownerName = data.owner?.name || "Agent";
  const summary = data.summary || "Property Listing";

  // Defensive: Parse numbers safely
  const listingId = Number(data.listingid) || 0;
  const bedroomCount = Number(data.bedroomcount) || 0;
  const bathroomCount = Number(data.bathroomcount) || 0;
  const garageCount = Number(data.garagecount) || 0;
  const floorArea = data.floorarea || "-";
  const recency = data.recency || "recently";
  const pricePart1 = data.pricepart1 || "";
  const pricePart2 = data.pricepart2 || "";

  return (
    <Card className="mb-8 flex p-0 h-fit flex-col gap-4 rounded-lg border-none text-brand-accent shadow w-full md:min-w-[256px]">
      <CardHeader className="p-0">
        <div className="relative w-full rounded-lg min-h-[230px] md:min-h-[279px] md:min-w-[256px]">
          <Link
            href={detailsLink}
            className="absolute inset-0 z-10"
            aria-label={`View details for ${summary}`}
          ></Link>
          <Image
            className="h-[202px] w-full rounded-t-lg object-cover md:h-[279px] lg:rounded-none lg:rounded-t-lg"
            src={data.image2}
            alt={summary}
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(728, 279))}`}
            sizes="728px"
            onError={() => setImageError(true)}
            priority
            fill
            style={{ objectFit: "cover" }}
          />
          <div className=" absolute inset-0 rounded-lg ">
            <Badge className="absolute left-4 top-4 z-20 bg-brand-primary uppercase">
              Premium Plus
            </Badge>
            <div className="absolute right-4 top-4 z-30">
              <AddFavoriteButton listingId={listingId} />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className=" flex flex-col items-start p-0 px-4">
        <h3 className="font-extrabold lg:text-lg ">
          <Link
            href={detailsLink}
            title={summary}
            aria-label={`View details for ${summary}`}
          >
            {summary}
          </Link>
        </h3>
        <div className="flex items-center pt-2 font-light">
          {bedroomCount === 0 ? null : (
            <>
              <span>{bedroomCount} Beds</span>
              <Dot className="h-4 w-4" />
            </>
          )}
          {bathroomCount === 0 ? null : (
            <>
              <span>{bathroomCount} Baths</span>
            </>
          )}
          {garageCount === 0 ? null : (
            <>
              <Dot className="h-4 w-4" />
              <span>{garageCount} Parking</span>
              <Dot className="h-4 w-4" />
              <span>{floorArea} m²</span>
            </>
          )}
        </div>
        <div className="flex h-fit items-center gap-2 pt-3">
          <p
            className="text-base font-bold"
            dangerouslySetInnerHTML={{
              __html: pricePart1,
            }}
          ></p>
          <p className="text-base font-bold">
            <span className="text-sm font-normal text-brand-muted">
              {pricePart2}
            </span>
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-2 p-4">
        <Avatar className="flex items-center rounded-full border text-brand-accent shadow">
          <AvatarImage
            src={ownerImage}
            className="rounded-full object-contain"
            alt={ownerName}
            onError={() => setAvatarError(true)}
          />
          <AvatarFallback className="flex items-center justify-center rounded-full border bg-slate-50 text-sm font-bold text-inherit">
            {ownerName
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        <div className="hidden lg:block">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="line-clamp-1 w-44 text-center text-xs text-brand-muted lg:text-sm">
                  Updated {recency} ago
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p> Updated {recency} ago</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex h-full grow justify-end">
          <div className="flex items-center gap-2">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="flex items-center gap-1.5  font-semibold text-brand-accent"
                  aria-label={`Contact ${ownerName}`}
                >
                  <Phone className="h-4 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-fit h-fit overflow-y-auto p-0">
                <div className="h-full">
                  <ContactCard
                    name={ownerName}
                    image={data.owner?.image || ""}
                    src
                    listingId={data.listingid}
                    pageType="listing"
                  />
                </div>
              </DialogContent>
            </Dialog>
            <div>
              <Link
                href={detailsLink}
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "w-32 font-semibold bg-brand-primary text-white hover:bg-brand-primary",
                )}
                aria-label={`View details for ${summary}`}
              >
                View details
              </Link>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
