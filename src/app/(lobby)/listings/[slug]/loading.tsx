import Shell from "@/layouts/shell";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ListingLoading() {
  return (
    <main>
      <Shell>
        <div className="space-y-3 mb-3">
          {/* Breadcrumbs skeleton */}
          <div className="flex items-center gap-2 pt-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
          {/* Title skeleton */}
          <Skeleton className="h-8 w-3/4" />
        </div>
      </Shell>

      {/* Image carousel skeleton - matches DynamicCarousel exact dimensions */}
      <div className="flex justify-center border-b border-orange-400 lg:bg-brand-secondary relative h-[280px] w-full overflow-hidden lg:max-h-[400px] lg:min-h-[400px]">
        <div className="w-full max-w-xl lg:max-h-[400px] lg:min-h-[400px]">
          <div className="h-[280px] w-full lg:max-h-[400px] lg:min-h-[400px]">
            {/* Card skeleton matching exact Card dimensions */}
            <div className="h-[280px] w-full rounded-none border-0 py-0 shadow-none lg:max-h-[400px] lg:min-h-[400px] flex items-center justify-center p-0 relative">
              <Skeleton className="h-full w-full rounded-none" />
            </div>
          </div>
          
          {/* Carousel navigation badge skeleton - exact positioning */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
            <div className="bg-black/70 text-white border-0 px-3 py-1 rounded">
              <Skeleton className="h-4 w-16 bg-white/20 rounded-sm" />
            </div>
          </div>
        </div>
      </div>

      <Shell>
        <div className="grid grid-cols-1 text-brand-accent w-full mt-4 md:grid-cols-[2fr,1fr] lg:gap-8 lg:px-0">
          <div>
            {/* Price and badges skeleton */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-48" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>

            {/* Property features skeleton */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex items-center gap-4 flex-wrap">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>

            {/* Property badges skeleton */}
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-48" />
            </div>

            {/* Property details skeleton */}
            <Card className="p-6 mb-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 9 }, (_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Description skeleton */}
            <div className="space-y-4 mb-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Amenities skeleton */}
            <div className="space-y-4 mb-6">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }, (_, i) => (
                  <Skeleton key={i} className="h-6 w-32" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-6">
            <Card className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>

            <Card className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </Card>
          </div>
        </div>
      </Shell>

      {/* Mortgage calculator skeleton (for sale properties) */}
      <Shell>
        <div className="pt-14 md:pt-20">
          <Skeleton className="h-6 w-48 mb-6" />
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-2">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Shell>

      {/* Contact section skeleton */}
      <div className="bg-muted/50 py-14 md:py-20">
        <Shell>
          <div className="text-center space-y-6">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
            <div className="flex items-center justify-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </Shell>
      </div>

      {/* Similar properties skeleton */}
      <div className="pt-14 md:pt-20 mb-6">
        <Shell>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Shell>
      </div>
    </main>
  );
}
