/**
 * Central export file for units search module
 * Provides clean imports and better organization
 */

// Main components
export { UnitsSearchWrapper } from "./units-search-wrapper";
export { UnitsSearchResults } from "./units-search-results";
export { UnitsSearchFilter } from "./units-search-filter";
export { UnitsResultCard } from "./units-result-card";

// UI components
export { UnitsSearchSkeleton } from "./units-search-skeleton";
export { UnitsPageSkeleton } from "./units-page-skeleton";

// Utilities and helpers
export {
  generateSearchMetadata,
  generatePageTitle,
  generateSubtitle,
} from "./metadata-utils";
export {
  fetchUnitsSearchResults,
  fetchMoreUnits,
  mapSearchParamsToApi,
} from "./api-utils";

// New utility functions for maintainability
export {
  safeNumber,
  safeBedBath,
  generateUnitDetailUrl,
  constructUnitTitle,
  generateImageAltText,
  getDeveloperImageUrl,
  getUnitImageUrl,
  validateSearchParams,
  debounce,
  formatCurrency,
  getDeveloperInitials,
  shouldPrioritizeImage,
  generateUnitKey,
} from "./utils";

// Constants and configuration
export {
  API_CONFIG,
  SEARCH_CONFIG,
  FILTER_OPTIONS,
  UI_CONFIG,
  IMAGE_CONFIG,
  URL_CONFIG,
  ERROR_MESSAGES,
  VALIDATION_RULES,
  ANALYTICS_CONFIG,
} from "./constants";

// Sidebar components
export { SidebarLinks, DEFAULT_LOCATION_LINKS } from "./sidebar-links";
export { StructuredData } from "./structured-data";

// Types - Core interfaces
export type {
  DeveloperUnit,
  SearchParams,
  SearchResultsProps,
  ApiSearchParams,
  MetadataGeneratorParams,
  LocationLink,
  ContractTerms,
} from "./types";

// Types - Enhanced interfaces for better development experience
export type {
  FilterFormState,
  ApiResponse,
  LoadingState,
  SearchResultMetadata,
  ImageConfig,
  PriceDisplay,
} from "./types";

// Type helpers from constants
export type {
  UnitTypes,
  BedroomOptions,
  BathroomOptions,
} from "./constants";
