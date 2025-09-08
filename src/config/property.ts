/**
 * Property-specific configuration
 * Centralized constants for property types, contracts, and related settings
 */

export const propertyTypes = [
  "house",
  "apartment",
  "office",
  "land",
  "townhouse",
  "commercial space",
  "warehouse",
  "guest house",
  "shop",
  "retail",
  "beach house",
] as const;

export const contractTypes = ["rent", "sale", "short-stay"] as const;

export const propertyStatuses = [
  "active",
  "pending",
  "sold",
  "rented",
  "withdrawn",
] as const;

export const currencies = ["GHS", "USD"] as const;

export const popularLocations = [
  "Accra",
  "East Legon",
  "Tema",
  "Kasoa",
  "Spintex",
  "Airport Area",
  "Cantonments",
  "Dzorwulu",
  "Ridge",
  "Osu",
  "Labone",
  "Airport Hills",
  "Adjiringanor",
  "Kwabenya",
  "Tesano",
] as const;

export const bedroomOptions = [
  { value: "1", label: "1 Bedroom" },
  { value: "2", label: "2 Bedrooms" },
  { value: "3", label: "3 Bedrooms" },
  { value: "4", label: "4 Bedrooms" },
  { value: "5", label: "5+ Bedrooms" },
] as const;

export const bathroomOptions = [
  { value: "1", label: "1 Bathroom" },
  { value: "2", label: "2 Bathrooms" },
  { value: "3", label: "3 Bathrooms" },
  { value: "4", label: "4 Bathrooms" },
  { value: "5", label: "5+ Bathrooms" },
] as const;

export const priceRanges = {
  rent: [
    { value: "0-500", label: "Under GH₵ 500" },
    { value: "500-1000", label: "GH₵ 500 - 1,000" },
    { value: "1000-2000", label: "GH₵ 1,000 - 2,000" },
    { value: "2000-5000", label: "GH₵ 2,000 - 5,000" },
    { value: "5000-10000", label: "GH₵ 5,000 - 10,000" },
    { value: "10000", label: "GH₵ 10,000+" },
  ],
  sale: [
    { value: "0-50000", label: "Under GH₵ 50,000" },
    { value: "50000-100000", label: "GH₵ 50,000 - 100,000" },
    { value: "100000-250000", label: "GH₵ 100,000 - 250,000" },
    { value: "250000-500000", label: "GH₵ 250,000 - 500,000" },
    { value: "500000-1000000", label: "GH₵ 500,000 - 1,000,000" },
    { value: "1000000", label: "GH₵ 1,000,000+" },
  ],
} as const;

export const propertyFeatures = [
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
] as const;

// Property configuration for UI components
export const propertyConfig = {
  types: propertyTypes,
  contracts: contractTypes,
  statuses: propertyStatuses,
  currencies,
  locations: popularLocations,
  bedrooms: bedroomOptions,
  bathrooms: bathroomOptions,
  priceRanges,
  features: propertyFeatures,

  // Default values
  defaults: {
    currency: "GHS" as const,
    contract: "rent" as const,
    location: "Accra" as const,
    type: "house" as const,
  },

  // Property type categories for better organization
  categories: {
    residential: ["house", "apartment", "townhouse"],
    commercial: ["office", "shop", "commercial space", "warehouse", "retail"],
    hospitality: ["guest house", "beach house"],
    land: ["land"],
  },

  // Search-specific configurations
  search: {
    resultsPerPage: 20,
    maxFilters: 10,
    defaultSortBy: "date_desc" as const,
    sortOptions: [
      { value: "date_desc", label: "Newest First" },
      { value: "date_asc", label: "Oldest First" },
      { value: "price_asc", label: "Price: Low to High" },
      { value: "price_desc", label: "Price: High to Low" },
      { value: "relevance", label: "Most Relevant" },
    ],
  },
} as const;

// Type exports for TypeScript
export type PropertyType = (typeof propertyTypes)[number];
export type ContractType = (typeof contractTypes)[number];
export type PropertyStatus = (typeof propertyStatuses)[number];
export type Currency = (typeof currencies)[number];
export type PopularLocation = (typeof popularLocations)[number];
export type PropertyFeature = (typeof propertyFeatures)[number];
