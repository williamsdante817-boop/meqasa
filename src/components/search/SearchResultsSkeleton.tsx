import { Skeleton } from "@/components/ui/skeleton";
import Shell from "@/layouts/shell";

// Premium Plus Card Skeleton Component
function PremiumPlusCardSkeleton() {
  return (
    <div className="h-full w-full overflow-hidden rounded-lg border border-gray-200 bg-white p-0">
      {/* Image skeleton */}
      <div className="relative min-h-[200px] w-full sm:min-h-[230px] md:min-h-[260px]">
        <Skeleton className="h-[200px] w-full animate-pulse rounded-t-lg sm:h-[230px] md:h-[260px]" />

        {/* Premium Plus Badge skeleton */}
        <div className="absolute top-3 left-3 z-30">
          <Skeleton className="bg-brand-primary/20 h-6 w-24 rounded-md" />
        </div>

        {/* Favorite button skeleton */}
        <div className="absolute top-3 right-3 z-30">
          <Skeleton className="h-10 w-10 rounded-full bg-white/80" />
        </div>

        {/* Photo count skeleton */}
        <div className="absolute right-3 bottom-3 z-30">
          <Skeleton className="h-6 w-16 rounded-md bg-black/20" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="flex flex-1 flex-col space-y-3 p-4">
        {/* Title skeleton */}
        <Skeleton className="h-5 w-4/5 bg-gray-200" />

        {/* Property details skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-12 bg-gray-200" />
          <Skeleton className="h-3 w-3 rounded-full bg-gray-200" />
          <Skeleton className="h-4 w-14 bg-gray-200" />
          <Skeleton className="h-3 w-3 rounded-full bg-gray-200" />
          <Skeleton className="h-4 w-16 bg-gray-200" />
        </div>

        {/* Price skeleton */}
        <Skeleton className="h-6 w-1/2 bg-gray-200" />
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-between border-t border-gray-100 p-4">
        {/* Agent info skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full bg-gray-200" />
        </div>

        {/* Action buttons skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-md bg-gray-200" />
          <Skeleton className="h-9 w-24 rounded-md bg-gray-200 sm:w-32" />
        </div>
      </div>
    </div>
  );
}

// Featured Property Variant Card Skeleton Component
function FeaturedPropertyVariantSkeleton() {
  return (
    <div className="relative flex h-full w-full flex-col gap-0 overflow-hidden rounded-lg border border-gray-200 bg-white p-0">
      {/* Image skeleton with aspect ratio */}
      <div className="relative min-h-[200px] w-full sm:min-h-[230px] md:min-h-[260px]">
        <Skeleton className="h-[200px] w-full animate-pulse rounded-t-lg sm:h-[230px] md:h-[260px]" />

        {/* Premium Plus Badge skeleton */}
        <div className="absolute bottom-3 left-3 z-30">
          <Skeleton className="bg-brand-primary/20 h-6 w-24 rounded-md" />
        </div>

        {/* Photo count skeleton */}
        <div className="absolute right-3 bottom-3 z-30">
          <Skeleton className="h-18 w-18 rounded-md bg-black/20" />
        </div>
      </div>
    </div>
  );
}

// Carousel Plugin Skeleton Component
function CarouselPluginSkeleton() {
  return (
    <div className="mb-6 w-full sm:mb-8">
      {/* Carousel header skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Skeleton className="mb-1 h-6 w-48 bg-gray-200" />
        </div>

        {/* Desktop counter skeleton */}
        <div className="hidden items-center gap-2 md:flex">
          <Skeleton className="h-4 w-16 bg-gray-200" />
          <Skeleton className="h-1 w-16 rounded-full bg-gray-200" />
        </div>

        {/* Mobile indicators skeleton */}
        <div className="flex items-center gap-1 md:hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-2 w-2 rounded-full bg-gray-200"
            />
          ))}
        </div>
      </div>

      {/* Carousel content skeleton */}
      <div className="relative">
        <div className="flex gap-2 overflow-hidden md:gap-4">
          {/* Desktop: Show one full card + peek of next */}
          <div className="w-full flex-shrink-0 md:w-[calc(100%-120px)] lg:w-[calc(100%-150px)] xl:w-[calc(100%-200px)]">
            <PremiumPlusCardSkeleton />
          </div>

          {/* Peek of next card on desktop */}
          <div className="hidden w-[120px] flex-shrink-0 md:block lg:w-[150px] xl:w-[200px]">
            <div className="h-full overflow-hidden">
              <PremiumPlusCardSkeleton />
            </div>
          </div>
        </div>

        {/* Navigation buttons skeleton */}
        <div className="absolute top-1/2 left-2 hidden -translate-y-1/2 md:left-4 md:block">
          <Skeleton className="h-10 w-10 rounded-full bg-white/90 md:h-12 md:w-12" />
        </div>
      </div>

      {/* Mobile progress indicator skeleton */}
      <div className="mt-4 flex justify-center md:hidden">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-32 bg-gray-200" />
          <Skeleton className="h-1 w-12 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

// Export individual skeleton components for granular use
export {
  PremiumPlusCardSkeleton,
  FeaturedPropertyVariantSkeleton,
  CarouselPluginSkeleton,
};

export default function SearchResultsSkeleton() {
  return (
    <Shell className="mt-8 flex gap-8 px-0">
      <div className="w-full">
        <div className="grid grid-cols-1 gap-8 md:px-0 lg:grid-cols-[1fr,300px]">
          {/* Main results area */}
          <div className="w-full pb-8">
            <div className="grid grid-cols-1 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex w-full flex-col gap-4 rounded-lg border border-gray-100 bg-white md:flex-row md:p-4"
                  role="status"
                  aria-label={`Loading property ${i + 1}`}
                >
                  {/* Property image skeleton */}
                  <div className="relative w-full p-0 md:w-[280px] md:min-w-[280px]">
                    <div className="relative w-full overflow-hidden rounded-lg pb-[60%] md:pb-[65%]">
                      <Skeleton
                        variant="shimmer"
                        className="absolute inset-0 h-[256px] rounded-lg"
                        aria-label="Loading property image"
                      />

                      {/* Contract type badge */}
                      <div className="absolute top-2 left-2">
                        <Skeleton className="bg-brand-accent/20 h-6 w-16 rounded-sm" />
                      </div>

                      {/* Favorite button */}
                      <div className="absolute top-2 right-2">
                        <Skeleton className="h-10 w-10 rounded-full bg-white/80" />
                      </div>
                    </div>
                  </div>

                  {/* Property details skeleton */}
                  <div className="flex flex-1 flex-col justify-between space-y-3 px-4 pb-4 md:p-0">
                    {/* Title */}
                    <Skeleton
                      variant="text"
                      size="lg"
                      className="w-4/5"
                      aria-label="Loading property title"
                    />

                    {/* Price */}
                    <Skeleton
                      variant="text"
                      size="xl"
                      className="text-brand-accent w-1/2"
                      aria-label="Loading property price"
                    />

                    {/* Location */}
                    <Skeleton
                      variant="light"
                      size="default"
                      className="w-2/3"
                      aria-label="Loading property location"
                    />

                    {/* Features */}
                    <div className="flex items-center gap-2">
                      <Skeleton variant="light" className="h-4 w-8" />
                      <Skeleton
                        variant="light"
                        className="h-3 w-3 rounded-full"
                      />
                      <Skeleton variant="light" className="h-4 w-8" />
                      <Skeleton
                        variant="light"
                        className="h-3 w-3 rounded-full"
                      />
                      <Skeleton variant="light" className="h-4 w-16" />
                    </div>

                    {/* Agent info */}
                    <div className="mt-4 flex items-center gap-3">
                      <Skeleton
                        variant="light"
                        className="h-12 w-12 rounded-full"
                      />
                      <div className="space-y-1">
                        <Skeleton variant="light" className="h-4 w-24" />
                        <Skeleton variant="light" className="h-3 w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
