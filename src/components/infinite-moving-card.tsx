"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "./ui/card";

// item type
type Item = {
  imbroker: string;
  first: string;
  name: string;
  name2: string;
};

/**
 * Renders a horizontally moving set of cards with optional pause on hover.
 *
 * @param {Object} props - Component props
 * @param {Item[]} props.items - An array of items to display in the cards.
 * @param {"left" | "right"} [props.direction="left"] - The direction of card movement.
 * @param {"fast" | "normal" | "slow"} [props.speed="fast"] - The speed of the card movement.
 * @param {boolean} [props.pauseOnHover=true] - Whether to pause the animation on hover.
 * @param {string} [props.className] - Additional classes for styling the container.
 * @returns {JSX.Element} A React component rendering an infinite moving card animation.
 */

export const InfiniteMovingCards = ({
  items,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: Item[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Set animation duration
  useEffect(() => {
    if (scrollerRef.current) {
      const duration =
        speed === "fast" ? "30s" : speed === "normal" ? "60s" : "70s";
      scrollerRef.current.style.animationDuration = duration;
    }
  }, [speed]);

  // Handle pause/resume
  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.style.animationPlayState = isPaused
        ? "paused"
        : "running";
    }
  }, [isPaused]);

  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false);
    }
  };

  const handleCardClick = (_item: Item) => {
    // The Link should handle navigation automatically
  };

  if (!items || items.length === 0) {
    return <p>No items available</p>;
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full overflow-hidden", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        minHeight: "200px",
        zIndex: 10, // Ensure it's above other elements
      }}
    >
      {/* Scrolling container */}
      <div
        ref={scrollerRef}
        className="flex gap-4 py-8 animate-marquee"
        style={{
          width: "max-content",
          minWidth: "100%",
          // Fallback animation if Tailwind doesn't work
          animation:
            scrollerRef.current?.style.animation ??
            "marquee 60s linear infinite",
        }}
      >
        {/* Duplicate items for seamless loop */}
        {[...items, ...items].map((item, index) => {
          const imageUrl = item.imbroker
            ? `https://dve7rykno93gs.cloudfront.net/fascimos/somics/${item.imbroker}`
            : "/default-image.jpg";

          return (
            <Card
              key={`${item.first}-${index}`}
              className="flex-shrink-0 w-[120px] h-[120px] rounded-lg overflow-hidden"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/agents/${item.name}?g=${item.first}`}
                      className="block w-full h-full p-4 hover:bg-gray-50 transition-colors"
                      aria-label={`View details for ${item.name}`}
                      onClick={() => {
                        handleCardClick(item);
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <OptimizedAgentLogo
                          src={imageUrl}
                          alt={item.name}
                          fallbackSrc="/default-image.jpg"
                        />
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// Optimized Agent Logo Component
interface OptimizedAgentLogoProps {
  src: string;
  alt: string;
  fallbackSrc: string;
}

const OptimizedAgentLogo: React.FC<OptimizedAgentLogoProps> = ({
  src,
  alt,
  fallbackSrc,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  // Reset state when src changes
  React.useEffect(() => {
    setCurrentSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  return (
    <div className="relative w-full h-full">
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-md" />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 rounded-md flex items-center justify-center">
          <div className="text-gray-400 text-xs text-center">
            <div className="w-8 h-8 mx-auto mb-1 bg-gray-200 rounded-md flex items-center justify-center">
              <span className="text-gray-400">?</span>
            </div>
            <span>Logo unavailable</span>
          </div>
        </div>
      )}

      {/* Optimized image */}
      <Image
        src={currentSrc}
        alt={alt}
        width={100}
        height={50}
        className={cn(
          "h-full w-full object-contain transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
        )}
        onLoad={handleLoad}
        onError={handleError}
        priority={false}
        sizes="120px"
        quality={85}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxAAPwCdABmX/9k="
      />
    </div>
  );
};
