/**
 * Shared types for units search module
 * Comprehensive type definitions for type safety and maintainability
 */

/**
 * Represents a developer unit with all possible properties
 * Used throughout the search module for consistent data structure
 */
export interface DeveloperUnit {
  id: string;
  unitid?: number;
  title: string;
  price: string;
  location: string;
  address?: string;
  city?: string;
  bedrooms: number;
  beds?: number;
  bathrooms: number;
  baths?: number;
  unittype: string;
  unittypename?: string;
  terms: "sale" | "rent" | "preselling";
  image?: string;
  coverphoto?: string;
  developer?: string;
  companyname?: string;
  name?: string;
  area?: string;
  floorarea?: number;
  featured?: boolean;
  description?: string;
  developermobile?: string;
  developeremail?: string;
  developerlogo?: string;
  timestamp?: string;
  dateadded?: string;
  updated_at?: string;
  sellingprice?: number;
  sellingpricecsign?: string;
  rentpricepermonth?: number;
  rentpricecsignpermonth?: string;
  /** Additional properties from API response */
  [key: string]: any;
}

/**
 * URL search parameters for filtering and pagination
 * Represents query string parameters in the search URL
 */
export interface SearchParams {
  terms?: "sale" | "rent" | "preselling";
  unittype?: string;
  address?: string;
  maxprice?: string;
  beds?: string;
  baths?: string;
  projectid?: string;
  page?: string;
  sort?: string;
  /** Additional URL parameters */
  [key: string]: string | string[] | undefined;
}

/**
 * Props for search results components
 * Defines the contract for displaying search results
 */
export interface SearchResultsProps {
  initialUnits: DeveloperUnit[];
  searchParams: SearchParams;
  totalCount?: number;
  hasMore?: boolean;
}

/**
 * Parameters sent to the API for searching units
 * Mapped from SearchParams with proper validation and formatting
 */
export interface ApiSearchParams {
  app: string;
  terms?: string;
  unittype?: string;
  address?: string;
  maxprice?: number;
  beds?: number;
  baths?: number;
  projectid?: number;
  offset?: number;
}

/**
 * Metadata generator parameters for SEO optimization
 * Used to generate page titles, descriptions, and meta tags
 */
export interface MetadataGeneratorParams {
  terms?: string | string[];
  unittype?: string | string[];
  address?: string | string[];
  beds?: string | string[];
  baths?: string | string[];
  maxprice?: string | string[];
}

/**
 * Location link configuration for sidebar navigation
 * Used to display popular location shortcuts
 */
export interface LocationLink {
  title: string;
  href: string;
  aria?: string;
}

// Additional utility types for better type safety

/**
 * Contract terms enum for type safety
 */
export type ContractTerms = "sale" | "rent" | "preselling";

/**
 * Filter form state for search filter component
 */
export interface FilterFormState {
  terms: ContractTerms;
  unittype: string;
  address: string;
  maxprice: string;
  beds: string;
  baths: string;
}

/**
 * API response wrapper for consistent error handling
 */
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
  total?: number;
  hasMore?: boolean;
}

/**
 * Loading states for better UX
 */
export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

/**
 * Search result metadata for analytics and display
 */
export interface SearchResultMetadata {
  query: string;
  filters: FilterFormState;
  resultCount: number;
  searchTime: number;
  timestamp: string;
}

/**
 * Image configuration for unit cards
 */
export interface ImageConfig {
  src: string;
  alt: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}

/**
 * Price display configuration for consistent formatting
 */
export interface PriceDisplay {
  pricepart1: string;
  pricepart2?: string;
  currency?: string;
  isFormatted: boolean;
}
