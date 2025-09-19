export function UnitsSearchSkeleton() {
  return (
    <div className="space-y-8">
      {/* Results Grid Skeleton - matches actual layout */}
      <div className="grid grid-cols-1 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="text-brand-accent flex flex-col gap-4 rounded-lg shadow-none md:flex-row md:border md:border-gray-200 md:p-4"
          >
            {/* Image Container - matches CardHeader */}
            <div className="relative min-w-[256px] p-0 sm:min-w-[300px]">
              <div className="relative min-h-[202px] min-w-[256px] overflow-hidden rounded-lg sm:min-h-[225px] sm:min-w-[300px]">
                {/* Image Skeleton */}
                <div className="aspect-[4/3] animate-pulse rounded-lg bg-gray-100" />

                {/* Contract Badge placeholder */}
                <div className="absolute top-4 left-4">
                  <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
                </div>

                {/* Featured badge placeholder for some cards */}
                {i % 3 === 0 && (
                  <div className="absolute top-4 right-4">
                    <div className="h-6 w-16 animate-pulse rounded bg-gray-300" />
                  </div>
                )}

                {/* Photo count badge placeholder */}
                <div className="absolute right-3 bottom-3">
                  <div className="h-6 w-8 animate-pulse rounded bg-gray-400" />
                </div>
              </div>
            </div>

            {/* Content Container - matches CardContent */}
            <div className="flex flex-1 flex-col justify-between px-4 pb-4 md:p-0">
              <div>
                {/* Price Section */}
                <div className="mb-2 flex h-fit items-baseline gap-2">
                  <div className="h-6 w-32 animate-pulse rounded bg-gray-300 sm:h-8" />
                </div>

                {/* Title */}
                <div className="mb-2 space-y-1">
                  <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200 sm:h-5" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 sm:h-5" />
                </div>

                {/* Location */}
                <div className="mb-2 pt-2 sm:pt-3">
                  <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200" />
                </div>

                {/* Property Details */}
                <div className="flex items-center gap-2 pt-2 sm:pt-3">
                  <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
                  <div className="h-2 w-2 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
                  <div className="h-2 w-2 animate-pulse rounded-full bg-gray-200" />
                  <div className="h-3 w-10 animate-pulse rounded bg-gray-200" />
                </div>
              </div>

              {/* Footer - matches CardFooter */}
              <div className="mt-4 flex items-center justify-between">
                {/* Developer Info */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {/* Avatar */}
                  <div className="h-10 w-10 flex-shrink-0 animate-pulse rounded-full bg-gray-200" />

                  {/* Developer details */}
                  <div className="flex min-w-0 flex-1 flex-col space-y-1">
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                    <div className="h-2 w-16 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 animate-pulse rounded bg-gray-200" />
                  <div className="h-8 w-28 animate-pulse rounded bg-gray-200 sm:w-32" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
