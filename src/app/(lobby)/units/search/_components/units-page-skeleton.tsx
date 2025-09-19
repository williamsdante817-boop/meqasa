import { UnitsSearchSkeleton } from "./units-search-skeleton";

export function UnitsPageSkeleton() {
  return (
    <div className="mt-8 grid w-full grid-cols-1 gap-8 md:px-0 lg:grid-cols-[minmax(0,736px)_1fr]">
      {/* Main Content Column */}
      <div>
        {/* Streaming Banner Skeleton */}
        <div className="mb-8 h-24 animate-pulse rounded-lg bg-gray-100" />

        {/* Search Results Skeleton */}
        <UnitsSearchSkeleton />
      </div>

      {/* Aside Content */}
      <aside>
        {/* Reference Search Skeleton */}
        <div className="mb-4 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-green-50 p-4">
          <div className="space-y-2">
            {/* Label */}
            <div className="mb-2 flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded bg-blue-200" />
              <div className="h-4 w-32 animate-pulse rounded bg-blue-200" />
            </div>
            {/* Input and button */}
            <div className="flex gap-2">
              <div className="h-10 flex-1 animate-pulse rounded border bg-white" />
              <div className="h-10 w-16 animate-pulse rounded bg-blue-200" />
            </div>
          </div>
        </div>

        {/* Location Links Skeleton */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="p-4">
            <div className="mb-3 h-4 w-64 animate-pulse rounded bg-gray-200" />
            <div className="space-y-1">
              {Array.from({ length: 11 }).map((_, i) => {
                // Use deterministic widths based on index to avoid hydration mismatch
                const widths = [85, 92, 78, 95, 73, 88, 82, 90, 76, 84, 87];
                const width = widths[i] || 80;
                return (
                  <div
                    key={i}
                    className="h-4 animate-pulse rounded bg-gray-100"
                    style={{ width: `${width}%` }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
