import { getListingDetails } from "./get-listing-detail";
import { prodReferenceCache } from "./production-reference-cache";
import type { ListingDetails } from "@/types/property";

/**
 * Production-optimized reference-based URL generator
 * Features: hybrid navigation, caching, error recovery, performance monitoring
 */

export interface ProductionReferenceResult {
  reference: string;
  url: string;
  isValid: boolean;
  source: 'cache' | 'api' | 'fallback';
  responseTime?: number;
  error?: string;
  propertyData?: ListingDetails;
}

/**
 * Production-grade reference search with hybrid approach
 * 1. Instant fallback navigation for immediate UX
 * 2. Background API enhancement for accuracy
 * 3. Caching and deduplication for performance
 */
export async function processProductionReferenceSearch(
  reference: string,
  options: {
    useHybrid?: boolean;
    maxRetries?: number;
    timeout?: number;
  } = {}
): Promise<ProductionReferenceResult> {
  const {
    useHybrid = true,
    maxRetries = 2,
    timeout = 5000
  } = options;

  const startTime = performance.now();
  const cleanRef = reference.trim().replace(/[^a-zA-Z0-9]/g, "");
  
  if (!cleanRef) {
    return {
      reference: "",
      url: "",
      isValid: false,
      source: 'fallback',
      error: "Please enter a reference number",
      responseTime: performance.now() - startTime
    };
  }

  if (!isValidReferenceFormat(cleanRef)) {
    return {
      reference: cleanRef,
      url: "",
      isValid: false,
      source: 'fallback',
      error: "Invalid reference format. Use only letters and numbers.",
      responseTime: performance.now() - startTime
    };
  }

  try {
    // Use production cache with deduplication
    const url = await prodReferenceCache.get(cleanRef, async () => {
      return await generateUrlWithRetry(cleanRef, maxRetries, timeout);
    });

    const responseTime = performance.now() - startTime;
    const formattedRef = formatReferenceForDisplay(cleanRef);
    
    // Get the listing details to pass along with the URL
    let listingDetails;
    try {
      listingDetails = await getListingDetails(cleanRef);
      console.log(`🔄 Got property data for reference: ${cleanRef}`);
    } catch (dataError) {
      console.warn(`Failed to get property data for ${cleanRef}:`, dataError);
    }
    
    return {
      reference: formattedRef,
      url,
      isValid: true,
      source: 'api',
      responseTime,
      propertyData: listingDetails // Add the property data to pass along
    };

  } catch (error) {
    // Fallback to generic URL on any error
    const responseTime = performance.now() - startTime;
    const fallbackUrl = generateFallbackUrl(cleanRef);
    const errorMessage = error instanceof Error ? error.message : "Search failed";
    
    const isPropertyNotFound = errorMessage.includes("not available") || 
                              errorMessage.includes("not found") ||
                              errorMessage.includes("fail");

    return {
      reference: reference.trim(),
      url: useHybrid ? fallbackUrl : "",
      isValid: useHybrid,
      source: 'fallback',
      error: isPropertyNotFound 
        ? "Property not found. Please check the reference number." 
        : "Search failed. Please try again.",
      responseTime
    };
  }
}

/**
 * Generate URL with retry logic and timeout
 */
async function generateUrlWithRetry(
  reference: string, 
  maxRetries: number, 
  timeout: number
): Promise<string> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Add timeout to API call
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeout);
      });

      const apiPromise = getListingDetails(reference);
      const propertyDetails = await Promise.race([apiPromise, timeoutPromise]);

      // Process the API response to get URL
      return await processApiResponse(propertyDetails);

    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Don't retry on certain errors
      if (lastError.message.includes('not available') || 
          lastError.message.includes('not found')) {
        throw lastError;
      }

      // Exponential backoff for retries
      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
        console.warn(`[Reference Search] Retry ${attempt}/${maxRetries} after ${delay}ms for ref: ${reference}`);
      }
    }
  }

  throw lastError!;
}

/**
 * Process API response and extract URL
 */
async function processApiResponse(propertyDetails: ListingDetails): Promise<string> {
  // First try: Use detailreq if available (most accurate)
  if (propertyDetails.detailreq) {
    const cleanPath = propertyDetails.detailreq.replace(/^https?:\/\/[^/]+\//, "");
    
    // Ensure proper /listings/ prefix
    if (cleanPath.startsWith('listings/')) {
      return `/${cleanPath}`;
    } else if (cleanPath.startsWith('/listings/')) {
      return cleanPath;
    } else {
      const pathWithoutLeadingSlash = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;
      return `/listings/${pathWithoutLeadingSlash}`;
    }
  }
  
  // Second try: Construct URL from property details
  return constructUrlFromPropertyData(propertyDetails);
}

/**
 * Construct URL from property details when detailreq is unavailable
 */
function constructUrlFromPropertyData(property: ListingDetails): string {
  const {
    type = "property",
    contract = "rent",
    location = "Ghana", 
    locationstring,
    listingid
  } = property;
  
  const locationName = locationstring || location;
  
  const typeSlug = type.toLowerCase().replace(/\s+/g, "-");
  const contractSlug = contract.toLowerCase();
  const locationSlug = locationName
    .split(" ")
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase();
  
  return `/listings/${typeSlug}-for-${contractSlug}-at-${locationSlug}-${listingid}`;
}

/**
 * Generate fallback URL for instant navigation
 */
export function generateFallbackUrl(reference: string): string {
  const cleanRef = reference.trim().replace(/[^a-zA-Z0-9]/g, "");
  return `/listings/property-ref-${cleanRef}`;
}

/**
 * Enhanced reference validation
 */
function isValidReferenceFormat(reference: string): boolean {
  const cleanRef = reference.trim();
  
  return (
    cleanRef.length > 0 &&
    cleanRef.length <= 20 &&
    /^[a-zA-Z0-9]+$/.test(cleanRef) &&
    !/^0+$/.test(cleanRef) // Not all zeros
  );
}

/**
 * Format reference for display
 */
export function formatReferenceForDisplay(reference: string): string {
  return reference.trim().toUpperCase().replace(/[^a-zA-Z0-9]/g, "");
}

/**
 * Hybrid navigation strategy
 * Navigate immediately with fallback, enhance in background
 */
export async function hybridReferenceNavigation(
  reference: string,
  onNavigate: (url: string, source: 'fallback' | 'enhanced') => void,
  onError?: (error: string) => void
): Promise<void> {
  const cleanRef = reference.trim().replace(/[^a-zA-Z0-9]/g, "");
  
  if (!cleanRef || !isValidReferenceFormat(cleanRef)) {
    onError?.("Invalid reference format");
    return;
  }

  // 1. Immediate navigation with fallback URL
  const fallbackUrl = generateFallbackUrl(cleanRef);
  onNavigate(fallbackUrl, 'fallback');

  try {
    // 2. Background enhancement - get accurate URL
    const enhancedUrl = await prodReferenceCache.get(cleanRef, async () => {
      return await generateUrlWithRetry(cleanRef, 2, 3000);
    });

    // 3. Navigate to enhanced URL if different and more accurate
    if (enhancedUrl !== fallbackUrl && enhancedUrl.includes(cleanRef)) {
      // Use replace to avoid back button issues
      onNavigate(enhancedUrl, 'enhanced');
    }

  } catch (error) {
    // Silent fail for background enhancement
    console.debug(`[Hybrid Navigation] Background enhancement failed for ${cleanRef}:`, error);
  }
}

/**
 * Get cache performance metrics
 */
export function getReferenceSearchMetrics() {
  return prodReferenceCache.getMetrics();
}