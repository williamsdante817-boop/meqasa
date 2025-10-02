"use client";

import { buildRichInnerHtml } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Card } from "./ui/card";

interface GridAdProps {
  flexiBanner: string;
  loading?: boolean;
  error?: string;
}

/**
 * GridAd Component
 *
 * A responsive grid layout component that displays a flexi banner in a visually appealing grid.
 * Supports loading states and error handling.
 *
 * @component
 * @param {GridAdProps} props - Component props
 * @param {string} props.flexiBanner - HTML content for the flexi banner
 * @param {boolean} [props.loading] - Loading state of the component
 * @param {string} [props.error] - Error message to display if any
 */
export default function GridAd({
  flexiBanner,
  loading = false,
  error,
}: GridAdProps) {
  const [mounted, setMounted] = useState(false);
  const [image1Loaded, setImage1Loaded] = useState(false);
  const [image2Loaded, setImage2Loaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Enhanced blur placeholder for better UX
  const blurDataURL =
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAMGBP/EACAQAAEDBAICAwAAAAAAAAAAAAECAwQABREGEiExE1HB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAL/xAAYEQEBAQEBAAAAAAAAAAAAAAAAARECEv/aAAwDAQACEQMRAD8A0kup7jLkSktFTqXW4VBwKS2qCWlOKGCUp3BsEjJOD6nVZ/q67kJhp1oYfBBVyCrwB4lfX0o1HqVPUC9TSLsGkKJU0pClJ1gDPJORz4z2BI6bTEMStqRIebTKUVv5S2ppOSCCdoJI+p8fY+oj7z/2Q==";

  if (!mounted) return null;

  if (loading) {
    return (
      <section className="hidden lg:block" aria-label="Loading featured items">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6 sm:grid-rows-4">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className={`animate-pulse rounded-lg bg-gray-100 ${index === 0 ? "h-48 sm:col-span-3 sm:row-span-2" : ""} ${index === 1 ? "h-48 sm:col-span-3 sm:row-span-2" : ""} ${index === 2 ? "h-[450px] sm:col-span-3 sm:col-start-4 sm:row-span-4 sm:row-start-1" : ""} `}
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="hidden lg:block"
        aria-label="Error loading featured items"
      >
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          <p className="font-medium">Error loading featured items</p>
          <p className="text-sm">{error}</p>
        </div>
      </section>
    );
  }

  console.log(flexiBanner);

  return (
    <section className="hidden lg:block" aria-label="Featured items grid">
      <div
        className="grid h-full grid-cols-1 gap-4 sm:grid-cols-6 sm:grid-rows-4"
        role="grid"
      >
        {/* First placeholder item */}
        <Card className="relative h-60 overflow-hidden rounded-lg sm:col-span-3 sm:row-span-2">
          <a
            href="https://www.thorpe-bedu.com/belton-residences/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative block h-full"
          >
            <Image
              src="https://dve7rykno93gs.cloudfront.net/pieoq/1572277987"
              alt="Belton Residences - Selling Fast"
              fill
              className={`object-cover transition-all duration-700 ${
                image1Loaded ? "blur-0 opacity-100" : "opacity-90 blur-sm"
              }`}
              placeholder="blur"
              blurDataURL={blurDataURL}
              onLoad={() => setImage1Loaded(true)}
              onError={() => setImage1Loaded(true)} // Show image even if there's an error
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Show blur background while loading */}
            {!image1Loaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200" />
            )}
          </a>
        </Card>

        {/* Flexi banner in the middle position */}
        <Card className="relative h-60 overflow-hidden rounded-lg sm:col-span-3 sm:row-span-2">
          <a
            href="/follow-ad-2502?u=https://meqasa.com/1-bedroom-apartment-for-sale-in-nungua-unit-3222"
            target="_blank"
            className="relative block h-full"
          >
            <Image
              src="https://dve7rykno93gs.cloudfront.net/pieoq/1572277987"
              alt="Belton Residences - Premium Properties"
              fill
              className={`object-cover transition-all duration-700 ${
                image2Loaded ? "blur-0 opacity-100" : "opacity-90 blur-sm"
              }`}
              placeholder="blur"
              blurDataURL={blurDataURL}
              onLoad={() => setImage2Loaded(true)}
              onError={() => setImage2Loaded(true)} // Show image even if there's an error
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Show blur background while loading */}
            {!image2Loaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200" />
            )}
          </a>
        </Card>

        {/* Last placeholder item */}
        <Card
          className="h-full overflow-hidden rounded-lg sm:col-span-3 sm:col-start-4 sm:row-span-4 sm:row-start-1"
          dangerouslySetInnerHTML={buildRichInnerHtml(flexiBanner)}
        />
      </div>
    </section>
  );
}
