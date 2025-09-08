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
    <div className="w-full py-10 mt-4">
      <Card className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-brand-accent mb-2">
              Save This {propertyType === "listing" ? "Property" : "Project"}
            </h3>
            <p className="text-brand-muted mb-4">
              Add to favorites to compare with other properties and track price
              changes
            </p>
            <div
              className={cn(
                "inline-flex items-center gap-3 bg-white border border-rose-200 rounded-lg px-4 py-3 relative cursor-pointer transition-all hover:shadow-md",
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
                        "h-5 w-5 text-brand-primary",
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
                    <Heart className="h-5 w-5 text-brand-primary" />
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="font-medium text-brand-accent">
                {isFavorite ? "Added to Favorites!" : "Add to Favorites"}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
