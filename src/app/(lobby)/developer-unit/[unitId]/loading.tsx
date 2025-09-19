import { Skeleton } from "@/components/ui/skeleton";
import Shell from "@/layouts/shell";

export default function DeveloperUnitLoading() {
  return (
    <main>
      <Shell>
        <div className="mb-3 space-y-3">
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
      <section className="border-brand-badge-ongoing h-[200px] border-b bg-black md:h-[400px] lg:h-[500px]">
        <div className="relative h-full w-full bg-gray-900">
          <Skeleton className="h-full w-full bg-gray-800" />
          {/* Carousel Controls */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 transform gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-2 w-2 rounded-full bg-gray-600" />
            ))}
          </div>
        </div>
      </section>

      <Shell>
        <div className="text-brand-accent mt-4 grid w-full grid-cols-1 lg:grid-cols-[2fr_1fr] lg:gap-8 lg:px-0">
          <div>
            {/* Price and Badges Section */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Skeleton className="h-8 w-48 md:h-10 md:w-64" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />{" "}
                {/* Favorite button */}
              </div>
            </div>

            {/* Property Features */}
            <div className="flex flex-wrap items-center gap-2 py-3 sm:gap-4">
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
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-full sm:w-48" />
            </div>

            {/* Trending Banner Skeleton */}
            <div className="mb-6">
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 md:p-6">
                <div className="flex items-center gap-4 md:gap-6">
                  <Skeleton className="h-12 w-12 flex-shrink-0 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-5 w-full max-w-64" />
                    <div className="flex flex-wrap items-center gap-2">
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
            <div className="pt-14 pb-10 md:pt-20 md:pb-0">
              <Skeleton className="mb-6 h-8 w-32" />
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 md:p-6">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="mt-4 flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="mb-1 h-3 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </div>

            {/* Explore More Section */}
            <div className="pt-14 md:pt-20">
              <Skeleton className="mb-6 h-8 w-40" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
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
              <Skeleton className="mb-6 h-8 w-40" />
              <div className="space-y-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b border-gray-100 py-3"
                  >
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Section */}
            <div className="pt-14 md:pt-20">
              <Skeleton className="mb-6 h-8 w-32" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
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
              <Skeleton className="mb-6 h-8 w-36" />
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="aspect-square rounded-lg" />
              </div>
            </div>

            {/* Property Insight Section */}
            <div className="pt-14 md:pt-20">
              <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-3 rounded-lg border p-4">
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
          <aside className="sticky top-4 hidden lg:block">
            <div className="space-y-4 rounded-lg border p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="mb-2 h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="space-y-3">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="border-t pt-4">
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
          <Skeleton className="mb-6 h-8 w-48" />
          <div className="space-y-6 rounded-lg border p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
      <div className="bg-gray-50 pt-14 md:pt-20">
        <Shell>
          <div className="space-y-6 py-12 text-center">
            <Skeleton className="mx-auto h-12 w-12 rounded-full" />
            <Skeleton className="mx-auto h-8 w-64" />
            <Skeleton className="mx-auto h-4 w-96" />
            <div className="flex justify-center gap-4 pt-6">
              <Skeleton className="h-10 w-32 rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>
        </Shell>
      </div>

      {/* Similar Units Section */}
      <div className="pt-14 md:pt-20 lg:pt-24">
        <div className="lg:mx-auto lg:max-w-7xl">
          <div className="mb-8 px-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
          <div className="px-4">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
