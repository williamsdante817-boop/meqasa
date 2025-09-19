import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function DevelopersSkeleton() {
  return (
    <div role="status" aria-label="Loading developers">
      {/* Search input skeleton */}
      <div className="mb-8 w-full">
        <Skeleton
          variant="light"
          className="h-12 w-full max-w-lg rounded-md"
          aria-label="Loading search input"
        />
      </div>

      {/* Developers list skeleton */}
      <div className="space-y-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card
            key={index}
            className="w-full bg-white p-4 md:p-8"
            role="status"
            aria-label={`Loading developer ${index + 1}`}
          >
            <div className="mb-6 flex flex-col gap-6 sm:flex-row">
              {/* Logo skeleton */}
              <div className="flex-shrink-0">
                <Skeleton
                  variant="card"
                  className="h-16 w-16 rounded-md"
                  aria-label="Loading developer logo"
                />
              </div>

              {/* Content skeleton */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    {/* Company name skeleton */}
                    <Skeleton
                      variant="text"
                      size="lg"
                      className="mb-2 w-48"
                      aria-label="Loading company name"
                    />

                    {/* Location skeleton */}
                    <div className="mb-3 flex items-center gap-2">
                      <Skeleton variant="light" className="h-4 w-4" />
                      <Skeleton
                        variant="light"
                        size="default"
                        className="w-32"
                      />
                    </div>

                    {/* Badges skeleton */}
                    <div className="mb-3 flex items-center gap-3">
                      <Skeleton
                        variant="light"
                        className="bg-brand-badge-verified/20 h-6 w-20 rounded-sm"
                      />
                      <Skeleton
                        variant="light"
                        className="bg-brand-badge-ongoing/20 h-6 w-24 rounded-sm"
                      />
                    </div>
                  </div>

                  {/* Button skeleton */}
                  <Skeleton
                    variant="light"
                    className="bg-brand-primary/20 h-10 w-32 rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Hero image skeleton */}
            <div className="mb-6">
              <Skeleton
                variant="shimmer"
                className="h-48 w-full rounded-md"
                aria-label="Loading developer showcase image"
              />
            </div>

            {/* Description skeleton */}
            <div className="space-y-2">
              <Skeleton variant="light" size="default" className="w-full" />
              <Skeleton variant="light" size="default" className="w-3/4" />
              <Skeleton variant="light" size="default" className="w-1/2" />
            </div>
          </Card>
        ))}
      </div>
      <span className="sr-only">
        Loading developers information, please wait...
      </span>
    </div>
  );
}
