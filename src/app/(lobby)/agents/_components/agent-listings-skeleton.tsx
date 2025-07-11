export function AgentListingsSkeleton() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-8">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-4 rounded-xl border border-[#fea3b1] p-4 lg:flex-row"
        >
          {/* Image skeleton */}
          <div className="min-w-[256px] p-0">
            <div className="relative min-h-[202px] min-w-[256px] rounded-2xl bg-gray-200 animate-pulse"></div>
          </div>

          {/* Content skeleton */}
          <div className="flex flex-col justify-between px-4 pb-4 lg:p-0">
            <div>
              {/* Title skeleton */}
              <div className="h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>

              {/* Price skeleton */}
              <div className="flex items-center gap-2 pt-3 mb-3">
                <div className="h-5 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>

              {/* Description skeleton */}
              <div className="pt-3 mb-3">
                <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>

              {/* Property details skeleton */}
              <div className="flex items-center gap-1 pt-2">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>

            {/* Footer skeleton */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-11 w-11 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              <div className="h-9 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
