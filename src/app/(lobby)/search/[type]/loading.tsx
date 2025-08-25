import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import PropertyTypeLinks from "@/components/search/PropertyTypeLinks";
import { ResultSearchFilter } from "@/components/search/results-search-filter";
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
      {/* Hero Banner Skeleton */}
      <div className="hidden lg:block max-h-[280px] h-[280px] relative bg-gray-200">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Search Filter Skeleton */}
      <div className="hidden md:block sticky top-[64px] z-50 bg-white">
        <ResultSearchFilter />
      </div>

      <Shell className="mt-12 flex gap-8 md:px-0">
        <PropertyTypeLinks />
        <div className="w-full">
          <Breadcrumbs className="capitalize" segments={segments} />

          {/* Header Skeleton */}
          <header>
            <Skeleton className="h-6 w-64 mb-2" />
            <Skeleton className="h-4 w-32" />
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[736px,1fr] md:px-0">
            <div>
              <SearchResultsSkeleton />
            </div>
            <div className="hidden lg:block mt-12">
              <aside className="w-full items-center grid grid-cols-1 gap-8">
                {/* Rectangle Ads Skeleton */}
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-[250px] h-96 bg-gray-200 rounded-lg"
                  >
                    <Skeleton className="w-full h-full" />
                  </div>
                ))}
              </aside>
            </div>
          </div>
        </div>
      </Shell>
    </div>
  );
}
