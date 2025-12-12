import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import ContentSection from "@/components/layout/content-section";
import Shell from "@/layouts/shell";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ProjectsClient } from "./_components/projects-client";
import { ProjectsSearchFilter } from "./_components/projects-search-filter";
import { StreamingHeroBanner } from "@/components/streaming/StreamingHeroBanner";
import { StreamingErrorBoundary } from "@/components/streaming/StreamingErrorBoundary";
import { HeroBannerSkeleton } from "@/components/streaming/LoadingSkeletons";
import { getHeroBanner } from "@/lib/get-hero-banner";

interface AllUnitsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Generate metadata for SEO
export async function generateMetadata({
  searchParams,
}: AllUnitsPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams.category;

  let title = "Newly Built Units - Fresh Properties in Ghana | MeQasa";
  let description =
    "Discover newly built residential and commercial units in Ghana. Find fresh properties from verified developers across prime locations.";

  if (category === "new") {
    title = "New Units - Latest Properties in Ghana | MeQasa";
    description =
      "Discover the newest built units in Ghana. Fresh properties from top developers and property companies.";
  }

  if (category === "featured") {
    title = "Featured Units - Premium New Properties in Ghana | MeQasa";
    description =
      "Explore our featured premium newly built units in Ghana. Hand-picked properties from trusted developers.";
  }

  return {
    title,
    description,
    keywords: [
      "newly built units Ghana",
      "new properties Ghana",
      "fresh units Ghana",
      "residential units Ghana",
      "commercial units Ghana",
      "newly built properties Accra",
      "new construction Ghana",
      "fresh developments Ghana",
    ],
    authors: [{ name: "MeQasa" }],
    creator: "MeQasa",
    publisher: "MeQasa",
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: "/newly-built-units",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/newly-built-units",
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: `${siteConfig.url}/og-all-units.jpg`,
          width: 1200,
          height: 630,
          alt: "Newly Built Units - Fresh Properties in Ghana",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@meqasa",
      creator: "@meqasa",
      title,
      description,
      images: [`${siteConfig.url}/og-all-units.jpg`],
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

export default async function AllUnitsPage({
  searchParams,
}: AllUnitsPageProps) {
  const resolvedSearchParams = await searchParams;

  // Create hero banner promise for streaming (like home page)
  const heroBannerPromise = getHeroBanner();

  const segments = [
    { title: "Home", href: "/", key: "home" },
    {
      title: "Newly Built Units",
      href: "/newly-built-units",
      key: "newly-built-units",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner - Streaming with promise (same as home page) */}
      <div className="mb-0">
        <StreamingErrorBoundary fallback={<HeroBannerSkeleton />}>
          <StreamingHeroBanner heroBannerPromise={heroBannerPromise} />
        </StreamingErrorBoundary>
      </div>

      {/* Search Filters - Full width, sticky */}
      <div className="sticky top-[56px] z-50">
        <ProjectsSearchFilter />
      </div>

      <Shell className="py-8 md:py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs segments={segments} className="mb-8" />

        {/* Introductory Content */}
        <header className="mb-16 text-left">
          <h1 className="text-brand-accent mb-4 text-2xl font-bold leading-tight tracking-tight lg:text-3xl">
            Newly Built Units in Ghana
          </h1>
          <p className="text-brand-muted max-w-4xl text-sm leading-normal sm:text-base sm:leading-7">
            Fresh Units For Sale & Rent In Ghana. Discover newly built
            residential and commercial units across prime locations from
            verified developers.
          </p>
        </header>

        {/* Content Sections */}
        <div className="space-y-16 md:space-y-20">
          {/* Newly Built Houses for Sale */}
          <ContentSection
            title="Newly Built Houses for Sale"
            description="Explore premium newly built houses from verified developers across Ghana"
            href="/units/search?terms=sale&unittype=house"
            linkText="See All Houses"
            className="pt-4"
          >
            <ProjectsClient
              searchParams={{
                ...resolvedSearchParams,
                terms: "sale",
                unittype: "house",
              }}
              sectionType="houses-sale"
            />
          </ContentSection>

          {/* Newly Built Apartments for Sale */}
          <ContentSection
            title="Newly Built Apartments for Sale"
            description="Discover modern apartments for sale from trusted developers and property owners"
            href="/units/search?terms=sale&unittype=apartment"
            linkText="See All Apartments"
            className="pt-4"
          >
            <ProjectsClient
              searchParams={{
                ...resolvedSearchParams,
                terms: "sale",
                unittype: "apartment",
              }}
              sectionType="apartments-sale"
            />
          </ContentSection>

          {/* Newly Built Apartments for Rent */}
          <ContentSection
            title="Newly Built Apartments for Rent"
            description="Find quality rental apartments from verified developers and landlords"
            href="/units/search?terms=rent&unittype=apartment"
            linkText="See All Rentals"
            className="pt-4"
          >
            <ProjectsClient
              searchParams={{
                ...resolvedSearchParams,
                terms: "rent",
                unittype: "apartment",
              }}
              sectionType="apartments-rent"
            />
          </ContentSection>
        </div>
      </Shell>
    </div>
  );
}
