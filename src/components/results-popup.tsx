"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PopupDataWithUrls } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ResultsPopupProps {
  type: string;
}

export function ResultsPopup({ type }: ResultsPopupProps) {
  const [popupData, setPopupData] = useState<PopupDataWithUrls | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        // Check if user has already seen the popup for this specific search
        const contract = searchParams.get("contract") ?? "sale"; // Default to sale if not specified
        const popupKey = `results-popup-seen-${type}-${contract}`;
        const hasSeenPopup = localStorage.getItem(popupKey);

        if (hasSeenPopup) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `/api/popup/results?type=${type}&contract=${contract}`
        );

        if (response.ok) {
          const data = (await response.json()) as PopupDataWithUrls;

          if (data?.imageUrl && data?.linkUrl) {
            setPopupData(data);
            setIsOpen(true);
            // Mark popup as seen for this specific search
            localStorage.setItem(popupKey, "true");
          }
        }
      } catch (error) {
        console.error("Failed to fetch popup data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure the page is fully loaded
    const timer = setTimeout(() => void fetchPopup(), 1000);
    return () => clearTimeout(timer);
  }, [type, searchParams]);

  if (isLoading || !popupData) {
    return null;
  }

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-full overflow-hidden p-0 lg:max-w-3xl">
          <DialogHeader className="p-0">
            <div className="relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={popupData.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block cursor-pointer"
                  >
                    <Image
                      src={popupData.imageUrl}
                      alt={popupData.alt}
                      width={400}
                      height={300}
                      className="h-auto w-full object-cover transition-opacity hover:opacity-95"
                      priority
                    />
                    <DialogTitle className="sr-only absolute right-0 bottom-0 left-0 bg-black/70 p-4 text-sm text-white">
                      {popupData.title}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                      Click to visit {popupData.title}. Opens in a new window.
                    </DialogDescription>
                  </Link>
                </TooltipTrigger>
                <TooltipContent className="z-[150]">
                  <p>{popupData.alt}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
