"use client";

import { useCallback, useState } from "react";

const SWIPE_THRESHOLD = 50; // Minimum distance for swipe to trigger navigation

interface UseSwipeNavigationOptions {
  onPrevious: () => void;
  onNext: () => void;
}

export function useSwipeNavigation({
  onPrevious,
  onNext,
}: UseSwipeNavigationOptions) {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.targetTouches[0]) {
      setTouchStart({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      });
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.targetTouches[0]) {
      setTouchEnd({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      });
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontalSwipe && Math.abs(distanceX) > SWIPE_THRESHOLD) {
      if (distanceX > 0) {
        // Swiped left - go to next
        onNext();
      } else {
        // Swiped right - go to previous
        onPrevious();
      }
    }

    // Reset touch states
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, onPrevious, onNext]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
