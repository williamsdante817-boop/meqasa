import { Skeleton } from "@/components/ui/skeleton";
import Shell from "@/layouts/shell";

export default function DeveloperUnitLoading() {
  return (
    <main>
      <Shell>
        <div className="space-y-3 mb-3">
          {/* Breadcrumbs Skeleton */}
          <div className="flex items-center gap-2 pt-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          {/* Page Title */}
          <Skeleton className="h-8 w-3/4 md:h-10" />
        </div>
      </Shell>

      {/* Image Carousel Skeleton */}
      <section className="border-b border-brand-badge-ongoing bg-black h-[200px] md:h-[400px] lg:h-[500px]">
        <div className="relative w-full h-full bg-gray-900">
          <Skeleton className="w-full h-full bg-gray-800" />
          {/* Carousel Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-2 h-2 rounded-full bg-gray-600" />
            ))}
          </div>
        </div>
      </section>

      <Shell>
        <div className="grid grid-cols-1 text-brand-accent w-full mt-4 lg:grid-cols-[2fr_1fr] lg:gap-8 lg:px-0">
          <div>
            {/* Price and Badges Section */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Skeleton className="h-8 w-48 md:h-10 md:w-64" />
              <div className="flex gap-2 flex-wrap">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" /> {/* Favorite button */}
              </div>
            </div>

            {/* Property Features */}
            <div className="flex items-center gap-2 sm:gap-4 py-3 flex-wrap">
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-14" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>

            {/* Property Status Badges */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-32 sm:w-48 rounded-full" />
            </div>

            {/* Trending Banner Skeleton */}
            <div className="mb-6">
              <div className="border border-orange-200 bg-orange-50 rounded-lg p-4 md:p-6">
                <div className="flex items-center gap-4 md:gap-6">
                  <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-5 w-full max-w-64" />
                    <div className="flex items-center gap-2 flex-wrap">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-1 rounded-full" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Safety Tips Card */}
            <div className="mb-6">
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>

            {/* Description Section */}
            <div className="pt-14 md:pt-20 pb-10 md:pb-0">
              <Skeleton className="h-8 w-32 mb-6" />
              <div className="bg-gray-50 rounded-lg p-4 md:p-6 border border-gray-200">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="mt-4 flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-3 w-20 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </div>

            {/* Explore More Section */}
            <div className="pt-14 md:pt-20">
              <Skeleton className="h-8 w-40 mb-6" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            </div>

            {/* Property Favorites Banner */}
            <div className="pt-14 md:pt-20">
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>

            {/* Project Video Section */}
            <div className="pt-14 md:pt-20">
              <Skeleton className="aspect-video w-full rounded-lg" />
            </div>

            {/* Project Details Section */}
            <div className="pt-14 md:pt-20">
              <Skeleton className="h-8 w-40 mb-6" />
              <div className="space-y-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Section */}
            <div className="pt-14 md:pt-20">
              <Skeleton className="h-8 w-32 mb-6" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2 p-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>

            {/* Property Plan Section */}
            <div className="pt-14 md:pt-20">
              <Skeleton className="h-8 w-36 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="aspect-square rounded-lg" />
              </div>
            </div>

            {/* Property Insight Section */}
            <div className="pt-14 md:pt-20">
              <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-4 border rounded-lg space-y-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Card Sidebar - Desktop Only */}
          <aside className="hidden lg:block sticky top-4">
            <div className="border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Shell>

      {/* Mortgage Calculator Section - Only for Sale Properties */}
      <Shell>
        <div className="pt-14 md:pt-20">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="border rounded-lg p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="pt-4">
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </Shell>

      {/* Contact Section */}
      <div className="pt-14 md:pt-20 bg-gray-50">
        <Shell>
          <div className="py-12 text-center space-y-6">
            <Skeleton className="h-12 w-12 rounded-full mx-auto" />
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
            <div className="flex justify-center gap-4 pt-6">
              <Skeleton className="h-10 w-32 rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>
        </Shell>
      </div>

      {/* Similar Units Section */}
      <div className="pt-14 md:pt-20 lg:pt-24">
        <div className="lg:max-w-7xl lg:mx-auto">
          <div className="px-4 mb-8">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
          <div className="px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
