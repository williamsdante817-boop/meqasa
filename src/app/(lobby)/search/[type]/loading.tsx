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
      <div className="hidden lg:block max-h-[280px] h-[280px] relative bg-gray-200 overflow-hidden">
        <Skeleton className="w-full h-full animate-pulse" />
      </div>

      {/* Search Filter Skeleton - matching actual sticky positioning */}
      <div className="sticky top-[56px] z-50 bg-white border border-gray-200">
        <div className="flex items-center gap-2 p-4 container mx-auto overflow-x-auto">
          {/* For Sale/Rent Dropdown Skeleton */}
          <Skeleton className="h-10 sm:h-12 w-28 sm:w-32 flex-shrink-0 rounded-md" />
          
          {/* Search Input Skeleton */}
          <Skeleton className="h-10 sm:h-12 flex-1 min-w-[120px] sm:min-w-[200px] rounded-md" />
          
          {/* Property Type Skeleton */}
          <Skeleton className="h-10 sm:h-12 w-32 sm:w-40 flex-shrink-0 rounded-md" />
          
          {/* Bedrooms Skeleton */}
          <Skeleton className="h-10 sm:h-12 w-24 sm:w-32 flex-shrink-0 rounded-md" />
          
          {/* Bathrooms Skeleton */}
          <Skeleton className="h-10 sm:h-12 w-24 sm:w-32 flex-shrink-0 rounded-md" />
          
          {/* Price Range Skeleton */}
          <Skeleton className="h-10 sm:h-12 w-28 sm:w-40 flex-shrink-0 rounded-md" />
          
          {/* More Filters Skeleton */}
          <Skeleton className="h-10 sm:h-12 w-20 sm:w-32 flex-shrink-0 rounded-md" />
          
          {/* Search Button Skeleton */}
          <Skeleton className="h-10 sm:h-12 w-20 sm:w-32 flex-shrink-0 rounded-md" />
        </div>
        
        {/* Active Filter Chips Skeleton */}
        <div className="px-4 pb-4 container mx-auto">
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
              <Skeleton className="h-6 w-64 mb-2 md:h-7 md:w-80" />
              <Skeleton className="h-4 w-48 md:w-64" />
            </div>
            
            {/* Production Reference Search Component Skeleton */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
              <Skeleton className="h-10 max-w-md w-full" />
            </div>
          </header>

          {/* Main Content Grid - matching actual layout: lg:grid-cols-[minmax(0,736px)_1fr] */}
          <div className="grid grid-cols-1 gap-8 mt-8 md:px-0 lg:grid-cols-[minmax(0,736px)_1fr] w-full">
            <div>
              {/* Streaming Flexi Banner Skeleton */}
              <div className="mb-6">
                <Skeleton className="w-full h-24 rounded-lg" />
              </div>
              
              {/* Search Results Skeleton */}
              <SearchResultsSkeleton />
            </div>
            
            {/* Sidebar - matching actual StreamingSidebarBanners layout */}
            <div className="hidden lg:block">
              <aside className="w-full grid grid-cols-1 gap-8">
                {/* Rectangle Ads Skeleton - matching actual banner dimensions */}
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="w-full max-w-[300px] mx-auto">
                    <Skeleton className="w-full h-96 rounded-lg" />
                  </div>
                ))}
              </aside>
            </div>
          </div>
        </div>
      </Shell>
      
      {/* Results Popup Skeleton - matching actual component */}
      <div className="fixed bottom-4 right-4 z-50 lg:hidden">
        <Skeleton className="w-16 h-16 rounded-full" />
      </div>
    </div>
  );
}
