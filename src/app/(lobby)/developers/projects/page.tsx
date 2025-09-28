import { ProjectsSearchFilter } from "@/app/(lobby)/newly-built-units/_components/projects-search-filter";
import { HeroBannerSkeleton } from "@/components/streaming/LoadingSkeletons";
import { StreamingErrorBoundary } from "@/components/streaming/StreamingErrorBoundary";
import { StreamingHeroBanner } from "@/components/streaming/StreamingHeroBanner";
import { siteConfig } from "@/config/site";
import Shell from "@/layouts/shell";
import { transformApiDataToDevelopments } from "@/lib/development-data-transformer";
import { getDevelopments } from "@/lib/get-developments";
import { getHeroBanner } from "@/lib/get-hero-banner";
import type { DeveloperProjectsPageProps } from "@/types/development";
import type { Metadata } from "next";
import { DeveloperLogos } from "../_components/developer-marquee";
import { CallToAction } from "./_components/call-to-action";
import { PageHeader } from "./_components/page-header";
import { ProjectResults } from "./_components/project-results";
import { SeoContent } from "./_components/seo-content";

/**
 * Generate metadata for SEO optimization
 * @param searchParams - URL search parameters containing category and other filters
 * @returns Metadata object with title, description, and social sharing tags
 */
export async function generateMetadata({
  searchParams,
}: DeveloperProjectsPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams.category;

  let title =
    "Developer Projects - Professional Property Developments in Ghana | MeQasa";
  let description =
    "Explore developer projects and professional property developments in Ghana. Find quality residential and commercial projects from verified developers.";

  if (category === "featured") {
    title =
      "Featured Developer Projects - Premium Developments in Ghana | MeQasa";
    description =
      "Discover our featured premium developer projects in Ghana. Hand-picked developments from trusted property developers.";
  }

  return {
    title,
    description,
    keywords: [
      "developer projects Ghana",
      "property developments Ghana",
      "real estate developers Ghana",
      "residential projects Ghana",
      "commercial projects Ghana",
      "developer properties Accra",
      "property construction Ghana",
      "real estate development Ghana",
    ],
    authors: [{ name: "MeQasa" }],
    creator: "MeQasa",
    publisher: "MeQasa",
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: "/developers/projects",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/developers/projects",
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: `${siteConfig.url}/og-developer-projects.jpg`,
          width: 1200,
          height: 630,
          alt: "Developer Projects - Professional Property Developments in Ghana",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@meqasa",
      creator: "@meqasa",
      title,
      description,
      images: [`${siteConfig.url}/og-developer-projects.jpg`],
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

/**
 * Developer Projects page component displaying a list of development projects
 * with search filters, hero banner, and project cards
 * @param searchParams - URL search parameters for filtering and pagination
 * @returns React component with developer projects layout
 */
export default async function DeveloperProjectsPage({
  searchParams,
}: DeveloperProjectsPageProps) {
  // Resolve search params for future use (currently unused but needed for metadata)
  await searchParams;
  // Fetch development data from the API
  const developmentData = await getDevelopments();
  // Transform API data to component format
  const developments = transformApiDataToDevelopments(developmentData);
  // Create hero banner promise for streaming (like newly built units page)
  const heroBannerPromise = getHeroBanner();

  const segments = [
    { title: "Home", href: "/", key: "home" },
    { title: "Developers", href: "/developers", key: "developers" },
    { title: "Projects", href: "/developers/projects", key: "projects" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner - Streaming with promise (same as newly built units page) */}
      <div className="mb-0">
        <StreamingErrorBoundary fallback={<HeroBannerSkeleton />}>
          <StreamingHeroBanner heroBannerPromise={heroBannerPromise} />
        </StreamingErrorBoundary>
      </div>

      {/* Search Filters - Full width, sticky */}
      <div className="sticky top-[56px] z-50">
        <ProjectsSearchFilter resultCount={developments.length} />
      </div>
      <Shell>
        <DeveloperLogos developers={developmentData?.developers} />
      </Shell>

      <Shell className="py-8 md:py-12">
        <PageHeader segments={segments} />
        <ProjectResults developments={developments} />
      </Shell>

      <SeoContent />
      <CallToAction />
    </div>
  );
}
