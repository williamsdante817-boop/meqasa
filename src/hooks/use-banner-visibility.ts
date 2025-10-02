"use client";

import { useEffect, useState } from "react";

interface BannerVisibilityOptions {
  storageKey: string;
  bannerId: string;
  coolDownMs?: number;
}

const DEFAULT_COOLDOWN = 6 * 60 * 60 * 1000; // 6 hours

export function useBannerVisibility({
  storageKey,
  bannerId,
  coolDownMs = DEFAULT_COOLDOWN,
}: BannerVisibilityOptions) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(storageKey);
      if (!stored) {
        setIsVisible(true);
        return;
      }

      const record = JSON.parse(stored) as {
        id: string;
        seenAt: number;
      };

      const sameBanner = record.id === bannerId;
      const withinCooldown = Date.now() - record.seenAt < coolDownMs;

      setIsVisible(!(sameBanner && withinCooldown));
    } catch {
      setIsVisible(true);
    }
  }, [storageKey, bannerId, coolDownMs]);

  const markAsSeen = () => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ id: bannerId, seenAt: Date.now() })
      );
    } catch {
      // ignore storage errors
    }
  };

  return { isVisible, markAsSeen };
}
