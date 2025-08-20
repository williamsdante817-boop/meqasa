"use client";

import Image from "next/image";
import Link from "next/link";

// import { shimmer, toBase64 } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { MapPin } from "lucide-react";
import type { Unit } from "@/types";

export function PropertyUnitCard({ unit }: { unit: Unit }) {
  const url = `${unit?.beds}-bedrooms-${unit?.unittypeslug}-for-${unit?.terms}-in-${unit?.city.split(" ").join("-")}-unit-${unit?.unitid}`;

  return (
    <Link
      href={url.toLocaleLowerCase()}
      aria-label={unit?.title === "" ? unit?.unittypename : unit?.title}
      className="block"
    >
      <Card className="size-full rounded-xl p-0 relative gap-0 border-none shadow-none hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <CardHeader className="p-0 border-b border-b-gray-100 gap-0 rounded-xl shadow-elegant-sm">
          <AspectRatio ratio={4 / 3}>
            {/* {photos.length > 0 && !imgError ? ( */}
            <Image
              className="object-cover rounded-xl"
              src={`https://meqasa.com//uploads/imgs/${unit?.coverphoto}?dim=256x190`}
              // onError={() => setImgError(true)}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
              width={256}
              height={190}
              alt={unit?.title === "" ? unit?.unittypename : unit?.title}
              quality={90}
            />
            {/* ) : (
              <PlaceholderImage asChild />
            )} */}
          </AspectRatio>

          <Badge className="absolute top-3 left-3 z-10 rounded-sm bg-accent-foreground capitalize">
            {"For Sale"}
          </Badge>
        </CardHeader>

        <CardContent className="pt-4 px-0 pb-0 space-y-1">
          <CardTitle className="line-clamp-1 font-medium text-[#f93a5d] text-md capitalize">
            {unit?.title === "" ? unit?.unittypename : unit?.title}
          </CardTitle>
          <div className="flex items-start gap-1 text-sm text-muted-foreground font-medium">
            <MapPin className="h-4 w-4 text-gray-400" />
            <p className="text-md capitalize text-gray-400 line-clamp-1 w-full">
              {unit?.address}
            </p>
          </div>
          <div className=" flex items-center text-sm md:text-base text-muted-foreground">
            {unit?.beds} Beds{" "}
            <Icons.dot className="h-[12px] w-[12px] text-b-accent" />{" "}
            {unit?.baths} Baths
            <Icons.dot className="h-[12px] w-[12px] text-b-accent" />{" "}
            {unit?.garages} Parking
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
