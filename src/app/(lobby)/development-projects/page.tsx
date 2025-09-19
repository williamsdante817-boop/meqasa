import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import Shell from "@/layouts/shell";
import { Suspense } from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

// Components we'll create for the development projects page
import DevelopmentProjectsGrid from "./_component/development-projects-grid";
import DevelopmentProjectsFilters from "./_component/development-projects-filters";
import FeaturedDevelopments from "./_component/featured-developments";

interface DevelopmentProjectsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Generate metadata for SEO
export async function generateMetadata({
  searchParams,
}: DevelopmentProjectsPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const featured = resolvedSearchParams.featured;
  const status = resolvedSearchParams.status;

  let title = "Development Projects in Ghana | MeQasa";
  let description =
    "Explore premium real estate development projects in Ghana. Find luxury apartments, houses, and commercial developments from top developers.";

  if (featured) {
    title = "Featured Development Projects in Ghana | MeQasa";
    description =
      "Discover our featured real estate development projects in Ghana. Premium properties from verified developers.";
  }

  if (status === "new") {
    title = "New Development Projects in Ghana | MeQasa";
    description =
      "Explore the latest new development projects in Ghana. Fresh opportunities from leading real estate developers.";
  }

  return {
    title,
    description,
    keywords: [
      "development projects Ghana",
      "real estate developments",
      "luxury developments Ghana",
      "new developments Accra",
      "property developers Ghana",
      "residential developments",
      "commercial developments",
    ],
    authors: [{ name: "MeQasa" }],
    creator: "MeQasa",
    publisher: "MeQasa",
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: "/development-projects",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/development-projects",
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: `${siteConfig.url}/og-development-projects.jpg`,
          width: 1200,
          height: 630,
          alt: "Development Projects in Ghana",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@meqasa",
      creator: "@meqasa",
      title,
      description,
      images: [`${siteConfig.url}/og-development-projects.jpg`],
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
}

export default async function DevelopmentProjectsPage({
  searchParams,
}: DevelopmentProjectsPageProps) {
  const resolvedSearchParams = await searchParams;

  const segments = [
    { title: "Home", href: "/", key: "home" },
    { title: "Development Projects", href: "#", key: "development-projects" },
  ];

  // Determine page title based on filters
  const getPageTitle = () => {
    if (resolvedSearchParams.featured) {
      return "Featured Development Projects";
    }
    if (resolvedSearchParams.status === "new") {
      return "New Development Projects";
    }
    return "All Development Projects";
  };

  const getPageDescription = () => {
    if (resolvedSearchParams.featured) {
      return "Discover our hand-picked featured development projects from Ghana's top real estate developers.";
    }
    if (resolvedSearchParams.status === "new") {
      return "Explore the latest development projects launching in Ghana's prime locations.";
    }
    return "Browse all real estate development projects in Ghana. Find luxury apartments, houses, and commercial developments.";
  };

  return (
    <Shell className="pt-6 pb-8 md:py-8">
      <div className="space-y-6">
        {/* Breadcrumbs */}
        <Breadcrumbs segments={segments} />

        {/* Page Header */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-brand-accent text-2xl leading-tight font-bold tracking-tight sm:text-3xl md:text-4xl">
              {getPageTitle()}
            </h1>
            <p className="text-brand-muted text-base md:text-lg">
              {getPageDescription()}
            </p>
          </div>
        </div>

        {/* Featured Developments - Show only on main page or when featured=true */}
        {(!resolvedSearchParams.status || resolvedSearchParams.featured) && (
          <Suspense
            fallback={
              <div className="h-64 animate-pulse rounded-lg bg-gray-100" />
            }
          >
            <FeaturedDevelopments />
          </Suspense>
        )}

        {/* Filters Section */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-brand-accent mb-4 text-xl font-semibold">
              Filter Projects
            </h2>
            <DevelopmentProjectsFilters searchParams={resolvedSearchParams} />
          </div>

          {/* Projects Grid */}
          <Suspense
            fallback={
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-80 animate-pulse rounded-lg bg-gray-100"
                  />
                ))}
              </div>
            }
          >
            <DevelopmentProjectsGrid searchParams={resolvedSearchParams} />
          </Suspense>
        </div>
      </div>
    </Shell>
  );
}
