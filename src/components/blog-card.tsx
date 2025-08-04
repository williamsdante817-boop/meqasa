"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Calendar } from "lucide-react";
import { PlaceholderImage } from "./placeholder-image";
import { cn } from "@/lib/utils";

/**
 * A card component for representing blog posts.
 *
 * It displays a title, description, date posted, and a poster image.
 *
 * If the poster image is not provided, it will fall back to a default image.
 *
 * @param {Object} props - The component props.
 * @param {string} props.datePosted - The date when the blog post was posted.
 * @param {string} [props.href="/blog"] - The link to the blog post.
 * @param {string} props.poster - The link to the poster image.
 * @param {string} props.title - The title of the blog post.
 * @param {string} props.description - The description of the blog post.
 * @param {boolean} [props.priority=false] - Whether to prioritize loading the image.
 */
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

  return (
    <Link href={href} className="block" aria-label={`Read blog post: ${title}`}>
      <article className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_192px] mb-6">
        <div className="space-y-2">
          <h3 className="text-sm font-bold lg:text-base text-brand-accent">
            {title}
          </h3>
          <p className="line-clamp-3 text-sm leading-5 text-brand-muted">
            {description}
          </p>
          <time
            dateTime={datePosted}
            className="text-xs text-brand-accent flex items-center"
          >
            <Calendar
              className="mr-2 text-[#f93a5d]"
              size={16}
              aria-hidden="true"
            />
            {datePosted}
          </time>
        </div>
        <div className="hidden lg:block lg:w-full lg:overflow-hidden lg:rounded-2xl">
          <Card className="overflow-hidden size-full p-0 border-none">
            <CardContent className="p-0 rounded-xl">
              <AspectRatio ratio={4 / 3} className="relative">
                {!imgError ? (
                  <>
                    <Image
                      src={poster || "/fallback-image.jpg"}
                      alt={`Featured image for blog post: ${title}`}
                      sizes="(min-width: 1024px) 192px, 100vw"
                      fill
                      loading={priority ? "eager" : "lazy"}
                      className={cn(
                        "object-cover rounded-xl transition-opacity duration-300",
                        isLoading ? "opacity-0" : "opacity-100",
                      )}
                      onError={() => setImgError(true)}
                      onLoad={() => setIsLoading(false)}
                    />
                    {isLoading && (
                      <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-xl" />
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
