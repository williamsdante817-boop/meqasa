import { ProjectsSearchFilter } from "@/app/(lobby)/newly-built-units/_components/projects-search-filter";
import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import { HeroBannerSkeleton } from "@/components/streaming/LoadingSkeletons";
import { StreamingErrorBoundary } from "@/components/streaming/StreamingErrorBoundary";
import { StreamingHeroBanner } from "@/components/streaming/StreamingHeroBanner";
import { siteConfig } from "@/config/site";
import Shell from "@/layouts/shell";
import { getHeroBanner } from "@/lib/get-hero-banner";
import type { Metadata } from "next";
import { DeveloperLogos } from "../_components/developer-marquee";
import { DevelopmentCardsGrid } from "../_components/development-cards-grid";
import { Button } from "@/components/ui/button";
import { Search, Building2 } from "lucide-react";
import Link from "next/link";

interface Development {
  id: string;
  imageUrl: string;
  developmentName: string;
  location: string;
  developerName: string;
  developerLogo?: string;
  projectValue?: string;
}

interface DeveloperProjectsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Generate metadata for SEO
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

const developments: Development[] = [
  {
    id: "greenwich-park",
    imageUrl:
      "https://images.unsplash.com/photo-1720608594472-bc29045eef28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXNpZGVudGlhbCUyMGRldmVsb3BtZW50JTIwR2hhbmF8ZW58MXx8fHwxNzU4MjQzOTIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    developmentName: "GreenwichPark by IndigoHomes",
    location: "Borteyman",
    developerName: "IndigoHomes",
  },
  {
    id: "the-summit",
    imageUrl:
      "https://images.unsplash.com/photo-1660481860920-d9b9a1895161?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGNvbnN0cnVjdGlvbnxlbnwxfHx8fDE3NTgyNDM5MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    developmentName: "The Summit",
    location: "Accra",
    developerName: "TKSNG",
  },
  {
    id: "star-properties",
    imageUrl:
      "https://images.unsplash.com/photo-1564133831496-567eef17441e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0b3duaG91c2UlMjBkZXZlbG9wbWVudCUyMGFlcmlhbHxlbnwxfHx8fDE3NTgyNDM5MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    developmentName: "STAR PROPERTIES",
    location: "Lakeside Estates",
    developerName: "Star Properties Ltd",
  },
  {
    id: "legato-heights",
    imageUrl:
      "https://images.unsplash.com/photo-1746823032195-3f934451d4e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwcmlzZSUyMHJlc2lkZW50aWFsJTIwYnVpbGRpbmclMjBtb2Rlcm58ZW58MXx8fHwxNzU4MjQzOTMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    developmentName: "Legato Heights",
    location: "Ridge",
    developerName: "VAAL",
    projectValue: "$29K",
  },
  {
    id: "luxe-maison",
    imageUrl:
      "https://images.unsplash.com/photo-1631168270165-8f7c0e3cefad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBlc3RhdGUlMjBkZXZlbG9wbWVudCUyMGxhbmRzY2FwaW5nfGVufDF8fHx8MTc1ODI0MzkzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    developmentName: "Luxe Maison",
    location: "Airport Residential",
    developerName: "Luxe Developers",
  },
  {
    id: "earlwood-close",
    imageUrl:
      "https://images.unsplash.com/photo-1622015663381-d2e05ae91b72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjB2aWxsYSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NTgyMDAwMTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    developmentName: "Earlwood Close",
    location: "Cantonments",
    developerName: "GoldKey",
  },
];

export default async function DeveloperProjectsPage({
  searchParams,
}: DeveloperProjectsPageProps) {
  const resolvedSearchParams = await searchParams;

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
        <ProjectsSearchFilter resultCount={250} />
      </div>
      <Shell>
        <DeveloperLogos />
      </Shell>

      <Shell className="py-8 md:py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs segments={segments} className="mb-8" />

        {/* Introductory Content */}
        <header className="mb-16 text-left">
          <h1 className="text-brand-accent mb-6 text-3xl leading-tight font-bold tracking-tight md:text-4xl lg:text-5xl">
            Developer Projects in Ghana
          </h1>
          <p className="text-brand-muted max-w-4xl text-lg leading-relaxed md:text-xl">
            Professional Property Developments For Sale & Rent In Ghana.
            Discover quality residential and commercial projects from verified
            developers and property companies across Ghana's leading real estate
            markets.
          </p>
        </header>

        <DevelopmentCardsGrid developments={developments} />
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
