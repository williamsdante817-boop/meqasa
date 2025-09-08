import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function DevelopersSkeleton() {
  return (
    <div role="status" aria-label="Loading developers">
      {/* Search input skeleton */}
      <div className="w-full mb-8">
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
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              {/* Logo skeleton */}
              <div className="flex-shrink-0">
                <Skeleton
                  variant="card"
                  className="w-16 h-16 rounded-md"
                  aria-label="Loading developer logo"
                />
              </div>

              {/* Content skeleton */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    {/* Company name skeleton */}
                    <Skeleton
                      variant="text"
                      size="lg"
                      className="w-48 mb-2"
                      aria-label="Loading company name"
                    />

                    {/* Location skeleton */}
                    <div className="flex items-center gap-2 mb-3">
                      <Skeleton variant="light" className="h-4 w-4" />
                      <Skeleton
                        variant="light"
                        size="default"
                        className="w-32"
                      />
                    </div>

                    {/* Badges skeleton */}
                    <div className="flex items-center gap-3 mb-3">
                      <Skeleton
                        variant="light"
                        className="h-6 w-20 bg-brand-badge-verified/20 rounded-sm"
                      />
                      <Skeleton
                        variant="light"
                        className="h-6 w-24 bg-brand-badge-ongoing/20 rounded-sm"
                      />
                    </div>
                  </div>

                  {/* Button skeleton */}
                  <Skeleton
                    variant="light"
                    className="h-10 w-32 bg-brand-primary/20 rounded-md"
                  />
                </div>
              </div>
            </div>

            {/* Hero image skeleton */}
            <div className="mb-6">
              <Skeleton
                variant="shimmer"
                className="w-full h-48 rounded-md"
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
