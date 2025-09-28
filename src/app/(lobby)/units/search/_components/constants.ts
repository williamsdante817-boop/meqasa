/**
 * Constants and configuration for units search module
 * Centralized location for all search-related constants to improve maintainability
 */

// API Configuration
export const API_CONFIG = {
  /** Default app identifier for API requests */
  APP_ID: "vercel",
  /** Cache revalidation time in seconds (5 minutes) */
  CACHE_REVALIDATION: 300,
  /** Stale while revalidate time in seconds (10 minutes) */
  CACHE_SWR: 600,
  /** Default page size for pagination */
  DEFAULT_PAGE_SIZE: 12,
  /** Maximum items to load per request */
  MAX_ITEMS_PER_REQUEST: 50,
} as const;

// Search Configuration
export const SEARCH_CONFIG = {
  /** Number of items to prioritize for image loading (LCP optimization) */
  PRIORITY_IMAGES_COUNT: 8,
  /** Maximum number of location suggestions to show */
  MAX_LOCATION_SUGGESTIONS: 5,
  /** Default search term when none specified */
  DEFAULT_TERMS: "sale",
  /** Default unit type filter */
  DEFAULT_UNIT_TYPE: "all",
  /** Default bedroom/bathroom count for "any" selection */
  DEFAULT_BED_BATH_COUNT: "0",
} as const;

// Filter Options
export const FILTER_OPTIONS = {
  /** Available contract terms */
  TERMS: [
    { value: "sale", label: "For Sale" },
    { value: "rent", label: "For Rent" },
    { value: "preselling", label: "Pre-selling" },
  ],

  /** Available unit types */
  UNIT_TYPES: [
    { value: "all", label: "All Types" },
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "detached house", label: "Detached House" },
    { value: "semi-detached house", label: "Semi-Detached House" },
    { value: "townhouse", label: "Townhouse" },
    { value: "studio apartment", label: "Studio Apartment" },
    { value: "penthouse apartment", label: "Penthouse Apartment" },
    { value: "villa", label: "Villa" },
    { value: "condominium", label: "Condominium" },
    { value: "terrace house", label: "Terrace House" },
  ],

  /** Available bedroom options */
  BEDROOMS: [
    { value: "0", label: "Beds" },
    { value: "1", label: "1+ Beds" },
    { value: "2", label: "2+ Beds" },
    { value: "3", label: "3+ Beds" },
    { value: "4", label: "4+ Beds" },
    { value: "5", label: "5+ Beds" },
    { value: "6", label: "6+ Beds" },
  ],

  /** Available bathroom options */
  BATHROOMS: [
    { value: "0", label: "Baths" },
    { value: "1", label: "1+ Baths" },
    { value: "2", label: "2+ Baths" },
    { value: "3", label: "3+ Baths" },
    { value: "4", label: "4+ Baths" },
    { value: "5", label: "5+ Baths" },
    { value: "6", label: "6+ Baths" },
  ],
} as const;

// UI Configuration
export const UI_CONFIG = {
  /** Avatar size for developer images */
  AVATAR_SIZE: "h-10 w-10",
  /** Default transition duration for animations */
  TRANSITION_DURATION: "duration-200",
  /** Loading skeleton animation duration */
  SKELETON_ANIMATION: "animate-pulse",
  /** Default card hover effects */
  CARD_HOVER_EFFECTS: "hover:shadow-md transition-all duration-300",
} as const;

// Image Configuration
export const IMAGE_CONFIG = {
  /** Base URL for developer logos */
  DEVELOPER_LOGO_BASE_URL: "https://meqasa.com/uploads/imgs/",
  /** Base URL for unit cover photos */
  UNIT_PHOTO_BASE_URL: "https://meqasa.com/uploads/imgs/",
  /** Fallback image URL for missing images */
  FALLBACK_IMAGE_URL: "https://dve7rykno93gs.cloudfront.net/pieoq/1572277987",
  /** Image quality for optimization */
  IMAGE_QUALITY: 75,
  /** Responsive image sizes */
  RESPONSIVE_SIZES: "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 300px",
} as const;

// URL Configuration
export const URL_CONFIG = {
  /** Base search URL */
  SEARCH_BASE_URL: "/units/search",
  /** API endpoint for developer units */
  API_ENDPOINT: "/api/developer-units",
  /** Developer unit detail URL pattern */
  UNIT_DETAIL_URL_PATTERN: "/developer-unit/{bedrooms}-bedroom-{type}-for-{terms}-in-{city}-unit-{id}",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  /** Generic API error message */
  API_ERROR: "Failed to load units. Please try again.",
  /** Network error message */
  NETWORK_ERROR: "Network error occurred. Please check your connection and try again.",
  /** No results found message */
  NO_RESULTS: "We couldn't find any developer units matching your search criteria. Try adjusting your filters or check back later for new listings.",
  /** Search filter error */
  FILTER_ERROR: "An error occurred while processing your search. Please try again.",
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  /** Maximum price value */
  MAX_PRICE: 1000000000,
  /** Minimum price value */
  MIN_PRICE: 0,
  /** Maximum bedroom count */
  MAX_BEDROOMS: 10,
  /** Maximum bathroom count */
  MAX_BATHROOMS: 10,
  /** Maximum search query length */
  MAX_SEARCH_QUERY_LENGTH: 100,
} as const;

// Analytics and Tracking
export const ANALYTICS_CONFIG = {
  /** Events to track */
  EVENTS: {
    SEARCH_PERFORMED: "search_performed",
    FILTER_APPLIED: "filter_applied",
    UNIT_VIEWED: "unit_viewed",
    CONTACT_CLICKED: "contact_clicked",
    LOAD_MORE_CLICKED: "load_more_clicked",
  },
  /** Properties to track with events */
  PROPERTIES: {
    SEARCH_TERMS: "search_terms",
    FILTERS_APPLIED: "filters_applied",
    RESULTS_COUNT: "results_count",
    UNIT_TYPE: "unit_type",
    LOCATION: "location",
  },
} as const;

// Type helpers for constants
export type ContractTerms = typeof FILTER_OPTIONS.TERMS[number]["value"];
export type UnitTypes = typeof FILTER_OPTIONS.UNIT_TYPES[number]["value"];
export type BedroomOptions = typeof FILTER_OPTIONS.BEDROOMS[number]["value"];
export type BathroomOptions = typeof FILTER_OPTIONS.BATHROOMS[number]["value"];