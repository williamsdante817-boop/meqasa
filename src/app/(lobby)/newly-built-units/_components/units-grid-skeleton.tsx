interface UnitsGridSkeletonProps {
  count?: number;
}

export function UnitsGridSkeleton({ count = 3 }: UnitsGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <article key={i} className="group">
          <div className="min-h-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
            {/* Image Container - exactly matches aspect-[4/3] */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <div className="absolute inset-0 animate-pulse bg-gray-100" />
              {/* Badge placeholder */}
              <div className="absolute top-3 left-3">
                <div className="h-6 w-16 animate-pulse rounded bg-gray-200 px-2.5 py-1" />
              </div>
            </div>
            {/* Content - exactly matches p-4 with title */}
            <div className="p-4">
              {/* Matches line-clamp-2 text-sm with leading-snug */}
              <div className="space-y-1">
                <div className="h-4 w-4/5 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
