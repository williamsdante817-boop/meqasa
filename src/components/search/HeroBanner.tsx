"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Card } from "../ui/card";

interface HeroBannerProps {
  src: string;
  href?: string;
  alt?: string;
  ariaLabel?: string;
  priority?: boolean;
}

export function HeroBanner({
  src,
  href,
  alt = "",
  ariaLabel,
  priority = false,
}: HeroBannerProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Enhanced blur placeholder with better quality
  const blurDataURL =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAGABIDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";
  const imageAlt = alt?.trim() ?? "";
  const isDecorative = imageAlt.length === 0;
  const anchorLabel = ariaLabel ?? (isDecorative ? undefined : imageAlt);

  const image = (
    <Image
      src={src}
      alt={imageAlt}
      fill
      className={`object-contain object-center transition-[filter] duration-700 ${
        imageLoaded ? "blur-0" : "blur-lg"
      }`}
      priority={priority}
      sizes="(max-width: 1023px) 0px, (max-width: 1440px) 70vw, 1080px"
      placeholder="blur"
      blurDataURL={blurDataURL}
      onLoad={() => setImageLoaded(true)}
      aria-hidden={isDecorative}
      role={isDecorative ? "presentation" : undefined}
    />
  );

  return (
    <Card className="relative hidden h-[305px] max-h-[305px] overflow-hidden rounded-none border-t-0 border-b bg-transparent lg:block">
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block h-full"
          aria-label={anchorLabel}
        >
          {image}
        </a>
      ) : (
        <div className="relative block h-full" aria-hidden={isDecorative}>
          {image}
        </div>
      )}
    </Card>
  );
}

export function HeroBannerFallback() {
  return (
    <Card className="bg-muted/40 text-muted-foreground relative hidden h-[305px] max-h-[305px] items-center justify-center overflow-hidden rounded-none border-t-0 border-b lg:flex">
      <div className="flex flex-col items-center gap-3 px-8 text-center">
        <p className="text-muted-foreground/70 text-xs tracking-[0.18em] uppercase">
          Promotional Spotlight
        </p>
        <p className="max-w-[36rem] text-sm leading-relaxed">
          Fresh campaign content is on the way. Explore our property listings to
          keep your search moving while we load the latest highlights.
        </p>
        <Link
          href="/search/rent?q=ghana&w=1"
          className="text-brand-primary text-sm font-medium underline-offset-4 hover:underline"
        >
          Browse listings
        </Link>
      </div>
    </Card>
  );
}
