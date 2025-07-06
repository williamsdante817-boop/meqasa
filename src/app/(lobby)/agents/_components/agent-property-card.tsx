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

export function AgentPropertyCard() {
  const [imgError, setImgError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Mock data for demonstration - replace with actual props
  const mockData = {
    listingId: 123,
    image:
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3270&q=80",
    summary: "1 Bedroom Furnished Apartment For Rent At East Legon",
    pricepart1: "GH₵27,500",
    pricepart2: "/ month",
    description:
      "The Signature Apartments is strategically situated in the heart of Accra at Tetteh Quarshie with easy access to major roads and amenities.",
    bedroomcount: "2",
    bathroomcount: "2",
    garagecount: "3",
    floorarea: "300",
    photocount: "10",
    availability: "For sale",
    recency: "Today",
    owner: {
      name: "John Doe",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  };

  const detailsLink = "/listings/house-for-sale-at-Tema-Community-25-428757"; // Replace with actual link generation logic

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
                  src={mockData.image}
                  onError={() => setImgError(true)}
                  onLoad={() => setIsLoading(false)}
                  width={256}
                  height={202}
                  sizes="256px"
                  alt={mockData.summary}
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
            {mockData.availability}
          </Badge>
          <div className="absolute right-4 top-4 z-10">
            <AddFavoriteButton listingId={mockData.listingId} />
          </div>
          <Button className="absolute bottom-4 right-4 h-6 w-12 bg-white p-0 text-xs uppercase shadow-none hover:bg-white">
            <Camera
              className="mr-1 h-5 w-5 text-brand-accent"
              strokeWidth="1.3"
            />
            <p className="font-bold text-brand-accent">{mockData.photocount}</p>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-between px-4 pb-4 lg:p-0">
        <Link href={detailsLink}>
          <h3 className="font-bold lg:text-lg">{mockData.summary}</h3>
          <div className="flex h-fit items-center gap-2 pt-3">
            <span className="text-base font-semibold">
              {mockData.pricepart1}
            </span>
            <span className="text-sm font-normal text-brand-muted">
              {mockData.pricepart2}
            </span>
          </div>
          <p className="line-clamp-2 pt-3 text-sm text-brand-muted">
            {mockData.description}
          </p>
          <div className="flex items-center gap-1 pt-2 text-sm">
            <span>{mockData.bedroomcount} Beds</span>
            <Dot className="h-4 w-4" />
            <span>{mockData.bathroomcount} Baths</span>
            <Dot className="h-4 w-4" />
            <span>{mockData.garagecount} Parking</span>
            <Dot className="h-4 w-4" />
            <span>{mockData.floorarea ? `${mockData.floorarea} m²` : ""}</span>
          </div>
        </Link>
        <CardFooter className="mt-3 flex items-center justify-between p-0">
          <div className="flex items-center gap-2">
            <Avatar className="flex h-11 w-11 items-center rounded-full text-brand-accent shadow-none border">
              <AvatarImage
                src={mockData.owner.image}
                className="rounded-full border border-gray-50 object-contain"
              />
              <AvatarFallback className="flex h-11 w-11 items-center justify-center rounded-full border bg-slate-50 text-sm font-bold text-inherit">
                {mockData.owner.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden lg:block">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <span className="line-clamp-1 w-fit text-left text-sm text-brand-muted">
                      Updated {mockData.recency}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Updated {mockData.recency}</p>
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
