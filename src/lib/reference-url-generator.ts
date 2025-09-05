import { getListingDetails } from "./get-listing-detail";
import type { ListingDetails } from "@/types/property";

/**
 * Reference-based URL generator for property listings
 * Uses API-first approach to get accurate property URLs
 */

/**
 * Generate a property URL from a reference number using API-first approach
 * Fetches property details first to construct accurate URL
 * 
 * @param reference - Property reference number (e.g., "086983")
 * @returns Promise<URL path> - Accurate URL path for the property
 */
export async function generatePropertyUrlFromReference(reference: string): Promise<string> {
  // Clean the reference - remove any non-alphanumeric characters
  const cleanRef = reference.trim().replace(/[^a-zA-Z0-9]/g, "");
  
  if (!cleanRef) {
    throw new Error("Invalid reference number");
  }

  try {
    // Fetch property details using the existing API
    const propertyDetails = await getListingDetails(cleanRef);
    
    // First try: Use detailreq if available (most accurate)
    if (propertyDetails.detailreq) {
      const cleanPath = propertyDetails.detailreq.replace(/^https?:\/\/[^/]+\//, "");
      
      // Ensure the path starts with /listings/
      if (cleanPath.startsWith('listings/')) {
        return `/${cleanPath}`;
      } else if (cleanPath.startsWith('/listings/')) {
        return cleanPath;
      } else {
        // If detailreq doesn't contain listings path, prepend it
        // Remove leading slash to avoid double slashes
        const pathWithoutLeadingSlash = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;
        return `/listings/${pathWithoutLeadingSlash}`;
      }
    }
    
    // Second try: Construct URL from property details
    return constructUrlFromPropertyData(propertyDetails);
    
  } catch (error) {
    // Fallback: Use generic URL that still works
    console.warn(`Failed to fetch property details for ${cleanRef}:`, error);
    return `/listings/property-ref-${cleanRef}`;
  }
}

/**
 * Generate fallback URL for immediate navigation (original approach)
 * Used when we want instant navigation without waiting for API
 * 
 * @param reference - Property reference number
 * @returns URL path that works with the listings page
 */
export function generateFallbackPropertyUrl(reference: string): string {
  // Clean the reference - remove any non-alphanumeric characters
  const cleanRef = reference.trim().replace(/[^a-zA-Z0-9]/g, "");
  
  if (!cleanRef) {
    throw new Error("Invalid reference number");
  }
  
  // The listings page expects URLs ending with -{listingid} format
  // Since we're searching by reference, we'll treat the reference AS the listing ID
  // This assumes the reference corresponds to the actual listing ID
  return `/listings/property-for-rent-or-sale-${cleanRef}`;
}

/**
 * Construct URL from property details when detailreq is unavailable
 * Creates SEO-friendly URLs based on property data
 * 
 * @param property - Property details from API
 * @returns Constructed URL path
 */
function constructUrlFromPropertyData(property: ListingDetails): string {
  const {
    type = "property",
    contract = "rent",
    location = "Ghana", 
    locationstring,
    listingid
  } = property;
  
  // Use locationstring if available, fallback to location
  const locationName = locationstring || location;
  
  // Create URL-friendly slugs
  const typeSlug = type.toLowerCase().replace(/\s+/g, "-");
  const contractSlug = contract.toLowerCase();
  const locationSlug = locationName
    .split(" ")
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase();
  
  // Construct URL in expected format: /listings/house-for-rent-at-accra-123456
  return `/listings/${typeSlug}-for-${contractSlug}-at-${locationSlug}-${listingid}`;
}

/**
 * Generate a more descriptive property URL from reference
 * Alternative format that's more user-friendly
 * 
 * @param reference - Property reference number
 * @param type - Optional property type for better URL
 * @param contract - Optional contract type for better URL
 * @returns More descriptive URL path
 */
export function generateDescriptivePropertyUrl(
  reference: string,
  type?: string,
  contract?: string
): string {
  const cleanRef = reference.trim().replace(/[^a-zA-Z0-9]/g, "");
  
  if (!cleanRef) {
    throw new Error("Invalid reference number");
  }
  
  // Build URL components
  const typeSlug = type ? type.toLowerCase().replace(/\s+/g, "-") : "property";
  const contractSlug = contract ? contract.toLowerCase() : "rent-or-sale";
  
  return `/listings/${typeSlug}-for-${contractSlug}-ref-${cleanRef}`;
}

/**
 * Validate if a reference number appears to be valid
 * Basic validation to catch obvious errors before navigation
 * 
 * @param reference - Reference number to validate
 * @returns true if reference appears valid
 */
export function isValidReference(reference: string): boolean {
  const cleanRef = reference.trim();
  
  // Basic validation rules
  return (
    cleanRef.length > 0 &&
    cleanRef.length <= 20 && // Reasonable max length
    /^[a-zA-Z0-9]+$/.test(cleanRef) // Only alphanumeric characters
  );
}

/**
 * Format reference number for display
 * Standardizes the display format of reference numbers
 * 
 * @param reference - Raw reference input
 * @returns Formatted reference for display
 */
export function formatReferenceForDisplay(reference: string): string {
  return reference.trim().toUpperCase().replace(/[^a-zA-Z0-9]/g, "");
}

/**
 * Reference search result interface
 */
export interface ReferenceSearchResult {
  reference: string;
  url: string;
  isValid: boolean;
  error?: string;
  propertyData?: ListingDetails;
}

/**
 * Process reference search input and generate result using API-first approach
 * Combines validation, API call, and URL generation
 * 
 * @param reference - User input reference
 * @returns Promise<Search result with URL and validation info>
 */
export async function processReferenceSearch(reference: string): Promise<ReferenceSearchResult> {
  try {
    const cleanRef = reference.trim();
    
    if (!cleanRef) {
      return {
        reference: "",
        url: "",
        isValid: false,
        error: "Please enter a reference number",
      };
    }
    
    if (!isValidReference(cleanRef)) {
      return {
        reference: cleanRef,
        url: "",
        isValid: false,
        error: "Invalid reference format. Use only letters and numbers.",
      };
    }
    
    // Use API-first approach to get accurate URL
    const url = await generatePropertyUrlFromReference(cleanRef);
    const formattedRef = formatReferenceForDisplay(cleanRef);
    
    return {
      reference: formattedRef,
      url,
      isValid: true,
    };
  } catch (error) {
    // Check if it's a "property not found" error vs other API errors
    const errorMessage = error instanceof Error ? error.message : "Search failed";
    const isPropertyNotFound = errorMessage.includes("not available") || 
                              errorMessage.includes("not found") ||
                              errorMessage.includes("fail");
    
    return {
      reference: reference.trim(),
      url: "",
      isValid: false,
      error: isPropertyNotFound 
        ? "Property not found. Please check the reference number." 
        : "Search failed. Please try again.",
    };
  }
}

/**
 * Process reference search with fallback (synchronous version)
 * Uses fallback URL generation without API call
 * 
 * @param reference - User input reference
 * @returns Search result with fallback URL
 */
export function processReferenceSearchFallback(reference: string): ReferenceSearchResult {
  try {
    const cleanRef = reference.trim();
    
    if (!cleanRef) {
      return {
        reference: "",
        url: "",
        isValid: false,
        error: "Please enter a reference number",
      };
    }
    
    if (!isValidReference(cleanRef)) {
      return {
        reference: cleanRef,
        url: "",
        isValid: false,
        error: "Invalid reference format. Use only letters and numbers.",
      };
    }
    
    const url = generateFallbackPropertyUrl(cleanRef);
    const formattedRef = formatReferenceForDisplay(cleanRef);
    
    return {
      reference: formattedRef,
      url,
      isValid: true,
    };
  } catch (error) {
    return {
      reference: reference.trim(),
      url: "",
      isValid: false,
      error: error instanceof Error ? error.message : "Invalid reference",
    };
  }
}