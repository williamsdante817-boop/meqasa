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
import { useCallback, useEffect, useMemo, useState } from "react";

interface ResultsPopupProps {
  type: string;
}

export function ResultsPopup({ type }: ResultsPopupProps) {
  const [popupData, setPopupData] = useState<PopupDataWithUrls | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  const contract = searchParams.get("contract") ?? "sale";

  const { storageKey, sessionKey } = useMemo(() => {
    const baseKey = `results-popup-${type}-${contract}`;
    return {
      storageKey: baseKey,
      sessionKey: `${baseKey}-session`,
    };
  }, [type, contract]);

  const cooldownMs = useMemo(() => {
    const envValue = process.env.NEXT_PUBLIC_RESULTS_POPUP_COOLDOWN_MS;
    const parsed = envValue ? Number(envValue) : NaN;
    const fallback = 1000 * 60 * 60 * 48; // 48 hours
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }, []);

  const recordImpression = useCallback(
    (popupId: string) => {
      try {
        const payload = JSON.stringify({ id: popupId, seenAt: Date.now() });
        localStorage.setItem(storageKey, payload);
      } catch (error) {
        console.warn("Failed to persist popup impression", error);
      }

      try {
        sessionStorage.setItem(sessionKey, "true");
      } catch (error) {
        console.warn("Failed to persist session popup impression", error);
      }
    },
    [storageKey, sessionKey]
  );

  useEffect(() => {
    let cancelled = false;

    const shouldSkipForSession = () => {
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
        // ignore malformed storage
      }
      return null;
    };

    const fetchPopup = async () => {
      try {
        const response = await fetch(
          `/api/popup/results?type=${type}&contract=${contract}`,
          { cache: "no-store" }
        );

        if (response.ok) {
          const data = (await response.json()) as PopupDataWithUrls;

          if (cancelled) return;

          if (data?.imageUrl && data?.linkUrl) {
            const popupId = data.id ?? `${data.imageUrl}|${data.linkUrl}`;

            if (!popupId) {
              return;
            }

            const lastImpression = getStoredImpression();
            const now = Date.now();
            const sessionSeen = shouldSkipForSession();
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
        console.error("Failed to fetch popup data:", error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    // Add a small delay to ensure the page is fully loaded
    const timer = setTimeout(() => {
      void fetchPopup();
    }, 1000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [type, contract, storageKey, sessionKey, cooldownMs, recordImpression]);

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
