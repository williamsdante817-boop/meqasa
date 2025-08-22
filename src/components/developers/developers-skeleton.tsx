import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function DevelopersSkeleton() {
  return (
    <>
      {/* Search input skeleton */}
      <div className="w-full mb-8">
        <Skeleton className="h-12 w-full max-w-lg rounded-md" />
      </div>

      {/* Developers list skeleton */}
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="w-full bg-white p-4 md:p-8">
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              {/* Logo skeleton */}
              <div className="flex-shrink-0">
                <Skeleton className="w-16 h-16 rounded-md" />
              </div>

              {/* Content skeleton */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    {/* Company name skeleton */}
                    <Skeleton className="h-6 w-48 mb-2" />

                    {/* Location skeleton */}
                    <div className="flex items-center gap-2 mb-3">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>

                    {/* Badges skeleton */}
                    <div className="flex items-center gap-3 mb-3">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                    </div>
                  </div>

                  {/* Button skeleton */}
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>

            {/* Hero image skeleton */}
            <div className="mb-6">
              <Skeleton className="w-full h-48 rounded-md" />
            </div>

            {/* Description skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
