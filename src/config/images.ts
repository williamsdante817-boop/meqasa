/**
 * Image configuration for different environments
 * Centralized configuration for image URLs, CDNs, and fallback strategies
 */

export interface ImageConfig {
  primaryCdn: string;
  secondaryCdn: string;
  localFallback?: string;
  defaultQuality: number;
  enableWebP: boolean;
  enableAvif: boolean;
  maxRetries: number;
  retryDelay: number;
  enableFallbackChain: boolean;
  fallbacks: Record<
    | "property"
    | "agent"
    | "agent-logo"
    | "developer"
    | "developer-logo"
    | "project"
    | "project-photo"
    | "project-logo"
    | "banner"
    | "ad"
    | "temp"
    | "generic",
    string
  >;
  sizes: {
    thumbnail: { width: number; height: number; quality: number };
    medium: { width: number; height: number; quality: number };
    large: { width: number; height: number; quality: number };
    original: { quality: number };
  };
  environment: {
    isDevelopment: boolean;
    isProduction: boolean;
    isPreview: boolean;
    baseOrigin: string;
  };
  patterns: Record<
    | "property"
    | "agent-logo"
    | "developer-logo"
    | "project-photo"
    | "project-logo"
    | "banner"
    | "ad"
    | "temp"
    | "generic",
    string[]
  >;
}

// ---------- Shared Defaults ----------
const PLACEHOLDER = "/placeholder-image.png";
const FALLBACK = "/fallback.png";

// ---------- Environments ----------
const developmentConfig: ImageConfig = {
  primaryCdn: "https://dve7rykno93gs.cloudfront.net",
  secondaryCdn: "https://meqasa.com",
  localFallback: "http://localhost:3000",
  defaultQuality: 85,
  enableWebP: false,
  enableAvif: false,
  maxRetries: 2,
  retryDelay: 500,
  enableFallbackChain: true,
  fallbacks: {
    property: PLACEHOLDER,
    agent: PLACEHOLDER,
    "agent-logo": PLACEHOLDER,
    developer: PLACEHOLDER,
    "developer-logo": PLACEHOLDER,
    project: PLACEHOLDER,
    "project-photo": PLACEHOLDER,
    "project-logo": PLACEHOLDER,
    banner: FALLBACK,
    ad: FALLBACK,
    temp: PLACEHOLDER,
    generic: PLACEHOLDER,
  },
  sizes: {
    thumbnail: { width: 150, height: 150, quality: 80 },
    medium: { width: 400, height: 300, quality: 85 },
    large: { width: 800, height: 600, quality: 90 },
    original: { quality: 95 },
  },
  environment: {
    isDevelopment: true,
    isProduction: false,
    isPreview: false,
    baseOrigin: "http://localhost:3000",
  },
  patterns: {
    property: [
      "/tn5/uploads/imgs/",
      "/tn6/uploads/imgs/",
      "/uploads/imgs/",
      "/uploads/properties/",
    ],
    "agent-logo": [
      "/fascimos/somics/",
      "/uploads/agents/",
      "/uploads/imgs/",
    ],
    "developer-logo": ["/uploads/imgs/", "/uploads/developers/"],
    "project-photo": [
      "/tn5/uploads/imgs/",
      "/tn6/uploads/imgs/",
      "/uploads/projects/",
      "/uploads/imgs/",
    ],
    "project-logo": [
      "/tn5/uploads/imgs/",
      "/tn6/uploads/imgs/",
      "/uploads/projects/",
      "/uploads/imgs/",
    ],
    banner: ["/uploads/banners/"],
    ad: ["/uploads/ads/"],
    temp: ["/temp/temp/", "/temp/"],
    generic: ["/uploads/imgs/"],
  },
};

const previewConfig: ImageConfig = {
  ...developmentConfig,
  environment: {
    isDevelopment: false,
    isProduction: false,
    isPreview: true,
    baseOrigin: "https://staging.meqasa.com",
  },
  enableWebP: true,
};

const productionConfig: ImageConfig = {
  ...developmentConfig,
  enableWebP: true,
  enableAvif: true,
  defaultQuality: 75,
  environment: {
    isDevelopment: false,
    isProduction: true,
    isPreview: false,
    baseOrigin: "https://meqasa.com",
  },
};

/** Determine environment config */
export function getImageConfig(): ImageConfig {
  const nodeEnv = process.env.NODE_ENV;
  const vercelEnv = process.env.VERCEL_ENV;
  const isClient = typeof window !== "undefined";

  // Client-side: check hostname
  if (isClient) {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return developmentConfig;
    }
    if (hostname.includes("vercel.app")) {
      return previewConfig;
    }
    return productionConfig;
  }

  // Server-side: use env vars
  if (nodeEnv === "development") return developmentConfig;
  if (vercelEnv === "preview") return previewConfig;
  return productionConfig;
}

/** Get CDN URLs */
export function getCdnUrls(preferSecondary = false): string[] {
  const { primaryCdn, secondaryCdn } = getImageConfig();
  return preferSecondary
    ? [secondaryCdn, primaryCdn]
    : [primaryCdn, secondaryCdn];
}

/** Get base origin (useful for local + hybrid URLs) */
export function getBaseOrigin(): string {
  return getImageConfig().environment.baseOrigin;
}

/** Get fallback image for a specific type */
export function getFallbackImage(type: keyof ImageConfig["fallbacks"]): string {
  return getImageConfig().fallbacks[type];
}

/** Get image patterns for a specific type */
export function getImagePatterns(
  type: keyof ImageConfig["patterns"]
): string[] {
  const config = getImageConfig();
  return config.patterns[type] || config.patterns.generic;
}

/** Get size optimization parameters for a given size */
export function getSizeParams(size: keyof ImageConfig["sizes"]): string {
  const config = getImageConfig();
  const sizeConfig = config.sizes[size];
  const params = new URLSearchParams();

  if (size !== "original" && "width" in sizeConfig && "height" in sizeConfig) {
    params.set("w", sizeConfig.width.toString());
    params.set("h", sizeConfig.height.toString());
  }
  params.set("q", sizeConfig.quality.toString());

  // Format priority: AVIF > WebP > Default
  if (config.enableAvif) {
    params.set("f", "avif");
  } else if (config.enableWebP) {
    params.set("f", "webp");
  }

  return params.toString();
}
