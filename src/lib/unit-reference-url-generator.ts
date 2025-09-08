import type { UnitDetails } from "./get-unit-details";
import { getUnitDetails } from "./get-unit-details";

/**
 * Unit Reference-based URL generator for developer units
 * Uses API-first approach to get accurate unit URLs
 * Mirrors the property reference system for consistency
 */

/**
 * Generate a unit URL from a reference number using API-first approach
 * Fetches unit details first to construct accurate URL
 *
 * @param unitReference - Unit reference number (e.g., "12345", "UNIT12345")
 * @returns Promise<URL path> - Accurate URL path for the unit
 */
export async function generateUnitUrlFromReference(
  unitReference: string
): Promise<string> {
  // Clean the reference - remove any non-alphanumeric characters and prefixes
  const cleanRef = cleanUnitReference(unitReference);

  if (!cleanRef) {
    throw new Error("Invalid unit reference number");
  }

  // Use production strategy: Generate generic but valid slug immediately
  // The unit API will validate and return correct data if unit exists
  return generateGenericUnitSlug(cleanRef);
}

/**
 * Generate production-ready generic unit slug
 * Creates valid slug using sensible defaults that the unit API can process
 * Pattern: {bedrooms}-bedroom-{type}-for-{contract}-in-{location}-unit-{reference}
 *
 * @param unitReference - Clean unit reference number
 * @returns Valid unit slug for API and routing
 */
export function generateGenericUnitSlug(unitReference: string): string {
  // Use sensible defaults for unknown unit details
  const defaults = {
    bedrooms: "multi", // Generic bedroom count
    type: "property", // Generic property type
    contract: "rent-or-sale", // Cover both contracts
    location: "accra-ghana", // Default location
  };

  // Construct slug that ends with -unit-{reference}
  return `/developer-unit/${defaults.bedrooms}-bedroom-${defaults.type}-for-${defaults.contract}-in-${defaults.location}-unit-${unitReference}`;
}

/**
 * Generate fallback URL for immediate navigation (original approach)
 * Used when we want instant navigation without waiting for API
 *
 * @param unitReference - Unit reference number
 * @returns URL path that works with the unit details page
 */
export function generateFallbackUnitUrl(unitReference: string): string {
  // Clean the reference
  const cleanRef = cleanUnitReference(unitReference);

  if (!cleanRef) {
    throw new Error("Invalid unit reference number");
  }

  // Use the new generic slug generation
  return generateGenericUnitSlug(cleanRef);
}

/**
 * Construct URL from unit details when we have complete unit data
 * Creates SEO-friendly URLs based on unit data
 * Mirrors the format: {bedroomcount}-bedroom-{type}-for-{contract}-in-{city}-unit-{unitid}
 *
 * @param unitDetails - Unit details from API
 * @returns Constructed URL path
 */
export function constructUnitUrlFromData(unitDetails: UnitDetails): string {
  const {
    unit: {
      beds = 1,
      unittypename = "unit",
      terms = "rent",
      city = "ghana",
      unitid,
    },
  } = unitDetails;

  // Create URL-friendly slugs
  const bedroomCount = beds || 1;
  const typeSlug = unittypename.toLowerCase().replace(/\s+/g, "-");
  const contractSlug = terms.toLowerCase();
  const citySlug = city
    .split(" ")
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase();

  // Construct URL in expected format
  return `/developer-unit/${bedroomCount}-bedroom-${typeSlug}-for-${contractSlug}-in-${citySlug}-unit-${unitid}`;
}

/**
 * Generate a more descriptive unit URL from reference
 * Alternative format that's more user-friendly
 *
 * @param unitReference - Unit reference number
 * @param beds - Optional bedroom count for better URL
 * @param type - Optional unit type for better URL
 * @param contract - Optional contract type for better URL
 * @returns More descriptive URL path
 */
export function generateDescriptiveUnitUrl(
  unitReference: string,
  beds?: number,
  type?: string,
  contract?: string
): string {
  const cleanRef = cleanUnitReference(unitReference);

  if (!cleanRef) {
    throw new Error("Invalid unit reference number");
  }

  // Build URL components
  const bedroomCount = beds || 1;
  const typeSlug = type ? type.toLowerCase().replace(/\s+/g, "-") : "unit";
  const contractSlug = contract ? contract.toLowerCase() : "rent-or-sale";

  return `/developer-unit/${bedroomCount}-bedroom-${typeSlug}-for-${contractSlug}-ref-${cleanRef}`;
}

/**
 * Clean and normalize unit reference input
 * Removes common prefixes and normalizes the reference format
 *
 * @param reference - Raw reference input
 * @returns Cleaned reference number
 */
export function cleanUnitReference(reference: string): string {
  if (!reference || typeof reference !== "string") {
    return "";
  }

  let cleaned = reference.trim().toUpperCase();

  // Remove common prefixes
  cleaned = cleaned.replace(/^UNIT\s*/, ""); // Remove "UNIT " prefix
  cleaned = cleaned.replace(/^U\s*/, ""); // Remove "U " prefix
  cleaned = cleaned.replace(/^REF\s*/, ""); // Remove "REF " prefix

  // Keep only alphanumeric characters
  cleaned = cleaned.replace(/[^A-Z0-9]/g, "");

  return cleaned;
}

/**
 * Validate if a unit reference appears to be valid
 * Basic validation to catch obvious errors before navigation
 *
 * @param reference - Unit reference to validate
 * @returns true if reference appears valid
 */
export function isValidUnitReference(reference: string): boolean {
  const cleanRef = cleanUnitReference(reference);

  // Basic validation rules for units
  return (
    cleanRef.length > 0 &&
    cleanRef.length <= 20 && // Reasonable max length
    /^[A-Z0-9]+$/.test(cleanRef) && // Only alphanumeric characters
    (/^\d+$/.test(cleanRef) || // Pure numeric
      /^[A-Z]\d+$/.test(cleanRef) || // Letter followed by numbers
      /^\d+[A-Z]$/.test(cleanRef) || // Numbers followed by letter
      /^[A-Z]+\d+$/.test(cleanRef)) // Letters followed by numbers
  );
}

/**
 * Format unit reference for display
 * Standardizes the display format of unit reference numbers
 *
 * @param reference - Raw reference input
 * @returns Formatted reference for display
 */
export function formatUnitReferenceForDisplay(reference: string): string {
  const cleaned = cleanUnitReference(reference);

  // Add UNIT prefix for display if it's purely numeric
  if (/^\d+$/.test(cleaned)) {
    return `UNIT${cleaned}`;
  }

  return cleaned;
}

/**
 * Unit reference search result interface
 * Mirrors the property reference search result for consistency
 */
export interface UnitReferenceSearchResult {
  reference: string;
  url: string;
  isValid: boolean;
  error?: string;
  unitData?: UnitDetails;
  source?: "api" | "fallback";
  responseTime?: number;
}

/**
 * Process unit reference search input and generate result using API-first approach
 * Combines validation, API call, and URL generation
 * Mirrors processReferenceSearch for consistency
 *
 * @param reference - User input reference
 * @returns Promise<Search result with URL and validation info>
 */
export async function processUnitReferenceSearch(
  reference: string
): Promise<UnitReferenceSearchResult> {
  const startTime = performance.now();

  try {
    const cleanRef = cleanUnitReference(reference);

    if (!cleanRef) {
      return {
        reference: "",
        url: "",
        isValid: false,
        error: "Please enter a unit reference number",
        responseTime: performance.now() - startTime,
      };
    }

    if (!isValidUnitReference(cleanRef)) {
      return {
        reference: cleanRef,
        url: "",
        isValid: false,
        error: "Invalid unit reference format. Use letters and numbers only.",
        responseTime: performance.now() - startTime,
      };
    }

    try {
      // Phase 1: Try to get accurate URL by fetching unit details
      const genericSlug = generateGenericUnitSlug(cleanRef).replace(
        "/developer-unit/",
        ""
      );
      const unitDetails = await getUnitDetails(genericSlug);

      // Phase 2: Construct proper URL from actual unit data
      const accurateUrl = constructUnitUrlFromData(unitDetails);
      const formattedRef = formatUnitReferenceForDisplay(cleanRef);

      return {
        reference: formattedRef,
        url: accurateUrl, // Use clean URL, data will be passed separately
        isValid: true,
        source: "api", // Got accurate data from API
        responseTime: performance.now() - startTime,
        unitData: unitDetails, // This is the key - unit data for URL passing
      };
    } catch (apiError) {
      // If API fails, fall back to generic URL (still works for navigation)
      const url = generateGenericUnitSlug(cleanRef);
      const formattedRef = formatUnitReferenceForDisplay(cleanRef);

      const errorMessage =
        apiError instanceof Error ? apiError.message : "API call failed";
      console.warn(`Unit API failed for ${cleanRef}:`, apiError);

      // Check if it's a "not found" vs API error
      const isUnitNotFound =
        errorMessage.includes("not available") ||
        errorMessage.includes("not found") ||
        errorMessage.includes("fail");

      if (isUnitNotFound) {
        return {
          reference: formattedRef,
          url: "",
          isValid: false,
          source: "api",
          responseTime: performance.now() - startTime,
          error:
            "Unit not found. Please check the reference number and try again.",
        };
      }

      // For API errors (timeout, network, etc.), provide fallback with warning
      return {
        reference: formattedRef,
        url,
        isValid: true,
        source: "fallback",
        responseTime: performance.now() - startTime,
        error:
          "Network issue - using approximate URL. Full details will load on page.",
      };
    }
  } catch (error) {
    return {
      reference: reference.trim(),
      url: "",
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid unit reference",
      responseTime: performance.now() - startTime,
    };
  }
}

/**
 * Process unit reference search with fallback (synchronous version)
 * Uses fallback URL generation without API call
 *
 * @param reference - User input reference
 * @returns Search result with fallback URL
 */
export function processUnitReferenceSearchFallback(
  reference: string
): UnitReferenceSearchResult {
  const startTime = performance.now();

  try {
    const cleanRef = reference.trim();

    if (!cleanRef) {
      return {
        reference: "",
        url: "",
        isValid: false,
        error: "Please enter a unit reference number",
        responseTime: performance.now() - startTime,
      };
    }

    if (!isValidUnitReference(cleanRef)) {
      return {
        reference: cleanRef,
        url: "",
        isValid: false,
        error: "Invalid unit reference format. Use letters and numbers only.",
        responseTime: performance.now() - startTime,
      };
    }

    const url = generateFallbackUnitUrl(cleanRef);
    const formattedRef = formatUnitReferenceForDisplay(cleanRef);

    return {
      reference: formattedRef,
      url,
      isValid: true,
      source: "fallback",
      responseTime: performance.now() - startTime,
    };
  } catch (error) {
    return {
      reference: reference.trim(),
      url: "",
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid unit reference",
      responseTime: performance.now() - startTime,
    };
  }
}

/**
 * Detect if a reference is likely for a unit vs property
 * Helper function for the unified search system
 *
 * @param reference - Raw reference input
 * @returns Confidence score (0-1) that this is a unit reference
 */
export function detectUnitReferenceConfidence(reference: string): number {
  const upper = reference.toUpperCase().trim();

  // High confidence indicators for units
  if (upper.includes("UNIT") || upper.startsWith("U")) return 0.9;
  if (/^[A-Z]\d+$/.exec(upper)) return 0.8; // Pattern like "A123"
  if (/^\d+[A-Z]$/.exec(upper)) return 0.7; // Pattern like "123A"

  // Medium confidence
  if (/^[A-Z]+\d+$/.exec(upper)) return 0.6; // Pattern like "ABC123"
  if (upper.length > 6) return 0.4; // Longer references more likely units

  // Low confidence - could be either
  if (/^\d+$/.exec(upper)) return 0.3; // Pure numeric

  return 0.2; // Default low confidence
}
