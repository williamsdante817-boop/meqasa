import { Skeleton } from "@/components/ui/skeleton";
import Shell from "@/layouts/shell";

export default function Loading() {
  return (
    <main role="main" aria-label="Loading developer profile">
      {/* Hero Section Skeleton */}
      <div className="relative flex h-[300px] min-h-[200px] w-full overflow-hidden sm:h-[350px] sm:min-h-[250px] md:h-[50vh] md:max-h-[600px] md:min-h-[400px]">
        {/* Background Image Skeleton */}
        <Skeleton className="h-full w-full bg-gray-300" />

        <Shell>
          {/* Content Container - matching exact structure */}
          <div
            className="absolute bottom-0 left-0 h-48 w-full bg-gradient-to-t from-black/95 to-transparent sm:h-56 md:h-64"
            aria-hidden="true"
          />
          <div className="absolute bottom-4 z-10 flex h-fit flex-col items-start gap-4 px-0 sm:flex-row sm:items-end sm:gap-6 md:pb-4">
            {/* Company Logo Card Skeleton - Conditionally shown, hidden on mobile */}
            <div className="hidden h-[120px] min-h-[120px] w-[120px] min-w-[120px] items-center justify-center rounded-md bg-white/90 p-2 shadow-lg backdrop-blur-sm sm:h-[140px] sm:min-h-[140px] sm:w-[140px] sm:min-w-[140px] md:flex md:h-[160px] md:min-h-[160px] md:w-[160px] md:min-w-[160px]">
              <Skeleton className="h-20 w-20 rounded sm:h-24 sm:w-24 md:h-28 md:w-28" />
            </div>

            {/* Company Info Skeleton */}
            <div className="text-white drop-shadow-lg">
              {/* Company name - h1 with proper text sizing */}
              <Skeleton className="mb-2 h-8 w-48 rounded bg-white/20 sm:mb-3 sm:h-9 sm:w-56 md:h-10 md:w-64" />

              {/* Active status with CheckCircle icon */}
              <div className="mb-2 flex items-center">
                <Skeleton className="mr-2 h-4 w-4 flex-shrink-0 rounded-full bg-green-400/20 sm:h-5 sm:w-5" />
                <Skeleton className="h-3 w-32 rounded bg-white/20 sm:h-4 sm:w-36" />
              </div>

              {/* Location with MapPin icon */}
              <div className="flex items-center">
                <Skeleton className="bg-brand-primary/20 mr-2 h-5 w-5 flex-shrink-0 rounded-full" />
                <Skeleton className="h-3 w-40 rounded bg-white/20 sm:h-4 sm:w-48" />
              </div>
            </div>
          </div>
        </Shell>
      </div>

      <Shell>
        <div className="text-brand-accent mt-4 grid w-full grid-cols-1 lg:grid-cols-[2fr_1fr] lg:gap-8 lg:px-0">
          <div>
            {/* Breadcrumbs Skeleton */}
            <nav aria-label="Breadcrumb navigation">
              <div className="flex items-center gap-2 pb-4 text-gray-600">
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
              <div className="bg-muted mb-0 grid h-full w-full grid-cols-3 rounded-md p-1 px-2">
                <div className="group inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap">
                  <Skeleton className="h-4 w-20 sm:w-28" />
                  <Skeleton className="ml-2 hidden h-6 w-6 items-center justify-center rounded-md lg:flex" />
                </div>
                <div className="group inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap">
                  <Skeleton className="h-4 w-20 sm:w-24" />
                  <Skeleton className="ml-2 hidden h-6 w-6 items-center justify-center rounded-md lg:flex" />
                </div>
                <div className="group inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap">
                  <Skeleton className="h-4 w-16 sm:w-20" />
                  <Skeleton className="ml-2 hidden h-6 w-6 items-center justify-center rounded-md lg:flex" />
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
                      <div className="gap-0 p-0">
                        {/* AspectRatio 16/9 */}
                        <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                          <Skeleton className="h-[180px] w-full rounded-lg transition-transform duration-300 lg:h-[254px]" />

                          {/* Status Badge and Project Name - absolute bottom-3 left-3 z-20 lg:bottom-4 lg:left-4 */}
                          <div className="absolute bottom-3 left-3 z-20 lg:bottom-4 lg:left-4">
                            <Skeleton className="mb-2 h-6 w-20 rounded-sm bg-white/30" />
                            <Skeleton className="h-5 w-32 rounded bg-white/40 lg:h-6 lg:w-40" />
                          </div>

                          {/* Gradient Overlay - matching exact gradient */}
                          <div className="absolute inset-0 z-10 rounded-lg bg-gradient-to-b from-transparent via-transparent to-slate-900/60" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Skeleton - conditional based on items > 6 */}
                <div className="mt-8 flex items-center justify-center gap-2">
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
              <div className="pt-10 pb-8 sm:pt-14 sm:pb-10 md:pt-20 md:pb-0">
                <Skeleton className="mb-6 h-8 w-48 rounded" />
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
              <div className="pt-10 pb-8 sm:pt-14 sm:pb-10 md:pt-20 md:pb-0">
                <Skeleton className="mb-6 h-8 w-80 rounded" />
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-3 rounded-lg border p-4">
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
            className="sticky top-4 hidden pb-6 lg:block"
            aria-label="Contact information"
          >
            <div className="space-y-4 rounded-lg border bg-white p-6 shadow-sm">
              {/* Contact Header */}
              <div className="flex items-center gap-4 border-b pb-4">
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
              <div className="space-y-2 border-t pt-4">
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
              <div className="border-t pt-4">
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
