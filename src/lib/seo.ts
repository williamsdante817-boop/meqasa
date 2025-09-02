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
  description: "Ghana's no.1 property website - Find houses, apartments, lands and commercial properties for rent and sale",
  url: "https://meqasa.com",
  ogImage: "https://meqasa.com/og-image.jpg",
  creator: "@meqasa",
  keywords: [
    "Ghana property",
    "houses for rent Ghana",
    "apartments for sale Ghana",
    "real estate Ghana",
    "property listings Ghana",
    "Accra properties",
    "Kumasi properties",
    "Tema properties"
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
      unitText: "sqft"
    },
    
    numberOfRooms: property.details.bedrooms,
    numberOfBathroomsTotal: property.details.bathrooms,
    
    // Address
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location.area,
      addressRegion: "Greater Accra",
      addressCountry: "Ghana",
      streetAddress: property.location.address
    },
    
    // Geo coordinates (if available)
    ...(property.location.coordinates && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: property.location.coordinates.lat,
        longitude: property.location.coordinates.lng
      }
    }),
    
    // Pricing
    price: {
      "@type": "PriceSpecification",
      price: property.pricing.amount,
      priceCurrency: property.pricing.currency,
      ...(property.contract === "rent" && {
        unitText: "MONTH"
      })
    },
    
    // Agent/Agency
    listedBy: {
      "@type": property.agent.type === "company" ? "RealEstateAgent" : "Person",
      name: property.agent.name,
      ...(property.agent.logo && {
        image: property.agent.logo
      }),
      ...(property.agent.contact.phone && {
        telephone: property.agent.contact.phone
      }),
      ...(property.agent.contact.email && {
        email: property.agent.contact.email
      })
    },
    
    // Additional features
    amenityFeature: property.features.map(feature => ({
      "@type": "LocationFeatureSpecification",
      name: feature
    })),
    
    // Property type
    additionalType: `https://schema.org/${property.type === 'apartment' ? 'Apartment' : 'House'}`,
    
    // Availability
    availability: property.status === "active" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
  };
  
  return structuredData;
}

// Generate property listing page structured data
export function generatePropertyListingStructuredData(properties: PropertyListing[], searchParams?: Record<string, unknown>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Property Listings${searchParams?.location ? ` in ${typeof searchParams.location === 'string' ? searchParams.location : (typeof searchParams.location === 'object' && 'name' in searchParams.location ? (searchParams.location as { name: string }).name : '')}` : ''}`,
    description: `Browse ${properties.length} properties for ${typeof searchParams?.contract === 'string' ? searchParams.contract : 'rent and sale'} in Ghana`,
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
          priceCurrency: property.pricing.currency
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: property.location,
          addressCountry: "Ghana"
        }
      }
    }))
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
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`
      },
      sameAs: [
        "https://twitter.com/meqasa",
        "https://facebook.com/meqasa",
        "https://instagram.com/meqasa"
      ]
    }
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
      availableLanguage: ["English"]
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Accra",
      addressRegion: "Greater Accra",
      addressCountry: "Ghana"
    },
    sameAs: [
      "https://twitter.com/meqasa",
      "https://facebook.com/meqasa",
      "https://instagram.com/meqasa"
    ]
  };
}

// Generate property page metadata
export function generatePropertyMetadata(property: Property): Metadata {
  const title = `${property.title} | ${siteConfig.name}`;
  const description = `${property.details.bedrooms} bedroom ${getPropertyTypeLabel(property.type)} for ${property.contract} in ${property.location.area}. ${property.pricing.priceOnRequest ? 'Price on request' : formatPropertyPrice(property.pricing.amount, property.pricing.currency, property.contract)}`;
  
  return {
    title,
    description,
    keywords: [
      property.title,
      `${property.details.bedrooms} bedroom`,
      getPropertyTypeLabel(property.type),
      property.location.area,
      property.contract === 'rent' ? 'for rent' : 'for sale',
      'Ghana property',
      ...property.features
    ],
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/listings/${property.seo.slug}`,
      siteName: siteConfig.name,
      images: property.media.images.map(image => ({
        url: image,
        width: 1200,
        height: 630,
        alt: property.title
      })),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [property.media.coverImage],
      creator: siteConfig.creator,
    },
    alternates: {
      canonical: `${siteConfig.url}/listings/${property.seo.slug}`,
    },
    robots: {
      index: property.status === 'active',
      follow: true,
    }
  };
}

// Generate property listing page metadata
export function generatePropertyListingMetadata(
  properties: PropertyListing[],
  searchParams?: Record<string, unknown>
): Metadata {
  const location =
    searchParams?.location
      ? typeof searchParams.location === "string"
        ? ` in ${searchParams.location}`
        : typeof searchParams.location === "object" && "name" in searchParams.location
        ? ` in ${(searchParams.location as { name: string }).name}`
        : ""
      : "";
  const contract =
    searchParams?.contract && typeof searchParams.contract === "string"
      ? ` for ${searchParams.contract}`
      : "";
  const type = searchParams?.type ? ` ${getPropertyTypeLabel(searchParams.type as "land" | "house" | "apartment" | "office" | "townhouse" | "commercial space" | "warehouse" | "guest house" | "shop" | "retail" | "beach house")}` : '';
  
  const title = `Properties${type}${contract}${location} | ${siteConfig.name}`;
  const description = `Browse ${properties.length} property listings${type}${contract}${location}. Find your perfect home in Ghana's largest property marketplace.`;
  
  return {
    title,
    description,
    keywords: [
      'Ghana properties',
      'property listings',
      'real estate Ghana',
      ...(searchParams?.location
        ? typeof searchParams.location === "string"
          ? [searchParams.location]
          : typeof searchParams.location === "object" && "name" in searchParams.location
            ? [(searchParams.location as { name: string }).name]
            : []
        : []),
      ...(searchParams?.contract && typeof searchParams.contract === "string" ? [`for ${searchParams.contract}`] : []),
      ...(searchParams?.type ? [getPropertyTypeLabel(searchParams.type as "land" | "house" | "apartment" | "office" | "townhouse" | "commercial space" | "warehouse" | "guest house" | "shop" | "retail" | "beach house")] : [])
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
          alt: siteConfig.name
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [siteConfig.ogImage],
      creator: siteConfig.creator,
    },
    robots: {
      index: true,
      follow: true,
    }
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
          alt: siteConfig.name
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
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
    }
  };
}

// Utility to create structured data script tag
export function createStructuredDataScript(data: Record<string, unknown>): string {
  return `<script type="application/ld+json">${JSON.stringify(data, null, 2)}</script>`;
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
  createStructuredDataScript,
};

export default seoUtils;