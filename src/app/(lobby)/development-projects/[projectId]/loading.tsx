import React from "react";
import Shell from "@/layouts/shell";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ProjectLoading() {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <Shell>
        {/* Breadcrumbs skeleton */}
        <div className="flex items-center gap-2 my-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
      </Shell>

      {/* Hero image skeleton */}
      <div className="relative w-full h-[250px] md:h-[450px] overflow-hidden flex md:mb-4 bg-gray-200">
        <Skeleton className="w-full h-full" />
      </div>

      <Shell>
        <div className="h-fit w-full bg-inherit">
          <div className="relative z-10 flex items-end gap-2 p-3 lg:-top-14 lg:gap-8">
            {/* Company Logo Card skeleton */}
            <div className="bg-white rounded-lg p-2 w-[130px] h-[130px] md:w-[160px] md:h-[160px] flex items-center justify-center border shadow-lg">
              <Skeleton className="w-[120px] h-[120px]" />
            </div>

            <div className="flex grow items-center justify-between">
              <div className="grid">
                <Skeleton className="h-8 w-64 mb-1" />
                <Skeleton className="h-6 w-24 mb-3" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-48" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-32 rounded-lg bg-gray-700 hidden md:flex" />
              </div>
            </div>
          </div>
        </div>
      </Shell>

      <Shell>
        <div className="grid grid-cols-1 text-brand-accent w-full mt-12 md:grid-cols-[2fr,1fr] lg:gap-8">
          <div className="mt-6 grid gap-8 px-3 pb-3 transition-all duration-300 ease-in lg:grid-cols-1 lg:px-0">
            {/* Project Highlight section */}
            <div>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="flex items-center gap-4 mb-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-5 w-56" />
            </div>

            {/* Price range card */}
            <div className="mt-6 flex items-center justify-between rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-50 p-4 md:p-6 shadow-sm">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-40" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-40" />
              </div>
            </div>

            {/* About Developer section */}
            <div className="pt-14 md:pt-20 pb-10 md:pb-0">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>

            {/* Project Details section */}
            <div className="pt-14 md:pt-20 hidden md:block">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>

            {/* Features section */}
            <div className="pt-14 md:pt-20">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }, (_, i) => (
                  <Skeleton key={i} className="h-6 w-32" />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>

            <Card className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </Card>
          </div>
        </div>
      </Shell>
    </div>
  );
}
