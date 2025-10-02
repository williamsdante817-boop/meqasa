"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import type { ComponentProps } from "react";
import React, { useEffect, useRef, useState } from "react";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4K";

export type ImageWithFallbackProps = ComponentProps<typeof Image> & {
  fallbackAlt?: string;
  fallbackSrc?: string;
  withBlur?: boolean;
};

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const {
    src,
    alt,
    className,
    fallbackAlt,
    fallbackSrc,
    withBlur = true,
    onError: userOnError,
    onLoad: userOnLoad,
    ...rest
  } = props;

  const [isLoading, setIsLoading] = useState(Boolean(src));
  const [usingFallback, setUsingFallback] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const prevSrcRef = useRef<string | null>(null);

  // Reset only when src actually changes
  useEffect(() => {
    if (src !== prevSrcRef.current) {
      prevSrcRef.current = src as string;
      setUsingFallback(false);
      setRetryCount(0);
      setIsLoading(Boolean(src));
    }
  }, [src]);

  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    // If not already using fallback, switch to fallbackSrc (or ERROR_IMG_SRC)
    if (!usingFallback) {
      setUsingFallback(true);
    } else if (retryCount < 1) {
      // retry original once in case of transient failure
      setUsingFallback(false);
      setRetryCount((c) => c + 1);
    }
    setIsLoading(false);
    userOnError?.(event);
  };

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    userOnLoad?.(event);
  };

  // Respect explicit alt="" for decorative images
  const safeAlt =
    alt !== undefined ? alt : (fallbackAlt ?? "Image could not be loaded");

  const effectiveSrc = usingFallback
    ? (fallbackSrc ?? ERROR_IMG_SRC)
    : ((src as string) ?? ERROR_IMG_SRC);

  return (
    <Image
      {...rest}
      src={effectiveSrc}
      alt={safeAlt}
      className={cn(
        "duration-700 ease-in-out",
        withBlur && isLoading && "scale-105 blur-sm",
        withBlur && !isLoading && "blur-0 scale-100",
        className
      )}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}
