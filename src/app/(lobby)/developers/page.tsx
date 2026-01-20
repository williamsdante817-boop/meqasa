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

import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Estate Developers | MeQasa Ghana",
  description:
    "Browse through our list of trusted real estate developers in Ghana. Find verified property developers and construction companies for your next project.",
  keywords: [
    "real estate developers Ghana",
    "property developers Ghana",
    "construction companies Ghana",
    "Ghana developers",
    "property development Ghana",
    "real estate companies Ghana",
    "trusted developers Ghana",
    "Accra developers",
  ],
  authors: [{ name: "MeQasa" }],
  creator: "MeQasa",
  publisher: "MeQasa",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/developers",
  },
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "/developers",
    siteName: siteConfig.name,
    title: "Real Estate Developers | MeQasa Ghana",
    description:
      "Browse through our list of trusted real estate developers in Ghana. Find verified property developers and construction companies.",
    images: [
      {
        url: `${siteConfig.url}/og-developers.jpg`,
        width: 1200,
        height: 630,
        alt: "MeQasa Real Estate Developers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@meqasa",
    creator: "@meqasa",
    title: "Real Estate Developers | MeQasa Ghana",
    description:
      "Browse through our list of trusted real estate developers in Ghana. Find verified property developers and construction companies.",
    images: [`${siteConfig.url}/og-developers.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        developers.length
      );
    }

    if (!developers || developers.length === 0) {
      return <EmptyDevelopersState />;
    }

    return (
      <>
        <div className="mb-8 w-full">
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
        <div className="text-brand-accent mt-4 grid w-full grid-cols-1 lg:grid-cols-[2fr_1fr] lg:gap-8 lg:px-0">
          <div>
            <Breadcrumbs
              className="mb-6"
              segments={[
                { title: "Home", href: "/" },
                { title: "Developers", href: "#" },
              ]}
            />
            <header className="text-b-accent mb-8">
              <h1 className="text-brand-accent mb-2 text-lg leading-tight font-bold tracking-tighter md:text-xl">
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
