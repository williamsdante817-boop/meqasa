import Shell from "@/layouts/shell";
import { DeveloperCard } from "@/components/developer/cards/developer-card";
import SearchInput from "@/components/search-input";
import { getDevelopers } from "@/lib/get-developers";
import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import { Suspense } from "react";
import { StreamingErrorBoundary } from "@/components/streaming/StreamingErrorBoundary";
import { DevelopersSkeleton } from "@/components/developer/developers/developers-skeleton";
import { EmptyDevelopersState } from "@/components/developer/developers/empty-developers-state";
import { ErrorFallback } from "@/components/developer/developers/error-fallback";
import { analytics } from "@/lib/analytics";

export const metadata = {
  title: "Real Estate Developers | Meqasa",
  description:
    "Browse through our list of trusted real estate developers in Ghana",
  keywords:
    "real estate developers, Ghana, property developers, construction companies",
  openGraph: {
    title: "Real Estate Developers | Meqasa",
    description:
      "Browse through our list of trusted real estate developers in Ghana",
    type: "website",
  },
};

async function DevelopersContent() {
  const startTime = performance.now();

  try {
    const { developers } = await getDevelopers();

    // Track performance
    const loadTime = performance.now() - startTime;
    if (typeof window !== "undefined") {
      analytics.trackPerformance("developers_load_time", loadTime);
      analytics.trackEvent(
        "developers_loaded",
        "page_performance",
        "developers_page",
        developers.length,
      );
    }

    if (!developers || developers.length === 0) {
      return <EmptyDevelopersState />;
    }

    return (
      <>
        <div className="w-full mb-8">
          <SearchInput
            data={developers.map((dev) => ({
              developerid: dev.developerid,
              name: dev.companyname,
            }))}
            path="projects-by-developer"
            triggerLabel="Search developers..."
            inputPlaceholder="Search for developers..."
          />
        </div>
        <div className="space-y-8">
          {developers.map((developer) => (
            <DeveloperCard key={developer.developerid} developer={developer} />
          ))}
        </div>
      </>
    );
  } catch (error) {
    // Track errors
    if (typeof window !== "undefined" && error instanceof Error) {
      analytics.trackError(error, "developers_content");
    }
    throw error;
  }
}

export default function DevelopersPage() {
  return (
    <Shell>
      <div className="py-8">
        <div className="grid grid-cols-1 text-brand-accent w-full mt-4 lg:grid-cols-[2fr_1fr] lg:gap-8 lg:px-0">
          <div>
            <Breadcrumbs
              className="mb-6"
              segments={[
                { title: "Home", href: "/" },
                { title: "Developers", href: "#" },
              ]}
            />
            <header className="mb-8 text-b-accent">
              <h1 className="mb-2 text-lg font-bold leading-tight tracking-tighter text-brand-accent md:text-xl">
                Find a Developer
              </h1>
            </header>

            <StreamingErrorBoundary
              fallback={<DevelopersSkeleton />}
              errorFallback={<ErrorFallback />}
            >
              <Suspense fallback={<DevelopersSkeleton />}>
                <DevelopersContent />
              </Suspense>
            </StreamingErrorBoundary>
          </div>
        </div>
      </div>
    </Shell>
  );
}
