import Shell from "@/layouts/shell";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ListingLoading() {
  return (
    <main>
      <Shell>
        <div className="mb-3 space-y-3">
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
      <div className="lg:bg-brand-secondary relative flex h-[280px] w-full justify-center overflow-hidden border-b border-orange-400 lg:max-h-[400px] lg:min-h-[400px]">
        <div className="w-full max-w-xl lg:max-h-[400px] lg:min-h-[400px]">
          <div className="h-[280px] w-full lg:max-h-[400px] lg:min-h-[400px]">
            {/* Card skeleton matching exact Card dimensions */}
            <div className="relative flex h-[280px] w-full items-center justify-center rounded-none border-0 p-0 py-0 shadow-none lg:max-h-[400px] lg:min-h-[400px]">
              <Skeleton className="h-full w-full rounded-none" />
            </div>
          </div>

          {/* Carousel navigation badge skeleton - exact positioning */}
          <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2">
            <div className="rounded border-0 bg-black/70 px-3 py-1 text-white">
              <Skeleton className="h-4 w-16 rounded-sm bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      <Shell>
        <div className="text-brand-accent mt-4 grid w-full grid-cols-1 md:grid-cols-[2fr,1fr] lg:gap-8 lg:px-0">
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
              <div className="flex flex-wrap items-center gap-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>

            {/* Property badges skeleton */}
            <div className="mb-6 flex items-center gap-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-48" />
            </div>

            {/* Property details skeleton */}
            <Card className="mb-6 p-6">
              <Skeleton className="mb-4 h-6 w-32" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {Array.from({ length: 9 }, (_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Description skeleton */}
            <div className="mb-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Amenities skeleton */}
            <div className="mb-6 space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {Array.from({ length: 6 }, (_, i) => (
                  <Skeleton key={i} className="h-6 w-32" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="space-y-6">
            <Card className="p-6">
              <Skeleton className="mb-4 h-6 w-32" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>

            <Card className="p-6">
              <Skeleton className="mb-4 h-6 w-32" />
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
          <Skeleton className="mb-6 h-6 w-48" />
          <Card className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
          <div className="space-y-6 text-center">
            <Skeleton className="mx-auto h-8 w-64" />
            <Skeleton className="mx-auto h-4 w-96" />
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
      <div className="mb-6 pt-14 md:pt-20">
        <Shell>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <div className="space-y-3 p-4">
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
