"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
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

export function HomepagePopup() {
  const [popupData, setPopupData] = useState<PopupDataWithUrls | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        // Check if user has already seen the popup
        const hasSeenPopup = localStorage.getItem("homepage-popup-seen");
        if (hasSeenPopup) {
          setIsLoading(false);
          return;
        }

        const response = await fetch("/api/popup/homepage");

        if (response.ok) {
          const data = await response.json();

          if (data && data.imageUrl && data.linkUrl) {
            setPopupData(data);
            setIsOpen(true);
            // Mark popup as seen
            localStorage.setItem("homepage-popup-seen", "true");
          }
        }
      } catch (error) {
        console.error("Failed to fetch popup data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure the page is fully loaded
    const timer = setTimeout(fetchPopup, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !popupData) {
    return null;
  }

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-full lg:max-w-3xl p-0 overflow-hidden">
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
                      className="w-full h-auto object-cover hover:opacity-95 transition-opacity"
                      priority
                    />
                    <DialogTitle className="sr-only absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 text-sm">
                      {popupData.title}
                    </DialogTitle>
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
