import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import Shell from "@/layouts/shell";

import { AlertCard } from "@/components/common/alert-card";
import Amenities from "@/components/amenities";
import ContactCard from "@/components/common/contact-card";
import ContactSection from "@/components/contact-section";
import ContentSection from "@/components/layout/content-section";
import { DynamicCarousel } from "@/components/common/dynamic-carousel";
import { Icons } from "@/components/icons";
import LeaseOptions from "@/components/lease-option";
import MortgageCalculator from "@/components/mortgage-calculator";
import PropertyDetailsTable from "@/components/property/details/property-details";
import PropertyFavoritesBanner from "@/components/property-favorite-banner";
import PropertyInsight from "@/components/property/details/property-insight";
import PropertyListings from "@/components/property/listings/property-listings";
import PropertyShowcase from "@/components/property/details/property-showcase";
import SafetyTipsCard from "@/components/safety-tip";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getListingDetails } from "@/lib/get-listing-detail";
import { extractPropertyData, getCleanUrl, hasCompressedData } from "@/lib/compressed-data-utils";
import { buildInnerHtml, cn, formatNumber } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/dom-sanitizer";
import { BathIcon, BedIcon, ParkingSquare, Square, ShieldCheck, Tag, ExternalLink } from "lucide-react";
import Link from "next/link";
import ProjectVideo from "../../development-projects/_component/project-video";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { createPropertyError } from "@/lib/error-handling";
import { ExpandableDescription } from "@/components/expandable-description";

// Constants for better maintainability
const CONTRACT_TYPES = {
  SALE: "sale",
  RENT: "rent",
  SHORT_STAY: "short-stay",
} as const;

const PROPERTY_TYPES = {
  LAND: "land",
} as const;

const VERIFICATION_STATUSES = {
  APPROVED: "approved",
  APPROVED2: "approved2",
} as const;

// Helper function to extract the first currency amount (e.g., GH₵ 3,687,912) from HTML/text and return digits
const extractNumericPrice = (priceString: string): string => {
  if (!priceString) return "0";
  const text = priceString.replace(/<[^>]*>/g, " ");
  
  // Try to match currency with comma-formatted numbers first (1,234,567 format)
  const currencyWithCommasRegex = /(?:GH\s*₵|GHS|GH₵)\s*([0-9]{1,3}(?:,[0-9]{3})+(?:\.[0-9]+)?)/i;
  const currencyMatch = currencyWithCommasRegex.exec(text);
  if (currencyMatch?.[1]) {
    return currencyMatch[1].replace(/,/g, "");
  }
  
  // Try to match currency with plain numbers (no commas, handles large numbers)
  const currencyPlainRegex = /(?:GH\s*₵|GHS|GH₵)\s*([0-9]+(?:\.[0-9]+)?)/i;
  const currencyPlainMatch = currencyPlainRegex.exec(text);
  if (currencyPlainMatch?.[1]) {
    return currencyPlainMatch[1];
  }
  
  // Match formatted numbers without currency (1,234,567 format)
  const formattedNumberRegex = /([0-9]{1,3}(?:,[0-9]{3})+(?:\.[0-9]+)?)/;
  const formattedMatch = formattedNumberRegex.exec(text);
  if (formattedMatch?.[1]) {
    return formattedMatch[1].replace(/,/g, "");
  }
  
  // Match plain numbers (fallback)
  const plainNumberRegex = /([0-9]+(?:\.[0-9]+)?)/;
  const plainMatch = plainNumberRegex.exec(text);
  if (plainMatch?.[1]) {
    return plainMatch[1];
  }
  
  return "0";
};

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const match = /-(\d+)$/.exec(slug);

    if (!match?.[1]) {
      return {
        title:
          "Property Not Found | MeQasa - Ghana's Leading Real Estate Marketplace",
        description:
          "The requested property listing could not be found. Browse thousands of verified properties for rent and sale on MeQasa.",
        openGraph: {
          title: "Property Not Found | MeQasa",
          description: "The requested property listing could not be found.",
          type: "website",
          url: `/listings/${slug}`,
          siteName: siteConfig.name,
        },
        twitter: {
          card: "summary",
          title: "Property Not Found | MeQasa",
          description: "The requested property listing could not be found.",
        },
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    const listingId = match[1];
    const listingDetail = await getListingDetails(listingId);

    if (!listingDetail) {
      return {
        title:
          "Property Not Found | MeQasa - Ghana's Leading Real Estate Marketplace",
        description:
          "The requested property listing could not be found. Browse thousands of verified properties for rent and sale on MeQasa.",
        openGraph: {
          title: "Property Not Found | MeQasa",
          description: "The requested property listing could not be found.",
          type: "website",
          url: `/listings/${slug}`,
          siteName: siteConfig.name,
        },
        twitter: {
          card: "summary",
          title: "Property Not Found | MeQasa",
          description: "The requested property listing could not be found.",
        },
        robots: {
          index: false,
          follow: true,
        },
      };
    }

    // Extract price for meta description
    const priceText = listingDetail.price
      ? listingDetail.price.replace(/<[^>]*>/g, "").trim()
      : "Contact for pricing";

    // Create SEO-optimized title
    const title = `${listingDetail.title || `${listingDetail.beds} Bedroom ${listingDetail.type}`} for ${listingDetail.contract} in ${listingDetail.locationstring} | MeQasa`;

    // Create detailed description for SEO
    const description = `${listingDetail.title || `${listingDetail.beds} bedroom ${listingDetail.type.toLowerCase()}`} for ${listingDetail.contract} in ${listingDetail.locationstring}, Ghana. ${listingDetail.beds ? `${listingDetail.beds} bed` : ""}${listingDetail.baths ? `, ${listingDetail.baths} bath` : ""}${listingDetail.floorarea ? ` property with ${listingDetail.floorarea} sqm` : ""}. ${priceText}. Verified listing on MeQasa.`;

    // Comprehensive keywords for SEO
    const keywords = [
      listingDetail.title,
      `${listingDetail.type} for ${listingDetail.contract}`,
      `${listingDetail.locationstring} properties`,
      `${listingDetail.location} real estate`,
      `${listingDetail.beds} bedroom ${listingDetail.type}`,
      `${listingDetail.contract} ${listingDetail.locationstring}`,
      "MeQasa Ghana",
      "Ghana real estate",
      "property listing Ghana",
      "verified properties Ghana",
      listingDetail.contract === "rent"
        ? "rental property Ghana"
        : "property for sale Ghana",
      `${listingDetail.locationstring} ${listingDetail.contract}`,
    ].filter(Boolean);

    // Generate image URLs
    const imageUrl = listingDetail.imagelist?.[0]
      ? `https://meqasa.com/uploads/imgs/${listingDetail.imagelist[0]}`
      : null;

    const images = imageUrl
      ? [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${listingDetail.title || `${listingDetail.type} for ${listingDetail.contract}`} in ${listingDetail.locationstring}`,
            type: "image/jpeg",
          },
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: `${listingDetail.title || `${listingDetail.type} for ${listingDetail.contract}`} in ${listingDetail.locationstring}`,
            type: "image/jpeg",
          },
        ]
      : [];

    return {
      title,
      description,
      keywords: keywords.join(", "),
      authors: [{ name: "MeQasa", url: "https://meqasa.com" }],
      creator: "MeQasa",
      publisher: "MeQasa",
      category: "Real Estate",
      classification: "Real Estate Listing",
      metadataBase: new URL(siteConfig.url),
      alternates: {
        canonical: `/listings/${slug}`,
      },
      openGraph: {
        type: "website",
        locale: "en_GH",
        url: `/listings/${slug}`,
        siteName: siteConfig.name,
        title,
        description,
        images,
        countryName: "Ghana",
      },
      twitter: {
        card: "summary_large_image",
        site: "@meqasa",
        creator: "@meqasa",
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
      robots: {
        index: true,
        follow: true,
        noarchive: false,
        nosnippet: false,
        noimageindex: false,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      verification: {
        google: process.env.GOOGLE_SITE_VERIFICATION,
      },
      other: {
        "property:price": priceText,
        "property:location": listingDetail.locationstring,
        "property:type": listingDetail.type,
        "property:contract": listingDetail.contract,
        "property:bedrooms": listingDetail.beds,
        "property:bathrooms": listingDetail.baths,
        ...(listingDetail.floorarea && {
          "property:area": `${listingDetail.floorarea} sqm`,
        }),
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title:
        "Property Details | MeQasa - Ghana's Leading Real Estate Marketplace",
      description:
        "View detailed property information on MeQasa, Ghana's leading real estate marketplace with thousands of verified properties.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }
}

export default async function DetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;
  
  // Extract listing ID more reliably
  const match = /-(\d+)$/.exec(slug);
  if (!match?.[1]) {
    throw createPropertyError(new Error("Invalid slug format"), "invalid_slug");
  }

  const listingId = match[1];
  console.log(
    "Property page - extracting ID from slug:",
    slug,
    "-> ID:",
    listingId,
  );

  // Check for compressed data from search first (SSR-compatible)
  let listingDetail;
  
  if (hasCompressedData(searchParamsResolved)) {
    // Extract compressed property data
    listingDetail = extractPropertyData(searchParamsResolved);
    
    if (listingDetail) {
      console.log(`✅ COMPRESSED DATA HIT: Using passed property data, no API call needed!`);
    } else {
      console.log(`⚠️ COMPRESSED DATA INVALID: Fetching from API`);
      listingDetail = await getListingDetails(listingId);
    }
  } else {
    // Normal API call when not coming from search
    console.log("Property page - calling getListingDetails with ID:", listingId);
    listingDetail = await getListingDetails(listingId);
  }
  
  console.log(
    "Property page - got listing detail:",
    !!listingDetail,
    listingDetail?.listingid,
  );

  if (!listingDetail) {
    throw createPropertyError(new Error("Property listing not found"));
  }

  // Generate comprehensive structured data for SEO and rich snippets
  const cleanPrice = listingDetail.price
    ? listingDetail.price.replace(/<[^>]*>/g, "").replace(/[^\d.,]/g, "")
    : null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${siteConfig.url}/listings/${slug}`,
    name:
      listingDetail.title ||
      `${listingDetail.beds ? `${listingDetail.beds} Bedroom ` : ""}${listingDetail.type} for ${listingDetail.contract}`,
    description:
      listingDetail.description ||
      `${listingDetail.title || `${listingDetail.beds} bedroom ${listingDetail.type.toLowerCase()}`} for ${listingDetail.contract} in ${listingDetail.locationstring}, Ghana. ${listingDetail.beds ? `${listingDetail.beds} bed` : ""}${listingDetail.baths ? `, ${listingDetail.baths} bath` : ""}${listingDetail.floorarea ? ` property with ${listingDetail.floorarea} sqm` : ""}.`,
    url: `${siteConfig.url}/listings/${slug}`,
    image:
      listingDetail.imagelist?.map(
        (img) => `https://meqasa.com/uploads/imgs/${img}`,
      ) || [],
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "MeQasa",
      url: "https://meqasa.com",
      logo: {
        "@type": "ImageObject",
        url: "https://meqasa.com/logo.png",
      },
    },
    publisher: {
      "@type": "Organization",
      name: "MeQasa",
      url: "https://meqasa.com",
      logo: {
        "@type": "ImageObject",
        url: "https://meqasa.com/logo.png",
      },
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      price: cleanPrice ?? undefined,
      priceCurrency: "GHS",
      priceSpecification: cleanPrice
        ? {
            "@type": "PriceSpecification",
            price: cleanPrice,
            priceCurrency: "GHS",
            unitCode: listingDetail.contract === "rent" ? "MON" : undefined,
          }
        : undefined,
      businessFunction:
        listingDetail.contract === "rent"
          ? "http://purl.org/goodrelations/v1#LeaseOut"
          : "http://purl.org/goodrelations/v1#Sell",
      offeredBy: {
        "@type": "RealEstateAgent",
        name: listingDetail.owner.name,
        url: listingDetail.owner.page
          ? `https://meqasa.com${listingDetail.owner.page}`
          : undefined,
        image:
          (listingDetail.owner.logo ?? listingDetail.owner.profilepic)
            ? `https://meqasa.com${listingDetail.owner.logo ?? listingDetail.owner.profilepic}`
            : undefined,
      },
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: listingDetail.streetaddress ?? listingDetail.location,
      addressLocality: listingDetail.locationstring,
      addressRegion: listingDetail.locationstring.includes("Accra")
        ? "Greater Accra"
        : undefined,
      addressCountry: "GH",
      postalCode: undefined,
    },

    numberOfRooms: parseInt(listingDetail.beds) || undefined,
    numberOfBedrooms: parseInt(listingDetail.beds) || undefined,
    numberOfBathrooms: parseInt(listingDetail.baths) || undefined,
    floorSize: listingDetail.floorarea
      ? {
          "@type": "QuantitativeValue",
          value: parseFloat(listingDetail.floorarea),
          unitCode: "MTK",
          unitText: "square meters",
        }
      : undefined,
    propertyType: listingDetail.type,
    category:
      listingDetail.contract === "rent"
        ? "Rental Property"
        : "Property for Sale",
    additionalType: `https://schema.org/${listingDetail.type === "house" ? "House" : listingDetail.type === "apartment" ? "Apartment" : "Accommodation"}`,
    amenityFeature:
      listingDetail.amenities?.map((amenity: string) => ({
        "@type": "LocationFeatureSpecification",
        name: amenity,
        value: true,
      })) || [],
    petsAllowed: undefined,
    smokingAllowed: undefined,
    tourBookingPage: `${siteConfig.url}/listings/${slug}`,
    potentialAction: [
      {
        "@type": "ViewAction",
        target: `${siteConfig.url}/listings/${slug}`,
        name: "View Property Details",
      },
      {
        "@type": "ContactAction",
        target: `mailto:${siteConfig.email}`,
        name: "Contact Agent",
      },
    ],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/listings/${slug}`,
    },
    isAccessibleForFree: false,
    keywords: [
      listingDetail.type,
      listingDetail.contract,
      listingDetail.locationstring,
      "Ghana real estate",
      "MeQasa",
    ].join(", "),
  };

  // Build Similar Listings search href based on current listing details
  const contract = listingDetail.contract.toLowerCase();
  const location = listingDetail.location.toLowerCase();
  const type = listingDetail.type.toLowerCase();
  const similarSearchParams = new URLSearchParams({
    q: location,
    page: "1",
    ftype: type,
  });
  const numBeds = Number.parseInt(listingDetail.beds, 10);
  const numBaths = Number.parseInt(listingDetail.baths, 10);
  if (!Number.isNaN(numBeds) && numBeds > 0)
    similarSearchParams.set("fbeds", String(numBeds));
  if (!Number.isNaN(numBaths) && numBaths > 0)
    similarSearchParams.set("fbaths", String(numBaths));
  const similarSearchHref = `/search/${contract}?${similarSearchParams.toString()}`;

  // Construct internal agent link `/agents/{name}?g={id}` using owner.page as source of id
  const agentNameEncoded = encodeURIComponent(listingDetail.owner.name);
  const ownerPageUrl = listingDetail.owner.page;
  let agentIdFromPage = "";
  const qMarkIndex = ownerPageUrl.indexOf("?");
  if (qMarkIndex !== -1) {
    const queryString = ownerPageUrl.slice(qMarkIndex + 1);
    const sp = new URLSearchParams(queryString);
    agentIdFromPage = sp.get("g") ?? "";
  } else {
    const execResult = /[?&]g=([^&]+)/.exec(ownerPageUrl);
    agentIdFromPage = execResult?.[1] ?? "";
  }
  const agentHref = agentIdFromPage
    ? `/agents/${agentNameEncoded}?g=${encodeURIComponent(agentIdFromPage)}`
    : `/agents/${agentNameEncoded}`;

  const isFurnished =
    typeof listingDetail.isfurnished === "boolean"
      ? listingDetail.isfurnished
      : typeof listingDetail.isfurnished === "string"
        ? ["1", "true", "yes", "y"].includes(
            listingDetail.isfurnished.toLowerCase(),
          )
        : false;

  const safePriceHtml = {
    __html: sanitizeHtml(listingDetail.price ?? ""),
  } satisfies { __html: string };
  // const safeDescriptionHtml = {
  //   __html: sanitizeHtml(listingDetail.description ?? ""),
  // } satisfies { __html: string };

  const propertyDetails = [
    { title: "Type", value: listingDetail.type || "Not specified" },
    { title: "Contract", value: listingDetail.contract || "Not specified" },
    { title: "Location", value: listingDetail.location || "Not specified" },
    {
      title: "Bedrooms",
      value: listingDetail.beds || "Not specified",
    },
    {
      title: "Bathrooms",
      value: listingDetail.baths || "Not specified",
    },
    { title: "Garages", value: listingDetail.garages || "Not specified" },
    {
      title: "Area",
      value: listingDetail.floorarea
        ? `${listingDetail.floorarea} ㎡`
        : "Not specified",
    },
    {
      title: "Furnished",
      value:
        listingDetail.isfurnished !== ""
          ? listingDetail.isfurnished
            ? "Yes"
            : "No"
          : "Not specified",
    },
    {
      title: "Reference",
      value: listingDetail.listingid,
    },
  ];

  return (
    <>
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData, null, 2),
        }}
      />

      <main>
        <Shell>
          <div className="space-y-3 mb-3">
            <Breadcrumbs
              className="pt-4"
              segments={[
                { title: "Home", href: "/" },
                {
                  title: `For ${listingDetail.contract}`,
                  href: `/search/${listingDetail.contract.toLowerCase()}?q=ghana&page=1`,
                },
                {
                  title: `${listingDetail.type}`,
                  href: `/search/${listingDetail.contract.toLowerCase()}?q=ghana&ftype=${listingDetail.type}&page=1`,
                },
                {
                  title: `${listingDetail.location}`,
                  href: `/search/${listingDetail.contract.toLowerCase()}?q=${listingDetail.location}&page=1`,
                },
              ]}
              aria-label="Property listing navigation"
            />
            <h1 className="font-bold leading-tight tracking-tighter text-brand-accent lg:leading-[1.1] text-2xl md:text-3xl capitalize">
              {listingDetail.title}
            </h1>
          </div>
        </Shell>
        <section
          className="border-b border-brand-badge-ongoing bg-black flex items-center justify-center"
          aria-label="Property images"
        >
          <DynamicCarousel images={listingDetail.imagelist} />
        </section>
        <Shell>
          <div className="grid grid-cols-1 text-brand-accent w-full mt-4 lg:grid-cols-[2fr_1fr] lg:gap-8 lg:px-0">
            <div>
              <div className="flex items-start justify-between flex-wrap gap-3 md:flex-nowrap md:items-center md:gap-4">
                <div className="flex items-center">
                  <h2
                    className="text-2xl font-extrabold text-brand-accent lg:text-3xl"
                    dangerouslySetInnerHTML={safePriceHtml}
                  />
                  <span className="text-brand-muted font-light text-sm md:text-xl ml-2">
                    {listingDetail.leaseunit}
                  </span>
                </div>
                <div className="flex gap-2 md:gap-3 text-xs flex-wrap">
                  {(listingDetail.owner.verification ===
                    VERIFICATION_STATUSES.APPROVED ||
                    listingDetail.owner.verification ===
                      VERIFICATION_STATUSES.APPROVED2) && (
                    <Badge variant="success" className="uppercase">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {Boolean(listingDetail.isnegotiable) && (
                    <Badge variant="default" className="uppercase">
                      Negotiable
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 py-3">
                <div
                  className="flex items-center gap-3 md:gap-6 flex-wrap"
                  role="list"
                  aria-label="Property features"
                >
                  {listingDetail.beds && (
                    <div className="flex items-center gap-2" role="listitem">
                      <p className="flex items-center gap-2 text-brand-accent">
                        <BedIcon
                          className="h-5 w-5 text-brand-muted"
                          strokeWidth={1.2}
                          aria-hidden="true"
                        />{" "}
                        <span>{listingDetail.beds} Beds</span>
                      </p>
                    </div>
                  )}
                  {listingDetail.baths && (
                    <div className="flex items-center gap-2" role="listitem">
                      <p className="flex items-center gap-2 text-brand-accent">
                        <BathIcon
                          className="h-5 w-5 text-brand-muted"
                          strokeWidth={1.2}
                          aria-hidden="true"
                        />{" "}
                        <span>{listingDetail.baths} Baths</span>
                      </p>
                    </div>
                  )}
                  {listingDetail.garages && (
                    <div className="flex items-center gap-2" role="listitem">
                      <p className="flex items-center gap-2 text-brand-accent">
                        <ParkingSquare
                          className="h-5 w-5 text-brand-muted"
                          strokeWidth={1.2}
                          aria-hidden="true"
                        />{" "}
                        <span>{listingDetail.garages} Parking</span>
                      </p>
                    </div>
                  )}
                  {listingDetail.floorarea && (
                    <div className="flex items-center gap-2" role="listitem">
                      <p className="flex items-center gap-2 text-brand-accent">
                        <Square
                          className="h-5 w-5 text-brand-muted"
                          strokeWidth={1.2}
                          aria-hidden="true"
                        />{" "}
                        <span>{listingDetail.floorarea} sqm</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <Badge variant="info" className="uppercase">
                  {isFurnished ? "Furnished" : "Unfurnished"}
                </Badge>
                <Badge variant="info" className="uppercase max-w-[280px] md:max-w-full">
                  <p className="truncate w-full">{listingDetail.location}</p>
                </Badge>
              </div>
              <aside className="mb-6">
                {listingDetail.owner.listingscount !== "0" && 
                 parseInt(listingDetail.owner.listingscount) >= 5 && (
                  <Card className="relative overflow-hidden border-l-3 border-l-orange-500 bg-gradient-to-r rounded-lg from-orange-50 to-amber-50 p-4 md:p-6">
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <Icons.trend className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge variant="warning" className="text-xs font-semibold flex-shrink-0">
                            🔥 TRENDING
                          </Badge>
                          <span className="text-xs text-orange-600 font-medium">
                            High Interest Property
                          </span>
                        </div>
                        <h3 className="text-brand-accent font-semibold text-base md:text-lg mb-2 leading-tight">
                          This property is in high demand
                        </h3>
                        <div className="flex items-center gap-2 text-sm md:text-base flex-wrap">
                          <span className="font-medium text-brand-accent flex-shrink-0">
                            {`${formatNumber(listingDetail.owner.listingscount, { notation: "compact" })} views`}
                          </span>
                          <span className="text-brand-muted">•</span>
                          <span className="text-orange-600 font-medium">
                            Contact agent before it&apos;s gone!
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Subtle background pattern */}
                    <div className="absolute top-2 right-2 opacity-5">
                      <Icons.trend className="h-16 w-16 md:h-20 md:w-20 text-orange-500" />
                    </div>
                  </Card>
                )}
              </aside>
              <aside className="mb-6">
                <Card className="border-blue-200 bg-gradient-to-r from-blue-50 rounded-lg to-indigo-50 p-4 md:p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <Tag className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="info" className="text-xs font-semibold">
                          {listingDetail.owner.type !== "Agent" ? "PROJECT" : "CATEGORIES"}
                        </Badge>
                      </div>
                      {listingDetail.owner.type !== "Agent" ? (
                        <h3 className="font-semibold text-brand-accent text-base">
                          {"Project name"}
                        </h3>
                      ) : (
                        <div className="space-y-2">
                          <Link
                            href={`/search/${listingDetail.contract.toLowerCase()}?q=ghana&ftype=${listingDetail.type.toLowerCase()}&page=1`}
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors group"
                            key={listingDetail.parenttext}
                          >
                            <span className="font-medium">{listingDetail.parenttext}</span>
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                          <Link
                            href={`/search/${listingDetail.contract.toLowerCase()}?q=${listingDetail.location.toLowerCase()}&ftype=${listingDetail.type.toLowerCase()}&page=1`}
                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors group"
                            key={listingDetail.categorytext}
                          >
                            <span className="font-medium">{listingDetail.categorytext}</span>
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-colors" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </aside>
              <ContentSection
                title="Description"
                description=""
                href="/listings"
                className="pt-14 md:pt-20 px-0 pb-10 overflow-hidden md:pb-0"
                btnHidden
              >
                {listingDetail?.description &&
                listingDetail.description.trim() !== "" ? (
                  <ExpandableDescription 
                    description={buildInnerHtml(listingDetail.description)}
                    name={listingDetail.owner.name}
                    href={agentHref}
                  />
                ) : (
                  <AlertCard
                    title="No description provided"
                    description="This listing doesn't have a detailed description yet."
                    className="my-4 h-[200px] md:h-[300px]"
                  />
                )}
              </ContentSection>
              <ContentSection
                title="Explore More"
                description=""
                href="/listings"
                className="pt-14 px-0 md:pt-20"
                btnHidden
              >
                <PropertyShowcase images={listingDetail?.imagelist} />
              </ContentSection>
              <PropertyFavoritesBanner
                propertyId={Number(listingDetail.detailreq.split("-").pop())}
                propertyType="listing"
              />

              {/* Video component - will show when video data is available */}
              {(listingDetail as unknown as { videoUrl?: string }).videoUrl &&
                (
                  listingDetail as unknown as { videoUrl?: string }
                ).videoUrl!.trim() !== "" && (
                  <ProjectVideo
                    videoUrl={
                      (listingDetail as unknown as { videoUrl?: string })
                        .videoUrl!
                    }
                  />
                )}

              <ContentSection
                title="Project Details"
                description=""
                href=""
                className="pt-14 md:pt-20"
                btnHidden
              >
                <PropertyDetailsTable details={propertyDetails} />
              </ContentSection>

              {listingDetail.contract.toLowerCase() !== CONTRACT_TYPES.SALE && (
                <LeaseOptions leaseOptions={listingDetail.leaseoptions} />
              )}

              {listingDetail.amenities.length > 0 && (
                <ContentSection
                  title="Amenities"
                  description=""
                  href=""
                  className="pt-14 md:pt-20"
                  btnHidden
                >
                  <Amenities amenities={listingDetail.amenities} />
                </ContentSection>
              )}

              <SafetyTipsCard />

              <PropertyInsight 
                location={listingDetail.locationstring}
                bedroomType={listingDetail.beds ? `${listingDetail.beds}-bedroom` : undefined}
              />
            </div>
            <aside className="hidden lg:block">
              <ContactCard
                name={listingDetail.owner.name}
                image={`${listingDetail.owner.logo !== "" ? listingDetail.owner.logo : listingDetail.owner.profilepic}`}
                listingId={listingDetail.listingid}
              />
            </aside>
          </div>
        </Shell>
        <Shell>
          {listingDetail.contract.toLowerCase() === CONTRACT_TYPES.SALE &&
            listingDetail.type.toLowerCase() !== PROPERTY_TYPES.LAND && (
              <ContentSection
                title="Mortgage Calculator"
                description=""
                href=""
                className="pt-14 md:pt-20"
                btnHidden
              >
                <MortgageCalculator
                  key={listingDetail.listingid}
                  price={extractNumericPrice(listingDetail.price)}
                />
              </ContentSection>
            )}
        </Shell>

        <ContactSection
          name={listingDetail.owner.name}
          image={`${listingDetail.owner.logo !== "" ? listingDetail.owner.logo : listingDetail.owner.profilepic}`}
          listingId={listingDetail.listingid}
        />
        {listingDetail.similars.length > 0 ? (
          <ContentSection
            title="Similar Listings"
            description=""
            href={similarSearchHref}
            className={cn(
              "w-full mx-auto",
              "pt-14 md:pt-20 lg:pt-24 md:block mb-6 [&_p]:px-4 [&_h2]:px-4 md:[&_p]:px-0 md:[&_h2]:px-0",
            )}
          >
            <PropertyListings
              listings={listingDetail.similars}
              parentContract={listingDetail.contract}
            />
          </ContentSection>
        ) : (
          <Shell>
            <AlertCard className="my-10" />
          </Shell>
        )}
      </main>
    </>
  );
}
