// Projects page constants for maintainability and consistency

export const UNIT_TYPES = [
  "all",
  "apartment",
  "house",
  "detached house",
  "semi-detached house",
  "townhouse",
  "studio apartment",
  "penthouse apartment",
  "villa",
  "condominium",
  "terrace house",
] as const;

export const TERMS_OPTIONS = [
  { value: "sale", label: "For Sale" },
  { value: "rent", label: "For Rent" },
  { value: "preselling", label: "Pre-selling" },
] as const;

export const BEDROOM_OPTIONS = [
  { value: "0", label: "Beds" },
  { value: "1", label: "1+ Beds" },
  { value: "2", label: "2+ Beds" },
  { value: "3", label: "3+ Beds" },
  { value: "4", label: "4+ Beds" },
  { value: "5", label: "5+ Beds" },
  { value: "6", label: "6+ Beds" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "bedrooms", label: "Most Bedrooms" },
  { value: "popularity", label: "Most Popular" },
] as const;

// Grid configuration
export const GRID_CONFIG = {
  SECTION_LIMIT: 3,
  DEFAULT_GRID_LIMIT: 9,
  FEATURED_LIMIT: 12,
} as const;

// API configuration
export const API_CONFIG = {
  APP_PARAM: "vercel",
  ENDPOINT: "/api/developer-units",
} as const;
