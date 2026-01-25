import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import { ResultsPopup } from "@/components/results-popup";
import { HeroBanner, HeroBannerFallback } from "@/components/search/HeroBanner";
import PropertyTypeLinks from "@/components/search/PropertyTypeLinks";
import { ReferenceSearch } from "@/components/search/ReferenceSearch";
import { ResultSearchFilter } from "@/components/search/results-search-filter";
import { SearchError } from "@/components/search/SearchError";
import {
  StreamingFlexiBannerWrapper,
  StreamingSidebarBanners,
} from "@/components/search/StreamingBanners";
import { siteConfig } from "@/config/site";
import Shell from "@/layouts/shell";
import { getResultsHeroBanner } from "@/lib/banners";
import { getResultsPopup } from "@/lib/get-results-popup";
import { normalizeHeroBanner } from "@/lib/hero-banner";
import { logError, logger } from "@/lib/logger";
import {
  loadMorePropertiesServer,
  searchPropertiesServer,
} from "@/lib/meqasa-server";
import { ANY_SENTINEL } from "@/lib/search/constants";
import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchResults } from "./search-results";

export const dynamic = "force-dynamic";

interface SearchPageProps {
  params: Promise<{
    type: string;
  }>;
  searchParams: Promise<{
    q?: string;
    ftype?: string;
    fbeds?: string;
    fbaths?: string;
    fmin?: string;
    fmax?: string;
    fminarea?: string;
    fmaxarea?: string;
    frentperiod?: string;
    fsort?: string;
    fisfurnished?: string;
    ffsbo?: string;
    w?: string;
    y?: string;
    rtotal?: string;
    fhowshort?: string;
  }>;
}

// Generate metadata for the search page
export async function generateMetadata({
  params,
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { type } = await params;
  const { q, ftype, fbeds } = await searchParams;

  const location = q || "Ghana";
  const propertyType = ftype && ftype !== "all" ? ftype : "";
  const bedrooms = fbeds && fbeds !== "- Any -" ? fbeds : "";

  // Build dynamic title
  let title = "";
  if (propertyType) {
    title = `${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}${bedrooms ? ` ${bedrooms} Bedroom` : ""} for ${type === "rent" ? "Rent" : "Sale"}`;
  } else {
    title = `Property for ${type === "rent" ? "Rent" : "Sale"}`;
  }
  title += ` in ${location} | ${siteConfig.name}`;

  // Build dynamic description
  const description = `Find ${propertyType ? `${propertyType}s` : "properties"}${bedrooms ? ` with ${bedrooms} bedrooms` : ""} for ${type === "rent" ? "rent" : "sale"} in ${location}, Ghana. Browse verified listings from trusted agents and property owners on MeQasa.`;

  return {
    title,
    description,
    keywords: [
      `${propertyType || "property"} for ${type} ${location}`,
      `${location} ${propertyType || "property"}`,
      `${type} ${propertyType || "property"} Ghana`,
      `Ghana real estate ${location}`,
      `${location} property listings`,
      "MeQasa Ghana",
      "Ghana property search",
    ],
    authors: [{ name: "MeQasa" }],
    creator: "MeQasa",
    publisher: "MeQasa",
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: `/search/${type}?q=${encodeURIComponent(location)}`,
    },
    openGraph: {
      type: "website",
      locale: "en_GH",
      url: `/search/${type}?q=${encodeURIComponent(location)}`,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: `${siteConfig.url}/og-search.jpg`,
          width: 1200,
          height: 630,
          alt: `Property Search Results - ${location}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@meqasa",
      creator: "@meqasa",
      title,
      description,
      images: [`${siteConfig.url}/og-search.jpg`],
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
  const location = resolvedSearchParams.q || "Ghana";

  // Fetch search results and popup data in parallel
  const [heroBanner, searchData, popupData] = await Promise.all([
    getResultsHeroBanner().catch(() => null),
    (async () => {
      try {
        const currentPage = parseInt(resolvedSearchParams.w ?? "1");
        const urlSearchId = resolvedSearchParams.y
          ? parseInt(resolvedSearchParams.y)
          : undefined;
        const canonicalResultTotal = resolvedSearchParams.rtotal
          ? parseInt(resolvedSearchParams.rtotal)
          : null;

        // If we have a search ID and page > 1, try to load more first
        // This preserves the search context (random seed) from the first page
        // (which can happen with distributed databases)
        if (currentPage > 1 && urlSearchId) {
          // Extract all filter parameters from URL to maintain filter state across pagination
          const loadMoreParams: any = {
            y: urlSearchId,
            w: currentPage,
          };

          // Include all filter parameters to ensure consistent results across pages
          if (resolvedSearchParams.ftype)
            loadMoreParams.ftype = resolvedSearchParams.ftype;
          if (resolvedSearchParams.fbeds)
            loadMoreParams.fbeds = parseInt(resolvedSearchParams.fbeds);
          if (resolvedSearchParams.fbaths)
            loadMoreParams.fbaths = parseInt(resolvedSearchParams.fbaths);
          if (resolvedSearchParams.fmin)
            loadMoreParams.fmin = parseInt(resolvedSearchParams.fmin);
          if (resolvedSearchParams.fmax)
            loadMoreParams.fmax = parseInt(resolvedSearchParams.fmax);
          if (resolvedSearchParams.fminarea)
            loadMoreParams.fminarea = parseInt(resolvedSearchParams.fminarea);
          if (resolvedSearchParams.fmaxarea)
            loadMoreParams.fmaxarea = parseInt(resolvedSearchParams.fmaxarea);
          if (resolvedSearchParams.frentperiod)
            loadMoreParams.frentperiod = resolvedSearchParams.frentperiod;
          if (resolvedSearchParams.fsort)
            loadMoreParams.fsort = resolvedSearchParams.fsort;
          if (resolvedSearchParams.fisfurnished)
            loadMoreParams.fisfurnished = resolvedSearchParams.fisfurnished;
          if (resolvedSearchParams.ffsbo)
            loadMoreParams.ffsbo = resolvedSearchParams.ffsbo;
          if (resolvedSearchParams.fhowshort)
            loadMoreParams.fhowshort = resolvedSearchParams.fhowshort;

          // Special handling for short-let searches
          if (
            resolvedSearchParams.frentperiod === "shortrent" ||
            resolvedSearchParams.fhowshort
          ) {
            loadMoreParams.ftype = ANY_SENTINEL;
            loadMoreParams.frentperiod = "shortrent";
          }

          const loadMoreResult = await loadMorePropertiesServer(
            type,
            location,
            loadMoreParams
          );
          if (
            canonicalResultTotal !== null &&
            !Number.isNaN(canonicalResultTotal)
          ) {
            // Override the total count from the URL if valid, to keep pagination consistent
            // even if the API reports a slightly different count on subsequent pages
            loadMoreResult.resultcount = canonicalResultTotal;
          }
          return loadMoreResult;
        } else {
          // New search or first page
          // Sanitize search params to remove undefined/empty values
          const sanitizedSearchParams: any = {};
          if (resolvedSearchParams.ftype)
            sanitizedSearchParams.ftype = resolvedSearchParams.ftype;
          if (resolvedSearchParams.fbeds)
            sanitizedSearchParams.fbeds = parseInt(resolvedSearchParams.fbeds);
          if (resolvedSearchParams.fbaths)
            sanitizedSearchParams.fbaths = parseInt(
              resolvedSearchParams.fbaths
            );
          if (resolvedSearchParams.fmin)
            sanitizedSearchParams.fmin = parseInt(resolvedSearchParams.fmin);
          if (resolvedSearchParams.fmax)
            sanitizedSearchParams.fmax = parseInt(resolvedSearchParams.fmax);
          if (resolvedSearchParams.fminarea)
            sanitizedSearchParams.fminarea = parseInt(
              resolvedSearchParams.fminarea
            );
          if (resolvedSearchParams.fmaxarea)
            sanitizedSearchParams.fmaxarea = parseInt(
              resolvedSearchParams.fmaxarea
            );
          if (resolvedSearchParams.frentperiod)
            sanitizedSearchParams.frentperiod =
              resolvedSearchParams.frentperiod;
          if (resolvedSearchParams.fsort)
            sanitizedSearchParams.fsort = resolvedSearchParams.fsort;
          if (resolvedSearchParams.fisfurnished)
            sanitizedSearchParams.fisfurnished =
              resolvedSearchParams.fisfurnished;
          if (resolvedSearchParams.ffsbo)
            sanitizedSearchParams.ffsbo = resolvedSearchParams.ffsbo;
          if (resolvedSearchParams.fhowshort)
            sanitizedSearchParams.fhowshort = resolvedSearchParams.fhowshort;

          // Special handling for short-let searches
          if (
            resolvedSearchParams.frentperiod === "shortrent" ||
            resolvedSearchParams.fhowshort
          ) {
            // Ensure ftype is set to ANY_SENTINEL for short-let if not specified or "all"
            // The API expects "- Any -" for property type in short-let searches usually
            // unless specific type is supported.
            // Based on legacy logic: $ftype = "- Any -";
            sanitizedSearchParams.ftype = ANY_SENTINEL;
            sanitizedSearchParams.frentperiod = "shortrent";
          }
          const searchResult = await searchPropertiesServer(type, location, {
            ...sanitizedSearchParams,
            app: "vercel",
          });
          if (
            canonicalResultTotal !== null &&
            !Number.isNaN(canonicalResultTotal)
          ) {
            searchResult.resultcount = canonicalResultTotal;
          }
          return searchResult;
        }
      } catch (error) {
        logger.error("Error fetching search data", error);
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
          hasError: true, // Flag to indicate error
        };
      }
    })(),
    getResultsPopup({
      type: resolvedSearchParams.ftype || "house",
      contract: type === "rent" ? "rent" : "sale",
    }).catch(() => null),
  ]);

  // Check for error state
  if (searchData.hasError) {
    return (
      <Shell className="mt-12 flex min-h-[60vh] max-w-[1250px] flex-col items-center justify-center gap-8 py-16 md:px-0">
        <SearchError />
      </Shell>
    );
  }

  const canonicalResultTotalFromUrlRaw = resolvedSearchParams.rtotal;
  const canonicalResultTotalFromUrl =
    canonicalResultTotalFromUrlRaw !== undefined
      ? parseInt(canonicalResultTotalFromUrlRaw)
      : null;

  // Hydrate the initial data for the client
  // We pass this to the client component so it can initialize its state
  const hydratedSearchData = {
    ...searchData,
    resultcount:
      canonicalResultTotalFromUrl !== null &&
      !Number.isNaN(canonicalResultTotalFromUrl)
        ? canonicalResultTotalFromUrl
        : searchData.resultcount,
  };

  const initialTotal = hydratedSearchData.resultcount;
  const isShortLet =
    resolvedSearchParams.frentperiod === "shortrent" ||
    !!resolvedSearchParams.fhowshort;

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

    let subheading = `${resultCount.toLocaleString()} ${resultCount === 1 ? "property" : "properties"} found`;

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

  // Prepare params for heading generation
  const headingParams: Record<string, string> = {
    ...resolvedSearchParams,
  };
  if (isShortLet) {
    headingParams.frentperiod = "shortrent";
    headingParams.ftype = ANY_SENTINEL;
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
          <Suspense fallback={<div className="h-16 w-full bg-white" />}>
            <ResultSearchFilter />
          </Suspense>
        </div>
        <Shell className="mt-12 flex max-w-[1250px] gap-8 md:px-0">
          <Suspense fallback={<div className="hidden w-44 lg:block xl:w-60" />}>
            <PropertyTypeLinks />
          </Suspense>
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
                <Suspense fallback={<div>Loading results...</div>}>
                  <SearchResults
                    results={hydratedSearchData.results}
                    totalResults={initialTotal}
                    currentPage={parseInt(resolvedSearchParams.w ?? "1")}
                    searchId={hydratedSearchData.searchid ?? 0}
                    type={type}
                    searchData={hydratedSearchData}
                    searchParams={Object.fromEntries(
                      Object.entries(resolvedSearchParams).map(([k, v]) => [
                        k,
                        v ?? "",
                      ])
                    )}
                  />
                </Suspense>
              </div>

              {/* Streaming Sidebar Banners - non-critical, loads progressively */}
              <Suspense fallback={null}>
                <StreamingSidebarBanners />
              </Suspense>
            </div>
          </div>
        </Shell>
        <ResultsPopup
          popupData={popupData}
          type={type}
          contract={type === "rent" ? "rent" : "sale"}
        />
      </div>
    </>
  );
}
