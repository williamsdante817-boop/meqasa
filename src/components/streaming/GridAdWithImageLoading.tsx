"use client";

import { useState, useEffect } from "react";
import GridAd from "@/components/grid-ad";
import { GridBannerSkeleton } from "./GridBannerSkeleton";

interface GridAdWithImageLoadingProps {
  flexiBanner: string;
}

export function GridAdWithImageLoading({
  flexiBanner,
}: GridAdWithImageLoadingProps) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Extract image URLs from flexi banner HTML
    const extractImageUrls = (html: string): string[] => {
      const imgRegex = /src="([^"]+)"/g;
      const urls: string[] = [];
      let match;

      while ((match = imgRegex.exec(html)) !== null) {
        urls.push(match[1]);
      }

      return urls;
    };

    // Create a list of image URLs to preload
    const staticImageUrls = [
      "https://dve7rykno93gs.cloudfront.net/pieoq/1572277987.webp",
      "https://dve7rykno93gs.cloudfront.net/pieoq/1649141906.webp",
    ];

    const flexiBannerImageUrls = extractImageUrls(flexiBanner);
    const allImageUrls = [...staticImageUrls, ...flexiBannerImageUrls];

    let loadedCount = 0;
    const totalImages = allImageUrls.length;

    const checkAllImagesLoaded = () => {
      loadedCount++;
      if (loadedCount >= totalImages) {
        // Add a small delay to ensure smooth transition
        setTimeout(() => setImagesLoaded(true), 100);
      }
    };

    // Preload images
    allImageUrls.forEach((url) => {
      const img = new Image();
      img.onload = checkAllImagesLoaded;
      img.onerror = checkAllImagesLoaded; // Continue even if some images fail
      img.src = url;
    });

    // Fallback: if no images are loaded after 3 seconds, show content anyway
    const fallbackTimer = setTimeout(() => {
      setImagesLoaded(true);
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, [mounted, flexiBanner]);

  if (!mounted || !imagesLoaded) {
    return <GridBannerSkeleton />;
  }

  return <GridAd flexiBanner={flexiBanner} />;
}
