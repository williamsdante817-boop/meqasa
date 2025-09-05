import { Skeleton } from "@/components/ui/skeleton";
import Shell from "@/layouts/shell";

// Premium Plus Card Skeleton Component
function PremiumPlusCardSkeleton() {
  return (
    <div className="h-full w-full overflow-hidden rounded-lg border border-gray-200 bg-white p-0">
      {/* Image skeleton */}
      <div className="relative w-full min-h-[200px] sm:min-h-[230px] md:min-h-[260px]">
        <Skeleton className="h-[200px] sm:h-[230px] md:h-[260px] w-full rounded-t-lg animate-pulse" />
        
        {/* Premium Plus Badge skeleton */}
        <div className="absolute left-3 top-3 z-30">
          <Skeleton className="h-6 w-24 rounded-md bg-brand-primary/20" />
        </div>
        
        {/* Favorite button skeleton */}
        <div className="absolute right-3 top-3 z-30">
          <Skeleton className="h-10 w-10 rounded-full bg-white/80" />
        </div>
        
        {/* Photo count skeleton */}
        <div className="absolute bottom-3 right-3 z-30">
          <Skeleton className="h-6 w-16 rounded-md bg-black/20" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="flex flex-col flex-1 p-4 space-y-3">
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
      <div className="flex items-center justify-between p-4 border-t border-gray-100">
        {/* Agent info skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full bg-gray-200" />
        </div>
        
        {/* Action buttons skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-md bg-gray-200" />
          <Skeleton className="h-9 w-24 sm:w-32 rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

// Featured Property Variant Card Skeleton Component
function FeaturedPropertyVariantSkeleton() {
  return (
    <div className="relative h-full overflow-hidden w-full rounded-lg p-0 gap-0 flex flex-col border border-gray-200 bg-white">
      {/* Image skeleton with aspect ratio */}
       <div className="relative w-full min-h-[200px] sm:min-h-[230px] md:min-h-[260px]">
        <Skeleton className="h-[200px] sm:h-[230px] md:h-[260px] w-full rounded-t-lg animate-pulse" />
        
        {/* Premium Plus Badge skeleton */}
        <div className="absolute left-3 bottom-3 z-30">
          <Skeleton className="h-6 w-24 rounded-md bg-brand-primary/20" />
        </div>
        
        {/* Photo count skeleton */}
        <div className="absolute bottom-3 right-3 z-30">
          <Skeleton className="h-18 w-18 rounded-md bg-black/20" />
        </div>
      </div>
    </div>
  );
}

// Carousel Plugin Skeleton Component
function CarouselPluginSkeleton() {
  return (
    <div className="w-full mb-6 sm:mb-8">
      {/* Carousel header skeleton */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <Skeleton className="h-6 w-48 mb-1 bg-gray-200" />
        </div>
        
        {/* Desktop counter skeleton */}
        <div className="hidden md:flex items-center gap-2">
          <Skeleton className="h-4 w-16 bg-gray-200" />
          <Skeleton className="h-1 w-16 rounded-full bg-gray-200" />
        </div>
        
        {/* Mobile indicators skeleton */}
        <div className="flex items-center gap-1 md:hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-2 w-2 rounded-full bg-gray-200" />
          ))}
        </div>
      </div>

      {/* Carousel content skeleton */}
      <div className="relative">
        <div className="flex gap-2 md:gap-4 overflow-hidden">
          {/* Desktop: Show one full card + peek of next */}
          <div className="w-full md:w-[calc(100%-120px)] lg:w-[calc(100%-150px)] xl:w-[calc(100%-200px)] flex-shrink-0">
            <PremiumPlusCardSkeleton />
          </div>
          
          {/* Peek of next card on desktop */}
          <div className="hidden md:block w-[120px] lg:w-[150px] xl:w-[200px] flex-shrink-0">
            <div className="h-full overflow-hidden">
              <PremiumPlusCardSkeleton />
            </div>
          </div>
        </div>
        
        {/* Navigation buttons skeleton */}
        <div className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 hidden md:block">
          <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white/90" />
        </div>
       
      </div>

      {/* Mobile progress indicator skeleton */}
      <div className="flex justify-center mt-4 md:hidden">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-32 bg-gray-200" />
          <Skeleton className="h-1 w-12 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

// Export individual skeleton components for granular use
export { PremiumPlusCardSkeleton, FeaturedPropertyVariantSkeleton, CarouselPluginSkeleton };

export default function SearchResultsSkeleton() {
  return (
    <Shell className="mt-8 flex gap-8 px-0">
      <div className="w-full">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,300px] md:px-0">
          {/* Main results area */}
          <div className="w-full pb-8">
            <div className="grid grid-cols-1 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-4 rounded-lg border border-gray-100 md:flex-row md:p-4 w-full bg-white"
                    role="status"
                    aria-label={`Loading property ${i + 1}`}
                  >
                    {/* Property image skeleton */}
                    <div className="w-full md:min-w-[280px] md:w-[280px] p-0 relative">
                      <div className="relative w-full pb-[60%] md:pb-[65%] overflow-hidden rounded-lg">
                        <Skeleton 
                          variant="shimmer" 
                          className="absolute inset-0 rounded-lg h-[256px]" 
                          aria-label="Loading property image"
                        />
                        
                        {/* Contract type badge */}
                        <div className="absolute top-2 left-2">
                          <Skeleton className="h-6 w-16 rounded-sm bg-brand-accent/20" />
                        </div>
                        
                        {/* Favorite button */}
                        <div className="absolute top-2 right-2">
                          <Skeleton className="h-10 w-10 rounded-full bg-white/80" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Property details skeleton */}
                    <div className="flex-1 flex flex-col justify-between px-4 pb-4 md:p-0 space-y-3">
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
                        className="w-1/2 text-brand-accent" 
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
                        <Skeleton variant="light" className="h-3 w-3 rounded-full" />
                        <Skeleton variant="light" className="h-4 w-8" />
                        <Skeleton variant="light" className="h-3 w-3 rounded-full" />
                        <Skeleton variant="light" className="h-4 w-16" />
                      </div>
                      
                      {/* Agent info */}
                      <div className="flex items-center gap-3 mt-4">
                        <Skeleton variant="light" className="h-12 w-12 rounded-full" />
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
