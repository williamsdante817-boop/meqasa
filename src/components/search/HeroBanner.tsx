"use client";

import Image from "next/image";
import { Card } from "../ui/card";
import { useState } from "react";

interface HeroBannerProps {
  src: string;
  href: string;
  alt?: string;
}

export function HeroBanner({
  src,
  href,
  alt = "Hero banner",
}: HeroBannerProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Enhanced blur placeholder with better quality
  const blurDataURL =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAGABIDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";
  return (
    <Card className="relative hidden h-[305px] max-h-[305px] overflow-hidden rounded-none border-t-0 border-b lg:block">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block h-full"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={`object-contain object-center transition-all duration-700 ${
            imageLoaded ? "blur-0 opacity-100" : "opacity-90 blur-sm"
          }`}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          placeholder="blur"
          blurDataURL={blurDataURL}
          onLoad={() => setImageLoaded(true)}
        />
      </a>
    </Card>
  );
}
