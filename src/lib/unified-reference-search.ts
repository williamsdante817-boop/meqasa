import { 
  processReferenceSearch, 
  type ReferenceSearchResult 
} from "./reference-url-generator";
import { 
  processUnitReferenceSearch, 
  type UnitReferenceSearchResult 
} from "./unit-reference-url-generator";
import { 
  enhancedReferenceDetection, 
  determineSearchStrategy,
  validateReferenceFormat,
  smartReferenceClean,
  formatReferenceForDisplay,
  type ReferenceType,
  type SearchStrategy
} from "./smart-reference-detector";

/**
 * Unified Reference Search System
 * Intelligently searches both properties and units based on reference input
 * Provides seamless user experience with smart fallbacks
 */

export interface UnifiedSearchResult {
  // Primary result (the best match found)
  reference: string;
  url: string;
  isValid: boolean;
  error?: string;
  
  // Search metadata
  searchType: 'property' | 'unit' | 'both';
  strategy: SearchStrategy['strategy'];
  source: 'property' | 'unit' | 'fallback';
  responseTime: number;
  
  // Detailed results (for debugging/analytics)
  propertyResult?: ReferenceSearchResult;
  unitResult?: UnitReferenceSearchResult;
  detection?: ReturnType<typeof enhancedReferenceDetection>;
  
  // User feedback
  suggestion?: string;
  alternativeResults?: Array<{
    type: 'property' | 'unit';
    url: string;
    reference: string;
  }>;
}

/**
 * Main unified search function
 * Intelligently searches both properties and units based on reference input
 * 
 * @param reference - User input reference
 * @param options - Search configuration options
 * @returns Promise<Unified search result>
 */
export async function processUnifiedReferenceSearch(
  reference: string,
  options: {
    timeout?: number;
    preferredType?: ReferenceType;
    includeAlternatives?: boolean;
  } = {}
): Promise<UnifiedSearchResult> {
  const startTime = performance.now();
  const { timeout = 10000, preferredType, includeAlternatives = false } = options;
  
  try {
    // 1. Validate input format
    const validation = validateReferenceFormat(reference);
    if (!validation.isValid) {
      return {
        reference: reference.trim(),
        url: '',
        isValid: false,
        error: validation.error,
        suggestion: validation.suggestion,
        searchType: 'both',
        strategy: 'parallel',
        source: 'fallback',
        responseTime: performance.now() - startTime
      };
    }
    
    // 2. Detect reference type (unless user specified preference)
    const detection = preferredType 
      ? { type: preferredType, confidence: 1.0, reference: reference.trim(), reasoning: 'User specified' }
      : enhancedReferenceDetection(reference);
    
    // 3. Determine search strategy
    const strategy = determineSearchStrategy(detection);
    
    // 4. Execute search based on strategy
    let result: UnifiedSearchResult;
    
    switch (strategy.strategy) {
      case 'primary-first':
        result = await searchPrimaryFirst(detection, strategy, startTime, timeout);
        break;
      case 'sequential':
        result = await searchSequential(detection, strategy, startTime, timeout);
        break;
      case 'parallel':
        result = await searchParallel(detection, startTime, timeout);
        break;
      default:
        result = await searchParallel(detection, startTime, timeout);
    }
    
    // 5. Add alternatives if requested and primary search succeeded
    if (includeAlternatives && result.isValid) {
      result.alternativeResults = await findAlternativeResults(
        reference, 
        result.source === 'property' ? 'unit' : 'property'
      );
    }
    
    // 6. Enhance result with detection metadata
    result.detection = detection;
    
    return result;
    
  } catch (error) {
    return {
      reference: reference.trim(),
      url: '',
      isValid: false,
      error: error instanceof Error ? error.message : 'Search failed unexpectedly',
      searchType: 'both',
      strategy: 'parallel',
      source: 'fallback',
      responseTime: performance.now() - startTime
    };
  }
}

/**
 * Search strategy: Try the most likely type first, then fallback if needed
 */
async function searchPrimaryFirst(
  detection: ReturnType<typeof enhancedReferenceDetection>,
  strategy: SearchStrategy,
  startTime: number,
  timeout: number
): Promise<UnifiedSearchResult> {
  // Handle unknown type by defaulting to property (safer fallback)
  const primaryType = (strategy.primaryType === 'unknown' || !strategy.primaryType) 
    ? 'property' 
    : strategy.primaryType;
  
  try {
    // Try primary type first
    const primaryResult = await Promise.race([
      searchByType(detection.reference, primaryType),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), timeout / 2)
      )
    ]);
    
    if (primaryResult.isValid) {
      return {
        reference: primaryResult.reference,
        url: primaryResult.url,
        isValid: true,
        searchType: primaryType,
        strategy: 'primary-first',
        source: primaryType,
        responseTime: performance.now() - startTime,
        [primaryType === 'property' ? 'propertyResult' : 'unitResult']: primaryResult
      };
    }
  } catch (error) {
    // Primary search failed, continue to fallback
  }
  
  // Primary failed, try the other type
  const fallbackType = primaryType === 'property' ? 'unit' : 'property';
  
  try {
    const fallbackResult = await Promise.race([
      searchByType(detection.reference, fallbackType),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), timeout / 2)
      )
    ]);
    
    if (fallbackResult.isValid) {
      return {
        reference: fallbackResult.reference,
        url: fallbackResult.url,
        isValid: true,
        searchType: fallbackType,
        strategy: 'primary-first',
        source: fallbackType,
        responseTime: performance.now() - startTime,
        [fallbackType === 'property' ? 'propertyResult' : 'unitResult']: fallbackResult
      };
    }
  } catch (error) {
    // Both searches failed
  }
  
  // Both failed
  return {
    reference: detection.reference,
    url: '',
    isValid: false,
    error: 'Reference not found in properties or units',
    searchType: 'both',
    strategy: 'primary-first',
    source: 'fallback',
    responseTime: performance.now() - startTime
  };
}

/**
 * Search strategy: Try primary type, then secondary type sequentially
 */
async function searchSequential(
  detection: ReturnType<typeof enhancedReferenceDetection>,
  strategy: SearchStrategy,
  startTime: number,
  timeout: number
): Promise<UnifiedSearchResult> {
  // Similar to primary-first but with different timeout allocation
  return searchPrimaryFirst(detection, strategy, startTime, timeout);
}

/**
 * Search strategy: Search both types simultaneously
 */
async function searchParallel(
  detection: ReturnType<typeof enhancedReferenceDetection>,
  startTime: number,
  timeout: number
): Promise<UnifiedSearchResult> {
  try {
    // Search both property and unit simultaneously
    const [propertyPromise, unitPromise] = [
      searchByType(detection.reference, 'property').catch(err => ({
        reference: detection.reference,
        url: '',
        isValid: false,
        error: err.message || 'Property search failed'
      } as ReferenceSearchResult)),
      
      searchByType(detection.reference, 'unit').catch(err => ({
        reference: detection.reference,
        url: '',
        isValid: false,
        error: err.message || 'Unit search failed'
      } as UnitReferenceSearchResult))
    ];
    
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Search timeout')), timeout)
    );
    
    const [propertyResult, unitResult] = await Promise.race([
      Promise.all([propertyPromise, unitPromise]),
      timeoutPromise
    ]);
    
    // Determine the best result
    const bestResult = selectBestResult(propertyResult, unitResult, detection);
    
    return {
      ...bestResult,
      searchType: 'both',
      strategy: 'parallel',
      responseTime: performance.now() - startTime,
      propertyResult: propertyResult as ReferenceSearchResult,
      unitResult: unitResult as UnitReferenceSearchResult
    };
    
  } catch (error) {
    return {
      reference: detection.reference,
      url: '',
      isValid: false,
      error: 'Search timeout or failure',
      searchType: 'both',
      strategy: 'parallel',
      source: 'fallback',
      responseTime: performance.now() - startTime
    };
  }
}

/**
 * Search by specific type (property or unit)
 */
async function searchByType(
  reference: string, 
  type: 'property' | 'unit'
): Promise<ReferenceSearchResult | UnitReferenceSearchResult> {
  const cleanedRef = smartReferenceClean(reference, type);
  
  if (type === 'property') {
    return processReferenceSearch(cleanedRef);
  } else {
    return processUnitReferenceSearch(cleanedRef);
  }
}

/**
 * Select the best result from property and unit searches
 */
function selectBestResult(
  propertyResult: ReferenceSearchResult,
  unitResult: UnitReferenceSearchResult,
  detection: ReturnType<typeof enhancedReferenceDetection>
): Omit<UnifiedSearchResult, 'searchType' | 'strategy' | 'responseTime' | 'propertyResult' | 'unitResult'> {
  // Both found - use detection confidence to choose
  if (propertyResult.isValid && unitResult.isValid) {
    const preferUnit = detection.type === 'unit' && detection.confidence > 0.7;
    
    if (preferUnit) {
      return {
        reference: unitResult.reference,
        url: unitResult.url,
        isValid: true,
        source: 'unit',
        suggestion: `Also found as property: ${propertyResult.reference}`
      };
    } else {
      return {
        reference: propertyResult.reference,
        url: propertyResult.url,
        isValid: true,
        source: 'property',
        suggestion: `Also found as unit: ${unitResult.reference}`
      };
    }
  }
  
  // Only property found
  if (propertyResult.isValid) {
    return {
      reference: propertyResult.reference,
      url: propertyResult.url,
      isValid: true,
      source: 'property'
    };
  }
  
  // Only unit found
  if (unitResult.isValid) {
    return {
      reference: unitResult.reference,
      url: unitResult.url,
      isValid: true,
      source: 'unit'
    };
  }
  
  // Neither found - return better error message
  const errorMessage = getBestErrorMessage(propertyResult, unitResult);
  
  return {
    reference: detection.reference,
    url: '',
    isValid: false,
    error: errorMessage,
    source: 'fallback'
  };
}

/**
 * Find alternative results in the other search type
 */
async function findAlternativeResults(
  reference: string,
  alternativeType: 'property' | 'unit'
): Promise<Array<{ type: 'property' | 'unit'; url: string; reference: string }>> {
  try {
    const result = await searchByType(reference, alternativeType);
    if (result.isValid) {
      return [{
        type: alternativeType,
        url: result.url,
        reference: result.reference
      }];
    }
  } catch (error) {
    // Ignore errors in alternative search
  }
  
  return [];
}

/**
 * Get the most helpful error message from failed searches
 */
function getBestErrorMessage(
  propertyResult: ReferenceSearchResult,
  unitResult: UnitReferenceSearchResult
): string {
  // Check for specific error types
  const propertyNotFound = propertyResult.error?.includes('not found');
  const unitNotFound = unitResult.error?.includes('not found');
  
  if (propertyNotFound && unitNotFound) {
    return 'Reference not found in properties or units. Please check the reference number.';
  }
  
  if (propertyResult.error?.includes('Invalid') || unitResult.error?.includes('Invalid')) {
    return 'Invalid reference format. Please check your reference number.';
  }
  
  // Return generic error
  return 'Reference not found. Please check the reference number and try again.';
}

/**
 * Quick search function for immediate feedback (synchronous fallback)
 * Provides instant results while async search is running
 */
export function getQuickSearchResult(reference: string): UnifiedSearchResult {
  const startTime = performance.now();
  const detection = enhancedReferenceDetection(reference);
  
  // Generate fallback URLs for immediate navigation
  const fallbackUrl = detection.type === 'unit' 
    ? `/developer-unit/unit-for-rent-or-sale-ref-${smartReferenceClean(reference, 'unit')}`
    : `/listings/property-ref-${smartReferenceClean(reference, 'property')}`;
  
  // Handle unknown type for searchType
  const searchType = detection.type === 'unknown' ? 'both' : detection.type;
  
  return {
    reference: formatReferenceForDisplay(reference, detection.type),
    url: fallbackUrl,
    isValid: true,
    searchType: searchType,
    strategy: 'primary-first',
    source: 'fallback',
    responseTime: performance.now() - startTime,
    suggestion: 'Quick result - verifying in background...'
  };
}