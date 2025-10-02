/**
 * Loading skeleton for featured properties aside
 * Matches the exact layout and spacing of the actual component
 */
export default function FeaturedPropertiesAsideSkeleton() {
  return (
    <>
      {/* Navigation header skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <div className="h-5 w-40 animate-pulse rounded bg-gray-200" />
        <div className="flex gap-1">
          <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      <div className="space-y-4" aria-label="Loading featured properties">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="flex overflow-hidden rounded-lg border border-gray-100 bg-white p-2"
          >
            {/* Image skeleton - Left Side */}
            <div className="relative h-24 w-28 flex-shrink-0 animate-pulse rounded-md bg-gray-200" />

            {/* Content skeleton - Right Side */}
            <div className="flex flex-1 flex-col justify-between pl-2">
              <div className="space-y-1">
                {/* Title skeleton - one line */}
                <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200" />
                {/* Location skeleton - one line */}
                <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200" />
                {/* Description skeleton - two lines */}
                <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200" />
              </div>

              {/* Amenities skeleton */}
              <div className="mt-2 flex items-center gap-2">
                <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-12 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
