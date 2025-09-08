import { useEffect, useState, type RefObject } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  options: UseIntersectionObserverOptions = {}
): boolean {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = "0px",
    freezeOnceVisible = false,
  } = options;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    // Return early if element doesn't exist or IntersectionObserver isn't supported
    if (!element || typeof IntersectionObserver === "undefined") {
      return;
    }

    // If frozen and already visible, don't observe again
    if (freezeOnceVisible && isVisible) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          const isElementVisible = entry.isIntersecting;
          setIsVisible(isElementVisible);

          // If we want to freeze once visible and element is now visible,
          // we can disconnect the observer
          if (freezeOnceVisible && isElementVisible) {
            observer.unobserve(element);
          }
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, threshold, root, rootMargin, freezeOnceVisible, isVisible]);

  return isVisible;
}
