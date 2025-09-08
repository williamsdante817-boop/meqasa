"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PlaceholderImage } from "@/components/common/placeholder-image";

interface PropertyPlanProps {
  className?: string;
}

export default function PropertyPlan({ className }: PropertyPlanProps) {
  const [imgError, setImgError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn("w-full", className)}>
      <Card className="overflow-hidden rounded-lg">
        <div className="relative h-[300px] md:h-[400px]">
          {!imgError ? (
            <>
              <Image
                src="/plan-4.webp"
                alt="Property floor plan"
                fill
                className={cn(
                  "object-contain transition-opacity duration-300",
                  isLoading ? "opacity-0" : "opacity-100"
                )}
                priority
                onError={() => setImgError(true)}
                onLoad={() => setIsLoading(false)}
              />
              {isLoading && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
              )}
            </>
          ) : (
            <PlaceholderImage
              asChild
              aria-label="Floor plan image placeholder"
            />
          )}
        </div>
      </Card>
    </div>
  );
}
