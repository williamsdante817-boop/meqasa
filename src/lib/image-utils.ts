// Enhanced image utilities for production-ready image handling
// Extends the existing image-preload.ts with additional optimizations

export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "jpeg" | "png";
  priority?: boolean;
}

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

// Environment-aware CDN URL
export const getCDNBaseUrl = (): string => {
  return (
    process.env.NEXT_PUBLIC_CDN_URL ?? "https://dve7rykno93gs.cloudfront.net"
  );
};

// Enhanced image URL generation with optimization support
export const getOptimizedImageUrl = (imagePath: string | undefined): string => {
  if (!imagePath) return "";

  const baseUrl = getCDNBaseUrl();

  // If the URL already contains cloudfront domain, return optimized version
  if (imagePath.includes("dve7rykno93gs.cloudfront.net")) {
    return imagePath;
  }

  // Handle different image path formats
  let imageSrc: string;

  if (imagePath.startsWith("/temp/temp/") || /^\d+$/.test(imagePath)) {
    const id = imagePath.split("/").pop();
    imageSrc = `${baseUrl}/temp/temp/${id}`;
  } else {
    imageSrc = `${baseUrl}/uploads/imgs/${imagePath}`;
  }

  // For Next.js optimization, we could add query parameters
  // but for now, return the direct CDN URL as the CDN likely handles optimization
  return imageSrc;
};

// Get responsive image sizes for different breakpoints
export const getResponsiveImageSizes = (
  containerType: "main" | "thumbnail" | "grid" = "main",
): string => {
  switch (containerType) {
    case "main":
      return "(min-width: 1024px) 66vw, 100vw";
    case "thumbnail":
      return "80px";
    case "grid":
      return "(min-width: 1024px) 33vw, 100vw";
    default:
      return "100vw";
  }
};

// Calculate optimal image dimensions based on container
export const getOptimalImageDimensions = (
  containerType: "main" | "thumbnail" | "grid" = "main",
  customWidth?: number,
  customHeight?: number,
): { width: number; height: number } => {
  if (customWidth && customHeight) {
    return { width: customWidth, height: customHeight };
  }

  switch (containerType) {
    case "main":
      return { width: 900, height: 600 };
    case "thumbnail":
      return { width: 80, height: 60 };
    case "grid":
      return { width: 450, height: 300 };
    default:
      return { width: 800, height: 600 };
  }
};

// Validate image URL format
export const isValidImagePath = (imagePath: string | undefined): boolean => {
  if (!imagePath || typeof imagePath !== "string") return false;

  // Check for valid image extensions or numeric IDs
  const validExtensions = /\.(jpg|jpeg|png|webp|gif)$/i;
  const isNumericId = /^\d+$/.test(imagePath);
  const isTempPath = imagePath.startsWith("/temp/temp/");
  const hasValidExtension = validExtensions.test(imagePath);

  return isNumericId || isTempPath || hasValidExtension;
};

// Filter and validate image array
export const sanitizeImageArray = (
  images: (string | undefined | null)[],
): string[] => {
  return images
    .filter((img): img is string => Boolean(img))
    .filter(isValidImagePath)
    .slice(0, 20); // Limit to prevent performance issues
};

// Generate srcset for responsive images
export const generateSrcSet = (
  imagePath: string,
  widths: number[] = [400, 800, 1200, 1600],
): string => {
  return widths
    .map((width) => {
      const url = getOptimizedImageUrl(imagePath);
      return `${url} ${width}w`;
    })
    .join(", ");
};

// Memory-efficient image preloader with abort control
class ImagePreloader {
  private static instance: ImagePreloader;
  private preloadCache = new Set<string>();
  private activeRequests = new Map<string, AbortController>();

  static getInstance(): ImagePreloader {
    if (!ImagePreloader.instance) {
      ImagePreloader.instance = new ImagePreloader();
    }
    return ImagePreloader.instance;
  }

  async preloadImage(
    url: string,
    options: { priority?: boolean } = {},
  ): Promise<void> {
    if (!url || this.preloadCache.has(url)) {
      return Promise.resolve();
    }

    // Cancel existing request if any
    if (this.activeRequests.has(url)) {
      this.activeRequests.get(url)?.abort();
    }

    const controller = new AbortController();
    this.activeRequests.set(url, controller);

    try {
      if (typeof window === "undefined") {
        return Promise.resolve();
      }

      const img = new Image();
      img.decoding = "async";
      img.loading = options.priority ? "eager" : "lazy";

      await new Promise<void>((resolve) => {
        img.onload = () => {
          this.preloadCache.add(url);
          this.activeRequests.delete(url);
          resolve();
        };

        img.onerror = () => {
          this.activeRequests.delete(url);
          // Don't cache errors, but don't reject either
          resolve();
        };

        controller.signal.addEventListener("abort", () => {
          this.activeRequests.delete(url);
          resolve(); // Resolve on abort, don't reject
        });

        img.src = url;
      });
    } catch (error) {
      this.activeRequests.delete(url);
      // Silently handle errors to prevent breaking the UI
      console.warn("Image preload failed:", url, error);
    }
  }

  async preloadImages(
    urls: string[],
    options: { priority?: boolean[]; batchSize?: number } = {},
  ): Promise<void> {
    const { priority = [], batchSize = 4 } = options;

    // Process in batches to avoid overwhelming the browser
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      const batchPromises = batch.map((url, index) =>
        this.preloadImage(url, { priority: priority[i + index] ?? false }),
      );

      await Promise.allSettled(batchPromises);
    }
  }

  isPreloaded(url: string): boolean {
    return this.preloadCache.has(url);
  }

  clearCache(): void {
    this.preloadCache.clear();
    // Abort all active requests
    this.activeRequests.forEach((controller) => controller.abort());
    this.activeRequests.clear();
  }
}

export const imagePreloader = ImagePreloader.getInstance();

// Helper functions that use the singleton
export const preloadImageOptimized = (
  url: string,
  options?: { priority?: boolean },
) => imagePreloader.preloadImage(url, options);

export const preloadImagesOptimized = (
  urls: string[],
  options?: { priority?: boolean[]; batchSize?: number },
) => imagePreloader.preloadImages(urls, options);

export const isImagePreloadedOptimized = (url: string) =>
  imagePreloader.isPreloaded(url);
