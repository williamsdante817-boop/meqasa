import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import { HeroBannerSkeleton } from "@/components/search/BannerSkeleton";
import { HeroBanner } from "@/components/search/HeroBanner";
import PropertyTypeLinks from "@/components/search/PropertyTypeLinks";
import { ReferenceSearch } from "@/components/search/ReferenceSearch";
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
      const urlSearchId = resolvedSearchParams.y
        ? parseInt(resolvedSearchParams.y)
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

  const segments = [
    { title: "Home", href: "/", key: "home" },
    {
      title: `For ${type.charAt(0).toUpperCase() + type.slice(1)}`,
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
    const typeDisplay =
      type === "rent" ? "Rental" : type === "sale" ? "Sale" : type;
    const locationDisplay = location === "ghana" ? "Ghana" : location;

    // Check for specific filters to make heading more specific
    const propertyType = searchParams.ftype;
    const bedrooms = searchParams.fbeds;
    const furnished = searchParams.fisfurnished;
    const owner = searchParams.ffsbo;
    const period = searchParams.frentperiod;

    // Build contextual heading
    let heading = `${typeDisplay} Properties`;

    if (propertyType && propertyType !== "all") {
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

    if (period === "shortrent") {
      heading = `Short-term ${heading}`;
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
    if (propertyType && propertyType !== "all") {
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
    name: `Properties for ${type} in ${location}`,
    description: `Search results for properties available for ${type} in ${location}`,
    url: `${siteConfig.url}/search/${type}?q=${encodeURIComponent(location)}`,
    numberOfItems: searchData.resultcount ?? 0,
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
      })) ?? [],
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
                  {generateDynamicHeading(type, location, resolvedSearchParams)}
                </h1>
                <p className="text-brand-muted mt-3 text-sm">
                  {generateDynamicSubheading(
                    type,
                    location,
                    searchData.resultcount,
                    resolvedSearchParams
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
                <StreamingFlexiBannerWrapper />

                {/* Main search results - critical content loads immediately */}
                <SearchResultsWrapper
                  type={type}
                  location={location}
                  initialResults={searchData.results}
                  initialTotal={searchData.resultcount}
                  initialSearchId={searchData.searchid ?? 0}
                  initialPage={parseInt(resolvedSearchParams.page ?? "1")}
                  initialSearchData={searchData}
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
