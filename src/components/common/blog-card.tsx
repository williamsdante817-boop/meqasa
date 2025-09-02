"use client";

import React from "react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Calendar } from "lucide-react";
import { PlaceholderImage } from "@/components/common/placeholder-image";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { cn } from "@/lib/utils";
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

  // Ensure ISO-8601 for machine-readable date while displaying raw or formatted date
  const parsedDate = React.useMemo(() => {
    const d = new Date(datePosted);
    return isNaN(d.getTime()) ? null : d;
  }, [datePosted]);

  const isoDate = parsedDate ? parsedDate.toISOString() : undefined;
  const displayDate = parsedDate
    ? parsedDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : datePosted;

  return (
    <Link href={href} className="block" aria-label={`Read blog post: ${title}`}>
      <article className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_192px] mb-6 gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-brand-accent mb-1 leading-tight">
            {title}
          </h3>
          <p className="line-clamp-3 text-sm md:text-base leading-relaxed text-brand-muted">
            {description}
          </p>
          <time
            dateTime={isoDate}
            className="text-sm text-brand-accent flex items-center"
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
          <Card className="overflow-hidden size-full !p-0 rounded-lg">
            <CardContent className="!p-0 rounded-lg">
              <AspectRatio ratio={4 / 3} className="relative overflow-hidden rounded-lg">
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
                        "object-cover rounded-lg transition-opacity duration-300",
                        isLoading ? "opacity-0" : "opacity-100",
                      )}
                      onError={() => setImgError(true)}
                      onLoad={() => setIsLoading(false)}
                      quality={priority ? 85 : 75}
                    />
                    {isLoading && (
                      <Skeleton className="absolute inset-0 bg-gray-100 animate-pulse rounded-xl" />
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
