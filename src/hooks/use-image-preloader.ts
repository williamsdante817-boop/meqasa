"use client";

import { isImagePreloaded, preloadImages } from "@/lib/image-preload";
import { useCallback, useEffect, useRef } from "react";

interface UseImagePreloaderOptions {
  /** Maximum number of images to preload around current index */
  maxPreloadWindow?: number;
  /** Whether to use smaller preload window on mobile */
  useMobileOptimization?: boolean;
}

export function useImagePreloader(
  imageUrls: string[],
  currentIndex: number,
  isOpen: boolean,
  options: UseImagePreloaderOptions = {}
) {
  const { maxPreloadWindow = 3, useMobileOptimization = true } = options;

  const abortControllerRef = useRef<AbortController | null>(null);

  // Determine preload window size based on screen size
  const getPreloadWindow = useCallback(() => {
    if (!useMobileOptimization) return maxPreloadWindow;

    // Use smaller window on mobile (detected by screen width)
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    return isMobile ? 1 : maxPreloadWindow;
  }, [maxPreloadWindow, useMobileOptimization]);

  // Preload images around current index
  const preloadAroundIndex = useCallback(
    (index: number) => {
      if (!isOpen || imageUrls.length === 0) return;

      // Cancel previous preload requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this batch
      abortControllerRef.current = new AbortController();

      const windowSize = getPreloadWindow();
      const toPreload: string[] = [];

      for (let offset = -windowSize; offset <= windowSize; offset++) {
        const idx = index + offset;
        if (idx >= 0 && idx < imageUrls.length) {
          const url = imageUrls[idx];
          if (url && !isImagePreloaded(url)) {
            toPreload.push(url);
          }
        }
      }

      if (toPreload.length > 0) {
        void preloadImages(toPreload);
      }
    },
    [imageUrls, isOpen, getPreloadWindow]
  );

  // Preload when current index changes
  useEffect(() => {
    preloadAroundIndex(currentIndex);
  }, [currentIndex, preloadAroundIndex]);

  // Preload remaining images when modal opens
  useEffect(() => {
    if (isOpen && imageUrls.length > 0) {
      // Preload initial window
      preloadAroundIndex(currentIndex);

      // Lazy preload remaining images
      const remainingUrls = imageUrls.filter((url) => !isImagePreloaded(url));
      if (remainingUrls.length > 0) {
        // Use a timeout to avoid blocking the initial render
        const timeoutId = setTimeout(() => {
          if (!abortControllerRef.current?.signal.aborted) {
            void preloadImages(remainingUrls);
          }
        }, 1000);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [isOpen, imageUrls, currentIndex, preloadAroundIndex]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    isImagePreloaded: useCallback((url: string) => isImagePreloaded(url), []),
  };
}
