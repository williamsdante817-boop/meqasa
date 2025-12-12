import {
  getCdnUrls,
  getFallbackImage,
  getImagePatterns,
  getSizeParams,
} from "@/config/images";

export type ImageType =
  | "property"
  | "agent-logo"
  | "developer-logo"
  | "project-photo"
  | "project-logo"
  | "banner"
  | "ad"
  | "temp"
  | "generic";

export type ImageSize = "thumbnail" | "medium" | "large" | "original";

export interface ImageUrlOptions {
  preferSecondary?: boolean;
  enableFallback?: boolean;
  customFallback?: string;
  disableOptimization?: boolean;
}

const urlCache = new Map<string, string>();

function normalizeCdn(cdn: string): string {
  return cdn.replace(/\/+$|$/, "");
}

function mergePatternWithPath(
  pattern: string,
  rawPath: string
): string | null {
  const patternSegments = pattern.split("/").filter(Boolean);
  const pathSegments = rawPath.split("/").filter(Boolean);

  const matchesPattern = patternSegments.every(
    (segment, index) => pathSegments[index] === segment
  );

  if (!matchesPattern && pathSegments.length > 1) {
    return null;
  }

  const finalSegments = matchesPattern
    ? pathSegments
    : [...patternSegments, ...pathSegments];

  return finalSegments.join("/");
}

/**
 * Determine the appropriate image type based on the image path
 */
export function getImageTypeFromPath(imagePath: string): ImageType {
  if (!imagePath) return "generic";

  // Handle specific path patterns first (most specific)
  if (imagePath.includes("/fascimos/somics/")) return "agent-logo";
  if (imagePath.includes("/uploads/developers/")) return "developer-logo";
  if (imagePath.includes("/uploads/projects/")) return "project-photo";
  if (imagePath.includes("/pieoq/")) return "banner";
  if (imagePath.includes("/uploads/ads/")) return "ad";
  if (imagePath.includes("/temp/")) return "temp";

  // Handle temp images - temp image patterns (8+ digits + single letter)
  // Temp images are typically like: "43921301a", "22731700a" (8+ digits + single letter)
  if (/^\d{8,}[a-z]$/i.test(imagePath)) return "temp";

  // Default to property for most cases
  return "property";
}

/**
 * Build a resilient image URL with CDN fallback and optimization
 */
export function buildResilientImageUrl(
  imagePath: string | undefined | null,
  imageType: ImageType = "generic",
  size: ImageSize = "original",
  options: ImageUrlOptions = {}
): string {
  const {
    preferSecondary = false,
    enableFallback = true,
    customFallback,
    disableOptimization = false,
  } = options;

  const trimmedPath = imagePath?.trim() ?? "";
  const cacheKey = JSON.stringify({
    imageType,
    size,
    path: trimmedPath,
    preferSecondary,
    disableOptimization,
    enableFallback,
    customFallback: customFallback ?? "",
  });
  if (urlCache.has(cacheKey)) return urlCache.get(cacheKey)!;

  const resolveFallback = (defaultValue = "") => {
    if (!enableFallback) {
      urlCache.set(cacheKey, defaultValue);
      return defaultValue;
    }

    const fallback =
      customFallback ||
      getFallbackImage(imageType) ||
      getFallbackImage("generic") ||
      "/placeholder-image.png";
    urlCache.set(cacheKey, fallback);
    return fallback;
  };

  if (!trimmedPath) {
    return resolveFallback("");
  }

  const clean = trimmedPath;
  const cdns = getCdnUrls(preferSecondary);

  // Temp / Local images - use CDN directly
  const isTempId = /^\d{8,}[a-z]$/i.test(clean);
  if (clean.startsWith("/temp") || clean.startsWith("temp/") || isTempId) {
    const cdn = cdns[0] || "https://dve7rykno93gs.cloudfront.net";
    let tempKey = clean.replace(/^\/+/, "");

    if (!isTempId) {
      while (tempKey.toLowerCase().startsWith("temp/")) {
        tempKey = tempKey.slice(5);
      }
    }

    const full = `${cdn}/temp/temp/${tempKey}`;
    urlCache.set(cacheKey, full);
    return full;
  }

  // Fully qualified URL - return as-is
  if (clean.startsWith("http")) {
    urlCache.set(cacheKey, clean);
    return clean;
  }

  // Local paths (starting with /) - return as-is for Next.js to handle
  if (clean.startsWith("/")) {
    urlCache.set(cacheKey, clean);
    return clean;
  }

  // Build via CDN patterns
  for (const cdn of cdns) {
    const patterns = getImagePatterns(imageType);
    for (const pattern of patterns) {
      const normalizedCdn = normalizeCdn(cdn);
      const candidatePath = mergePatternWithPath(pattern, clean);
      if (!candidatePath) continue;
      const candidate = `${normalizedCdn}/${candidatePath}`;
      if (candidate.startsWith("http")) {
        // Don't add query params for CDN URLs - let Next.js Image handle optimization
        urlCache.set(cacheKey, candidate);
        return candidate;
      }
    }
  }

  // Fallback
  return resolveFallback(clean);
}

// ----------------------
// Specialized Builders
// ----------------------

export function buildAgentLogoUrl(
  imbroker: string | undefined | null,
  options?: ImageUrlOptions
): string {
  return buildResilientImageUrl(imbroker, "agent-logo", "original", options);
}

export function buildPropertyImageUrl(
  imagePath: string | undefined | null,
  size: ImageSize = "original",
  options?: ImageUrlOptions
): string {
  return buildResilientImageUrl(imagePath, "property", size, options);
}

export function buildDeveloperLogoUrl(
  logoPath: string | undefined | null,
  size: ImageSize = "original",
  options?: ImageUrlOptions
): string {
  return buildResilientImageUrl(logoPath, "developer-logo", size, options);
}

export function buildProjectImageUrl(
  imagePath: string | undefined | null,
  size: ImageSize = "original",
  options?: ImageUrlOptions
): string {
  return buildResilientImageUrl(imagePath, "project-photo", size, options);
}

export function buildBannerImageUrl(
  bannerPath: string | undefined | null,
  size: ImageSize = "original",
  options?: ImageUrlOptions
): string {
  return buildResilientImageUrl(bannerPath, "banner", size, options);
}

export function buildTempImageUrl(tempPath: string | undefined | null): string {
  return buildResilientImageUrl(tempPath, "temp");
}
