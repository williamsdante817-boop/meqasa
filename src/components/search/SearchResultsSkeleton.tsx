import { Skeleton } from "@/components/ui/skeleton";

export default function SearchResultsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:gap-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="text-brand-accent md:border-brand-border flex flex-col gap-4 rounded-lg py-0 shadow-none md:flex-row md:border md:p-4"
            role="status"
            aria-label={`Loading unit ${i + 1}`}
          >
            {/* Image skeleton - matches CardHeader */}
            <div className="relative min-w-[256px] p-0 sm:min-w-[300px]">
              <div className="relative min-h-[202px] min-w-[256px] overflow-hidden rounded-lg sm:min-h-[225px] sm:min-w-[300px]">
                <Skeleton className="h-[202px] w-full rounded-lg sm:h-[225px]" />
                
                {/* Contract badge */}
                <div className="absolute top-4 left-4 z-30">
                  <Skeleton className="bg-brand-accent/20 h-6 w-20 rounded-sm" />
                </div>
                
                {/* Photo count badge */}
                <div className="absolute right-3 bottom-3 z-30">
                  <Skeleton className="h-6 w-12 rounded-md bg-black/20" />
                </div>
              </div>
            </div>

            {/* Content skeleton - matches CardContent */}
            <div className="flex flex-1 flex-col justify-between px-4 pb-4 md:p-0">
              <div>
                {/* Title */}
                <Skeleton className="h-5 w-4/5 bg-gray-200 sm:h-6" />
                
                {/* Price */}
                <div className="flex items-baseline gap-2 pt-2 sm:pt-3">
                  <Skeleton className="h-6 w-24 bg-gray-200 sm:h-7 sm:w-32" />
                  <Skeleton className="h-4 w-12 bg-gray-200" />
                </div>
                
                {/* Description */}
                <div className="pt-2 sm:pt-3">
                  <Skeleton className="h-4 w-full bg-gray-200" />
                  <Skeleton className="mt-1 h-4 w-3/4 bg-gray-200" />
                </div>
                
                {/* Property details */}
                <div className="flex items-center gap-1 pt-2 sm:pt-3">
                  <Skeleton className="h-4 w-12 bg-gray-200" />
                  <Skeleton className="h-3 w-3 rounded-full bg-gray-200" />
                  <Skeleton className="h-4 w-14 bg-gray-200" />
                  <Skeleton className="h-3 w-3 rounded-full bg-gray-200" />
                  <Skeleton className="h-4 w-16 bg-gray-200" />
                </div>
              </div>

              {/* Footer - matches CardFooter */}
              <div className="mt-4 flex items-center justify-between p-0">
                {/* Developer info */}
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-20 bg-gray-200" />
                    <Skeleton className="h-3 w-24 bg-gray-200" />
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-9 rounded-md bg-gray-200" />
                  <Skeleton className="h-9 w-28 rounded-md bg-gray-200 sm:w-32" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
