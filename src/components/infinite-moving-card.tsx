"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { buildAgentLogoUrl } from "@/lib/image-utils";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ImageWithFallback } from "./common/image-with-fallback";
import { Card } from "./ui/card";

type Item = {
  imbroker: string;
  first: string;
  name: string;
  name2: string;
};

const SPEEDS: Record<"fast" | "normal" | "slow", string> = {
  fast: "30s",
  normal: "60s",
  slow: "70s",
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

  // Duplicate items only when items array changes
  const doubledItems = useMemo(() => [...items, ...items], [items]);

  // Apply animation duration via CSS var
  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.style.setProperty("--duration", SPEEDS[speed]);
    }
  }, [speed]);

  // Pause/resume animation based on state
  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.style.animationPlayState = isPaused
        ? "paused"
        : "running";
    }
  }, [isPaused]);

  const handleMouseEnter = () => pauseOnHover && setIsPaused(true);
  const handleMouseLeave = () => pauseOnHover && setIsPaused(false);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.code === "Space") {
      event.preventDefault();
      setIsPaused((prev) => !prev);
    }
  };

  if (!items || items.length === 0) {
    return <p>No items available</p>;
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative mb-8 w-full overflow-hidden", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Partner company logos carousel. Press space to pause or resume."
      aria-live="off"
      aria-atomic="false"
      style={{ minHeight: "100%", zIndex: 10 }}
    >
      {/* Visible Pause/Play control for accessibility */}
      <button
        onClick={() => setIsPaused((prev) => !prev)}
        className="sr-only absolute top-2 right-2 z-20 rounded bg-white px-2 py-1 text-xs shadow focus:ring focus:outline-none"
        aria-pressed={isPaused}
      >
        {isPaused ? "Play" : "Pause"}
      </button>

      {/* Scrolling row */}
      <div
        ref={scrollerRef}
        className={cn(
          "animate-marquee-persistent flex gap-4",
          direction === "right" && "animate-marquee-reverse"
        )}
        role="list"
        aria-label={`${items.length} partner companies`}
        style={{ width: "max-content", minWidth: "100%" }}
      >
        {doubledItems.map((item, index) => {
          const imageUrl = buildAgentLogoUrl(item.imbroker);

          return (
            <Card
              key={`${item.first}-${index}`}
              className="h-[120px] w-[120px] flex-shrink-0 overflow-hidden rounded-lg focus:ring focus:outline-none"
              role="listitem"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={`/agents/${item.name}?g=${item.first}`}
                      className="block h-full w-full p-4 transition-colors hover:bg-gray-50 focus:ring focus:outline-none"
                      aria-label={`View details for ${item.name}`}
                    >
                      <div className="flex h-full w-full items-center justify-center">
                        <ImageWithFallback
                          src={imageUrl}
                          alt={item.name}
                          fallbackSrc="/placeholder-image.png"
                          width={100}
                          height={50}
                          sizes="120px"
                          quality={85}
                          className="h-full w-full object-contain"
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
