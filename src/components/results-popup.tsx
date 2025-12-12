"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { usePopupAccessibility } from "@/hooks/use-popup-accessibility";
import { logError } from "@/lib/logger";
import type { PopupDataWithUrls } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ResultsPopupProps {
  popupData: PopupDataWithUrls | null;
  type: string;
  contract: string;
}

export function ResultsPopup({ popupData: serverPopupData, type, contract }: ResultsPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  const storageKey = `results-popup-${type}-${contract}`;
  const sessionKey = `${storageKey}-session`;
  const cooldownMs = useMemo(() => {
    const envValue = process.env.NEXT_PUBLIC_RESULTS_POPUP_COOLDOWN_MS;
    const parsed = envValue ? Number(envValue) : NaN;
    const fallback = 1000 * 60 * 60 * 24; // 24 hours (same as homepage)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }, []);

  const { linkRef, descriptionId } = usePopupAccessibility({ isOpen });

  const recordImpression = useCallback(
    (popupId: string) => {
      try {
        const payload = JSON.stringify({ id: popupId, seenAt: Date.now() });
        localStorage.setItem(storageKey, payload);
      } catch (error) {
        logError("Failed to persist results popup impression", error, {
          component: "ResultsPopup",
        });
      }

      try {
        sessionStorage.setItem(sessionKey, "true");
      } catch (error) {
        logError("Failed to persist results popup session flag", error, {
          component: "ResultsPopup",
        });
      }
    },
    [sessionKey, storageKey]
  );

  const hasSessionImpression = useCallback(() => {
    try {
      return sessionStorage.getItem(sessionKey) === "true";
    } catch {
      return false;
    }
  }, [sessionKey]);

  const getStoredImpression = useCallback((): { id: string; seenAt: number } | null => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { id?: string; seenAt?: number };
      if (parsed && typeof parsed.id === "string" && typeof parsed.seenAt === "number") {
        return { id: parsed.id, seenAt: parsed.seenAt };
      }
    } catch {
      // Ignore malformed storage
    }
    return null;
  }, [storageKey]);

  // Check and show popup on mount (client-side only)
  useEffect(() => {
    // No popup data from server
    if (!serverPopupData?.imageUrl || !serverPopupData?.linkUrl) {
      return;
    }

    // Already shown in this session
    if (hasSessionImpression()) {
      return;
    }

    const popupId = serverPopupData.id ?? `${serverPopupData.imageUrl}|${serverPopupData.linkUrl}`;
    if (!popupId) {
      return;
    }

    // Check cooldown
    const lastImpression = getStoredImpression();
    const now = Date.now();
    const withinCooldown =
      lastImpression &&
      lastImpression.id === popupId &&
      now - lastImpression.seenAt < cooldownMs;

    if (withinCooldown) {
      return;
    }

    // Show popup and record impression
    recordImpression(popupId);
    setIsOpen(true);
  }, [
    serverPopupData,
    cooldownMs,
    getStoredImpression,
    hasSessionImpression,
    recordImpression,
  ]);

  // No popup data to display
  if (!serverPopupData) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[90vw] overflow-hidden border-none bg-transparent p-0 shadow-none sm:max-w-[600px]">
        <DialogHeader className="sr-only">
          <DialogTitle>{serverPopupData.title}</DialogTitle>
        </DialogHeader>

        <div className="relative mx-auto w-full overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label="Close advertisement"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          {/* Sponsored Badge */}
          <div className="absolute top-3 left-3 z-10 rounded-full bg-black/30 px-2.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm uppercase tracking-wider">
            Sponsored
          </div>

          <Link
            ref={linkRef}
            href={serverPopupData.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block relative w-full cursor-pointer overflow-hidden bg-gray-100"
            aria-describedby={descriptionId}
            onClick={() => setIsOpen(false)}
          >
            <Image
              src={serverPopupData.imageUrl}
              alt={serverPopupData.alt}
              width={600}
              height={800}
              className="h-auto w-full object-contain transition-transform duration-500 group-hover:scale-105"
              priority
              sizes="(max-width: 640px) 90vw, 600px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            {/* CTA Hint */}
            <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="flex items-center gap-1 rounded-full bg-brand-primary px-3 py-1 text-xs font-semibold text-white shadow-lg">
                Visit Site
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        </div>

        <div id={descriptionId} className="sr-only">
          Click to visit {serverPopupData.title}. Opens in a new window.
        </div>
      </DialogContent>
    </Dialog>
  );
}
