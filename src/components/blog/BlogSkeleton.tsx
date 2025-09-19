"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ArticleCardSkeleton({
  variant = "compact",
}: {
  variant?: "featured" | "compact" | "list";
}) {
  const isFeatured = variant === "featured";
  const isList = variant === "list";

  return (
    <Card
      className={`${isFeatured ? "h-full" : ""}`}
      role="status"
      aria-label="Loading article"
    >
      <CardContent className={`h-full p-0 ${isList ? "flex" : ""}`}>
        {/* Image Skeleton */}
        <div
          className={`relative flex-shrink-0 overflow-hidden rounded-t-lg ${isFeatured ? "h-48 md:h-56" : isList ? "h-20 w-20" : "h-40"} ${isList ? "mr-3 rounded-t-none rounded-l-lg" : ""} `}
        >
          <Skeleton
            variant="shimmer"
            className="h-full w-full"
            aria-label="Loading article image"
          />
        </div>

        {/* Content Skeleton */}
        <div
          className={`flex flex-1 flex-col p-4 ${isList ? "justify-center" : ""}`}
        >
          {/* Source and Date */}
          <div
            className={`mb-2 flex items-center gap-2 ${isList ? "mb-1" : ""}`}
          >
            <Skeleton variant="light" size="sm" className="w-16" />
            <Skeleton
              variant="light"
              className="bg-brand-muted/20 h-3 w-3 rounded-full"
            />
            <Skeleton variant="light" size="sm" className="w-20" />
          </div>

          {/* Title */}
          <div className={`space-y-2 ${isList ? "space-y-1" : ""}`}>
            <Skeleton
              variant="text"
              size={isFeatured ? "md" : "default"}
              className="w-full"
              aria-label="Loading article title"
            />
            <Skeleton
              variant="text"
              size={isFeatured ? "md" : "default"}
              className="w-3/4"
            />
          </div>

          {/* Read More - Only for featured */}
          {isFeatured && (
            <div className="mt-auto pt-3">
              <Skeleton variant="light" size="default" className="w-20" />
            </div>
          )}
        </div>
      </CardContent>
      <span className="sr-only">Loading article content, please wait...</span>
    </Card>
  );
}

export function FeaturedArticlesSkeleton() {
  return (
    <div
      className="space-y-4"
      role="status"
      aria-label="Loading featured articles"
    >
      <div className="text-center md:text-left">
        <Skeleton
          variant="text"
          size="lg"
          className="mx-auto mb-2 w-32 md:mx-0"
        />
        <Skeleton
          variant="light"
          size="default"
          className="mx-auto w-48 md:mx-0"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Main featured article */}
        <div className="md:row-span-2">
          <ArticleCardSkeleton variant="featured" />
        </div>

        {/* Secondary articles */}
        <div className="space-y-4">
          <ArticleCardSkeleton variant="compact" />
          <ArticleCardSkeleton variant="compact" />
        </div>
      </div>
    </div>
  );
}

export function MarketNewsSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading market news">
      <div className="text-center md:text-left">
        <Skeleton
          variant="text"
          size="lg"
          className="mx-auto mb-2 w-28 md:mx-0"
        />
        <Skeleton
          variant="light"
          size="default"
          className="mx-auto w-40 md:mx-0"
        />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, i) => (
          <ArticleCardSkeleton key={i} variant="list" />
        ))}
      </div>
    </div>
  );
}

export function BlogSectionSkeleton() {
  return (
    <div
      className="py-14 md:py-20 lg:py-24"
      role="status"
      aria-label="Loading blog section"
    >
      <div className="container px-4 md:px-0">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <Skeleton variant="text" size="xl" className="mx-auto mb-4 w-48" />
          <Skeleton variant="light" size="md" className="mx-auto w-64" />
        </div>

        {/* Blog Content */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <FeaturedArticlesSkeleton />
          <MarketNewsSkeleton />
        </div>
      </div>
    </div>
  );
}
