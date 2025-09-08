/**
 * Data transformation layer
 * Handles conversion between API responses, legacy formats, and standardized types
 */

import type { PropertyListing, PropertyProject, PropertyUnit } from "@/types";
import type { AdLink } from "@/types/common";
import type { BlogResponse } from "@/types/blog";
import { formatPropertyPrice, getPropertyTypeLabel } from "@/lib/utils";
import { slugify } from "@/lib/utils";

// Helper function to extract numeric price from HTML entity formatted strings
function extractNumericPrice(priceString: string): string {
  if (!priceString) return "0";

  // Decode HTML entities and extract numeric value
  // Handle formats like: 'GH&#8373;28,000/ month', 'GH&#8373;6,556,878'
  return (
    priceString
      .replace(/&#8373;/g, "") // Remove HTML entity for ₵
      .replace(/GH/g, "") // Remove GH prefix
      .replace(/[^\d,\.]/g, "") // Keep only digits, commas, and dots
      .replace(/,/g, "") || // Remove commas
    "0"
  );
}

/**
 * Transform raw API response to PropertyListing
 */
export function transformApiToPropertyListing(
  apiData: unknown
): PropertyListing {
  const data = apiData as Record<string, unknown>;
  return {
    id: (data.id ?? data.listingid ?? data.detailreq ?? "") as string,
    reference: (data.reference ?? data.detailreq ?? "") as string,
    title: (data.title ?? "") as string,
    type: (data.type ?? "house") as
      | "house"
      | "apartment"
      | "office"
      | "land"
      | "townhouse"
      | "commercial space"
      | "warehouse"
      | "guest house"
      | "shop"
      | "retail"
      | "beach house",
    contract: (data.contract ?? "rent") as "rent" | "sale" | "short-stay",
    status: (data.status ?? "active") as
      | "active"
      | "pending"
      | "sold"
      | "rented"
      | "withdrawn",
    location: (data.location ?? data.streetaddress ?? "") as string,
    bedrooms: parseInt(
      (data.bedrooms ?? data.beds ?? data.bedroomcount ?? "0") as string
    ),
    bathrooms: parseInt(
      (data.bathrooms ?? data.baths ?? data.bathroomcount ?? "0") as string
    ),
    floorArea: parseInt((data.floorArea ?? data.floorarea ?? "0") as string),
    pricing: {
      amount: parseFloat(extractNumericPrice((data.price ?? "0") as string)),
      currency: (data.currency ?? "GHS") as "GHS" | "USD",
      formatted: formatPropertyPrice(
        parseFloat(extractNumericPrice((data.price ?? "0") as string)),
        (data.currency ?? "GHS") as "GHS" | "USD",
        data.contract as "rent" | "sale" | "short-stay"
      ),
    },
    coverImage: (data.coverImage ?? data.image ?? "") as string,
    featured: Boolean(data.featured),
    dateAdded: (data.dateAdded ??
      data.datelisted ??
      new Date().toISOString()) as string,
    slug: (data.slug ??
      generatePropertySlug(
        data.title as string,
        data.type as string,
        data.id as string
      )) as string,
    agent: {
      name: ((data.agent as Record<string, unknown>)?.name ??
        (data.owner as Record<string, unknown>)?.name ??
        "Unknown") as string,
      verified: Boolean(
        (data.agent as Record<string, unknown>)?.verified ??
          (data.owner as Record<string, unknown>)?.verification === "1"
      ),
    },
  };
}

/**
 * Transform PropertyListing back to legacy format
 */
export function transformPropertyListingToLegacy(
  property: PropertyListing
): Record<string, unknown> {
  return {
    detailreq: property.reference,
    image: property.coverImage,
    streetaddress: property.location,
    baths: property.bathrooms.toString(),
    beds: property.bedrooms.toString(),
    garages: "0", // Not available in standardized format
    title: property.title,
    price: property.pricing.amount.toString(),
    contract: property.contract,
    bathroomcount: property.bathrooms.toString(),
    bedroomcount: property.bedrooms.toString(),
  };
}

/**
 * Transform raw API response to PropertyProject
 */
export function transformApiToPropertyProject(
  apiData: unknown
): PropertyProject {
  const data = apiData as Record<string, unknown>;
  return {
    id: (data.id ?? data.projectid ?? "") as string,
    name: (data.name ?? data.projectname ?? "") as string,
    slug: (data.slug ??
      generateProjectSlug(data.name as string, data.id as string)) as string,
    description: (data.description ?? "") as string,
    location: {
      area: (data.location ?? data.city ?? "") as string,
      address: (data.address ?? "") as string,
      coordinates:
        data.lat && data.lng
          ? {
              lat: parseFloat(data.lat as string),
              lng: parseFloat(data.lng as string),
            }
          : undefined,
    },
    developer: {
      id: (data.developerid ?? "") as string,
      name: (data.developername ??
        (data.developer as Record<string, unknown>)?.name ??
        "Unknown") as string,
      logo: (data.developer as Record<string, unknown>)?.logo as
        | string
        | undefined,
      verified: Boolean((data.developer as Record<string, unknown>)?.verified),
      contact: {
        phone: ((data.developer as Record<string, unknown>)?.phone ??
          "") as string,
        email: (data.developer as Record<string, unknown>)?.email as
          | string
          | undefined,
      },
    },
    media: {
      coverImage: (data.coverphoto ??
        data.coverimage ??
        data.image ??
        "") as string,
      images: Array.isArray(data.images)
        ? (data.images as string[])
        : [(data.coverphoto ?? data.image) as string].filter(Boolean),
      tourVideo: (data.tourvideo ?? data.tourVideo) as string | undefined,
    },
    features: Array.isArray(data.features)
      ? (data.features as (
          | "Swimming Pool"
          | "Gym"
          | "Garden"
          | "Parking"
          | "Security"
          | "Generator"
          | "Air Conditioning"
          | "Furnished"
          | "Balcony"
          | "Terrace"
          | "Elevator"
          | "CCTV"
          | "Gated Community"
          | "Playground"
          | "24hr Water"
          | "24hr Electricity"
        )[])
      : [],
    amenities: Array.isArray(data.amenities)
      ? (data.amenities as string[])
      : [],
    units: {
      total: parseInt((data.totalunits ?? "0") as string),
      available: parseInt((data.availableunits ?? "0") as string),
      types: Array.isArray(data.unittypes)
        ? (data.unittypes as Record<string, unknown>[]).map((type) => ({
            type: (type.type ?? "apartment") as
              | "house"
              | "apartment"
              | "office"
              | "land"
              | "townhouse"
              | "commercial space"
              | "warehouse"
              | "guest house"
              | "shop"
              | "retail"
              | "beach house",
            count: parseInt((type.count ?? "0") as string),
            priceFrom: parseFloat(
              (type.priceFrom ?? type.price ?? "0") as string
            ),
          }))
        : [],
    },
    completion: {
      status: (data.status ?? "under_construction") as
        | "under_construction"
        | "completed"
        | "planned",
      date: (data.completiondate ?? data.completionDate) as string | undefined,
    },
    dates: {
      launched: (data.dateadded ??
        data.created_at ??
        new Date().toISOString()) as string,
      updated: (data.updated_at ??
        data.dateadded ??
        new Date().toISOString()) as string,
    },
    featured: Boolean(data.featured),
  };
}

/**
 * Transform raw API response to PropertyUnit
 */
export function transformApiToPropertyUnit(
  apiData: unknown,
  projectId?: string
): PropertyUnit {
  const data = apiData as Record<string, unknown>;
  return {
    id: (data.unitid ?? data.id ?? "") as string,
    unitNumber: (data.unitnumber ?? data.unitname) as string | undefined,
    type: (data.unittype ?? "apartment") as
      | "house"
      | "apartment"
      | "office"
      | "land"
      | "townhouse"
      | "commercial space"
      | "warehouse"
      | "guest house"
      | "shop"
      | "retail"
      | "beach house",
    title: (data.title ??
      data.unitname ??
      `Unit ${String(data.unitnumber ?? data.id)}`) as string,
    bedrooms: parseInt((data.beds ?? "0") as string),
    bathrooms: parseInt((data.baths ?? "0") as string),
    floorArea: parseFloat((data.floorarea ?? "0") as string),
    pricing: {
      selling: data.sellingprice
        ? {
            amount: parseFloat(data.sellingprice as string),
            currency: (data.currency ?? "GHS") as "GHS" | "USD",
          }
        : undefined,
      renting: data.rentpricepermonth
        ? {
            amount: parseFloat(data.rentpricepermonth as string),
            currency: (data.currency ?? "GHS") as "GHS" | "USD",
            period: "month" as const,
          }
        : undefined,
    },
    features: Array.isArray(data.features)
      ? (data.features as (
          | "Swimming Pool"
          | "Gym"
          | "Garden"
          | "Parking"
          | "Security"
          | "Generator"
          | "Air Conditioning"
          | "Furnished"
          | "Balcony"
          | "Terrace"
          | "Elevator"
          | "CCTV"
          | "Gated Community"
          | "Playground"
          | "24hr Water"
          | "24hr Electricity"
        )[])
      : [],
    available: Boolean(!data.soldout && !data.sold),
    coverImage: (data.coverphoto ?? data.image ?? "") as string,
    floorPlan: data.floorplan
      ? {
          imageUrl: data.floorplan as string,
          sqft: parseFloat((data.floorarea ?? "0") as string),
          sqm: parseFloat((data.floorarea ?? "0") as string) * 0.092903, // Convert sqft to sqm
        }
      : undefined,
    project: {
      id: (projectId ?? data.projectid ?? "") as string,
      name: (data.projectname ?? "") as string,
      developer: {
        id: (data.developerid ?? "") as string,
        name: (data.developername ?? "") as string,
        logo: (data.developer as Record<string, unknown>)?.logo as
          | string
          | undefined,
      },
    },
  };
}

/**
 * Transform raw API response to AdLink
 */
export function transformApiToAdLink(apiData: unknown): AdLink {
  const data = apiData as Record<string, unknown>;
  return {
    src: (data.src ?? data.image ?? "") as string,
    href: (data.href ?? data.link ?? "#") as string,
  };
}

/**
 * Transform raw API response to BlogResponse
 */
export function transformApiToBlogResponse(apiData: unknown): BlogResponse {
  const data = apiData as Record<string, unknown>;
  return {
    featured: Array.isArray(data.featured)
      ? (data.featured as unknown[]).map(transformBlogPost)
      : [],
    market: Array.isArray(data.market)
      ? (data.market as unknown[]).map(transformBlogPost)
      : [],
  };
}

/**
 * Transform individual blog post
 */
function transformBlogPost(post: unknown) {
  const data = post as Record<string, unknown>;
  return {
    thumbnail: (data.coverImage ??
      data.image ??
      data.thumbnail ??
      "") as string,
    source: "meQasa Blog",
    summary: (data.title ?? data.excerpt ?? data.summary ?? "") as string,
    date: (data.publishedAt ??
      data.created_at ??
      data.date ??
      new Date().toISOString()) as string,
    url: (data.url ?? data.slug ?? "#") as string,
  };
}

/**
 * Batch transformation utilities
 */
export const batchTransformers = {
  /**
   * Transform array of API responses to PropertyListings
   */
  toPropertyListings(apiDataArray: unknown[]): PropertyListing[] {
    return (apiDataArray ?? []).map(transformApiToPropertyListing);
  },

  /**
   * Transform array of PropertyListings to legacy format
   */
  toLegacyListings(properties: PropertyListing[]): unknown[] {
    return properties.map(transformPropertyListingToLegacy);
  },

  /**
   * Transform array of API responses to PropertyProjects
   */
  toPropertyProjects(apiDataArray: unknown[]): PropertyProject[] {
    return (apiDataArray ?? []).map(transformApiToPropertyProject);
  },

  /**
   * Transform array of API responses to PropertyUnits
   */
  toPropertyUnits(apiDataArray: unknown[], projectId?: string): PropertyUnit[] {
    return (apiDataArray ?? []).map((data) =>
      transformApiToPropertyUnit(data, projectId)
    );
  },
};

function generatePropertySlug(
  title?: string,
  type?: string,
  id?: string
): string {
  if (!title && !type && !id) return "property";

  const parts = [];
  if (title) parts.push(title);
  if (type)
    parts.push(
      getPropertyTypeLabel(
        type as
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
      )
    );
  if (id) parts.push(id);

  return slugify(parts.join(" "));
}

function generateProjectSlug(name?: string, id?: string): string {
  if (!name && !id) return "project";

  const parts = [];
  if (name) parts.push(name);
  if (id) parts.push(id);

  return slugify(parts.join(" "));
}

// Legacy compatibility exports
export {
  transformApiToPropertyListing as transformListing,
  transformPropertyListingToLegacy as transformToLegacy,
  transformApiToPropertyProject as transformProject,
  transformApiToPropertyUnit as transformUnit,
  transformApiToAdLink as transformAd,
  transformApiToBlogResponse as transformBlog,
};
