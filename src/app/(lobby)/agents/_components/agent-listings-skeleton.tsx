import { Skeleton } from "@/components/ui/skeleton";

export function AgentListingsSkeleton() {
  return (
    <div
      className="mb-8 grid grid-cols-1 gap-8"
      role="status"
      aria-label="Loading agent listings"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 rounded-xl border border-[#fea3b1] p-4 lg:flex-row"
          role="status"
          aria-label={`Loading listing ${index + 1}`}
        >
          {/* Image skeleton */}
          <div className="min-w-[256px] p-0">
            <Skeleton
              variant="shimmer"
              className="relative min-h-[202px] min-w-[256px] rounded-2xl"
              aria-label="Loading property image"
            />
          </div>

          {/* Content skeleton */}
          <div className="flex flex-col justify-between px-4 pb-4 lg:p-0">
            <div>
              {/* Title skeleton */}
              <Skeleton
                variant="text"
                size="lg"
                className="mb-3 w-full"
                aria-label="Loading property title"
              />

              {/* Price skeleton */}
              <div className="mb-3 flex items-center gap-2 pt-3">
                <Skeleton
                  variant="text"
                  className="bg-brand-accent/20 h-5 w-24"
                />
                <Skeleton variant="light" className="h-4 w-16" />
              </div>

              {/* Description skeleton */}
              <div className="mb-3 pt-3">
                <Skeleton
                  variant="light"
                  size="default"
                  className="mb-2 w-full"
                />
                <Skeleton variant="light" size="default" className="w-3/4" />
              </div>

              {/* Property details skeleton */}
              <div className="flex items-center gap-1 pt-2">
                <Skeleton variant="light" className="h-4 w-16" />
                <Skeleton
                  variant="light"
                  className="bg-brand-accent/20 h-3 w-3 rounded-full"
                />
                <Skeleton variant="light" className="h-4 w-20" />
                <Skeleton
                  variant="light"
                  className="bg-brand-accent/20 h-3 w-3 rounded-full"
                />
                <Skeleton variant="light" className="h-4 w-24" />
              </div>
            </div>

            {/* Footer skeleton */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton variant="card" className="h-11 w-11 rounded-full" />
                <Skeleton variant="light" className="h-4 w-20" />
              </div>
              <Skeleton
                variant="light"
                className="bg-brand-primary/20 h-9 w-32 rounded"
              />
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">
        Loading agent property listings, please wait...
      </span>
    </div>
  );
}
