import { detectUnitReferenceConfidence } from "./unit-reference-url-generator";

/**
 * Smart Reference Detection System
 * Intelligently determines whether a reference is for a property or unit
 * Provides confidence scoring and fallback strategies
 */

export type ReferenceType = 'property' | 'unit' | 'unknown';

export interface ReferenceDetectionResult {
  type: ReferenceType;
  confidence: number;
  reference: string;
  reasoning?: string;
}

/**
 * Detect the most likely type of a reference (property vs unit)
 * Uses pattern analysis and heuristics to make intelligent guesses
 * 
 * @param input - Raw reference input from user
 * @returns Detection result with type, confidence, and reasoning
 */
export function detectReferenceType(input: string): ReferenceDetectionResult {
  const clean = input.trim().toUpperCase();
  const originalInput = input.trim();
  
  if (!clean) {
    return {
      type: 'unknown',
      confidence: 0,
      reference: originalInput,
      reasoning: 'Empty input'
    };
  }
  
  // High confidence unit indicators
  if (/^UNIT\s*\d+|^U\s*\d+/.test(clean)) {
    return {
      type: 'unit',
      confidence: 0.95,
      reference: originalInput,
      reasoning: 'Contains UNIT prefix'
    };
  }
  
  if (clean.endsWith('UNIT')) {
    return {
      type: 'unit',
      confidence: 0.9,
      reference: originalInput,
      reasoning: 'Ends with UNIT'
    };
  }
  
  // High confidence property indicators
  if (/^REF\s*\d+|^PROP\s*\d+/.test(clean)) {
    return {
      type: 'property',
      confidence: 0.9,
      reference: originalInput,
      reasoning: 'Contains property prefix (REF/PROP)'
    };
  }
  
  // Standard property reference format (6 digits is common for properties)
  if (/^\d{6}$/.test(clean)) {
    return {
      type: 'property',
      confidence: 0.85,
      reference: originalInput,
      reasoning: '6-digit format typical for properties'
    };
  }
  
  // Letter-number combinations are more common for units
  if (/^[A-Z]\d+$/.test(clean)) {
    return {
      type: 'unit',
      confidence: 0.8,
      reference: originalInput,
      reasoning: 'Letter-number pattern typical for units'
    };
  }
  
  if (/^\d+[A-Z]$/.test(clean)) {
    return {
      type: 'unit',
      confidence: 0.75,
      reference: originalInput,
      reasoning: 'Number-letter pattern typical for units'
    };
  }
  
  // Complex alphanumeric more likely units
  if (/^[A-Z]+\d+$/.test(clean) && clean.length > 4) {
    return {
      type: 'unit',
      confidence: 0.7,
      reference: originalInput,
      reasoning: 'Complex alphanumeric pattern typical for units'
    };
  }
  
  // Short numeric references more likely properties
  if (/^\d{4,5}$/.test(clean)) {
    return {
      type: 'property',
      confidence: 0.65,
      reference: originalInput,
      reasoning: 'Short numeric format common for properties'
    };
  }
  
  // Long numeric could be either, slight preference for units
  if (/^\d{7,}$/.test(clean)) {
    return {
      type: 'unit',
      confidence: 0.6,
      reference: originalInput,
      reasoning: 'Long numeric format slightly more common for units'
    };
  }
  
  // Generic numeric (could be either) - prefer property as it's more established
  if (/^\d+$/.test(clean)) {
    return {
      type: 'property',
      confidence: 0.55,
      reference: originalInput,
      reasoning: 'Generic numeric - slight preference for established property system'
    };
  }
  
  // Mixed patterns with low confidence
  if (/[A-Z]/.test(clean) && /\d/.test(clean)) {
    return {
      type: 'unit',
      confidence: 0.4,
      reference: originalInput,
      reasoning: 'Mixed alphanumeric - units more likely to have complex patterns'
    };
  }
  
  // Fallback - unknown with very low confidence
  return {
    type: 'unknown',
    confidence: 0.2,
    reference: originalInput,
    reasoning: 'Pattern not recognized - will try both types'
  };
}

/**
 * Determine search strategy based on detection result
 * Decides whether to search one type first or both simultaneously
 * 
 * @param detection - Result from detectReferenceType
 * @returns Search strategy configuration
 */
export interface SearchStrategy {
  strategy: 'primary-first' | 'parallel' | 'sequential';
  primaryType?: ReferenceType;
  explanation: string;
}

export function determineSearchStrategy(detection: ReferenceDetectionResult): SearchStrategy {
  // High confidence - try the detected type first
  if (detection.confidence >= 0.8) {
    return {
      strategy: 'primary-first',
      primaryType: detection.type,
      explanation: `High confidence ${detection.type} reference - trying ${detection.type} search first`
    };
  }
  
  // Medium confidence - try primary first, then fallback
  if (detection.confidence >= 0.6) {
    return {
      strategy: 'sequential',
      primaryType: detection.type,
      explanation: `Medium confidence ${detection.type} reference - trying ${detection.type} first, then other type if needed`
    };
  }
  
  // Low confidence - search both in parallel for speed
  return {
    strategy: 'parallel',
    explanation: 'Low confidence in reference type - searching both properties and units simultaneously'
  };
}

/**
 * Enhanced detection that combines multiple heuristics
 * Uses both pattern matching and statistical analysis
 * 
 * @param input - Raw reference input
 * @returns Enhanced detection result
 */
export function enhancedReferenceDetection(input: string): ReferenceDetectionResult {
  const basicDetection = detectReferenceType(input);
  
  // Get unit confidence from the unit detector
  const unitConfidence = detectUnitReferenceConfidence(input);
  const propertyConfidence = 1 - unitConfidence;
  
  // Combine heuristics for better accuracy
  let finalType: ReferenceType = basicDetection.type;
  let finalConfidence = basicDetection.confidence;
  
  // If unit detector has high confidence and it differs from basic detection
  if (unitConfidence > 0.8 && basicDetection.type !== 'unit') {
    finalType = 'unit';
    finalConfidence = Math.max(unitConfidence, basicDetection.confidence);
  }
  
  // If property confidence is high and basic detection agrees
  if (propertyConfidence > 0.8 && basicDetection.type === 'property') {
    finalConfidence = Math.max(propertyConfidence, basicDetection.confidence);
  }
  
  return {
    type: finalType,
    confidence: finalConfidence,
    reference: input.trim(),
    reasoning: `Combined analysis: ${basicDetection.reasoning} (enhanced confidence: ${Math.round(finalConfidence * 100)}%)`
  };
}

/**
 * Validate reference format regardless of type
 * Catches obviously invalid inputs before attempting searches
 * 
 * @param reference - Reference to validate
 * @returns Validation result
 */
export interface ReferenceValidation {
  isValid: boolean;
  error?: string;
  suggestion?: string;
}

export function validateReferenceFormat(reference: string): ReferenceValidation {
  const clean = reference.trim();
  
  if (!clean) {
    return {
      isValid: false,
      error: 'Please enter a reference number'
    };
  }
  
  if (clean.length > 50) {
    return {
      isValid: false,
      error: 'Reference number is too long',
      suggestion: 'Please check and enter a shorter reference'
    };
  }
  
  // Allow only alphanumeric and common separators
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(clean)) {
    return {
      isValid: false,
      error: 'Reference contains invalid characters',
      suggestion: 'Use only letters, numbers, spaces, hyphens, and underscores'
    };
  }
  
  // Must contain at least one number or letter
  if (!/[a-zA-Z0-9]/.test(clean)) {
    return {
      isValid: false,
      error: 'Reference must contain letters or numbers'
    };
  }
  
  return { isValid: true };
}

/**
 * Smart reference cleaner that preserves important formatting
 * More sophisticated than basic cleaners
 * 
 * @param reference - Raw reference input
 * @param type - Known or suspected reference type
 * @returns Cleaned reference optimized for the given type
 */
export function smartReferenceClean(reference: string, type?: ReferenceType): string {
  let cleaned = reference.trim().toUpperCase();
  
  if (type === 'unit') {
    // For units, preserve certain patterns but clean others
    cleaned = cleaned.replace(/\s+/g, ''); // Remove spaces
    cleaned = cleaned.replace(/[^A-Z0-9]/g, ''); // Keep only alphanumeric
    return cleaned;
  }
  
  if (type === 'property') {
    // For properties, be more aggressive in cleaning
    cleaned = cleaned.replace(/^(REF|PROP)\s*/i, ''); // Remove common prefixes
    cleaned = cleaned.replace(/[^0-9]/g, ''); // Keep only numbers for properties
    return cleaned;
  }
  
  // Unknown type - conservative cleaning
  cleaned = cleaned.replace(/\s+/g, ''); // Remove spaces
  cleaned = cleaned.replace(/[^A-Z0-9]/g, ''); // Keep alphanumeric only
  return cleaned;
}

/**
 * Format reference for display based on detected type
 * Provides user-friendly display format
 * 
 * @param reference - Reference to format
 * @param type - Reference type
 * @returns Formatted reference for display
 */
export function formatReferenceForDisplay(reference: string, type?: ReferenceType): string {
  const cleaned = smartReferenceClean(reference, type);
  
  if (type === 'unit') {
    // Add UNIT prefix for display if it's purely numeric and doesn't have it
    if (/^\d+$/.test(cleaned) && !reference.toUpperCase().includes('UNIT')) {
      return `UNIT${cleaned}`;
    }
    return cleaned;
  }
  
  if (type === 'property') {
    // Simple numeric display for properties
    return cleaned;
  }
  
  // Unknown type - return cleaned version
  return cleaned;
}