/**
 * Centralized data fetching functions
 * Replaces individual get-* functions with standardized, typed approaches
 */

import type {
  LegacyListingDetails,
  Property,
  PropertyListing,
  PropertyProject,
  PropertySearchParams,
  PropertySearchResponse,
  PropertyUnit,
} from "@/types";
import type { BlogResponse } from "@/types/blog";
import type { AdLink } from "@/types/common";
import { transformLegacyProperty } from "@/types/property-standardized";
import { meqasaApiClient } from "./client";
import { transformApiToPropertyListing } from "./transformers";

// Property-related data fetchers
export const propertyDataFetchers = {
  /**
   * Get featured listings for homepage
   */
  async getFeaturedListings(): Promise<{
    rentals: PropertyListing[];
    selling: PropertyListing[];
  }> {
    try {
      const response = await meqasaApiClient.postForm<{
        rentals: unknown[];
        selling: unknown[];
      }>("/hp-7");

      // Transform to our standardized format while preserving original fields
      const transformListing = (item: unknown): PropertyListing => {
        const standardized = transformApiToPropertyListing(item);
        
        // Store original API fields for backward compatibility
        ((standardized as unknown) as Record<string, unknown>).originalApiData = {
          pricepart1: (item as Record<string, unknown>).pricepart1,
          pricepart2: (item as Record<string, unknown>).pricepart2,
          price: (item as Record<string, unknown>).price,
        };
        
        return standardized;
      };

      return {
        rentals: (response.rentals ?? []).map(transformListing),
        selling: (response.selling ?? []).map(transformListing),
      };
    } catch (error) {
      console.error("Failed to fetch featured listings:", error);
      return { rentals: [], selling: [] };
    }
  },

  /**
   * Get property details by reference
   */
  async getPropertyDetails(reference: string): Promise<Property | null> {
    try {
      const response = await meqasaApiClient.getPropertyDetails<
        LegacyListingDetails | { status: string; msg?: string }
      >(reference);

      // Check for API failure response
      if ("status" in response && response.status === "fail") {
        throw new Error(response.msg ?? "Property not found");
      }

      const legacyProperty = response as LegacyListingDetails;
      
      // Transform to standardized format
      return transformLegacyProperty(legacyProperty);
    } catch (error) {
      console.error(`Failed to fetch property details for ${reference}:`, error);
      return null;
    }
  },

  /**
   * Search properties with filters
   */
  async searchProperties(
    params: PropertySearchParams
  ): Promise<PropertySearchResponse> {
    try {
      // Transform search params to API format
      const apiParams: Record<string, unknown> = {};
      
      if (params.type) {
        apiParams.type = Array.isArray(params.type) ? params.type.join(",") : params.type;
      }
      if (params.contract) apiParams.contract = params.contract;
      if (params.location) apiParams.location = params.location;
      if (params.bedrooms?.min) apiParams.bedrooms_min = params.bedrooms.min;
      if (params.bedrooms?.max) apiParams.bedrooms_max = params.bedrooms.max;
      if (params.price?.min) apiParams.price_min = params.price.min;
      if (params.price?.max) apiParams.price_max = params.price.max;
      if (params.q) apiParams.query = params.q;
      
      apiParams.page = params.page ?? 1;
      apiParams.limit = params.limit ?? 20;
      apiParams.sort = params.sortBy ?? "date_desc";

      const response = await meqasaApiClient.searchProperties<{
        properties: unknown[];
        total: number;
        page: number;
        limit: number;
      }>(apiParams);

      const properties = (response.properties ?? []).map((item: unknown): PropertyListing => {
        const data = item as Record<string, unknown>;
        return {
          id: (data.id ?? data.listingid ?? "") as string,
          reference: (data.reference ?? data.detailreq ?? "") as string,
          title: (data.title ?? "") as string,
          type: (["house", "apartment", "office", "land", "townhouse", "commercial space", "warehouse", "guest house", "shop", "retail", "beach house"].includes(data.type as string)
            ? (data.type as
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
                | "beach house")
            : "house"),
          contract: (["rent", "sale", "short-stay"].includes(data.contract as string)
            ? (data.contract as "rent" | "sale" | "short-stay")
            : "rent"),
          status: (["active", "pending", "sold", "rented", "withdrawn"].includes(data.status as string)
            ? (data.status as "active" | "pending" | "sold" | "rented" | "withdrawn")
            : "active"),
          location: (data.location ?? data.streetaddress ?? "") as string,
          bedrooms: parseInt((data.bedrooms ?? data.beds ?? "0") as string),
          bathrooms: parseInt((data.bathrooms ?? data.baths ?? "0") as string),
          floorArea: parseInt((data.floorArea ?? data.floorarea ?? "0") as string),
          pricing: {
            amount: parseFloat((data.price ?? "0") as string),
            currency: "GHS",
            formatted: `GH₵ ${typeof data.price === "number" || typeof data.price === "string" ? data.price : "0"}`,
          },
          coverImage: (data.coverImage ?? data.image ?? "") as string,
          featured: Boolean(data.featured),
          dateAdded: (data.dateAdded ?? data.datelisted ?? new Date().toISOString()) as string,
          slug: typeof data.slug === "string"
            ? data.slug
            : `${typeof data.title === "string" ? data.title.toLowerCase().replace(/\s+/g, '-') : ""}-${typeof data.id === "string" || typeof data.id === "number" ? String(data.id) : ""}`,
          agent: {
            name: ((data.agent as Record<string, unknown>)?.name ?? (data.owner as Record<string, unknown>)?.name ?? "Unknown") as string,
            verified: Boolean((data.agent as Record<string, unknown>)?.verified ?? (data.owner as Record<string, unknown>)?.verification === "1"),
          },
        };
      });

      const total = response.total ?? properties.length;
      const currentPage = response.page ?? params.page ?? 1;
      const limit = response.limit ?? params.limit ?? 20;
      const totalPages = Math.ceil(total / limit);

      return {
        properties,
        pagination: {
          page: currentPage,
          limit,
          total,
          totalPages,
          hasNext: currentPage < totalPages,
          hasPrev: currentPage > 1,
        },
        filters: {
          appliedFilters: params,
          availableFilters: {
            types: ["house", "apartment", "office", "land"],
            locations: ["Accra", "East Legon", "Tema"],
            priceRanges: {
              min: 0,
              max: 10000000,
            },
          },
        },
      };
    } catch (error) {
      console.error("Property search failed:", error);
      return {
        properties: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
        filters: {
          appliedFilters: params,
          availableFilters: {
            types: [],
            locations: [],
            priceRanges: { min: 0, max: 0 },
          },
        },
      };
    }
  },
};

// Project-related data fetchers
export const projectDataFetchers = {
  /**
   * Get featured projects
   */
      async getFeaturedProjects(): Promise<PropertyProject[]> {
      try {
        const response = await meqasaApiClient.getFeaturedProjects<unknown[]>();
        
                return (response ?? []).map((item: unknown): PropertyProject => {
          const data = item as Record<string, unknown>;
          return {
            id: (data.id ?? data.projectid ?? "") as string,
            name: (data.name ?? data.projectname ?? "") as string,
            slug: typeof data.slug === "string"
              ? data.slug
              : `${typeof data.name === "string" ? data.name.toLowerCase().replace(/\s+/g, '-') : ""}-${typeof data.id === "string" || typeof data.id === "number" ? String(data.id) : ""}`,
            description: (data.description ?? "") as string,
            location: {
              area: (data.location ?? data.city ?? "") as string,
              address: (data.address ?? "") as string,
              coordinates: data.lat && data.lng ? {
                lat: parseFloat(data.lat as string),
                lng: parseFloat(data.lng as string),
              } : undefined,
            },
            developer: {
              id: (data.developerid ?? "") as string,
              name: (data.developername ?? "Unknown") as string,
              verified: Boolean((data.developer as Record<string, unknown>)?.verified),
              contact: {
                phone: ((data.developer as Record<string, unknown>)?.phone ?? "") as string,
                email: (data.developer as Record<string, unknown>)?.email as string | undefined,
              },
            },
            media: {
              coverImage: (data.coverphoto ?? data.image ?? "") as string,
              images: (data.images ?? [data.coverphoto ?? data.image].filter(Boolean)) as string[],
              tourVideo: data.tourvideo as string | undefined,
            },
            features: (Array.isArray(data.features)
              ? data.features.filter((f: unknown) =>
                  [
                    "Swimming Pool",
                    "Gym",
                    "Garden",
                    "Parking",
                    "Security",
                    "Generator",
                    "Air Conditioning",
                    "Furnished",
                    "Balcony",
                    "Terrace",
                    "Elevator",
                    "CCTV",
                    "Gated Community",
                    "Playground",
                    "24hr Water",
                    "24hr Electricity",
                  ].includes(f as string)
                ) as (
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
                )[]
              : []),
            amenities: (data.amenities ?? []) as string[],
            units: {
              total: parseInt((data.totalunits ?? "0") as string),
              available: parseInt((data.availableunits ?? "0") as string),
              types: Array.isArray(data.unittypes)
              ? data.unittypes.map((ut: { type: string; count?: number; priceFrom?: number }) => ({
                  type: ut.type as
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
                  count: typeof ut.count === "number" ? ut.count : 0,
                  priceFrom: typeof ut.priceFrom === "number" ? ut.priceFrom : 0,
                }))
              : [],
            },
            completion: {
              status: (["under_construction", "completed", "planned"].includes(data.status as string)
                ? (data.status as "under_construction" | "completed" | "planned")
                : "under_construction"),
              date: data.completiondate as string | undefined,
            },
            dates: {
              launched: (data.dateadded ?? new Date().toISOString()) as string,
              updated: (data.updated_at ?? data.dateadded ?? new Date().toISOString()) as string,
            },
            featured: Boolean(data.featured),
          };
        });
    } catch (error) {
      console.error("Failed to fetch featured projects:", error);
      return [];
    }
  },

  /**
   * Get project units
   */
      async getProjectUnits(projectId: string): Promise<PropertyUnit[]> {
      try {
        const response = await meqasaApiClient.postForm<unknown[]>("/project-units", {
          projectid: projectId,
        });

                return (response ?? []).map((item: unknown): PropertyUnit => {
          const data = item as Record<string, unknown>;
          return {
            id: (data.unitid ?? data.id ?? "") as string,
            unitNumber: (data.unitnumber ?? data.unitname) as string | undefined,
            type: (["house", "apartment", "office", "land", "townhouse", "commercial space", "warehouse", "guest house", "shop", "retail", "beach house"].includes(data.unittype as string)
              ? (data.unittype as
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
                  | "beach house")
              : "apartment"),
            title: (data.title ?? data.unitname ?? "") as string,
            bedrooms: parseInt((data.beds ?? "0") as string),
            bathrooms: parseInt((data.baths ?? "0") as string),
            floorArea: parseFloat((data.floorarea ?? "0") as string),
            pricing: {
              selling: data.sellingprice ? {
                amount: parseFloat(data.sellingprice as string),
                currency: "GHS",
              } : undefined,
              renting: data.rentpricepermonth ? {
                amount: parseFloat(data.rentpricepermonth as string),
                currency: "GHS",
                period: "month" as const,
              } : undefined,
            },
            features: Array.isArray(data.features)
              ? data.features.filter((f: unknown) =>
                  [
                    "Swimming Pool",
                    "Gym",
                    "Garden",
                    "Parking",
                    "Security",
                    "Generator",
                    "Air Conditioning",
                    "Furnished",
                    "Balcony",
                    "Terrace",
                    "Elevator",
                    "CCTV",
                    "Gated Community",
                    "Playground",
                    "24hr Water",
                    "24hr Electricity",
                  ].includes(f as string)
                ) as (
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
                )[]
              : [],
            available: Boolean(!data.soldout),
            coverImage: (data.coverphoto ?? "") as string,
            floorPlan: data.floorplan ? {
              imageUrl: data.floorplan as string,
              sqft: parseFloat((data.floorarea ?? "0") as string),
              sqm: parseFloat((data.floorarea ?? "0") as string) * 0.092903, // Convert sqft to sqm
            } : undefined,
            project: {
              id: projectId,
              name: (data.projectname ?? "") as string,
              developer: {
                id: (data.developerid ?? "") as string,
                name: (data.developername ?? "") as string,
              },
            },
          };
        });
    } catch (error) {
      console.error(`Failed to fetch units for project ${projectId}:`, error);
      return [];
    }
  },
};

// Banner/Ad data fetchers
export const bannerDataFetchers = {
  async getHeroBanner(): Promise<AdLink | null> {
    try {
      const response = await meqasaApiClient.getHeroBanner<AdLink>();
      return response;
    } catch (error) {
      console.error("Failed to fetch hero banner:", error);
      return null;
    }
  },

  async getFlexiBanner(): Promise<AdLink | null> {
    try {
      const response = await meqasaApiClient.getFlexiBanner<AdLink>();
      return response;
    } catch (error) {
      console.error("Failed to fetch flexi banner:", error);
      return null;
    }
  },

  async getGridBanner(): Promise<AdLink | null> {
    try {
      const response = await meqasaApiClient.getGridBanner<AdLink>();
      return response;
    } catch (error) {
      console.error("Failed to fetch grid banner:", error);
      return null;
    }
  },
};

// Blog data fetchers
export const blogDataFetchers = {
  async getBlogData(): Promise<BlogResponse> {
    try {
      const response = await meqasaApiClient.getFeaturedBlogPosts<BlogResponse>();
      
      // Validate and clean response structure
      return {
        featured: Array.isArray(response.featured) ? response.featured : [],
        market: Array.isArray(response.market) ? response.market : [],
      };
    } catch (error) {
      console.error("Failed to fetch blog data:", error);
      return {
        featured: [],
        market: [],
      };
    }
  },
};

// Combined export
export const dataFetchers = {
  ...propertyDataFetchers,
  ...projectDataFetchers,
  ...bannerDataFetchers,
  ...blogDataFetchers,
};