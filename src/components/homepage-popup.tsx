"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
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

  const storageKey = "homepage-popup";
  const sessionKey = `${storageKey}-session`;
  const cooldownMs = useMemo(() => {
    const envValue = process.env.NEXT_PUBLIC_HOMEPAGE_POPUP_COOLDOWN_MS;
    const parsed = envValue ? Number(envValue) : NaN;
    const fallback = 1000 * 60 * 60 * 24; // 24 hours
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }, []);

  const recordImpression = useCallback(
    (popupId: string) => {
      try {
        const payload = JSON.stringify({ id: popupId, seenAt: Date.now() });
        localStorage.setItem(storageKey, payload);
      } catch (error) {
        logError("Failed to persist homepage popup impression", error, {
          component: "HomepagePopup",
        });
      }

      try {
        sessionStorage.setItem(sessionKey, "true");
      } catch (error) {
        logError(
          "Failed to persist homepage popup session flag",
          error,
          {
            component: "HomepagePopup",
          }
        );
      }
    },
    [sessionKey, storageKey]
  );

  useEffect(() => {
    let cancelled = false;

    const hasSessionImpression = () => {
      try {
        return sessionStorage.getItem(sessionKey) === "true";
      } catch {
        return false;
      }
    };

    const getStoredImpression = (): { id: string; seenAt: number } | null => {
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
    };

    const fetchPopup = async () => {
      try {
        const response = await fetch("/api/popup/homepage", {
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = (await response.json()) as PopupDataWithUrls;

          if (cancelled) return;

          if (data?.imageUrl && data?.linkUrl) {
            const popupId = data.id ?? `${data.imageUrl}|${data.linkUrl}`;
            if (!popupId) {
              return;
            }

            const sessionSeen = hasSessionImpression();
            const lastImpression = getStoredImpression();
            const now = Date.now();
            const withinCooldown =
              lastImpression &&
              lastImpression.id === popupId &&
              now - lastImpression.seenAt < cooldownMs;

            if (sessionSeen || withinCooldown) {
              return;
            }

            recordImpression(popupId);
            setPopupData({ ...data, id: popupId });
            setIsOpen(true);
          }
        }
      } catch (error) {
        logError("Failed to fetch popup data", error, {
          component: "HomepagePopup",
        });
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    const timer = setTimeout(() => {
      void fetchPopup();
    }, 1000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [cooldownMs, recordImpression, sessionKey, storageKey]);

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
        <DialogContent className="max-w-full overflow-hidden p-0 lg:max-w-3xl">
          <DialogHeader className="p-0">
            <div className="relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    ref={linkRef}
                    href={popupData.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block cursor-pointer rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    aria-describedby="popup-description"
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
