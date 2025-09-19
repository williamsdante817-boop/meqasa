import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import PropertyTypeLinks from "@/components/search/PropertyTypeLinks";
import SearchResultsSkeleton from "@/components/search/SearchResultsSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import Shell from "@/layouts/shell";

export default function Loading() {
  const segments = [
    { title: "Home", href: "/" },
    { title: "Search", href: "#" },
    { title: "Loading...", href: "#" },
  ];

  return (
    <div>
      {/* Hero Banner Skeleton - matching actual conditional rendering */}
      <div className="relative hidden h-[280px] max-h-[280px] overflow-hidden bg-gray-200 lg:block">
        <Skeleton className="h-full w-full animate-pulse" />
      </div>

      {/* Search Filter Skeleton - matching actual sticky positioning */}
      <div className="sticky top-[56px] z-50 border border-gray-200 bg-white">
        <div className="container mx-auto flex items-center gap-2 overflow-x-auto p-4">
          {/* For Sale/Rent Dropdown Skeleton */}
          <Skeleton className="h-10 w-28 flex-shrink-0 rounded-md sm:h-12 sm:w-32" />

          {/* Search Input Skeleton */}
          <Skeleton className="h-10 min-w-[120px] flex-1 rounded-md sm:h-12 sm:min-w-[200px]" />

          {/* Property Type Skeleton */}
          <Skeleton className="h-10 w-32 flex-shrink-0 rounded-md sm:h-12 sm:w-40" />

          {/* Bedrooms Skeleton */}
          <Skeleton className="h-10 w-24 flex-shrink-0 rounded-md sm:h-12 sm:w-32" />

          {/* Bathrooms Skeleton */}
          <Skeleton className="h-10 w-24 flex-shrink-0 rounded-md sm:h-12 sm:w-32" />

          {/* Price Range Skeleton */}
          <Skeleton className="h-10 w-28 flex-shrink-0 rounded-md sm:h-12 sm:w-40" />

          {/* More Filters Skeleton */}
          <Skeleton className="h-10 w-20 flex-shrink-0 rounded-md sm:h-12 sm:w-32" />

          {/* Search Button Skeleton */}
          <Skeleton className="h-10 w-20 flex-shrink-0 rounded-md sm:h-12 sm:w-32" />
        </div>

        {/* Active Filter Chips Skeleton */}
        <div className="container mx-auto px-4 pb-4">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      <Shell className="mt-12 flex gap-8 md:px-0">
        <PropertyTypeLinks />
        <div className="w-full">
          <Breadcrumbs className="capitalize" segments={segments} />

          {/* Header Skeleton - matching actual structure with proper spacing */}
          <header className="space-y-6">
            <div>
              <Skeleton className="mb-2 h-6 w-64 md:h-7 md:w-80" />
              <Skeleton className="h-4 w-48 md:w-64" />
            </div>

            {/* Production Reference Search Component Skeleton */}
            <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-green-50 p-4">
              <Skeleton className="h-10 w-full max-w-md" />
            </div>
          </header>

          {/* Main Content Grid - matching actual layout: lg:grid-cols-[minmax(0,736px)_1fr] */}
          <div className="mt-8 grid w-full grid-cols-1 gap-8 md:px-0 lg:grid-cols-[minmax(0,736px)_1fr]">
            <div>
              {/* Streaming Flexi Banner Skeleton */}
              <div className="mb-6">
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>

              {/* Search Results Skeleton */}
              <SearchResultsSkeleton />
            </div>

            {/* Sidebar - matching actual StreamingSidebarBanners layout */}
            <div className="hidden lg:block">
              <aside className="grid w-full grid-cols-1 gap-8">
                {/* Rectangle Ads Skeleton - matching actual banner dimensions */}
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="mx-auto w-full max-w-[300px]">
                    <Skeleton className="h-96 w-full rounded-lg" />
                  </div>
                ))}
              </aside>
            </div>
          </div>
        </div>
      </Shell>

      {/* Results Popup Skeleton - matching actual component */}
      <div className="fixed right-4 bottom-4 z-50 lg:hidden">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
    </div>
  );
}
