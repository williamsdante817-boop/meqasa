/**
 * Standardized property types and interfaces
 * Based on skateshop patterns for consistent, typed data structures
 */

import type {
  ContractType,
  Currency,
  PropertyFeature,
  PropertyStatus,
  PropertyType
} from "@/config/property";

// Core property data structure (standardized)
export interface Property {
  id: string;
  reference: string;
  title: string;
  description: string;
  type: PropertyType;
  contract: ContractType;
  status: PropertyStatus;
  
  // Location information
  location: {
    area: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Property details
  details: {
    bedrooms: number;
    bathrooms: number;
    garages?: number;
    floorArea: number;
    landArea?: number;
    furnished: boolean;
    negotiable: boolean;
  };
  
  // Pricing
  pricing: {
    amount: number;
    currency: Currency;
    priceOnRequest: boolean;
    rentPeriod?: "month" | "week" | "day";
  };
  
  // Media and assets
  media: {
    coverImage: string;
    images: string[];
    tourVideo?: string;
  };
  
  // Features and amenities
  features: PropertyFeature[];
  amenities: string[];
  
  // Agent/Owner information
  agent: {
    id: string;
    name: string;
    type: "individual" | "company";
    profileImage?: string;
    logo?: string;
    verified: boolean;
    contact: {
      phone: string;
      email?: string;
    };
  };
  
  // Timestamps
  dates: {
    listed: string;
    updated: string;
  };
  
  // SEO and URLs
  seo: {
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
  };
  
  // Metrics
  metrics: {
    views: number;
    contactClicks: number;
    featured: boolean;
  };
}

// Property listing for search results and listings pages
export interface PropertyListing {
  id: string;
  reference: string;
  title: string;
  type: PropertyType;
  contract: ContractType;
  status: PropertyStatus;
  location: string;
  bedrooms: number;
  bathrooms: number;
  floorArea: number;
  pricing: {
    amount: number;
    currency: Currency;
    formatted: string;
  };
  coverImage: string;
  featured: boolean;
  dateAdded: string;
  slug: string;
  agent: {
    name: string;
    verified: boolean;
  };
}

// Property search parameters
export interface PropertySearchParams {
  type?: PropertyType | PropertyType[];
  contract?: ContractType;
  location?: string;
  bedrooms?: {
    min?: number;
    max?: number;
  };
  bathrooms?: {
    min?: number;
    max?: number;
  };
  price?: {
    min?: number;
    max?: number;
    currency?: Currency;
  };
  features?: PropertyFeature[];
  furnished?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "date_desc" | "date_asc" | "price_asc" | "price_desc" | "relevance";
  q?: string; // General search query
}

// Property search response
export interface PropertySearchResponse {
  properties: PropertyListing[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters: {
    appliedFilters: PropertySearchParams;
    availableFilters: {
      types: PropertyType[];
      locations: string[];
      priceRanges: {
        min: number;
        max: number;
      };
    };
  };
}

// Property for featured sections
export interface FeaturedProperty extends PropertyListing {
  description: string;
  features: PropertyFeature[];
  agent: {
    id: string;
    name: string;
    type: "individual" | "company";
    verified: boolean;
    logo?: string;
  };
}

// Property unit for projects/developments
export interface PropertyUnit {
  id: string;
  unitNumber?: string;
  type: PropertyType;
  title: string;
  bedrooms: number;
  bathrooms: number;
  floorArea: number;
  pricing: {
    selling?: {
      amount: number;
      currency: Currency;
    };
    renting?: {
      amount: number;
      currency: Currency;
      period: "month" | "week" | "day";
    };
  };
  features: PropertyFeature[];
  available: boolean;
  coverImage: string;
  floorPlan?: {
    imageUrl: string;
    sqft: number;
    sqm: number;
  };
  project: {
    id: string;
    name: string;
    developer: {
      id: string;
      name: string;
      logo?: string;
    };
  };
}

// Property project/development
export interface PropertyProject {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: {
    area: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  developer: {
    id: string;
    name: string;
    logo?: string;
    verified: boolean;
    contact: {
      phone: string;
      email?: string;
    };
  };
  media: {
    coverImage: string;
    images: string[];
    tourVideo?: string;
  };
  features: PropertyFeature[];
  amenities: string[];
  units: {
    total: number;
    available: number;
    types: {
      type: PropertyType;
      count: number;
      priceFrom: number;
    }[];
  };
  completion: {
    status: "completed" | "under_construction" | "planned";
    date?: string;
  };
  dates: {
    launched: string;
    updated: string;
  };
  featured: boolean;
}

// Property contact form data
export interface PropertyContactForm {
  propertyId: string;
  propertyTitle: string;
  contactType: "inquiry" | "viewing" | "callback";
  visitor: {
    name: string;
    email: string;
    phone: string;
  };
  message: string;
  preferredContact?: "phone" | "email" | "whatsapp";
  preferredTime?: string;
}

// Property analytics/metrics
export interface PropertyMetrics {
  propertyId: string;
  views: {
    total: number;
    monthly: number;
    weekly: number;
  };
  contacts: {
    total: number;
    monthly: number;
    weekly: number;
  };
  favorites: number;
  shares: number;
  averageViewDuration?: number;
  topReferrers?: string[];
}

// Legacy property interface mapping (for backward compatibility)
export interface LegacyListingDetails extends Omit<Property, 'id' | 'reference' | 'type' | 'contract' | 'location' | 'details' | 'pricing' | 'media' | 'agent' | 'dates' | 'seo' | 'metrics'> {
  listingid: string;
  detailreq: string;
  location: string;
  locationstring: string;
  streetaddress: string;
  type: string;
  contract: string;
  beds: string;
  baths: string;
  isfurnished: string;
  garages: string;
  floorarea: string;
  price: string;
  pdr: string;
  leaseunit: string;
  leaseoptions: string[];
  isnegotiable: string;
  datelisted: string;
  imagelist: string[];
  image: string;
  owner: {
    haswan: boolean;
    name: string;
    page: string;
    type: string;
    accounttype: string;
    logo: string;
    profilepic: string;
    commission: string;
    registrationfee: string;
    listingscount: string;
    verification: string;
  };
  similars: LegacyListingDetails[];
}

// Transform legacy data to standardized format
export function transformLegacyProperty(legacy: LegacyListingDetails): Property {
  return {
    id: legacy.listingid,
    reference: legacy.detailreq,
    title: legacy.title,
    description: legacy.description,
    type: legacy.type as PropertyType,
    contract: legacy.contract as ContractType,
    status: "active" as PropertyStatus,
    
    location: {
      area: legacy.location,
      address: legacy.streetaddress,
    },
    
    details: {
      bedrooms: parseInt(legacy.beds) || 0,
      bathrooms: parseInt(legacy.baths) || 0,
      garages: parseInt(legacy.garages) || 0,
      floorArea: parseInt(legacy.floorarea) || 0,
      furnished: legacy.isfurnished === "1",
      negotiable: legacy.isnegotiable === "1",
    },
    
    pricing: {
      amount: parseFloat(legacy.price) || 0,
      currency: "GHS" as Currency,
      priceOnRequest: legacy.pdr === "1",
    },
    
    media: {
      coverImage: legacy.image,
      images: legacy.imagelist,
    },
    
    features: [],
    amenities: legacy.amenities || [],
    
    agent: {
      id: legacy.owner.page,
      name: legacy.owner.name,
      type: legacy.owner.accounttype === "company" ? "company" : "individual",
      profileImage: legacy.owner.profilepic,
      logo: legacy.owner.logo,
      verified: legacy.owner.verification === "1",
      contact: {
        phone: "", // Not available in legacy format
      },
    },
    
    dates: {
      listed: legacy.datelisted,
      updated: legacy.datelisted,
    },
    
    seo: {
      slug: `${legacy.title.toLowerCase().replace(/\s+/g, '-')}-${legacy.listingid}`,
    },
    
    metrics: {
      views: 0,
      contactClicks: 0,
      featured: false,
    },
  };
}