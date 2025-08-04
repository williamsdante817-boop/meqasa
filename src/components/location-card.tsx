import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AspectRatio } from "./ui/aspect-ratio";

export interface LocationCardProps {
  href: string;
  location: string;
  src: string;
  description?: string;
  priority?: boolean;
}

export default function LocationCard({
  href,
  location,
  src,
  description,
  priority = false,
}: LocationCardProps) {
  return (
    <Card className="min-w-[170px] rounded-none lg:size-full p-0 overflow-hidden border-none shadow-none">
      <Link
        href={href}
        className="space-y-1.5 block"
        aria-label={`View properties in ${location}`}
        role="article"
      >
        <CardHeader className="rounded-xl p-0">
          <AspectRatio ratio={4 / 3} className="relative">
            <Image
              alt={`${location} location image`}
              src={src}
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              fill
              loading={priority ? "eager" : "lazy"}
              priority={priority}
              quality={85}
              className="rounded-xl object-cover"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="p-0">
          <h3 className="mt-3 line-clamp-2 text-sm font-bold capitalize text-brand-accent lg:text-lg">
            {location}
          </h3>
          {description && (
            <p
              className="mt-1 text-sm text-gray-600 line-clamp-2"
              aria-label={`Description for ${location}`}
            >
              {description}
            </p>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
