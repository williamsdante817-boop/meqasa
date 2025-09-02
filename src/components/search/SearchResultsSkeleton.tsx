import { Skeleton } from "@/components/ui/skeleton";
import Shell from "@/layouts/shell";

export default function SearchResultsSkeleton() {
  return (
    <>
      {/* Search header skeleton */}
      <div className="bg-brand-gray py-4">
        <Shell>
          <div className="flex items-center justify-between">
            <Skeleton variant="text" size="lg" className="w-48" aria-label="Loading search results count" />
            <div className="flex items-center gap-4">
              <Skeleton variant="light" className="h-9 w-32" aria-label="Loading sort options" />
              <Skeleton variant="light" className="h-9 w-9 rounded-md" aria-label="Loading view toggle" />
            </div>
          </div>
        </Shell>
      </div>

      <Shell className="mt-8 flex gap-8 px-0">
        {/* Filters sidebar skeleton */}
        <div className="hidden lg:block">
          <aside className="flex flex-col gap-6 min-w-[280px]" aria-label="Loading search filters">
            <div className="space-y-4">
              <Skeleton variant="text" size="md" className="w-24" />
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton variant="light" className="h-4 w-4 rounded-sm" />
                    <Skeleton variant="light" className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Skeleton variant="text" size="md" className="w-20" />
              <Skeleton variant="light" className="h-24 w-full rounded-md" />
            </div>

            <div className="space-y-4">
              <Skeleton variant="text" size="md" className="w-28" />
              <div className="space-y-2">
                <Skeleton variant="light" className="h-10 w-full rounded-md" />
                <Skeleton variant="light" className="h-10 w-full rounded-md" />
              </div>
            </div>
          </aside>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,300px] md:px-0">
            {/* Main results area */}
            <div className="w-full pb-8">
              <div className="grid grid-cols-1 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-4 rounded-xl border border-gray-100 shadow-sm md:flex-row md:p-4 w-full bg-white hover:shadow-md transition-shadow"
                    role="status"
                    aria-label={`Loading property ${i + 1}`}
                  >
                    {/* Property image skeleton */}
                    <div className="w-full md:min-w-[280px] md:w-[280px] p-0 relative">
                      <div className="relative w-full pb-[60%] md:pb-[65%] overflow-hidden rounded-lg">
                        <Skeleton 
                          variant="shimmer" 
                          className="absolute inset-0 rounded-lg" 
                          aria-label="Loading property image"
                        />
                        
                        {/* Contract type badge */}
                        <div className="absolute top-2 left-2">
                          <Skeleton className="h-6 w-16 rounded-sm bg-brand-accent/20" />
                        </div>
                        
                        {/* Favorite button */}
                        <div className="absolute top-2 right-2">
                          <Skeleton className="h-10 w-10 rounded-full bg-white/80" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Property details skeleton */}
                    <div className="flex-1 flex flex-col justify-between px-4 pb-4 md:p-0 space-y-3">
                      {/* Title */}
                      <Skeleton 
                        variant="text" 
                        size="lg" 
                        className="w-4/5" 
                        aria-label="Loading property title"
                      />
                      
                      {/* Price */}
                      <Skeleton 
                        variant="text" 
                        size="xl" 
                        className="w-1/2 text-brand-accent" 
                        aria-label="Loading property price"
                      />
                      
                      {/* Location */}
                      <Skeleton 
                        variant="light" 
                        size="default" 
                        className="w-2/3" 
                        aria-label="Loading property location"
                      />
                      
                      {/* Features */}
                      <div className="flex items-center gap-2">
                        <Skeleton variant="light" className="h-4 w-8" />
                        <Skeleton variant="light" className="h-3 w-3 rounded-full" />
                        <Skeleton variant="light" className="h-4 w-8" />
                        <Skeleton variant="light" className="h-3 w-3 rounded-full" />
                        <Skeleton variant="light" className="h-4 w-16" />
                      </div>
                      
                      {/* Agent info */}
                      <div className="flex items-center gap-3 mt-4">
                        <Skeleton variant="light" className="h-12 w-12 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton variant="light" className="h-4 w-24" />
                          <Skeleton variant="light" className="h-3 w-20" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Load more skeleton */}
              <div className="mt-8 flex justify-center">
                <Skeleton variant="light" className="h-12 w-32 rounded-md" />
              </div>
            </div>
            
            {/* Sidebar ads/content skeleton */}
            <div>
              <aside className="hidden lg:grid grid-cols-1 gap-6 w-full" aria-label="Loading sidebar content">
                <div className="space-y-4">
                  <Skeleton variant="text" size="md" className="w-32" />
                  <Skeleton variant="card" className="h-[250px] w-full rounded-lg" />
                </div>
                <div className="space-y-4">
                  <Skeleton variant="text" size="md" className="w-40" />
                  <Skeleton variant="card" className="h-[300px] w-full rounded-lg" />
                </div>
                <div className="space-y-4">
                  <Skeleton variant="text" size="md" className="w-36" />
                  <Skeleton variant="card" className="h-[200px] w-full rounded-lg" />
                </div>
              </aside>
            </div>
          </div>
        </div>
      </Shell>
    </>
  );
}
