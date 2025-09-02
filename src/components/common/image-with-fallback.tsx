"use client";

import React from "react";
import Image from "next/image";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

export type ImageWithFallbackProps = ComponentProps<typeof Image> & {
  fallbackAlt?: string;
  withBlur?: boolean;
};

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  const {
    src,
    alt,
    className,
    fallbackAlt,
    loading,
    priority,
    withBlur = true,
    onError: userOnError,
    onLoad: userOnLoad,
    ...rest
  } = props;

  const handleError = (event: unknown) => {
    setDidError(true);
    setIsLoading(false);
    if (typeof userOnError === "function") {
      // @ts-expect-error - Next/Image onError typing is not strict here
      userOnError(event);
    }
  };

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false);
    if (typeof userOnLoad === "function") {
      userOnLoad(event);
    }
  };

  // Reset states when src changes so new URLs can attempt loading
  React.useEffect(() => {
    setDidError(false);
    setIsLoading(true);
  }, [src]);

  if (didError) {
    return (
      <Image
        {...rest}
        src={ERROR_IMG_SRC}
        alt={fallbackAlt ?? "Error loading image"}
        className={cn(
          "duration-700 ease-in-out",
          withBlur && "blur-0 scale-100",
          className
        )}
        loading={loading ?? (priority ? undefined : "lazy")}
        onError={undefined}
        onLoad={() => setIsLoading(false)}
      />
    );
  }

  return (
    <Image
      {...rest}
      src={src}
      alt={alt ?? ""}
      className={cn(
        "duration-700 ease-in-out",
        withBlur && isLoading && "scale-105 blur-sm",
        withBlur && !isLoading && "scale-100 blur-0",
        className
      )}
      loading={loading ?? (priority ? undefined : "lazy")}
      onError={handleError}
      onLoad={handleLoad}
    />
  );
}
