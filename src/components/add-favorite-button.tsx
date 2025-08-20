"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AddFavoriteButtonProps {
  className?: string;
  listingId: number;
}

export function AddFavoriteButton({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  listingId,
  className,
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

  return (
    <Button
      variant="outline"
      onClick={toggleFavorite}
      className={cn(
        "p-2 h-auto w-auto rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:outline-none",
        isFavorite &&
          "bg-white text-brand-primary hover:text-brand-primary hover:bg-white",
        className,
      )}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          "h-8 w-8 transition-colors",
          isFavorite
            ? "fill-brand-primary text-brand-primary"
            : "text-gray-600",
        )}
      />
    </Button>
  );
}
