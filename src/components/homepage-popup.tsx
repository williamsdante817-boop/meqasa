"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { usePopupAccessibility } from "@/hooks/use-popup-accessibility";
import { useResilientFetch } from "@/hooks/use-resilient-fetch";

export function HomepagePopup() {
  const [popupData, setPopupData] = useState<PopupDataWithUrls | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const hasFetchedRef = useRef(false);

  const storageKey = "homepage-popup";
  const sessionKey = `${storageKey}-session`;
  const cooldownMs = useMemo(() => {
    const envValue = process.env.NEXT_PUBLIC_HOMEPAGE_POPUP_COOLDOWN_MS;
    const parsed = envValue ? Number(envValue) : NaN;
    const fallback = 1000 * 60 * 60 * 24; // 24 hours
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }, []);

  const { linkRef, descriptionId } = usePopupAccessibility({ isOpen });

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
        logError("Failed to persist homepage popup session flag", error, {
          component: "HomepagePopup",
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

  const popupRequestInit = useMemo<RequestInit>(
    () => ({
      headers: {
        "Content-Type": "application/json",
      },
    }),
    []
  );

  const { data, error, loading } = useResilientFetch<PopupDataWithUrls>({
    input: "/api/popup/homepage",
    init: popupRequestInit,
    enabled: shouldFetch,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (hasFetchedRef.current || hasSessionImpression()) {
        return;
      }
      setShouldFetch(true);
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [hasSessionImpression]);

  useEffect(() => {
    if (!error) {
      return;
    }

    logError("Failed to fetch popup data", error, {
      component: "HomepagePopup",
    });
    setShouldFetch(false);
    hasFetchedRef.current = true;
  }, [error]);

  useEffect(() => {
    if (!data || hasFetchedRef.current) {
      return;
    }

    hasFetchedRef.current = true;
    setShouldFetch(false);

    if (!data.imageUrl || !data.linkUrl) {
      return;
    }

    const popupId = data.id ?? `${data.imageUrl}|${data.linkUrl}`;
    if (!popupId) {
      return;
    }

    if (hasSessionImpression()) {
      return;
    }

    const lastImpression = getStoredImpression();
    const now = Date.now();
    const withinCooldown =
      lastImpression &&
      lastImpression.id === popupId &&
      now - lastImpression.seenAt < cooldownMs;

    if (withinCooldown) {
      return;
    }

    recordImpression(popupId);
    setPopupData({ ...data, id: popupId });
    setIsOpen(true);
  }, [
    cooldownMs,
    data,
    getStoredImpression,
    hasSessionImpression,
    recordImpression,
  ]);

  const isLoading = shouldFetch && loading;

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
                    className="block cursor-pointer rounded-lg outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:shadow-lg"
                    aria-describedby={descriptionId}
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
                    <div id={descriptionId} className="sr-only">
                      Click to visit {popupData.title}. Opens in a new window.
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Opens in a new window</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
