"use client";

import React from "react";
import Image from "next/image";
import type { ComponentProps } from "react";

const ERROR_IMG_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

export type ImageWithFallbackProps = ComponentProps<typeof Image> & {
  fallbackAlt?: string;
};

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = React.useState(false);

  const {
    src,
    alt,
    fallbackAlt,
    loading,
    priority,
    onError: userOnError,
    ...rest
  } = props;

  const handleError = (event: unknown) => {
    setDidError(true);
    if (typeof userOnError === "function") {
      // Call the consumer's onError after toggling fallback state
      // @ts-expect-error - Next/Image onError typing is not strict here
      userOnError(event);
    }
  };

  // Reset error state when src changes so new URLs can attempt loading
  React.useEffect(() => {
    setDidError(false);
  }, [src]);

  if (didError) {
    return (
      <Image
        {...rest}
        src={ERROR_IMG_SRC}
        alt={fallbackAlt ?? "Error loading image"}
        loading={loading ?? (priority ? undefined : "lazy")}
        onError={undefined}
      />
    );
  }

  return (
    <Image
      {...rest}
      src={src}
      alt={alt ?? ""}
      loading={loading ?? (priority ? undefined : "lazy")}
      onError={handleError}
    />
  );
}
