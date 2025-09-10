/**
 * Production-Ready Compressed Data Utilities
 * Enables SSR-compatible data passing via compressed URL parameters
 * Features: gzip compression, base64 encoding, URL-safe, error recovery
 */

import pako from "pako";
import type { ListingDetails } from "@/types/property";
import type { UnitDetails } from "./get-unit-details";

// Configuration
const COMPRESSION_CONFIG = {
  URL_PARAM: "d", // Short parameter name
  MAX_URL_LENGTH: 6000, // Conservative limit for most browsers
  VERSION: "1",
} as const;

/**
 * Compress and encode data for URL passing
 * Uses gzip compression + base64 encoding for optimal size
 */
export function compressDataForUrl<T>(data: T): string {
  try {
    // Step 1: JSON stringify
    const jsonString = JSON.stringify(data);
    console.log(`📊 Original JSON size: ${jsonString.length} bytes`);

    // Step 2: Compress with gzip
    const compressed = pako.deflate(jsonString);
    console.log(
      `🗜️ Compressed size: ${compressed.length} bytes (${Math.round((1 - compressed.length / jsonString.length) * 100)}% reduction)`
    );

    // Step 3: Convert to base64 URL-safe string
    const base64 = btoa(String.fromCharCode(...compressed));
    const urlSafe = base64
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    console.log(`🔗 Final URL param size: ${urlSafe.length} characters`);

    if (urlSafe.length > COMPRESSION_CONFIG.MAX_URL_LENGTH) {
      console.warn(
        `⚠️ Compressed data is large (${urlSafe.length} chars). Consider reducing data size.`
      );
    }

    return urlSafe;
  } catch (_error) {
    console.error("Failed to compress data for URL:", _error);
    throw new Error("Data compression failed");
  }
}

/**
 * Decompress data from URL parameter
 * Handles both client and server-side decompression
 */
export function decompressDataFromUrl<T>(encodedData: string): T {
  try {
    // Step 1: Convert from URL-safe base64
    const base64 = encodedData.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    // Step 2: Decode base64
    const binaryString = atob(padded);
    const compressed = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      compressed[i] = binaryString.charCodeAt(i);
    }

    // Step 3: Decompress with gzip
    const decompressed = pako.inflate(compressed, { to: "string" });

    // Step 4: Parse JSON
    const data = JSON.parse(decompressed) as T;

    console.log(
      `✅ Successfully decompressed data (${decompressed.length} bytes)`
    );
    return data;
  } catch (error) {
    console.error("Failed to decompress data from URL:", error);
    throw new Error("Data decompression failed");
  }
}

/**
 * Build URL with compressed data parameter
 */
export function buildCompressedUrl<T>(baseUrl: string, data: T): string {
  try {
    const compressedData = compressDataForUrl(data);
    const urlObj = new URL(
      baseUrl,
      typeof window !== "undefined"
        ? window.location.origin
        : "https://example.com"
    );
    urlObj.searchParams.set(COMPRESSION_CONFIG.URL_PARAM, compressedData);
    urlObj.searchParams.set("v", COMPRESSION_CONFIG.VERSION);

    const finalUrl = urlObj.pathname + urlObj.search;
    console.log(`🔗 Built compressed URL: ${finalUrl.length} total characters`);

    return finalUrl;
  } catch (error) {
    console.warn(
      "Failed to build compressed URL, falling back to base URL:",
      error
    );
    return baseUrl;
  }
}

/**
 * Extract compressed data from URL search params
 * Works with both URLSearchParams and plain objects
 */
export function extractCompressedData<T>(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>
): T | null {
  try {
    let encodedData: string | null = null;

    if (searchParams instanceof URLSearchParams) {
      encodedData = searchParams.get(COMPRESSION_CONFIG.URL_PARAM);
    } else {
      const param = searchParams[COMPRESSION_CONFIG.URL_PARAM];
      encodedData = typeof param === "string" ? param : null;
    }

    if (!encodedData) {
      console.log("No compressed data parameter found");
      return null;
    }

    const data = decompressDataFromUrl<T>(encodedData);
    return data;
  } catch (error) {
    console.error("Failed to extract compressed data:", error);
    return null;
  }
}

/**
 * Check if URL contains compressed data
 */
export function hasCompressedData(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>
): boolean {
  if (searchParams instanceof URLSearchParams) {
    return searchParams.has(COMPRESSION_CONFIG.URL_PARAM);
  } else {
    return (
      COMPRESSION_CONFIG.URL_PARAM in searchParams &&
      searchParams[COMPRESSION_CONFIG.URL_PARAM] != null
    );
  }
}

/**
 * Clean URL by removing compressed data parameters
 * Used for cleaning URLs after data extraction
 */
export function getCleanUrl(currentUrl: string): string {
  try {
    const urlObj = new URL(
      currentUrl,
      typeof window !== "undefined"
        ? window.location.origin
        : "https://example.com"
    );
    urlObj.searchParams.delete(COMPRESSION_CONFIG.URL_PARAM);
    urlObj.searchParams.delete("v");

    return urlObj.pathname + (urlObj.search || "");
  } catch {
    // Fallback: simple string manipulation
    return currentUrl.split("?")[0] || currentUrl;
  }
}

/**
 * Property-specific helper
 */
export function compressPropertyForUrl(propertyData: ListingDetails): string {
  return buildCompressedUrl("", propertyData);
}

/**
 * Unit-specific helper
 */
export function compressUnitForUrl(unitData: UnitDetails): string {
  return buildCompressedUrl("", unitData);
}

/**
 * Extract property data from search params
 */
export function extractPropertyData(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>
): ListingDetails | null {
  return extractCompressedData<ListingDetails>(searchParams);
}

/**
 * Extract unit data from search params
 */
export function extractUnitData(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>
): UnitDetails | null {
  return extractCompressedData<UnitDetails>(searchParams);
}

/**
 * Estimate compression ratio for monitoring
 */
export function estimateCompressionRatio<T>(data: T): number {
  try {
    const jsonString = JSON.stringify(data);
    const compressed = pako.deflate(jsonString);
    return Math.round((1 - compressed.length / jsonString.length) * 100);
  } catch {
    return 0;
  }
}

/**
 * Get compression statistics for debugging
 */
export function getCompressionStats<T>(data: T) {
  try {
    const jsonString = JSON.stringify(data);
    const compressed = pako.deflate(jsonString);
    const base64 = btoa(String.fromCharCode(...compressed));
    const urlSafe = base64
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    return {
      originalSize: jsonString.length,
      compressedSize: compressed.length,
      base64Size: base64.length,
      urlSafeSize: urlSafe.length,
      compressionRatio: Math.round(
        (1 - compressed.length / jsonString.length) * 100
      ),
      urlFriendly: urlSafe.length < COMPRESSION_CONFIG.MAX_URL_LENGTH,
    };
  } catch {
    return null;
  }
}
