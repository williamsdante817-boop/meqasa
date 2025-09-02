"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ArticleCardSkeleton({ variant = "compact" }: { variant?: "featured" | "compact" | "list" }) {
  const isFeatured = variant === "featured";
  const isList = variant === "list";

  return (
    <Card 
      className={`${isFeatured ? "h-full" : ""}`}
      role="status"
      aria-label="Loading article"
    >
      <CardContent className={`p-0 h-full ${isList ? "flex" : ""}`}>
        {/* Image Skeleton */}
        <div 
          className={`
            relative overflow-hidden rounded-t-lg flex-shrink-0
            ${isFeatured ? "h-48 md:h-56" : isList ? "h-20 w-20" : "h-40"}
            ${isList ? "rounded-l-lg rounded-t-none mr-3" : ""}
          `}
        >
          <Skeleton 
            variant="shimmer" 
            className="w-full h-full" 
            aria-label="Loading article image"
          />
        </div>

        {/* Content Skeleton */}
        <div className={`p-4 flex-1 flex flex-col ${isList ? "justify-center" : ""}`}>
          {/* Source and Date */}
          <div className={`flex items-center gap-2 mb-2 ${isList ? "mb-1" : ""}`}>
            <Skeleton variant="light" size="sm" className="w-16" />
            <Skeleton variant="light" className="h-3 w-3 rounded-full bg-brand-muted/20" />
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
    <div className="space-y-4" role="status" aria-label="Loading featured articles">
      <div className="text-center md:text-left">
        <Skeleton variant="text" size="lg" className="w-32 mb-2 mx-auto md:mx-0" />
        <Skeleton variant="light" size="default" className="w-48 mx-auto md:mx-0" />
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
        <Skeleton variant="text" size="lg" className="w-28 mb-2 mx-auto md:mx-0" />
        <Skeleton variant="light" size="default" className="w-40 mx-auto md:mx-0" />
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
    <div className="py-14 md:py-20 lg:py-24" role="status" aria-label="Loading blog section">
      <div className="container px-4 md:px-0">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Skeleton variant="text" size="xl" className="w-48 mb-4 mx-auto" />
          <Skeleton variant="light" size="md" className="w-64 mx-auto" />
        </div>
        
        {/* Blog Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <FeaturedArticlesSkeleton />
          <MarketNewsSkeleton />
        </div>
      </div>
    </div>
  );
}