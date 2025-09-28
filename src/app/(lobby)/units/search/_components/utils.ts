/**
 * Utility functions for units search module
 * Centralized location for reusable business logic
 */

import type { DeveloperUnit, SearchParams, ApiSearchParams } from "./types";
import {
  API_CONFIG,
  SEARCH_CONFIG,
  IMAGE_CONFIG,
  URL_CONFIG,
  VALIDATION_RULES
} from "./constants";

/**
 * Safely converts a string value to number or returns default
 * @param value - String value to convert
 * @param defaultValue - Default value if conversion fails
 * @returns Converted number or default value
 */
export function safeNumber(value: string | undefined, defaultValue = 0): number {
  if (!value || value.trim() === "" || value === "all") return defaultValue;
  const num = Number(value);
  return !isNaN(num) && num >= 0 ? num : defaultValue;
}

/**
 * Safely handles bedroom/bathroom values with validation
 * @param value - String value to process
 * @returns Validated string value
 */
export function safeBedBath(value: string | undefined): string {
  if (!value || value.trim() === "" || value === "0") return "0";
  const num = safeNumber(value);
  if (num > 0 && num <= VALIDATION_RULES.MAX_BEDROOMS) {
    return String(num);
  }
  return "0";
}

/**
 * Generates SEO-friendly URL for unit details
 * @param unit - Developer unit data
 * @returns Formatted URL string
 */
export function generateUnitDetailUrl(unit: DeveloperUnit): string {
  const bedrooms = unit.beds || unit.bedrooms || 0;
  const citySlug =
    unit.city?.split(" ").join("-").toLowerCase() ||
    unit.location?.split(" ").join("-").toLowerCase() ||
    "ghana";
  const typeSlug =
    unit.unittypename?.toLowerCase().split(" ").join("-") ||
    unit.unittype?.toLowerCase() ||
    "apartment";
  const contractSlug = unit.terms === "rent" ? "rent" : "sale";
  const unitId = unit.unitid || unit.id;

  return `/developer-unit/${bedrooms}-bedroom-${typeSlug}-for-${contractSlug}-in-${citySlug}-unit-${unitId}`;
}

/**
 * Constructs unit title following MeQasa pattern
 * @param unit - Developer unit data
 * @returns Formatted title string
 */
export function constructUnitTitle(unit: DeveloperUnit): string {
  const bedrooms = unit.beds || unit.bedrooms || 1;
  const bedroomText = bedrooms === 1 ? "1 Bedroom" : `${bedrooms} Bedroom`;
  const propertyType = unit.unittypename || unit.unittype || "Apartment";
  const transactionType = unit.terms === "rent" ? "For Rent" : "For Sale";
  const location = unit.city || unit.location || "Ghana";

  return `${bedroomText} ${propertyType} ${transactionType} in ${location}`;
}

/**
 * Generates optimized alt text for unit images
 * @param unit - Developer unit data
 * @returns Descriptive alt text
 */
export function generateImageAltText(unit: DeveloperUnit): string {
  const title = constructUnitTitle(unit);
  const displayContract = unit.terms === "rent" ? "For Rent" : "For Sale";
  return `${title} - ${displayContract}`.trim();
}

/**
 * Gets developer image URL with fallback
 * @param logoPath - Developer logo path
 * @returns Complete image URL
 */
export function getDeveloperImageUrl(logoPath?: string): string {
  if (!logoPath) return "";
  return `${IMAGE_CONFIG.DEVELOPER_LOGO_BASE_URL}${logoPath}`;
}

/**
 * Gets unit cover photo URL with fallback
 * @param photoPath - Unit photo path
 * @returns Complete image URL
 */
export function getUnitImageUrl(photoPath?: string): string {
  if (!photoPath) return IMAGE_CONFIG.FALLBACK_IMAGE_URL;
  return `${IMAGE_CONFIG.UNIT_PHOTO_BASE_URL}${photoPath}`;
}

/**
 * Maps search parameters to API parameters with validation
 * @param searchParams - Search parameters from URL
 * @returns Validated API parameters
 */
export function mapSearchParamsToApi(searchParams: SearchParams): ApiSearchParams {
  const apiParams: ApiSearchParams = {
    app: API_CONFIG.APP_ID,
  };

  // Contract terms
  if (searchParams.terms) {
    apiParams.terms = Array.isArray(searchParams.terms)
      ? searchParams.terms[0]
      : searchParams.terms;
  } else {
    apiParams.terms = SEARCH_CONFIG.DEFAULT_TERMS;
  }

  // Unit type
  if (searchParams.unittype && searchParams.unittype !== SEARCH_CONFIG.DEFAULT_UNIT_TYPE) {
    apiParams.unittype = Array.isArray(searchParams.unittype)
      ? searchParams.unittype[0]
      : searchParams.unittype;
  }

  // Location/address
  if (searchParams.address) {
    apiParams.address = Array.isArray(searchParams.address)
      ? searchParams.address[0]
      : searchParams.address;
  }

  // Price range
  if (searchParams.maxprice && searchParams.maxprice !== "all") {
    const maxPrice = safeNumber(
      Array.isArray(searchParams.maxprice)
        ? searchParams.maxprice[0]
        : searchParams.maxprice
    );
    if (maxPrice > 0 && maxPrice <= VALIDATION_RULES.MAX_PRICE) {
      apiParams.maxprice = maxPrice;
    }
  }

  // Bedrooms
  if (searchParams.beds && searchParams.beds !== SEARCH_CONFIG.DEFAULT_BED_BATH_COUNT) {
    const beds = safeNumber(
      Array.isArray(searchParams.beds)
        ? searchParams.beds[0]
        : searchParams.beds
    );
    if (beds > 0 && beds <= VALIDATION_RULES.MAX_BEDROOMS) {
      apiParams.beds = beds;
    }
  }

  // Bathrooms
  if (searchParams.baths && searchParams.baths !== SEARCH_CONFIG.DEFAULT_BED_BATH_COUNT) {
    const baths = safeNumber(
      Array.isArray(searchParams.baths)
        ? searchParams.baths[0]
        : searchParams.baths
    );
    if (baths > 0 && baths <= VALIDATION_RULES.MAX_BATHROOMS) {
      apiParams.baths = baths;
    }
  }

  return apiParams;
}

/**
 * Validates search parameters
 * @param params - Search parameters to validate
 * @returns Validation result with errors if any
 */
export function validateSearchParams(params: SearchParams): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate price
  if (params.maxprice) {
    const price = safeNumber(
      Array.isArray(params.maxprice) ? params.maxprice[0] : params.maxprice
    );
    if (price > VALIDATION_RULES.MAX_PRICE) {
      errors.push(`Maximum price cannot exceed ${VALIDATION_RULES.MAX_PRICE.toLocaleString()}`);
    }
  }

  // Validate bedrooms
  if (params.beds) {
    const beds = safeNumber(
      Array.isArray(params.beds) ? params.beds[0] : params.beds
    );
    if (beds > VALIDATION_RULES.MAX_BEDROOMS) {
      errors.push(`Maximum bedrooms cannot exceed ${VALIDATION_RULES.MAX_BEDROOMS}`);
    }
  }

  // Validate bathrooms
  if (params.baths) {
    const baths = safeNumber(
      Array.isArray(params.baths) ? params.baths[0] : params.baths
    );
    if (baths > VALIDATION_RULES.MAX_BATHROOMS) {
      errors.push(`Maximum bathrooms cannot exceed ${VALIDATION_RULES.MAX_BATHROOMS}`);
    }
  }

  // Validate search query length
  if (params.address) {
    const address = Array.isArray(params.address) ? params.address[0] : params.address;
    if (address && address.length > VALIDATION_RULES.MAX_SEARCH_QUERY_LENGTH) {
      errors.push(`Search query cannot exceed ${VALIDATION_RULES.MAX_SEARCH_QUERY_LENGTH} characters`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Debounces a function call
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Formats currency values consistently
 * @param amount - Amount to format
 * @param currency - Currency symbol
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency = "¢"): string {
  if (currency === "¢") {
    return `&#8373;${amount.toLocaleString()}`;
  }
  return `${currency}${amount.toLocaleString()}`;
}

/**
 * Extracts developer initials for avatar fallback
 * @param developerName - Developer name
 * @returns Two-character initials
 */
export function getDeveloperInitials(developerName?: string): string {
  if (!developerName) return "DV";
  return developerName.slice(0, 2).toUpperCase();
}

/**
 * Checks if a unit should have priority loading
 * @param index - Unit index in the list
 * @returns Whether image should be prioritized
 */
export function shouldPrioritizeImage(index: number): boolean {
  return index < SEARCH_CONFIG.PRIORITY_IMAGES_COUNT;
}

/**
 * Generates unique key for unit in lists
 * @param unit - Developer unit
 * @param index - Index in array
 * @returns Unique key string
 */
export function generateUnitKey(unit: DeveloperUnit, index: number): string {
  return `${unit.unitid || unit.id}-${index}`;
}