import { Skeleton } from "@/components/ui/skeleton";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ContentSection from "@/components/layout/content-section";
import Shell from "@/layouts/shell";

// Hero Banner Loading Skeleton
export function HeroBannerSkeleton() {
  return (
    <div className="relative" role="status" aria-label="Loading hero banner">
      <Skeleton 
        variant="shimmer" 
        className="hidden lg:block max-h-[305px] h-[305px] rounded-lg" 
        aria-label="Loading banner image"
      />
      <span className="sr-only">Loading hero banner content...</span>
    </div>
  );
}

// Grid Banner Loading Skeleton
export function GridBannerSkeleton() {
  return (
    <div role="status" aria-label="Loading grid banners">
      <Shell className="hidden md:block">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton 
              key={i}
              variant="shimmer" 
              className="h-60 w-full rounded-lg" 
              aria-label={`Loading banner ${i + 1}`}
            />
          ))}
        </div>
        <span className="sr-only">Loading promotional banners...</span>
      </Shell>
    </div>
  );
}

// Featured Projects Loading Skeleton
export function FeaturedProjectsSkeleton() {
  return (
    <ContentSection
      title="Featured Projects"
      description="View all featured properties"
      href="/developments"
      className="pt-14 md:pt-20 lg:pt-24 w-full [&_p]:px-4 [&_h2]:px-4 md:[&_p]:px-0 md:[&_h2]:px-0"
    >
      <div className="relative md:border md:rounded-lg md:p-6">
        <div className="w-full hidden md:flex items-center justify-end mb-4">
          <div className="flex max-w-[61.25rem] gap-6">
            <Skeleton variant="card" className="h-12 w-12 rounded-full" aria-label="Loading navigation button" />
            <Skeleton variant="card" className="h-12 w-12 rounded-full" aria-label="Loading navigation button" />
          </div>
        </div>
        <div className="relative w-full max-w-full pl-4 overflow-hidden ">
          <div className="flex gap-4 -ml-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="min-w-0 rounded-lg w-[332px] md:w-[482px] overflow-hidden shrink-0 grow-0 h-full"
              >
                <div className="bg-card border overflow-hidden rounded-lg text-card-foreground flex flex-col p-0 relative gap-0 shadow-none h-full">
                  {/* Header image area (16:9) with gradient overlay */}
                  <div className="p-0 w-full">
                    <AspectRatio ratio={16 / 9} className="relative overflow-hidden rounded-t-lg">
                      <Skeleton variant="shimmer" className="absolute inset-0 h-[192px] md:h-[256px] rounded-t-lg rounded-b-none" aria-label="Loading project image" />
                    </AspectRatio>
                  </div>

                  {/* Content area matching featured-property-variant */}
                  <div className="p-8 relative flex flex-col grow h-full">
                    {/* Absolute logo placeholder */}
                    <div className="absolute top-8 right-8">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-20 h-20 rounded-lg">
                          <Skeleton variant="card" className="h-full w-full rounded-sm" aria-label="Loading developer logo" />
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <Skeleton variant="text" size="lg" className="w-52 md:w-3/4 mb-2" aria-label="Loading project title" />

                    {/* City */}
                    <Skeleton variant="light" size="md" className="w-1/2 mb-6" aria-label="Loading project location" />

                    {/* Status row */}
                    <div className="flex items-center gap-2 mb-6">
                      <Skeleton variant="light" className="h-6 w-20 rounded-sm bg-brand-badge-ongoing/20" />
                      <Skeleton variant="light" className="h-1 w-1 rounded-full" />
                      <Skeleton variant="light" size="md" className="w-24" />
                    </div>

                    {/* Description */}
                    <div className="pr-32 space-y-2">
                      <Skeleton variant="light" size="default" className="w-full" />
                      <Skeleton variant="light" size="default" className="w-3/4" />
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
                        <div className="p-0 border-b border-b-gray-50 gap-0 rounded-xl">
                          <div className="relative w-full pb-[75%]">
                            <Skeleton variant="shimmer" className="absolute inset-0 rounded-xl" aria-label="Loading listing image" />
                          </div>
                        </div>
                        <div className="px-0 pb-0 space-y-1">
                          <div className="pt-2">
                            <Skeleton variant="text" size="default" className="w-3/4 mb-2" aria-label="Loading property title" />
                            <Skeleton variant="text" size="lg" className="w-1/2 mb-1" aria-label="Loading property price" />
                            <Skeleton variant="light" size="default" className="w-1/3 mb-1" aria-label="Loading property location" />
                            <div className="flex items-center gap-1">
                              <Skeleton variant="light" className="h-4 w-8" />
                              <Skeleton variant="light" className="h-3 w-3 rounded-full" />
                              <Skeleton variant="light" className="h-4 w-8" />
                              <Skeleton variant="light" className="h-3 w-3 rounded-full" />
                              <Skeleton variant="light" className="h-4 w-12" />
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
      className="pt-14 md:pt-20 lg:pt-24 w-full [&_p]:px-4 [&_h2]:px-4 md:[&_p]:px-0 md:[&_h2]:px-0"
    >
      <div className="space-y-8">
        <div>
          <div className="w-full">
            <div className="px-3 md:px-0">
              <div className="h-9 items-center justify-center rounded-lg bg-muted p-1 gap-2 text-muted-foreground grid w-full md:w-[300px] grid-cols-2">
                <Skeleton variant="card" className="h-7 w-3/4 rounded-md" />
                <Skeleton variant="card" className="h-7 w-3/4 rounded-md" />
              </div>
            </div>
            <div className="mt-8">
              <div className="relative w-full max-w-full overflow-hidden">
                <div className="flex -ml-1">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="min-w-0 shrink-0 grow-0 pl-4 basis-[220px] md:basis-[256px]"
                    >
                      <div className="text-card-foreground flex flex-col border size-full rounded-xl p-0 relative gap-0 border-none shadow-none bg-transparent">
                        <div className="p-0 border-b border-b-gray-50 gap-0 rounded-xl">
                          <div className="relative w-full pb-[75%]">
                            <Skeleton variant="shimmer" className="absolute h-[154px] md:h-[172px]  inset-0 rounded-xl" aria-label="Loading featured listing image" />
                          </div>
                        </div>
                        <div className="px-0 pb-0 space-y-1">
                          <div className="pt-2">
                            <Skeleton variant="text" size="default" className="w-3/4 mb-2" aria-label="Loading featured property title" />
                            <Skeleton variant="text" size="lg" className="w-1/2 mb-1" aria-label="Loading featured property price" />
                            <Skeleton variant="light" size="default" className="w-1/3 mb-1" aria-label="Loading featured property location" />
                            <div className="flex items-center gap-1">
                              <Skeleton variant="light" className="h-4 w-8" />
                              <Skeleton variant="light" className="h-3 w-3 rounded-full" />
                              <Skeleton variant="light" className="h-4 w-8" />
                              <Skeleton variant="light" className="h-3 w-3 rounded-full" />
                              <Skeleton variant="light" className="h-4 w-12" />
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
