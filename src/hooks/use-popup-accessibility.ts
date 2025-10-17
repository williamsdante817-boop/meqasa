import { useEffect, useId, useRef } from "react";

interface PopupAccessibilityConfig {
  isOpen: boolean;
  focusDelayMs?: number;
}

interface PopupAccessibilityReturn {
  linkRef: React.RefObject<HTMLAnchorElement | null>;
  descriptionId: string;
}

/**
 * Provides shared accessibility helpers for popup dialogs.
 * Ensures focus moves to the primary CTA when the dialog opens
 * and exposes a stable id for the descriptive text.
 */
export function usePopupAccessibility({
  isOpen,
  focusDelayMs = 100,
}: PopupAccessibilityConfig): PopupAccessibilityReturn {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = window.setTimeout(() => {
      linkRef.current?.focus();
    }, focusDelayMs);

    return () => window.clearTimeout(timer);
  }, [isOpen, focusDelayMs]);

  return { linkRef, descriptionId };
}
