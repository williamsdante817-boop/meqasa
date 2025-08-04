import { Skeleton } from "@/components/ui/skeleton";
import ContentSection from "@/components/content-section";
import Shell from "@/layouts/shell";

// Hero Banner Loading Skeleton
export function HeroBannerSkeleton() {
  return (
    <div className="relative">
      <div className="hidden lg:block max-h-[305px] h-[305px] relative bg-gray-200 animate-pulse rounded-lg" />
    </div>
  );
}

// Grid Banner Loading Skeleton
export function GridBannerSkeleton() {
  return (
    <Shell className="hidden md:block">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-60 w-full rounded-lg bg-gray-200 animate-pulse" />
        <div className="h-60 grid-rows-4 w-full rounded-lg bg-gray-200 animate-pulse" />
        <div className="h-60 grid-rows-4 w-full rounded-lg bg-gray-200 animate-pulse" />
        <div className="h-60 grid-rows-4 w-full rounded-lg bg-gray-200 animate-pulse" />
      </div>
    </Shell>
  );
}

// Featured Projects Loading Skeleton
export function FeaturedProjectsSkeleton() {
  return (
    <ContentSection
      title="Featured Projects"
      description="View all featured properties"
      href="/developments"
      className="pt-14 md:pt-20 lg:pt-24 w-full mx-auto [&_p]:px-4 [&_h2]:px-4 md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]"
    >
      <div className="relative md:border md:rounded-lg md:p-6">
        <div className="w-full hidden md:flex items-center justify-end mb-4">
          <div className="flex max-w-[61.25rem] gap-6">
            <Skeleton className=" bg-gray-100 h-12 w-12 rounded-full animate-pulse" />
            <Skeleton className=" bg-gray-100 h-12 w-12 rounded-full animate-pulse" />
          </div>
        </div>
        <div className="relative w-full max-w-full pl-4 overflow-hidden ">
          <div className="flex gap-4 -ml-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="min-w-0 border rounded-lg w-[332px] md:w-[482px] overflow-hidden shrink-0 grow-0"
              >
                <div className="bg-card text-card-foreground flex flex-col border  p-0 relative gap-0 border-none shadow-none">
                  <div className="p-0 border-b border-b-gray-100 gap-0  w-full">
                    <div className="relative w-full">
                      <div className=" bg-gray-100 md:h-[250px] h-[180px] animate-pulse" />
                    </div>
                  </div>
                  <div className="px-0 pb-0 space-y-1">
                    <div className="p-4">
                      <Skeleton className=" bg-gray-100 h-4 w-32 mb-2" />
                      <Skeleton className=" bg-gray-100 h-6 w-1/2 mb-1" />

                      <div className="flex items-center gap-1">
                        <Skeleton className=" bg-gray-100 h-4 w-8" />
                        <Skeleton className=" bg-gray-100 h-2 w-2 rounded-full" />
                        <Skeleton className=" bg-gray-100 h-4 w-8" />
                        <Skeleton className=" bg-gray-100 h-2 w-2 rounded-full" />

                        <Skeleton className=" bg-gray-100 h-4 w-12" />
                      </div>
                      <Skeleton className=" bg-gray-100 h-4 w-1/3 mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ContentSection>
  );
}

// Featured Listings Loading Skeleton
export function LatestListingsSkeleton() {
  return (
    <ContentSection
      title="Latest Listings"
      description="View all recent property listings available."
      href="/search/rent?q=ghana&page=1"
      className="pt-14 md:pt-20 lg:pt-24 [&_p]:px-4 [&_h2]:px-4 w-full mx-auto md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]"
    >
      <div className="space-y-8">
        <div>
          <div className="w-full">
            <div className="mt-8">
              <div className="relative w-full max-w-full overflow-hidden">
                <div className="flex -ml-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="min-w-0 shrink-0 grow-0 pl-4 basis-[220px] md:basis-[256px]"
                    >
                      <div className="bg-card text-card-foreground flex flex-col border size-full rounded-xl p-0 relative gap-0 border-none shadow-none">
                        <div className="p-0 border-b border-b-gray-100 gap-0 rounded-xl">
                          <div className="relative w-full pb-[75%]">
                            <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-xl" />
                          </div>
                        </div>
                        <div className="px-0 pb-0 space-y-1">
                          <div className="pt-2">
                            <Skeleton className="bg-gray-100 h-4 w-3/4 mb-2" />
                            <Skeleton className=" bg-gray-100 h-6 w-1/2 mb-1" />
                            <Skeleton className=" bg-gray-100 h-4 w-1/3 mb-1" />
                            <div className="flex items-center gap-1">
                              <Skeleton className=" bg-gray-100 h-4 w-8" />
                              <Skeleton className=" bg-gray-100 h-3 w-3 rounded-full" />
                              <Skeleton className=" bg-gray-100 h-4 w-8" />
                              <Skeleton className=" bg-gray-100 h-3 w-3 rounded-full" />
                              <Skeleton className=" bg-gray-100 h-4 w-12" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentSection>
  );
}
// Featured Listings Loading Skeleton
export function FeaturedListingsSkeleton() {
  return (
    <ContentSection
      title="Featured Listings"
      description="View all featured property listings available."
      href="/search/rent?q=ghana&page=1"
      className="pt-14 md:pt-20 lg:pt-24 [&_p]:px-4 [&_h2]:px-4 w-full mx-auto md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]"
    >
      <div className="space-y-8">
        <div>
          <div className="w-full">
            <div className="h-9 items-center justify-center rounded-lg bg-muted p-1 gap-2 text-muted-foreground grid w-full md:w-[300px] grid-cols-2">
              <Skeleton className=" bg-gray-200 h-7 w-3/4 rounded-md animate-pulse" />
              <Skeleton className=" bg-gray-200 h-7 w-3/4 rounded-md animate-pulse" />
            </div>
            <div className="mt-8">
              <div className="relative w-full max-w-full overflow-hidden">
                <div className="flex -ml-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="min-w-0 shrink-0 grow-0 pl-4 basis-[220px] md:basis-[256px]"
                    >
                      <div className="bg-card text-card-foreground flex flex-col border size-full rounded-xl p-0 relative gap-0 border-none shadow-none">
                        <div className="p-0 border-b border-b-gray-100 gap-0 rounded-xl">
                          <div className="relative w-full pb-[75%]">
                            <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-xl" />
                          </div>
                        </div>
                        <div className="px-0 pb-0 space-y-1">
                          <div className="pt-2">
                            <Skeleton className="bg-gray-100 h-4 w-3/4 mb-2" />
                            <Skeleton className=" bg-gray-100 h-6 w-1/2 mb-1" />
                            <Skeleton className=" bg-gray-100 h-4 w-1/3 mb-1" />
                            <div className="flex items-center gap-1">
                              <Skeleton className=" bg-gray-100 h-4 w-8" />
                              <Skeleton className=" bg-gray-100 h-3 w-3 rounded-full" />
                              <Skeleton className=" bg-gray-100 h-4 w-8" />
                              <Skeleton className=" bg-gray-100 h-3 w-3 rounded-full" />
                              <Skeleton className=" bg-gray-100 h-4 w-12" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentSection>
  );
}
