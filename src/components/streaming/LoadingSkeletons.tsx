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
        className="hidden h-[305px] max-h-[305px] rounded-lg lg:block"
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
      className="w-full pt-14 md:pt-20 lg:pt-24 [&_h2]:px-4 md:[&_h2]:px-0 [&_p]:px-4 md:[&_p]:px-0"
    >
      <div className="relative md:rounded-lg md:border md:p-6">
        <div className="mb-4 hidden w-full items-center justify-end md:flex">
          <div className="flex max-w-[61.25rem] gap-6">
            <Skeleton
              variant="card"
              className="h-12 w-12 rounded-full"
              aria-label="Loading navigation button"
            />
            <Skeleton
              variant="card"
              className="h-12 w-12 rounded-full"
              aria-label="Loading navigation button"
            />
          </div>
        </div>
        <div className="relative w-full max-w-full overflow-hidden pl-4">
          <div className="-ml-1 flex gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-full w-[332px] min-w-0 shrink-0 grow-0 overflow-hidden rounded-lg md:w-[482px]"
              >
                <div className="bg-card text-card-foreground relative flex h-full flex-col gap-0 overflow-hidden rounded-lg border p-0 shadow-none">
                  {/* Header image area (16:9) with gradient overlay */}
                  <div className="w-full p-0">
                    <AspectRatio
                      ratio={16 / 9}
                      className="relative overflow-hidden rounded-t-lg"
                    >
                      <Skeleton
                        variant="shimmer"
                        className="absolute inset-0 h-[192px] rounded-t-lg rounded-b-none md:h-[256px]"
                        aria-label="Loading project image"
                      />
                    </AspectRatio>
                  </div>

                  {/* Content area matching featured-property-variant */}
                  <div className="relative flex h-full grow flex-col p-8">
                    {/* Absolute logo placeholder */}
                    <div className="absolute top-8 right-8">
                      <div className="flex items-center gap-3">
                        <div className="flex h-20 w-20 items-center justify-center rounded-lg">
                          <Skeleton
                            variant="card"
                            className="h-full w-full rounded-sm"
                            aria-label="Loading developer logo"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <Skeleton
                      variant="text"
                      size="lg"
                      className="mb-2 w-52 md:w-3/4"
                      aria-label="Loading project title"
                    />

                    {/* City */}
                    <Skeleton
                      variant="light"
                      size="md"
                      className="mb-6 w-1/2"
                      aria-label="Loading project location"
                    />

                    {/* Status row */}
                    <div className="mb-6 flex items-center gap-2">
                      <Skeleton
                        variant="light"
                        className="bg-brand-badge-ongoing/20 h-6 w-20 rounded-sm"
                      />
                      <Skeleton
                        variant="light"
                        className="h-1 w-1 rounded-full"
                      />
                      <Skeleton variant="light" size="md" className="w-24" />
                    </div>

                    {/* Description */}
                    <div className="space-y-2 pr-32">
                      <Skeleton
                        variant="light"
                        size="default"
                        className="w-full"
                      />
                      <Skeleton
                        variant="light"
                        size="default"
                        className="w-3/4"
                      />
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
      className="mx-auto w-full pt-14 md:max-w-[720px] md:pt-20 lg:max-w-[960px] lg:pt-24 xl:max-w-[1140px] 2xl:max-w-[1320px] [&_h2]:px-4 [&_p]:px-4"
    >
      <div className="space-y-8">
        <div>
          <div className="w-full">
            <div className="mt-8">
              <div className="relative w-full max-w-full overflow-hidden">
                <div className="-ml-1 flex">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="min-w-0 shrink-0 grow-0 basis-[220px] pl-4 md:basis-[256px]"
                    >
                      <div className="bg-card text-card-foreground relative flex size-full flex-col gap-0 rounded-xl border border-none p-0 shadow-none">
                        <div className="gap-0 rounded-xl border-b border-b-gray-50 p-0">
                          <div className="relative w-full pb-[75%]">
                            <Skeleton
                              variant="shimmer"
                              className="absolute inset-0 rounded-xl"
                              aria-label="Loading listing image"
                            />
                          </div>
                        </div>
                        <div className="space-y-1 px-0 pb-0">
                          <div className="pt-2">
                            <Skeleton
                              variant="text"
                              size="default"
                              className="mb-2 w-3/4"
                              aria-label="Loading property title"
                            />
                            <Skeleton
                              variant="text"
                              size="lg"
                              className="mb-1 w-1/2"
                              aria-label="Loading property price"
                            />
                            <Skeleton
                              variant="light"
                              size="default"
                              className="mb-1 w-1/3"
                              aria-label="Loading property location"
                            />
                            <div className="flex items-center gap-1">
                              <Skeleton variant="light" className="h-4 w-8" />
                              <Skeleton
                                variant="light"
                                className="h-3 w-3 rounded-full"
                              />
                              <Skeleton variant="light" className="h-4 w-8" />
                              <Skeleton
                                variant="light"
                                className="h-3 w-3 rounded-full"
                              />
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
      className="w-full pt-14 md:pt-20 lg:pt-24 [&_h2]:px-4 md:[&_h2]:px-0 [&_p]:px-4 md:[&_p]:px-0"
    >
      <div className="space-y-8">
        <div>
          <div className="w-full">
            <div className="px-3 md:px-0">
              <div className="bg-muted text-muted-foreground grid h-9 w-full grid-cols-2 items-center justify-center gap-2 rounded-lg p-1 md:w-[300px]">
                <Skeleton variant="card" className="h-7 w-3/4 rounded-md" />
                <Skeleton variant="card" className="h-7 w-3/4 rounded-md" />
              </div>
            </div>
            <div className="mt-8">
              <div className="relative w-full max-w-full overflow-hidden">
                <div className="-ml-1 flex">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="min-w-0 shrink-0 grow-0 basis-[220px] pl-4 md:basis-[256px]"
                    >
                      <div className="text-card-foreground relative flex size-full flex-col gap-0 rounded-xl border border-none bg-transparent p-0 shadow-none">
                        <div className="gap-0 rounded-xl border-b border-b-gray-50 p-0">
                          <div className="relative w-full pb-[75%]">
                            <Skeleton
                              variant="shimmer"
                              className="absolute inset-0 h-[154px] rounded-xl md:h-[172px]"
                              aria-label="Loading featured listing image"
                            />
                          </div>
                        </div>
                        <div className="space-y-1 px-0 pb-0">
                          <div className="pt-2">
                            <Skeleton
                              variant="text"
                              size="default"
                              className="mb-2 w-3/4"
                              aria-label="Loading featured property title"
                            />
                            <Skeleton
                              variant="text"
                              size="lg"
                              className="mb-1 w-1/2"
                              aria-label="Loading featured property price"
                            />
                            <Skeleton
                              variant="light"
                              size="default"
                              className="mb-1 w-1/3"
                              aria-label="Loading featured property location"
                            />
                            <div className="flex items-center gap-1">
                              <Skeleton variant="light" className="h-4 w-8" />
                              <Skeleton
                                variant="light"
                                className="h-3 w-3 rounded-full"
                              />
                              <Skeleton variant="light" className="h-4 w-8" />
                              <Skeleton
                                variant="light"
                                className="h-3 w-3 rounded-full"
                              />
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
