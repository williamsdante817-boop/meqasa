"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { buildRichInnerHtml } from "@/lib/utils";

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

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (loading) {
    return (
      <section className="hidden lg:block" aria-label="Loading featured items">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6 sm:grid-rows-4">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className={`
                bg-gray-100 animate-pulse rounded-lg
                ${index === 0 ? "sm:col-span-3 sm:row-span-2 h-48" : ""}
                ${index === 1 ? "sm:col-span-3 sm:row-span-2 h-48" : ""}
                ${index === 2 ? "sm:col-start-4 sm:col-span-3 sm:row-start-1 sm:row-span-4 h-[450px]" : ""}
              `}
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
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
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
        className="grid grid-cols-1 gap-4 sm:grid-cols-6 sm:grid-rows-4 h-full"
        role="grid"
      >
        {/* First placeholder item */}
        <Card className="sm:col-span-3 sm:row-span-2 overflow-hidden h-60 rounded-lg">
          <a
            href="https://www.thorpe-bedu.com/belton-residences/"
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            <picture className="block h-full">
              <source
                type="image/webp"
                srcSet="https://dve7rykno93gs.cloudfront.net/pieoq/1572277987.webp"
              />
              <source
                type="image/jpeg"
                srcSet="https://dve7rykno93gs.cloudfront.net/pieoq/1572277987"
              />
              <img
                src="https://dve7rykno93gs.cloudfront.net/pieoq/1572277987"
                alt="Belton Residences - Selling Fast"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </picture>
          </a>
        </Card>

        {/* Flexi banner in the middle position */}
        <Card className="sm:col-span-3 sm:row-span-2 overflow-hidden h-60 rounded-lg">
          <div className="w-full h-full [&>*]:w-full [&>*]:h-full [&>img]:object-cover [&>img]:w-full [&>img]:h-full">
            <a
              href="/follow-ad-2502?u=https://meqasa.com/1-bedroom-apartment-for-sale-in-nungua-unit-3222"
              target="_blank"
              className="block h-full"
            >
              <picture className="block h-full">
                <source
                  type="image/webp"
                  srcSet="https://dve7rykno93gs.cloudfront.net/pieoq/1649141906.webp"
                />
                <source
                  type="image/jpeg"
                  srcSet="https://dve7rykno93gs.cloudfront.net/pieoq/1649141906"
                />
                <img
                  src="https://dve7rykno93gs.cloudfront.net/pieoq/1649141906"
                  alt="1 & 2 Beachview Bedroom Apartments & Penthouses for Sale Maritime Road Nungua"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </picture>
            </a>
          </div>
        </Card>

        {/* Last placeholder item */}
        <Card
          className="sm:col-start-4 sm:col-span-3 sm:row-start-1 sm:row-span-4 overflow-hidden h-full rounded-lg"
          dangerouslySetInnerHTML={buildRichInnerHtml(flexiBanner)}
        />
      </div>
    </section>
  );
}
