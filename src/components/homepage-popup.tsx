"use client";

import { useEffect, useState, useRef } from "react";
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
import { logError } from "@/lib/logger";
import type { PopupDataWithUrls } from "@/types";

export function HomepagePopup() {
  const [popupData, setPopupData] = useState<PopupDataWithUrls | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const linkRef = useRef<HTMLAnchorElement>(null);

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
          const data = (await response.json()) as PopupDataWithUrls;

          if (data?.imageUrl && data?.linkUrl) {
            setPopupData(data);
            setIsOpen(true);
            // Mark popup as seen
            localStorage.setItem("homepage-popup-seen", "true");
          }
        }
      } catch (error) {
        logError("Failed to fetch popup data", error, { component: "HomepagePopup" });
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to ensure the page is fully loaded
    const timer = setTimeout(() => void fetchPopup(), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Focus management when dialog opens
  useEffect(() => {
    if (isOpen && linkRef.current) {
      // Focus the link when dialog opens for keyboard accessibility
      const focusTimeout = setTimeout(() => {
        linkRef.current?.focus();
      }, 100);
      return () => clearTimeout(focusTimeout);
    }
  }, [isOpen]);

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
                    ref={linkRef}
                    href={popupData.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                    aria-describedby="popup-description"
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
                    <div id="popup-description" className="sr-only">
                      Click to visit {popupData.title}. Opens in a new window.
                    </div>
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
