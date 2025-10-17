import { Suspense } from "react";
import { headers } from "next/headers";
import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import { ResultsPopup } from "@/components/results-popup";
import { HeroBanner, HeroBannerFallback } from "@/components/search/HeroBanner";
import PropertyTypeLinks from "@/components/search/PropertyTypeLinks";
import { ReferenceSearch } from "@/components/search/ReferenceSearch";
import { ResultSearchFilter } from "@/components/search/results-search-filter";
import {
  StreamingFlexiBannerWrapper,
  StreamingSidebarBanners,
} from "@/components/search/StreamingBanners";
import { siteConfig } from "@/config/site";
import Shell from "@/layouts/shell";
import { getResultsHeroBanner } from "@/lib/banners";
import { normalizeHeroBanner } from "@/lib/hero-banner";
import { logError } from "@/lib/logger";
import { loadMoreProperties, searchProperties } from "@/lib/meqasa";
import { ANY_SENTINEL } from "@/lib/search/constants";
import type { Metadata } from "next";
import { SearchResultsWrapper } from "./SearchResultsWrapper";

export const dynamic = "force-dynamic";

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
  const isShortLet =
    resolvedSearchParams.frentperiod === "shortrent" ||
    resolvedSearchParams.fhowshort !== undefined;
  const headingParams: Record<string, string> = {
    ...resolvedSearchParams,
  };
  if (isShortLet) {
    headingParams.frentperiod = "shortrent";
    headingParams.ftype = ANY_SENTINEL;
  }

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
  const headersList = await headers();
  const forwardedProto = headersList.get("x-forwarded-proto");
  const forwardedHost = headersList.get("x-forwarded-host");
  const hostHeader = forwardedHost ?? headersList.get("host") ?? undefined;
  const fallbackBase =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
  const apiBaseUrl = hostHeader && forwardedProto
    ? `${forwardedProto}://${hostHeader}`
    : fallbackBase ?? "http://localhost:3000";

  const { type } = await params;
  const resolvedSearchParams = await searchParams;
  const location = resolvedSearchParams.q ?? "Ghana";
  const isShortLet =
    resolvedSearchParams.frentperiod === "shortrent" ||
    resolvedSearchParams.fhowshort !== undefined;

  const headingParams: Record<string, string> = {
    ...resolvedSearchParams,
  };
  if (isShortLet) {
    headingParams.frentperiod = "shortrent";
    headingParams.ftype = ANY_SENTINEL;
  }

  // Load critical data on server: hero banner and search results
  const [heroBanner, searchData] = await Promise.all([
    getResultsHeroBanner().catch(() => null),
    (async () => {
      const currentPage = parseInt(resolvedSearchParams.w ?? "1");
      const urlSearchId = resolvedSearchParams.y
        ? parseInt(resolvedSearchParams.y)
        : null;

      const canonicalResultTotalRaw = resolvedSearchParams.rtotal;
      const canonicalResultTotal =
        canonicalResultTotalRaw !== undefined
          ? Number(canonicalResultTotalRaw)
          : null;

      try {
        if (currentPage > 1 && urlSearchId) {
          const loadMoreResult = await loadMoreProperties(type, location, {
            y: urlSearchId,
            w: currentPage,
          }, { baseUrl: apiBaseUrl });
          if (
            canonicalResultTotal !== null &&
            !Number.isNaN(canonicalResultTotal)
          ) {
            return {
              ...loadMoreResult,
              resultcount: canonicalResultTotal,
            };
          }
          return loadMoreResult;
        } else {
          const sanitizedSearchParams = { ...resolvedSearchParams };
          delete sanitizedSearchParams.w;
          delete sanitizedSearchParams.page;
          delete sanitizedSearchParams.rtotal;
          if (
            sanitizedSearchParams.frentperiod === "shortrent" ||
            sanitizedSearchParams.fhowshort !== undefined
          ) {
            sanitizedSearchParams.ftype = ANY_SENTINEL;
            sanitizedSearchParams.frentperiod = "shortrent";
          }
          const searchResult = await searchProperties(type, location, {
            ...sanitizedSearchParams,
            app: "vercel",
          }, { baseUrl: apiBaseUrl });
          if (
            canonicalResultTotal !== null &&
            !Number.isNaN(canonicalResultTotal)
          ) {
            return {
              ...searchResult,
              resultcount: canonicalResultTotal,
            };
          }
          return searchResult;
        }
      } catch (error) {
        console.error("Error fetching search data:", error);
        // Return a fallback response instead of throwing
        return {
          results: [],
          resultcount: 0,
          searchid: 0,
          topads: [],
          project1: { empty: true },
          project2: { empty: true },
          bottomads: [],
          searchdesc: "",
        };
      }
    })(),
  ]);

  const canonicalResultTotalFromUrlRaw = resolvedSearchParams.rtotal;
  const canonicalResultTotalFromUrl =
    canonicalResultTotalFromUrlRaw !== undefined
      ? Number(canonicalResultTotalFromUrlRaw)
      : null;
  const normalizedResultCount = Number(searchData.resultcount) || 0;
  const initialTotal =
    canonicalResultTotalFromUrl !== null &&
    !Number.isNaN(canonicalResultTotalFromUrl)
      ? canonicalResultTotalFromUrl
      : normalizedResultCount;
  const hydratedSearchData = {
    ...searchData,
    resultcount: initialTotal,
  };

  const segments = [
    { title: "Home", href: "/", key: "home" },
    {
      title: isShortLet
        ? "Short-term Rentals"
        : `For ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      href: `/search/${type}`,
      key: `search-${type}`,
    },
    { title: location, href: "#", key: `location-${location}` },
  ];

  // Generate dynamic, contextual headings
  const generateDynamicHeading = (
    type: string,
    location: string,
    searchParams: Record<string, string>
  ): string => {
    const isShortTerm = searchParams.frentperiod === "shortrent";
    const typeDisplay = isShortTerm
      ? "Short-term Rentals"
      : type === "rent"
        ? "Rental"
        : type === "sale"
          ? "Sale"
          : type;
    const locationDisplay = location === "ghana" ? "Ghana" : location;

    // Check for specific filters to make heading more specific
    const propertyType = searchParams.ftype;
    const bedrooms = searchParams.fbeds;
    const furnished = searchParams.fisfurnished;
    const owner = searchParams.ffsbo;

    // Build contextual heading
    let heading = isShortTerm
      ? "Short-term Rentals"
      : `${typeDisplay} Properties`;

    if (
      !isShortTerm &&
      propertyType &&
      propertyType !== "all" &&
      propertyType !== ANY_SENTINEL
    ) {
      const propertyTypeMap: Record<string, string> = {
        house: "Houses",
        apartment: "Apartments",
        office: "Office Spaces",
        land: "Land Plots",
        shop: "Shop Spaces",
        warehouse: "Warehouses",
      };
      heading = `${propertyTypeMap[propertyType] ?? propertyType} for ${typeDisplay}`;
    }

    if (bedrooms && bedrooms !== "- Any -") {
      heading = `${bedrooms} Bedroom ${heading}`;
    }

    if (furnished === "1") {
      heading = `Furnished ${heading}`;
    }

    if (owner === "1") {
      heading = `Owner-Direct ${heading}`;
    }

    heading += ` in ${locationDisplay}`;

    return heading;
  };

  const generateDynamicSubheading = (
    type: string,
    location: string,
    resultCount: number,
    searchParams: Record<string, string>
  ): string => {
    const locationDisplay = location === "ghana" ? "Ghana" : location;

    // Check for price filters
    const minPrice = searchParams.fmin;
    const maxPrice = searchParams.fmax;

    let subheading = `${resultCount} ${resultCount === 1 ? "property" : "properties"} found`;

    if (minPrice || maxPrice) {
      if (minPrice && maxPrice) {
        subheading += ` from GH₵${Number(minPrice).toLocaleString()} to GH₵${Number(maxPrice).toLocaleString()}`;
      } else if (minPrice) {
        subheading += ` from GH₵${Number(minPrice).toLocaleString()}+`;
      } else if (maxPrice) {
        subheading += ` up to GH₵${Number(maxPrice).toLocaleString()}`;
      }
    }

    // Add location context
    if (location !== "ghana") {
      subheading += ` in ${locationDisplay}`;
    }

    // Add property type context
    const propertyType = searchParams.ftype;
    if (
      propertyType &&
      propertyType !== "all" &&
      propertyType !== ANY_SENTINEL
    ) {
      const propertyTypeMap: Record<string, string> = {
        house: "houses",
        apartment: "apartments",
        office: "office spaces",
        land: "land plots",
        shop: "shop spaces",
        warehouse: "warehouses",
      };
      subheading += ` • ${propertyTypeMap[propertyType] ?? propertyType}`;
    }

    return subheading;
  };

  // Generate structured data for search results
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: isShortLet
      ? `Short-term rentals in ${location}`
      : `Properties for ${type} in ${location}`,
    description: isShortLet
      ? `Search results for short-term rentals in ${location}`
      : `Search results for properties available for ${type} in ${location}`,
    url: `${siteConfig.url}/search/${type}?q=${encodeURIComponent(location)}`,
    numberOfItems: initialTotal,
    itemListElement:
      hydratedSearchData.results?.map((property, index) => ({
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
      })) ?? [],
  };

  const normalizedHeroBanner = normalizeHeroBanner(heroBanner);

  if (heroBanner && !normalizedHeroBanner) {
    logError("Results hero banner payload missing required fields", undefined, {
      component: "SearchPage",
      payload: heroBanner,
    });
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div>
        {/* Hero Banner - loaded on server, immediately available */}
        {normalizedHeroBanner ? (
          <HeroBanner
            src={normalizedHeroBanner.src}
            href={normalizedHeroBanner.href}
            alt={normalizedHeroBanner.alt}
            ariaLabel={normalizedHeroBanner.ariaLabel}
          />
        ) : (
          <HeroBannerFallback />
        )}

        <div className="sticky top-[56px] z-50 bg-white">
          <ResultSearchFilter />
        </div>
        <Shell className="mt-12 flex max-w-[1250px] gap-8 md:px-0">
          <PropertyTypeLinks />
          <div className="w-full">
            <Breadcrumbs className="capitalize" segments={segments} />
            <header className="space-y-6">
              <div>
                <h1 className="text-brand-accent mt-2 text-lg leading-6 font-bold capitalize md:text-xl">
                  {generateDynamicHeading(type, location, headingParams)}
                </h1>
                <p className="text-brand-muted mt-3 text-sm">
                  {generateDynamicSubheading(
                    type,
                    location,
                    initialTotal,
                    headingParams
                  )}
                </p>
              </div>

              {/* Unified Reference Search Component - Properties + Units */}
              <div className="rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-green-50 p-4">
                <ReferenceSearch
                  showLabel={true}
                  size="default"
                  className="max-w-md"
                  enableUnifiedSearch={true}
                  placeholder="Search by reference (e.g. 086983)"
                />
              </div>
            </header>

            <div className="mt-8 grid w-full grid-cols-1 gap-8 md:px-0 lg:grid-cols-[minmax(0,736px)_1fr]">
              <div>
                {/* Streaming Flexi Banner - non-critical, loads progressively */}
                <Suspense fallback={null}>
                  <StreamingFlexiBannerWrapper />
                </Suspense>

                {/* Main search results - critical content loads immediately */}
                <SearchResultsWrapper
                  type={type}
                  location={location}
                  initialResults={hydratedSearchData.results}
                  initialTotal={initialTotal}
                  initialSearchId={hydratedSearchData.searchid ?? 0}
                  initialPage={parseInt(resolvedSearchParams.w ?? "1")}
                  initialSearchData={hydratedSearchData}
                />
              </div>

              {/* Streaming Sidebar Banners - non-critical, loads progressively */}
              <Suspense fallback={null}>
                <StreamingSidebarBanners />
              </Suspense>
            </div>
          </div>
        </Shell>
        <ResultsPopup type={type} />
      </div>
    </>
  );
}
