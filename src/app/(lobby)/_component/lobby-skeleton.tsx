import Shell from "@/layouts/shell";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ChevronDown, ListFilterPlus, SearchIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layout/page-header";
import { FeaturedProjectsSkeleton } from "@/components/streaming/LoadingSkeletons";

export function LobbySkeleton() {
  return (
    <main>
      {/* Hero section with search */}
      <div className="relative">
        <div className="relative h-[305px] max-h-[305px] bg-gray-200">
          <Skeleton className="h-full w-full" />
        </div>

        {/* Mobile Page Header - Only visible on mobile */}
        <PageHeader
          as="section"
          className="absolute top-1/2 left-1/2 z-10 mx-auto flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 text-center text-white lg:hidden"
          withPadding
        >
          <PageHeaderHeading className="animate-pulse text-white" as="h1">
            <Skeleton className="h-8 w-64 bg-white/20" />
          </PageHeaderHeading>
          <PageHeaderDescription className="max-w-[46.875rem] animate-pulse">
            <Skeleton className="mt-2 h-4 w-80 bg-white/20" />
          </PageHeaderDescription>
          {/* Mobile Search Trigger Skeleton */}
          <div className="mx-auto mt-4 w-[80%]">
            <Skeleton className="h-12 w-full rounded-lg bg-white/90" />
          </div>
        </PageHeader>

        {/* Desktop Search Form - Only visible on desktop */}
        <div className="absolute -bottom-20 left-1/2 hidden w-full max-w-4xl -translate-x-1/2 px-4 lg:block">
          <Card
            className="mx-auto my-0 h-fit w-full gap-0 rounded-2xl border-0 p-2 lg:max-w-[928px] lg:p-3"
            style={{ background: "rgba(11,17,52,.65)" }}
          >
            <div className="mx-auto my-0 w-4/5 lg:max-w-[460px]">
              <div className="text-b-accent mb-4 grid h-[44px] w-full grid-cols-4 overflow-hidden rounded-xl bg-white p-1.5">
                <div className="text-brand-accent flex h-full items-center justify-center rounded-md bg-rose-500 text-center text-base font-bold text-white">
                  Rent
                </div>
                <div className="text-brand-accent flex h-full cursor-default items-center justify-center text-center text-base font-bold hover:bg-gray-100">
                  Buy
                </div>
                <div className="text-brand-accent flex h-full cursor-default items-center justify-center text-center text-base font-bold hover:bg-gray-100">
                  Land
                </div>
                <div className="text-brand-accent flex h-full cursor-default items-center justify-center text-center text-base font-bold hover:bg-gray-100">
                  Short Let
                </div>
              </div>
            </div>
            <div className="relative flex h-[60px] w-full items-center justify-between rounded-xl bg-white shadow-sm">
              <div>
                <SearchIcon className="text-brand-accent absolute left-4 z-10" />
                <p className="pl-12 text-slate-400">Search for location</p>
              </div>
              <div className="my-1.5 mr-1.5 flex h-12 w-[115px] items-center justify-center rounded-lg bg-rose-500 font-bold text-white hover:bg-rose-500/90">
                Search
              </div>
            </div>
            <div className="container mx-auto flex max-w-[800px] items-center justify-around gap-2 pt-2 text-white">
              <div className="flex h-full items-center gap-2">
                <p>Property Type</p>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </div>
              <Separator
                orientation="vertical"
                className="h-[20px] bg-[#9A9EB5]"
              />
              <div className="flex h-full items-center gap-2">
                <p>Bedrooms</p>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </div>
              <Separator
                orientation="vertical"
                className="h-[20px] bg-[#9A9EB5]"
              />
              <div className="flex h-full items-center gap-2">
                <p>Bathrooms</p>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </div>
              <Separator
                orientation="vertical"
                className="h-[20px] bg-[#9A9EB5]"
              />
              <div className="flex h-full items-center gap-2">
                <p>Price range</p>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </div>
              <Separator
                orientation="vertical"
                className="h-[20px] bg-[#9A9EB5]"
              />
              <div className="flex h-full items-center gap-2">
                <p>More filter</p>
                <ListFilterPlus className="h-4 w-4 opacity-50" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Partner logos skeleton */}
      <div className="mt-[180px] hidden justify-center overflow-hidden lg:flex">
        <div className="flex animate-pulse gap-8">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-16 w-32" />
          ))}
        </div>
      </div>

      {/* Mobile: Show Featured Projects Skeleton instead of grid */}
      <div className="lg:hidden">
        <FeaturedProjectsSkeleton />
      </div>

      {/* Desktop: Show Grid Skeleton */}
      <Shell className="hidden lg:block">
        <div className="w-full p-4">
          {/* Grid ad skeleton */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Skeleton className="h-44 w-full rounded-lg" />
            <Skeleton className="h-44 w-full rounded-lg" />
          </div>
        </div>
      </Shell>
    </main>
  );
}
