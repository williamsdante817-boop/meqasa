import { Breadcrumbs } from "@/components/bread-crumbs";
import { HeroBannerSkeleton } from "@/components/search/BannerSkeleton";
import { HeroBanner } from "@/components/search/HeroBanner";
import PropertyTypeLinks from "@/components/search/PropertyTypeLinks";
import { ResultSearchFilter } from "@/components/search/results-search-filter";
import {
  StreamingFlexiBannerWrapper,
  StreamingSidebarBanners,
} from "@/components/search/StreamingBanners";
import { ResultsPopup } from "@/components/results-popup";
import Shell from "@/layouts/shell";
import { getResultsHeroBanner } from "@/lib/banners";
import { loadMoreProperties, searchProperties } from "@/lib/meqasa";
import { SearchResultsWrapper } from "./SearchResultsWrapper";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface SearchPageProps {
  params: Promise<{ type: string }>;
  searchParams: Promise<Record<string, string>>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { type } = await params;
  const resolvedSearchParams = await searchParams;
  const location = resolvedSearchParams.q ?? "Ghana";

  const typeDisplay = type.charAt(0).toUpperCase() + type.slice(1);
  const locationDisplay = location.charAt(0).toUpperCase() + location.slice(1);

  const title = `Properties for ${typeDisplay} in ${locationDisplay} | MeQasa`;
  const description = `Find properties for ${type} in ${location}. Browse houses, apartments, offices, and land available for ${type} on MeQasa - Ghana's trusted real estate platform.`;

  const keywords = [
    `properties for ${type}`,
    `${type} properties ${location}`,
    `real estate ${location}`,
    `${type} houses ${location}`,
    `${type} apartments ${location}`,
    `${type} office spaces ${location}`,
    `${type} land ${location}`,
    "MeQasa",
    "Ghana real estate",
    `${location} properties`,
  ];

  return {
    title,
    description,
    keywords,
    authors: [{ name: "MeQasa" }],
    creator: "MeQasa",
    publisher: "MeQasa",
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: `/search/${type}?q=${encodeURIComponent(location)}`,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: `/search/${type}?q=${encodeURIComponent(location)}`,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: `${siteConfig.url}/og-search-${type}.jpg`,
          width: 1200,
          height: 630,
          alt: `Properties for ${typeDisplay} in ${locationDisplay}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@meqasa",
      creator: "@meqasa",
      title,
      description,
      images: [`${siteConfig.url}/og-search-${type}.jpg`],
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

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const { type } = await params;
  const resolvedSearchParams = await searchParams;
  const location = resolvedSearchParams.q ?? "Ghana";

  // Load critical data on server: hero banner and search results
  const [heroBanner, searchData] = await Promise.all([
    getResultsHeroBanner().catch(() => null),
    (async () => {
      const currentPage = parseInt(resolvedSearchParams.page ?? "1");
      const urlSearchId = resolvedSearchParams.searchId
        ? parseInt(resolvedSearchParams.searchId)
        : null;

      try {
        if (currentPage > 1 && urlSearchId) {
          return await loadMoreProperties(type, location, {
            y: urlSearchId,
            w: currentPage,
          });
        } else {
          return await searchProperties(type, location, {
            ...resolvedSearchParams,
            app: "vercel",
          });
        }
      } catch (error) {
        console.error("Error fetching search data:", error);
        // Return a fallback response instead of throwing
        return {
          results: [],
          resultcount: 0,
          searchid: null,
        };
      }
    })(),
  ]);

  const segments = [
    { title: "Home", href: "/", key: "home" },
    {
      title: `For ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      href: `/search/${type}`,
      key: `search-${type}`,
    },
    { title: location, href: "#", key: `location-${location}` },
  ];

  // Generate structured data for search results
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Properties for ${type} in ${location}`,
    description: `Search results for properties available for ${type} in ${location}`,
    url: `${siteConfig.url}/search/${type}?q=${encodeURIComponent(location)}`,
    numberOfItems: searchData.resultcount || 0,
    itemListElement:
      searchData.results?.map((property, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "RealEstateListing",
          name: property.summary ?? `Property for ${type}`,
          description:
            property.description ??
            `Property available for ${type} in ${location}`,
          url: `${siteConfig.url}/listings/${property.listingid}`,
          image: property.image
            ? `${siteConfig.url}/uploads/imgs/${property.image}`
            : undefined,
          offers: {
            "@type": "Offer",
            availability:
              type === "rent"
                ? "https://schema.org/InStock"
                : "https://schema.org/InStock",
            price: property.priceval?.toString() ?? "Contact for price",
            priceCurrency: "GHS",
          },
          address: {
            "@type": "PostalAddress",
            addressLocality: location,
            addressCountry: "Ghana",
          },
        },
      })) || [],
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div>
        {/* Hero Banner - loaded on server, immediately available */}
        {heroBanner ? (
          <HeroBanner
            src={heroBanner.src}
            href={heroBanner.href}
            alt="Hero banner showcasing featured properties"
          />
        ) : (
          <HeroBannerSkeleton />
        )}

        <div className="hidden md:block sticky top-[64px] z-50 bg-white">
          <ResultSearchFilter />
        </div>
        <Shell className="mt-12 flex gap-8 md:px-0">
          <PropertyTypeLinks />
          <div className="w-full">
            <Breadcrumbs className="capitalize" segments={segments} />
            <header>
              <h1 className="mt-2 text-lg font-bold leading-6 text-brand-accent capitalize md:text-xl">
                Property for {type} in {location}
              </h1>
              <p className="mt-3 text-sm text-brand-muted">
                {searchData.resultcount} properties found
              </p>
            </header>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[736px,300px] mt-8 md:px-0">
              <div>
                {/* Streaming Flexi Banner - non-critical, loads progressively */}
                <StreamingFlexiBannerWrapper />

                {/* Main search results - critical content loads immediately */}
                <SearchResultsWrapper
                  type={type}
                  location={location}
                  initialResults={searchData.results}
                  initialTotal={searchData.resultcount}
                  initialSearchId={searchData.searchid ?? 0}
                  initialPage={parseInt(resolvedSearchParams.page ?? "1")}
                />
              </div>

              {/* Streaming Sidebar Banners - non-critical, loads progressively */}
              <StreamingSidebarBanners />
            </div>
          </div>
        </Shell>
        <ResultsPopup type={type} />
      </div>
    </>
  );
}
