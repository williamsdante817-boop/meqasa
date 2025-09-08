"use client";

import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface FeaturedPropertySkeletonProps {
  className?: string;
  variant?: "default" | "compact";
}

export default function FeaturedPropertySkeleton({
  className = "",
  variant = "default",
}: FeaturedPropertySkeletonProps) {
  const isCompact = variant === "compact";
  const cardHeight = isCompact ? "h-[200px]" : "h-[230px] md:h-[321px]";

  return (
    <Card
      className={`relative mb-8 ${cardHeight} w-full p-0 overflow-hidden rounded-lg border-none text-brand-accent ${className}`}
      role="status"
      aria-label="Loading featured property"
    >
      {/* Background gradient overlay - matches the actual component */}
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: "linear-gradient( rgba(0,0,0,0.1), rgba(0,0,0,0.8))",
        }}
        aria-hidden="true"
      />

      <CardContent className="p-0">
        {/* Main image skeleton - matches exact dimensions */}
        <Skeleton
          variant="shimmer"
          className={`${cardHeight === "h-[230px] md:h-[321px]" ? "h-[321px]" : "h-[200px]"} rounded-lg`}
          aria-label="Loading featured property image"
        />

        {/* Content overlay - matches absolute positioning */}
        <div className="absolute inset-0 rounded-2xl">
          <div className="absolute inset-x-4 bottom-4 z-20">
            <div className="flex items-end justify-between">
              {/* Left content - project info */}
              <div className="text-white space-y-2">
                {/* Project title skeleton */}
                <Skeleton
                  variant="light"
                  className={`${isCompact ? "h-5 w-32" : "h-6 w-48 md:h-7 md:w-56"} bg-white/20`}
                  aria-label="Loading project title"
                />

                {/* Location skeleton - matches the dot-separated layout */}
                <div className="flex items-center gap-1 pt-2">
                  <Skeleton variant="light" className="h-4 w-20 bg-white/15" />
                  <Skeleton
                    variant="light"
                    className="h-1 w-1 rounded-full bg-white/15"
                  />
                  <Skeleton variant="light" className="h-4 w-16 bg-white/15" />
                </div>

                {/* CTA Button skeleton */}
                <div className="mt-3">
                  <Skeleton
                    variant="light"
                    className={`${isCompact ? "h-8 w-24" : "h-10 w-32"} bg-brand-primary/40 rounded-md`}
                    aria-label="Loading view project button"
                  />
                </div>
              </div>

              {/* Right content - logo skeleton */}
              <div className="flex items-end">
                <Skeleton
                  variant="card"
                  className={`${isCompact ? "h-12 w-12" : "h-14 w-14 md:h-16 md:w-16"} rounded-md bg-white/20`}
                  aria-label="Loading developer logo"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <span className="sr-only">
        Loading featured property project details, please wait...
      </span>
    </Card>
  );
}
