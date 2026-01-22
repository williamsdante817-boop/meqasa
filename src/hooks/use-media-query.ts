"use client";

import * as React from "react";
import { logger } from "@/lib/logger";

export function useMediaQuery(query: string) {
  if (!query || typeof query !== "string") {
    throw new Error("useMediaQuery requires a valid query string");
  }

  const [value, setValue] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const isMountedRef = React.useRef(true);

  React.useEffect(() => {
    isMountedRef.current = true;
    setMounted(true);

    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    try {
      function onChange(event: MediaQueryListEvent) {
        if (isMountedRef.current) {
          setValue(event.matches);
        }
      }

      const result = matchMedia(query);
      if (!result) {
        throw new Error(`Failed to create MediaQueryList for: ${query}`);
      }

      result.addEventListener("change", onChange);
      if (isMountedRef.current) {
        setValue(result.matches);
      }

      return () => {
        isMountedRef.current = false;
        try {
          result.removeEventListener("change", onChange);
        } catch {
          // Silently handle cleanup errors
        }
      };
    } catch (error) {
      // Handle invalid media query strings gracefully
      if (isMountedRef.current) {
        logger.warn("Invalid media query", {
          query,
          error: error instanceof Error ? error.message : String(error),
        });
        setValue(false);
      }
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [query]);

  return mounted ? value : false;
}
