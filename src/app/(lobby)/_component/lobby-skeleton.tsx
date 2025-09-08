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
        <div className="max-h-[305px] h-[305px] relative bg-gray-200">
          <Skeleton className="w-full h-full" />
        </div>

        {/* Mobile Page Header - Only visible on mobile */}
        <PageHeader
          as="section"
          className="mx-auto items-center gap-2 text-center lg:hidden flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white z-10"
          withPadding
        >
          <PageHeaderHeading className="animate-pulse text-white" as="h1">
            <Skeleton className="h-8 w-64 bg-white/20" />
          </PageHeaderHeading>
          <PageHeaderDescription className="max-w-[46.875rem] animate-pulse">
            <Skeleton className="h-4 w-80 bg-white/20 mt-2" />
          </PageHeaderDescription>
          {/* Mobile Search Trigger Skeleton */}
          <div className="mt-4 w-[80%] mx-auto">
            <Skeleton className="h-12 w-full bg-white/90 rounded-lg" />
          </div>
        </PageHeader>

        {/* Desktop Search Form - Only visible on desktop */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 px-4 w-full max-w-4xl hidden lg:block">
          <Card
            className="mx-auto my-0 h-fit w-full rounded-2xl border-0 p-2 lg:max-w-[928px] lg:p-3 gap-0"
            style={{ background: "rgba(11,17,52,.65)" }}
          >
            <div className="mx-auto my-0 w-4/5 lg:max-w-[460px]">
              <div className="grid h-[44px] w-full grid-cols-4 bg-white p-1.5 text-b-accent mb-4 rounded-xl overflow-hidden">
                <div className="font-bold text-brand-accent text-base rounded-md h-full flex items-center justify-center text-center bg-rose-500 text-white">
                  Rent
                </div>
                <div className="font-bold text-brand-accent text-base h-full flex items-center justify-center text-center hover:bg-gray-100 cursor-default">
                  Buy
                </div>
                <div className="font-bold text-brand-accent text-base h-full flex items-center justify-center text-center hover:bg-gray-100 cursor-default">
                  Land
                </div>
                <div className="font-bold text-brand-accent text-base h-full flex items-center justify-center text-center hover:bg-gray-100 cursor-default">
                  Short Let
                </div>
              </div>
            </div>
            <div className="relative h-[60px] w-full items-center rounded-xl bg-white shadow-sm flex justify-between">
              <div>
                <SearchIcon className="absolute left-4 z-10 text-brand-accent" />
                <p className="text-slate-400 pl-12">Search for location</p>
              </div>
              <div className="my-1.5 mr-1.5 h-12 text-white flex justify-center items-center w-[115px] rounded-lg bg-rose-500 hover:bg-rose-500/90 font-bold">
                Search
              </div>
            </div>
            <div className="flex items-center justify-around gap-2 pt-2 container max-w-[800px] mx-auto text-white">
              <div className="flex gap-2 items-center h-full">
                <p>Property Type</p>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </div>
              <Separator
                orientation="vertical"
                className="h-[20px] bg-[#9A9EB5]"
              />
              <div className="flex gap-2 items-center h-full">
                <p>Bedrooms</p>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </div>
              <Separator
                orientation="vertical"
                className="h-[20px] bg-[#9A9EB5]"
              />
              <div className="flex gap-2 items-center h-full">
                <p>Bathrooms</p>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </div>
              <Separator
                orientation="vertical"
                className="h-[20px] bg-[#9A9EB5]"
              />
              <div className="flex gap-2 items-center h-full">
                <p>Price range</p>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </div>
              <Separator
                orientation="vertical"
                className="h-[20px] bg-[#9A9EB5]"
              />
              <div className="flex gap-2 items-center h-full">
                <p>More filter</p>
                <ListFilterPlus className="h-4 w-4 opacity-50" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Partner logos skeleton */}
      <div className="mt-[180px] hidden lg:flex justify-center overflow-hidden">
        <div className="flex gap-8 animate-pulse">
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
