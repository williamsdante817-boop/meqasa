"use client";

import { ProjectsSearchFilter } from "@/app/(lobby)/newly-built-units/_components/projects-search-filter";
import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, RefreshCw, Search, Building2 } from "lucide-react";
import Link from "next/link";
import Shell from "@/layouts/shell";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DeveloperProjectsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Developer Projects page error:", error);
  }, [error]);

  const segments = [
    { title: "Home", href: "/", key: "home" },
    { title: "Developers", href: "/developers", key: "developers" },
    { title: "Projects", href: "/developers/projects", key: "projects" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Search Filters - Show without loading state */}
      <div className="sticky top-[56px] z-50">
        <ProjectsSearchFilter resultCount={0} />
      </div>

      <Shell className="py-8 md:py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs segments={segments} className="mb-8" />

        {/* Error Content */}
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mx-auto max-w-md">
            <div className="bg-red-50 border border-red-200 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-red-600" />
            </div>

            <h1 className="text-brand-accent mb-4 text-2xl font-bold leading-tight md:text-3xl">
              Something went wrong
            </h1>

            <p className="text-brand-muted mb-8 text-base leading-relaxed md:text-lg">
              We're having trouble loading the developer projects page. This could be due to a temporary issue with our servers.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                onClick={reset}
                size="lg"
                className="bg-brand-primary hover:bg-brand-primary-dark w-full text-white sm:w-auto"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-brand-accent hover:bg-brand-primary hover:text-white w-full border-brand-primary sm:w-auto"
              >
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            </div>

            {/* Development environment error details */}
            {process.env.NODE_ENV === "development" && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                  Error Details (Development Only)
                </summary>
                <div className="mt-2 rounded bg-gray-100 p-4 text-xs text-gray-800">
                  <p className="font-mono break-all">{error.message}</p>
                  {error.digest && (
                    <p className="mt-2 text-gray-600">Error ID: {error.digest}</p>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      </Shell>

      {/* Alternative Actions Section */}
      <section className="border-t border-brand-border bg-gray-50">
        <Shell className="py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-brand-accent mb-6 text-2xl font-bold leading-tight md:text-3xl">
              Explore Other Options
            </h2>
            <p className="text-brand-muted mb-8 text-base leading-relaxed md:text-lg">
              While we fix this issue, you can still browse our extensive property portfolio and find your perfect home.
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