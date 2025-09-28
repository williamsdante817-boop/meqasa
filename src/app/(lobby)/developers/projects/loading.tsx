import { ProjectsSearchFilter } from "@/app/(lobby)/newly-built-units/_components/projects-search-filter";
import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import { HeroBannerSkeleton } from "@/components/streaming/LoadingSkeletons";
import { Button } from "@/components/ui/button";
import { Search, Building2 } from "lucide-react";
import Link from "next/link";
import Shell from "@/layouts/shell";
import { Skeleton } from "@/components/ui/skeleton";

// Development card skeleton component
function DevelopmentCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-brand-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative">
        <Skeleton className="h-48 w-full" />
        <div className="absolute top-3 right-3">
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2">
          <Skeleton className="h-6 w-3/4 mb-1" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
}

// Developer logos skeleton
function DeveloperLogosSkeleton() {
  return (
    <div className="py-12 border-b border-brand-border">
      <div className="flex items-center justify-center space-x-8 md:space-x-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-24 md:h-16 md:w-32" />
        ))}
      </div>
    </div>
  );
}

export default function DeveloperProjectsLoading() {
  const segments = [
    { title: "Home", href: "/", key: "home" },
    { title: "Developers", href: "/developers", key: "developers" },
    { title: "Projects", href: "/developers/projects", key: "projects" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner Skeleton */}
      <div className="mb-0">
        <HeroBannerSkeleton />
      </div>

      {/* Search Filters - Loading state */}
      <div className="sticky top-[56px] z-50">
        <ProjectsSearchFilter resultCount={0} />
      </div>

      <Shell>
        <DeveloperLogosSkeleton />
      </Shell>

      <Shell className="py-8 md:py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs segments={segments} className="mb-8" />

        {/* Header Loading */}
        <header className="mb-16 text-left">
          <Skeleton className="h-12 w-3/4 mb-6 md:h-16" />
          <div className="max-w-4xl space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-4/5" />
          </div>
        </header>

        {/* Development Cards Grid Loading */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <DevelopmentCardSkeleton key={i} />
          ))}
        </div>
      </Shell>

      {/* Call to Action Section */}
      <section className="border-t border-brand-border bg-gray-50">
        <Shell className="py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-brand-accent mb-6 text-3xl font-bold leading-tight md:text-4xl">
              Looking for Your Dream Property?
            </h2>
            <p className="text-brand-muted mb-8 text-lg leading-relaxed md:text-xl">
              Explore our extensive portfolio of premium developments across Ghana. From luxury apartments to family homes, find the perfect property that suits your lifestyle.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-brand-primary hover:bg-brand-primary-dark w-full text-white sm:w-auto"
              >
                <Link href="/search/sale?q=ghana">
                  <Search className="mr-2 h-5 w-5" />
                  Browse All Properties
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-brand-accent hover:bg-brand-primary hover:text-white w-full border-brand-primary sm:w-auto"
              >
                <Link href="/newly-built-units">
                  <Building2 className="mr-2 h-5 w-5" />
                  View New Units
                </Link>
              </Button>
            </div>
          </div>
        </Shell>
      </section>
    </div>
  );
}