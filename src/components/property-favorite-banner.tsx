"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PropertyFavoritesBannerProps {
  propertyId: number;
  propertyType: "listing" | "project";
}

export default function PropertyFavoritesBanner({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  propertyId,
  propertyType,
}: PropertyFavoritesBannerProps) {
  const [filled, setFilled] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Only animate when not hovered
    if (!isHovered) {
      const interval = setInterval(() => {
        setFilled((prev) => !prev);
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const toggleFavorite = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    setFilled(newState); // Keep heart filled when favorited

    if (newState) {
      toast.success("Added to favorites", {
        description: `This ${propertyType} has been added to your favorites`,
        action: {
          label: "Undo",
          onClick: () => {
            setIsFavorite(false);
            setFilled(false);
            toast("Action undone");
          },
        },
      });
    } else {
      toast("Removed from favorites", {
        description: `This ${propertyType} has been removed from your favorites`,
      });
    }
  };

  return (
    <div className="mt-4 w-full py-10">
      <Card className="w-full rounded-lg border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="text-brand-accent mb-2 text-lg font-semibold">
              Save This {propertyType === "listing" ? "Property" : "Project"}
            </h3>
            <p className="text-brand-muted mb-4">
              Add to favorites to compare with other properties and track price
              changes
            </p>
            <div
              className={cn(
                "relative inline-flex cursor-pointer items-center gap-3 rounded-lg border border-rose-200 bg-white px-4 py-3 transition-all hover:shadow-md",
                isFavorite && "border-rose-300 bg-rose-50 shadow-sm",
                "hover:border-rose-300 hover:bg-rose-50"
              )}
              onClick={toggleFavorite}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              role="button"
              tabIndex={0}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <AnimatePresence mode="wait">
                {filled || isFavorite ? (
                  <motion.div
                    key="filled"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart
                      className={cn(
                        "text-brand-primary h-5 w-5",
                        isFavorite && "fill-current"
                      )}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="outline"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Heart className="text-brand-primary h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="text-brand-accent font-medium">
                {isFavorite ? "Added to Favorites!" : "Add to Favorites"}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
