"use client";

import {
  buildResilientImageUrl,
  type ImageSize,
  type ImageType,
} from "@/lib/image-utils";
import { cn } from "@/lib/utils";
import Image, { type ImageProps } from "next/image";
import React, { useEffect, useRef, useState } from "react";

// Safe inline error placeholder (lightweight SVG)
const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4K";

export type ImageWithFallbackProps = Omit<ImageProps, "src" | "alt"> & {
  /** Image source (string or StaticImport) */
  src?: string | null;
  /** Accessible alt text (empty string allowed for decorative images) */
  alt?: string;
  /** Fallback text if alt is missing */
  fallbackAlt?: string;
  /** Custom fallback image source */
  fallbackSrc?: string;
  /** Enable blur effect while loading */
  withBlur?: boolean;

  // Resilient image options
  imageType?: ImageType;
  imageSize?: ImageSize;
  preferSecondary?: boolean;
  enableFallback?: boolean;

  /** Max retry attempts (original + fallback). Default: 2 */
  maxRetries?: number;
};

/**
 * Next.js <Image> wrapper with resilient URL building,
 * graceful fallback, retry logic, and blur-up loading effect.
 */
export function ImageWithFallback({
  src,
  alt,
  className,
  fallbackAlt,
  fallbackSrc,
  withBlur = true,
  imageType = "generic",
  imageSize = "original",
  preferSecondary = false,
  enableFallback = true,
  maxRetries = 2,
  onError: userOnError,
  onLoad: userOnLoad,
  ...rest
}: ImageWithFallbackProps) {
  const [isLoading, setIsLoading] = useState(Boolean(src));
  const [attempts, setAttempts] = useState(0);

  const prevSrcRef = useRef<string | null>(null);

  // Reset when src changes
  useEffect(() => {
    if (src !== prevSrcRef.current) {
      prevSrcRef.current = src!;
      setAttempts(0);
      setIsLoading(Boolean(src));
    }
  }, [src]);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const currentAttempt = attempts + 1;
    setAttempts(currentAttempt);
    setIsLoading(false);
    
    // Log error in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.warn(`Image load failed (attempt ${currentAttempt}/${maxRetries}):`, {
        src: effectiveSrc,
        originalSrc: src,
        imageType,
        imageSize,
      });
    }
    
    userOnError?.(event);
  };

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    userOnLoad?.(event);
  };

  // Build final image source
  const getEffectiveSrc = (): string => {
    if (!src) {
      return fallbackSrc ?? ERROR_IMG_SRC;
    }

    // If retries exceeded → force permanent fallback
    if (attempts >= maxRetries) {
      return fallbackSrc ?? ERROR_IMG_SRC;
    }

    // Full URL → trust as-is
    if (typeof src === "string" && src.startsWith("http")) {
      return src;
    }

    // Local paths (starting with /) → return as-is for Next.js to handle
    if (typeof src === "string" && src.startsWith("/")) {
      return src;
    }

    // Resilient builder for other paths (like image IDs)
    return buildResilientImageUrl(src, imageType, imageSize, {
      preferSecondary,
      enableFallback,
      customFallback: fallbackSrc,
    });
  };

  const effectiveSrc = getEffectiveSrc();

  // Respect alt="" for decorative images
  const safeAlt =
    alt !== undefined ? alt : (fallbackAlt ?? "Image could not be loaded");

  return (
    <Image
      {...rest}
      src={effectiveSrc}
      alt={safeAlt}
      className={cn(
        "transition duration-700 ease-in-out",
        withBlur && isLoading && "scale-105 blur-sm",
        withBlur && !isLoading && "blur-0 scale-100",
        className
      )}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}

// "use client";

// import {
//   buildNextJsImageUrl,
//   type ImageSize,
//   type ImageType,
// } from "@/lib/image-utils";
// import { cn } from "@/lib/utils";
// import Image from "next/image";
// import type { ComponentProps } from "react";
// import React, { useEffect, useRef, useState } from "react";

// const ERROR_IMG_SRC =
//   "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4K";

// export type ImageWithFallbackProps = ComponentProps<typeof Image> & {
//   fallbackAlt?: string;
//   fallbackSrc?: string;
//   withBlur?: boolean;

//   // Enhanced options for resilient image handling
//   imageType?: ImageType;
//   imageSize?: ImageSize;
//   preferSecondary?: boolean;
//   enableFallback?: boolean;
// };

// export function ImageWithFallback(props: ImageWithFallbackProps) {
//   const {
//     src,
//     alt,
//     className,
//     fallbackAlt,
//     fallbackSrc,
//     withBlur = true,
//     imageType = "generic",
//     imageSize = "original",
//     preferSecondary = false,
//     enableFallback = true,
//     onError: userOnError,
//     onLoad: userOnLoad,
//     ...rest
//   } = props;

//   const [isLoading, setIsLoading] = useState(Boolean(src));
//   const [usingFallback, setUsingFallback] = useState(false);
//   const [retryCount, setRetryCount] = useState(0);

//   const prevSrcRef = useRef<string | null>(null);

//   // Reset only when src actually changes
//   useEffect(() => {
//     if (src !== prevSrcRef.current) {
//       prevSrcRef.current = src as string;
//       setUsingFallback(false);
//       setRetryCount(0);
//       setIsLoading(Boolean(src));
//     }
//   }, [src]);

//   const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
//     // If not already using fallback, switch to fallbackSrc (or ERROR_IMG_SRC)
//     if (!usingFallback) {
//       setUsingFallback(true);
//     } else if (retryCount < 1) {
//       // retry original once in case of transient failure
//       setUsingFallback(false);
//       setRetryCount((c) => c + 1);
//     }
//     setIsLoading(false);
//     userOnError?.(event);
//   };

//   const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
//     setIsLoading(false);
//     userOnLoad?.(event);
//   };

//   // Respect explicit alt="" for decorative images
//   const safeAlt =
//     alt !== undefined ? alt : (fallbackAlt ?? "Image could not be loaded");

//   // Build resilient image URL if src is a path, otherwise use src directly
//   const getEffectiveSrc = () => {
//     if (usingFallback) {
//       return fallbackSrc ?? ERROR_IMG_SRC;
//     }

//     if (!src) {
//       return ERROR_IMG_SRC;
//     }

//     // If src is already a full URL, use it directly
//     if (typeof src === "string" && src.startsWith("http")) {
//       return src;
//     }

//     // Use Next.js compatible URL builder for paths (disables optimization to prevent conflicts)
//     return buildNextJsImageUrl(src as string, imageType, imageSize, {
//       preferSecondary,
//       enableFallback,
//       customFallback: fallbackSrc,
//     });
//   };

//   const effectiveSrc = getEffectiveSrc();

//   return (
//     <Image
//       {...rest}
//       src={effectiveSrc}
//       alt={safeAlt}
//       className={cn(
//         "duration-700 ease-in-out",
//         withBlur && isLoading && "scale-105 blur-sm",
//         withBlur && !isLoading && "blur-0 scale-100",
//         className
//       )}
//       onError={handleError}
//       onLoad={handleLoad}
//     />
//   );
// }
