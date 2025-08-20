import { Skeleton } from "@/components/ui/skeleton";
import Shell from "@/layouts/shell";

export default function Loading() {
  return (
    <main role="main" aria-label="Loading developer profile">
      {/* Hero Section Skeleton */}
      <div className="relative w-full min-h-[200px] h-[300px] sm:min-h-[250px] sm:h-[350px] md:min-h-[400px] md:h-[50vh] md:max-h-[600px] overflow-hidden flex">
        <Skeleton className="w-full h-full" />

        {/* Gradient overlay skeleton */}
        <div
          className="absolute bottom-0 left-0 w-full h-48 sm:h-56 md:h-64 bg-gradient-to-t from-black/95 to-transparent"
          aria-hidden="true"
        />

        <Shell>
          <div className="absolute bottom-4 md:pb-4 z-10 px-0 flex flex-col sm:flex-row items-start sm:items-end h-fit gap-4 sm:gap-6">
            {/* Company Logo Card Skeleton */}
            <div className="bg-white/90 backdrop-blur-sm rounded-md p-2 min-w-[120px] min-h-[120px] sm:min-w-[140px] sm:min-h-[140px] md:min-w-[160px] md:min-h-[160px] w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] flex items-center justify-center shadow-lg">
              <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded" />
            </div>

            {/* Company Info Skeleton */}
            <div className="text-white drop-shadow-lg">
              <Skeleton className="h-8 sm:h-9 w-48 sm:w-56 mb-2 sm:mb-3 bg-white/20" />
              <div className="flex items-center mb-2">
                <Skeleton className="w-4 h-4 sm:w-5 sm:h-5 rounded-full mr-2 bg-green-400/20" />
                <Skeleton className="h-3 sm:h-4 w-32 sm:w-36 bg-white/20" />
              </div>
              <div className="flex items-center">
                <Skeleton className="w-5 h-5 rounded-full mr-2 bg-brand-primary/20" />
                <Skeleton className="h-3 sm:h-4 w-40 sm:w-48 bg-white/20" />
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
              <div className="pb-4 flex items-center space-x-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
            </nav>

            {/* Developer Tabs Skeleton */}
            <div className="mt-8">
              <div className="grid grid-cols-3 gap-2 mb-8">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-64 w-full" />
            </div>

            {/* About Developer Section Skeleton */}
            <section aria-labelledby="about-developer-heading">
              <div className="pt-10 sm:pt-14 md:pt-20 pb-8 sm:pb-10 md:pb-0">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </section>

            {/* Client Reviews Section Skeleton */}
            <section aria-labelledby="client-reviews-heading">
              <div className="pt-10 sm:pt-14 md:pt-20 pb-8 sm:pb-10 md:pb-0">
                <Skeleton className="h-8 w-80 mb-6" />
                <Skeleton className="h-32 w-full" />
              </div>
            </section>
          </div>

          {/* Sidebar Contact Card Skeleton */}
          <aside
            className="hidden md:block pb-6"
            aria-label="Contact information"
          >
            <Skeleton className="h-64 w-full rounded-lg" />
          </aside>
        </div>
      </Shell>
    </main>
  );
}
