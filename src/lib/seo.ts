/**
 * SEO utilities and structured data generation
 * Based on skateshop patterns for production SEO
 */

import type { Property, PropertyListing } from "@/types/property-standardized";
import type { Metadata } from "next";
import { formatPropertyPrice, getPropertyTypeLabel } from "@/lib/utils";

// Base site configuration
export const siteConfig = {
  name: "MeQasa",
  description:
    "Ghana's no.1 property website - Find houses, apartments, lands and commercial properties for rent and sale",
  url: "https://meqasa.com",
  ogImage: "https://meqasa.com/og-image.jpg",
  creator: "@meqasa",
  email: "info@meqasa.com",
  keywords: [
    "Ghana property",
    "houses for rent Ghana",
    "apartments for sale Ghana",
    "real estate Ghana",
    "property listings Ghana",
    "Accra properties",
    "Kumasi properties",
    "Tema properties",
  ],
} as const;

// Generate property structured data (JSON-LD)
export function generatePropertyStructuredData(property: Property) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${siteConfig.url}/listings/${property.seo.slug}`,
    name: property.title,
    description: property.description,
    url: `${siteConfig.url}/listings/${property.seo.slug}`,
    image: property.media.images,
    datePosted: property.dates.listed,
    dateModified: property.dates.updated,

    // Property details
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.details.floorArea,
      unitText: "sqft",
    },

    numberOfRooms: property.details.bedrooms,
    numberOfBathroomsTotal: property.details.bathrooms,

    // Address
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location.area,
      addressRegion: "Greater Accra",
      addressCountry: "Ghana",
      streetAddress: property.location.address,
    },

    // Geo coordinates (if available)
    ...(property.location.coordinates && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: property.location.coordinates.lat,
        longitude: property.location.coordinates.lng,
      },
    }),

    // Pricing
    price: {
      "@type": "PriceSpecification",
      price: property.pricing.amount,
      priceCurrency: property.pricing.currency,
      ...(property.contract === "rent" && {
        unitText: "MONTH",
      }),
    },

    // Agent/Agency
    listedBy: {
      "@type": property.agent.type === "company" ? "RealEstateAgent" : "Person",
      name: property.agent.name,
      ...(property.agent.logo && {
        image: property.agent.logo,
      }),
      ...(property.agent.contact.phone && {
        telephone: property.agent.contact.phone,
      }),
      ...(property.agent.contact.email && {
        email: property.agent.contact.email,
      }),
    },

    // Additional features
    amenityFeature: property.features.map((feature) => ({
      "@type": "LocationFeatureSpecification",
      name: feature,
    })),

    // Property type
    additionalType: `https://schema.org/${property.type === "apartment" ? "Apartment" : "House"}`,

    // Availability
    availability:
      property.status === "active"
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
  };

  return structuredData;
}

// Generate property listing page structured data
export function generatePropertyListingStructuredData(
  properties: PropertyListing[],
  searchParams?: Record<string, unknown>
) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Property Listings${searchParams?.location ? ` in ${typeof searchParams.location === "string" ? searchParams.location : typeof searchParams.location === "object" && "name" in searchParams.location ? (searchParams.location as { name: string }).name : ""}` : ""}`,
    description: `Browse ${properties.length} properties for ${typeof searchParams?.contract === "string" ? searchParams.contract : "rent and sale"} in Ghana`,
    numberOfItems: properties.length,
    itemListElement: properties.map((property, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "RealEstateListing",
        "@id": `${siteConfig.url}/listings/${property.slug}`,
        name: property.title,
        url: `${siteConfig.url}/listings/${property.slug}`,
        image: property.coverImage,
        description: `${property.bedrooms} bedroom ${getPropertyTypeLabel(property.type)} for ${property.contract} in ${property.location}`,
        price: {
          "@type": "PriceSpecification",
          price: property.pricing.amount,
          priceCurrency: property.pricing.currency,
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: property.location,
          addressCountry: "Ghana",
        },
      },
    })),
  };

  return structuredData;
}

// Generate website structured data
export function generateWebsiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
      sameAs: [
        "https://twitter.com/meqasa",
        "https://facebook.com/meqasa",
        "https://instagram.com/meqasa",
      ],
    },
  };
}

// Generate organization structured data
export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+233-XXX-XXXX",
      contactType: "customer service",
      availableLanguage: ["English"],
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Accra",
      addressRegion: "Greater Accra",
      addressCountry: "Ghana",
    },
    sameAs: [
      "https://twitter.com/meqasa",
      "https://facebook.com/meqasa",
      "https://instagram.com/meqasa",
    ],
  };
}

// Generate property page metadata
export function generatePropertyMetadata(property: Property): Metadata {
  const title = `${property.title} | ${siteConfig.name}`;
  const description = `${property.details.bedrooms} bedroom ${getPropertyTypeLabel(property.type)} for ${property.contract} in ${property.location.area}. ${property.pricing.priceOnRequest ? "Price on request" : formatPropertyPrice(property.pricing.amount, property.pricing.currency, property.contract)}`;

  return {
    title,
    description,
    keywords: [
      property.title,
      `${property.details.bedrooms} bedroom`,
      getPropertyTypeLabel(property.type),
      property.location.area,
      property.contract === "rent" ? "for rent" : "for sale",
      "Ghana property",
      ...property.features,
    ],
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/listings/${property.seo.slug}`,
      siteName: siteConfig.name,
      images: property.media.images.map((image) => ({
        url: image,
        width: 1200,
        height: 630,
        alt: property.title,
      })),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [property.media.coverImage],
      creator: siteConfig.creator,
    },
    alternates: {
      canonical: `${siteConfig.url}/listings/${property.seo.slug}`,
    },
    robots: {
      index: property.status === "active",
      follow: true,
    },
  };
}

// Generate property listing page metadata
export function generatePropertyListingMetadata(
  properties: PropertyListing[],
  searchParams?: Record<string, unknown>
): Metadata {
  const location = searchParams?.location
    ? typeof searchParams.location === "string"
      ? ` in ${searchParams.location}`
      : typeof searchParams.location === "object" &&
          "name" in searchParams.location
        ? ` in ${(searchParams.location as { name: string }).name}`
        : ""
    : "";
  const contract =
    searchParams?.contract && typeof searchParams.contract === "string"
      ? ` for ${searchParams.contract}`
      : "";
  const type = searchParams?.type
    ? ` ${getPropertyTypeLabel(searchParams.type as "land" | "house" | "apartment" | "office" | "townhouse" | "commercial space" | "warehouse" | "guest house" | "shop" | "retail" | "beach house")}`
    : "";

  const title = `Properties${type}${contract}${location} | ${siteConfig.name}`;
  const description = `Browse ${properties.length} property listings${type}${contract}${location}. Find your perfect home in Ghana's largest property marketplace.`;

  return {
    title,
    description,
    keywords: [
      "Ghana properties",
      "property listings",
      "real estate Ghana",
      ...(searchParams?.location
        ? typeof searchParams.location === "string"
          ? [searchParams.location]
          : typeof searchParams.location === "object" &&
              "name" in searchParams.location
            ? [(searchParams.location as { name: string }).name]
            : []
        : []),
      ...(searchParams?.contract && typeof searchParams.contract === "string"
        ? [`for ${searchParams.contract}`]
        : []),
      ...(searchParams?.type
        ? [
            getPropertyTypeLabel(
              searchParams.type as
                | "land"
                | "house"
                | "apartment"
                | "office"
                | "townhouse"
                | "commercial space"
                | "warehouse"
                | "guest house"
                | "shop"
                | "retail"
                | "beach house"
            ),
          ]
        : []),
    ],
    openGraph: {
      title,
      description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage],
      creator: siteConfig.creator,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Generate homepage metadata
export function generateHomepageMetadata(): Metadata {
  return {
    title: `${siteConfig.name} | ${siteConfig.description}`,
    description: siteConfig.description,
    keywords: Array.from(siteConfig.keywords),
    openGraph: {
      title: siteConfig.name,
      description: siteConfig.description,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      creator: siteConfig.creator,
    },
    alternates: {
      canonical: siteConfig.url,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Utility to create structured data script tag
export function createStructuredDataScript(
  data: Record<string, unknown>
): string {
  return `<script type="application/ld+json">${JSON.stringify(data, null, 2)}</script>`;
}

// Generate metadata for listing detail page (for API response format)
export function generateListingDetailMetadata(listingDetail: any, slug: string): Metadata {
  if (!listingDetail) {
    return {
      title: "Property Not Found | MeQasa - Ghana's Leading Real Estate Marketplace",
      description: "The requested property listing could not be found. Browse thousands of verified properties for rent and sale on MeQasa.",
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
  const title = `${listingDetail.title || `${listingDetail.beds} Bedroom ${listingDetail.type}`} for ${listingDetail.contract} in ${listingDetail.locationstring} | ${siteConfig.name}`;

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
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
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
      site: siteConfig.creator,
      creator: siteConfig.creator,
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
}

// Generate structured data for listing detail page
export function generateListingDetailStructuredData(listingDetail: any, slug: string) {
  const cleanPrice = listingDetail.price
    ? listingDetail.price.replace(/<[^>]*>/g, "").replace(/[^\d.,]/g, "")
    : null;

  return {
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
        (img: string) => `https://meqasa.com/uploads/imgs/${img}`
      ) || [],
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
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
}

const seoUtils = {
  siteConfig,
  generatePropertyStructuredData,
  generatePropertyListingStructuredData,
  generateWebsiteStructuredData,
  generateOrganizationStructuredData,
  generatePropertyMetadata,
  generatePropertyListingMetadata,
  generateHomepageMetadata,
  generateListingDetailMetadata,
  generateListingDetailStructuredData,
  createStructuredDataScript,
};

export default seoUtils;
