"use client";

import { AspectRatio } from "./ui/aspect-ratio";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export default function FeaturedPropertySkeleton() {
  return (
    <Card
      className="relative size-full overflow-hidden rounded-xl p-0 gap-0"
      role="article"
    >
      <CardHeader className="p-0 gap-0">
        <AspectRatio ratio={16 / 9} className="relative">
          <Skeleton className="absolute inset-0 rounded-xl" />
          <div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/90"
            aria-hidden="true"
          />
        </AspectRatio>
      </CardHeader>

      <CardContent className="w-full p-4">
        <div className="grid grid-cols-[minmax(0,1fr)_max-content] lg:gap-3">
          <div>
            {/* Project name skeleton */}
            <Skeleton className="h-5 w-3/4 mb-1 lg:h-8 lg:mb-2" />

            {/* City and location skeleton */}
            <Skeleton className="h-4 w-1/2 mb-2 lg:h-6 lg:mb-3" />

            {/* Status and bedrooms skeleton */}
            <div className="mt-1 flex items-center gap-[5px]">
              <Skeleton className="h-5 w-16 rounded-sm" />
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-24 lg:h-5 lg:w-32" />
            </div>

            {/* Description skeleton - hidden on mobile, visible on lg+ */}
            <div className="relative mt-2 hidden lg:grid lg:grid-cols-[minmax(0,1fr)_max-content]">
              <div className="mt-2 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>

          {/* Logo skeleton */}
          <div className="max-w-[90px] max-h-[90px]">
            <Skeleton className="h-[50px] w-[50px] rounded-sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
