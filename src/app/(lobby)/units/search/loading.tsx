import Shell from "@/layouts/shell";
import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import { UnitsSearchSkeleton } from "./_components/units-search-skeleton";

export default function UnitsSearchLoading() {
  const segments = [
    { title: "Home", href: "/", key: "home" },
    {
      title: "Newly Built Units",
      href: "/newly-built-units",
      key: "newly-built-units",
    },
    { title: "Search Results", href: "#", key: "search-results" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Search Filter Skeleton */}
      <div className="sticky top-[56px] z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                <div className="h-10 animate-pulse rounded border bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Shell className="py-6 md:py-8">
        {/* Breadcrumbs Skeleton */}
        <div className="mb-6">
          <Breadcrumbs segments={segments} />
        </div>

        {/* Header Skeleton */}
        <header className="mb-8">
          <div className="mb-3 h-8 w-96 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-64 animate-pulse rounded bg-gray-200" />
        </header>

        {/* Two-column layout matching actual page */}
        <div className="mt-8 grid w-full grid-cols-1 gap-8 md:px-0 lg:grid-cols-[minmax(0,736px)_1fr]">
          {/* Main Content Column */}
          <div>
            {/* Streaming Banner Skeleton */}
            <div className="mb-8 h-24 animate-pulse rounded-lg bg-gray-100" />

            {/* Search Results Skeleton */}
            <UnitsSearchSkeleton />
          </div>

          {/* Aside Content */}
          <aside>
            {/* Reference Search Skeleton */}
            <div className="mb-4 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-green-50 p-4">
              <div className="space-y-2">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-4 w-4 animate-pulse rounded bg-blue-200" />
                  <div className="h-4 w-32 animate-pulse rounded bg-blue-200" />
                </div>
                <div className="flex gap-2">
                  <div className="h-10 flex-1 animate-pulse rounded border bg-white" />
                  <div className="h-10 w-16 animate-pulse rounded bg-blue-200" />
                </div>
              </div>
            </div>

            {/* Location Links Skeleton */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
              <div className="p-4">
                <div className="mb-3 h-4 w-64 animate-pulse rounded bg-gray-200" />
                <div className="space-y-1">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-4 w-40 animate-pulse rounded bg-gray-100"
                    />
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Shell>
    </div>
  );
}
