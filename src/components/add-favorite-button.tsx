"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddFavoriteButtonProps {
  className?: string;
  listingId: number;
  /** Show text label alongside icon for better UX */
  showLabel?: boolean;
  /** Size variant for different contexts */
  size?: "sm" | "md" | "lg";
  /** Hide text label on mobile for better responsive design */
  hideLabelOnMobile?: boolean;
}

export function AddFavoriteButton({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  listingId,
  className,
  showLabel = false,
  size = "md",
  hideLabelOnMobile = true,
}: AddFavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the carousel image click
    e.preventDefault(); // Prevent any navigation

    const newState = !isFavorite;
    setIsFavorite(newState);

    if (newState) {
      toast.success("Added to favorites", {
        description: "This property has been added to your favorites",
        action: {
          label: "Undo",
          onClick: () => {
            setIsFavorite(false);
            toast("Action undone");
          },
        },
      });
    } else {
      toast("Removed from favorites", {
        description: "This property has been removed from your favorites",
      });
    }
  };

  // Size-based styling
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          button: "p-1.5 h-auto w-auto",
          buttonWithLabel: "px-2 py-1.5",
          icon: "h-5 w-5",
          text: "text-xs",
        };
      case "lg":
        return {
          button: "p-3 h-auto w-auto",
          buttonWithLabel: "px-4 py-3",
          icon: "h-10 w-10",
          text: "text-base",
        };
      default: // md
        return {
          button: "p-2 h-auto w-auto",
          buttonWithLabel: "px-3 py-2",
          icon: "h-8 w-8",
          text: "text-sm",
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <Button
      variant="outline"
      onClick={toggleFavorite}
      className={cn(
        // Base button styling
        "focus-visible:ring-primary bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        // Responsive layout classes
        showLabel
          ? cn(
              "flex items-center gap-1 rounded-md sm:gap-2",
              sizeClasses.buttonWithLabel,
              // On mobile: smaller padding, on desktop: normal padding
              hideLabelOnMobile && "sm:px-3 sm:py-2"
            )
          : cn("rounded-full", sizeClasses.button),
        // Favorite state styling
        isFavorite &&
          "text-brand-primary hover:text-brand-primary bg-white hover:bg-white",
        className
      )}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isFavorite}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          sizeClasses.icon,
          "flex-shrink-0 transition-all duration-200",
          isFavorite
            ? "fill-brand-primary text-brand-primary scale-110"
            : "scale-100 text-gray-600"
        )}
        aria-hidden="true"
      />
      {showLabel && (
        <span
          className={cn(
            "font-medium transition-all duration-200",
            sizeClasses.text,
            // Hide text on mobile if hideLabelOnMobile is true
            hideLabelOnMobile && "hidden sm:inline"
          )}
        >
          {isFavorite ? "Saved" : "Save"}
        </span>
      )}
      <span className="sr-only">
        {isFavorite
          ? "Property is in favorites"
          : "Property is not in favorites"}
      </span>
    </Button>
  );
}
