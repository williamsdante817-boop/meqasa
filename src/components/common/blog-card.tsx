"use client";

import React from "react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Calendar } from "lucide-react";
import { PlaceholderImage } from "@/components/common/placeholder-image";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { cn, formatDisplayDate, isValidDateString } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogCard({
  datePosted,
  poster,
  title,
  description,
  href = "/blog",
  priority = false,
}: {
  datePosted: string;
  href?: string;
  poster: string;
  title: string;
  description: string;
  priority?: boolean;
}) {
  const [imgError, setImgError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const hasPoster = Boolean(poster);

  // Use consistent date formatting
  const isValidDate = isValidDateString(datePosted);
  const isoDate = isValidDate ? new Date(datePosted).toISOString() : undefined;
  const displayDate = isValidDate ? formatDisplayDate(datePosted) : datePosted;

  return (
    <Link href={href} className="block" aria-label={`Read blog post: ${title}`}>
      <article className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_192px]">
        <div className="space-y-2">
          <h3 className="text-brand-accent mb-1 text-base leading-tight font-semibold sm:text-lg">
            {title}
          </h3>
          <p className="text-brand-muted line-clamp-3 text-sm leading-relaxed sm:text-base">
            {description}
          </p>
          <time
            dateTime={isoDate}
            className="text-brand-accent flex items-center text-sm sm:text-base"
          >
            <Calendar
              className="mr-2 text-[#f93a5d]"
              size={16}
              aria-hidden="true"
            />
            {displayDate}
          </time>
        </div>
        <div className="hidden lg:block lg:w-full lg:overflow-hidden lg:rounded-lg">
          <Card className="size-full overflow-hidden rounded-lg !p-0">
            <CardContent className="rounded-lg !p-0">
              <AspectRatio
                ratio={4 / 3}
                className="relative overflow-hidden rounded-lg"
              >
                {hasPoster && !imgError ? (
                  <>
                    <ImageWithFallback
                      src={poster}
                      alt={`Featured image for blog post: ${title}`}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 192px, 192px"
                      fill
                      priority={priority}
                      loading={priority ? "eager" : undefined}
                      className={cn(
                        "rounded-lg object-cover transition-opacity duration-300",
                        isLoading ? "opacity-0" : "opacity-100"
                      )}
                      onError={() => setImgError(true)}
                      onLoad={() => setIsLoading(false)}
                      quality={priority ? 85 : 75}
                    />
                    {isLoading && (
                      <Skeleton className="absolute inset-0 animate-pulse rounded-xl bg-gray-100" />
                    )}
                  </>
                ) : (
                  <PlaceholderImage
                    asChild
                    aria-label="Blog post image placeholder"
                  />
                )}
              </AspectRatio>
            </CardContent>
          </Card>
        </div>
      </article>
    </Link>
  );
}
