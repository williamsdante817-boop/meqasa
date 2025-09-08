import { Skeleton } from "@/components/ui/skeleton";
import Shell from "@/layouts/shell";

export default function Loading() {
  return (
    <main role="main" aria-label="Loading developer profile">
      {/* Hero Section Skeleton */}
      <div className="relative w-full min-h-[200px] h-[300px] sm:min-h-[250px] sm:h-[350px] md:min-h-[400px] md:h-[50vh] md:max-h-[600px] overflow-hidden flex">
        {/* Background Image Skeleton */}
        <Skeleton className="w-full h-full bg-gray-300" />

        <Shell>
          {/* Content Container - matching exact structure */}
          <div
            className="absolute bottom-0 left-0 w-full h-48 sm:h-56 md:h-64 bg-gradient-to-t from-black/95 to-transparent"
            aria-hidden="true"
          />
          <div className="absolute bottom-4 md:pb-4 z-10 px-0 flex flex-col sm:flex-row items-start sm:items-end h-fit gap-4 sm:gap-6">
            {/* Company Logo Card Skeleton - Conditionally shown, hidden on mobile */}
            <div className="bg-white/90 backdrop-blur-sm rounded-md p-2 min-w-[120px] min-h-[120px] sm:min-w-[140px] sm:min-h-[140px] md:min-w-[160px] md:min-h-[160px] w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] md:flex items-center justify-center shadow-lg hidden">
              <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded" />
            </div>

            {/* Company Info Skeleton */}
            <div className="text-white drop-shadow-lg">
              {/* Company name - h1 with proper text sizing */}
              <Skeleton className="h-8 sm:h-9 md:h-10 w-48 sm:w-56 md:w-64 mb-2 sm:mb-3 bg-white/20 rounded" />

              {/* Active status with CheckCircle icon */}
              <div className="flex items-center mb-2">
                <Skeleton className="w-4 h-4 sm:w-5 sm:h-5 rounded-full mr-2 bg-green-400/20 flex-shrink-0" />
                <Skeleton className="h-3 sm:h-4 w-32 sm:w-36 bg-white/20 rounded" />
              </div>

              {/* Location with MapPin icon */}
              <div className="flex items-center">
                <Skeleton className="w-5 h-5 rounded-full mr-2 bg-brand-primary/20 flex-shrink-0" />
                <Skeleton className="h-3 sm:h-4 w-40 sm:w-48 bg-white/20 rounded" />
              </div>
            </div>
          </div>
        </Shell>
      </div>

      <Shell>
        <div className="grid grid-cols-1 text-brand-accent w-full mt-4 lg:grid-cols-[2fr_1fr] lg:gap-8 lg:px-0">
          <div>
            {/* Breadcrumbs Skeleton */}
            <nav aria-label="Breadcrumb navigation">
              <div className="pb-4 flex items-center gap-2 text-gray-600">
                <Skeleton className="h-4 w-12 rounded" />
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-32 rounded" />
              </div>
            </nav>

            {/* Developer Tabs Skeleton - Matching actual DeveloperTabs component */}
            <div className="w-full">
              {/* Tabs Header - matching TabsList structure */}
              <div className="grid h-full w-full grid-cols-3 px-2 bg-muted rounded-md p-1 mb-0">
                <div className="group inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium">
                  <Skeleton className="h-4 w-20 sm:w-28" />
                  <Skeleton className="hidden lg:flex ml-2 h-6 w-6 items-center justify-center rounded-md" />
                </div>
                <div className="group inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium">
                  <Skeleton className="h-4 w-20 sm:w-24" />
                  <Skeleton className="hidden lg:flex ml-2 h-6 w-6 items-center justify-center rounded-md" />
                </div>
                <div className="group inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium">
                  <Skeleton className="h-4 w-16 sm:w-20" />
                  <Skeleton className="hidden lg:flex ml-2 h-6 w-6 items-center justify-center rounded-md" />
                </div>
              </div>

              {/* Tab Content - matching TabsContent mt-8 */}
              <div className="mt-8">
                {/* Project Cards Grid - matching exact grid structure from ProjectCard */}
                <div className="grid grid-cols-2 gap-4 lg:gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={`project-${i}`}
                      className="group relative h-full overflow-hidden rounded-lg border-0 bg-transparent p-0 shadow-none"
                    >
                      {/* ProjectCard structure - CardHeader p-0 gap-0 */}
                      <div className="p-0 gap-0">
                        {/* AspectRatio 16/9 */}
                        <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
                          <Skeleton className="h-[180px] w-full rounded-lg lg:h-[254px] transition-transform duration-300" />

                          {/* Status Badge and Project Name - absolute bottom-3 left-3 z-20 lg:bottom-4 lg:left-4 */}
                          <div className="absolute bottom-3 left-3 z-20 lg:bottom-4 lg:left-4">
                            <Skeleton className="h-6 w-20 rounded-sm mb-2 bg-white/30" />
                            <Skeleton className="h-5 w-32 lg:h-6 lg:w-40 bg-white/40 rounded" />
                          </div>

                          {/* Gradient Overlay - matching exact gradient */}
                          <div className="absolute inset-0 z-10 rounded-lg bg-gradient-to-b from-transparent via-transparent to-slate-900/60" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Skeleton - conditional based on items > 6 */}
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-12 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </div>

            {/* About Developer Section Skeleton */}
            <section aria-labelledby="about-developer-heading">
              <div className="pt-10 sm:pt-14 md:pt-20 pb-8 sm:pb-10 md:pb-0">
                <Skeleton className="h-8 w-48 mb-6 rounded" />
                <div className="prose prose-sm max-w-none space-y-3">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-4 w-5/6 rounded" />
                  <Skeleton className="h-4 w-2/3 rounded" />
                  <Skeleton className="h-4 w-4/5 rounded" />
                  <Skeleton className="h-4 w-1/2 rounded" />
                </div>
              </div>
            </section>

            {/* Client Reviews Section Skeleton */}
            <section aria-labelledby="client-reviews-heading">
              <div className="pt-10 sm:pt-14 md:pt-20 pb-8 sm:pb-10 md:pb-0">
                <Skeleton className="h-8 w-80 mb-6 rounded" />
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Skeleton
                                key={j}
                                className="h-4 w-4 rounded-full"
                              />
                            ))}
                          </div>
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-3/5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Contact Card Skeleton */}
          <aside
            className="hidden lg:block pb-6 sticky top-4"
            aria-label="Contact information"
          >
            <div className="border rounded-lg p-6 space-y-4 bg-white shadow-sm">
              {/* Contact Header */}
              <div className="flex items-center gap-4 pb-4 border-b">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              {/* Contact Actions */}
              <div className="space-y-3">
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>

              {/* Additional Info */}
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Shell>
    </main>
  );
}
