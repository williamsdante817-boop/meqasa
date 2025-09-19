"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import AppStoreButtons from "./app-store-btn";

export default function AppPromotion() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Use Intersection Observer to detect when component is in viewport
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sectionRef.current) return;
    if (!("IntersectionObserver" in window)) return;

    const element = sectionRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      try {
        observer.unobserve(element);
      } catch {
        // noop
      }
      observer.disconnect();
    };
  }, []);

  // Respect user's reduced-motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", onChange);
    } else if (typeof mediaQuery.addListener === "function") {
      // Deprecated in modern browsers, kept for older browsers
      mediaQuery.addListener(onChange);
    }
    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", onChange);
      } else if (typeof mediaQuery.removeListener === "function") {
        // Deprecated in modern browsers, kept for older browsers
        mediaQuery.removeListener(onChange);
      }
    };
  }, []);

  // Only animate when visible, not hovered, and motion is allowed
  useEffect(() => {
    if (!isVisible || isHovering || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setIsHovering((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible, isHovering, prefersReducedMotion]);

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);

  return (
    <section
      ref={sectionRef}
      id="app-promotion"
      className="border-brand-blue relative mx-auto my-16 max-w-6xl overflow-visible rounded-xl border bg-[#f0f5ff] px-4 py-10 md:px-8 lg:my-32 lg:border-none lg:px-12"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Mobile app promotion"
    >
      <div className="grid items-center md:grid-cols-2">
        <div className="max-w-lg space-y-1 lg:space-y-3">
          <h2 className="text-brand-accent text-xl font-bold md:text-3xl">
            Do more on the app.
          </h2>
          <p className="text-brand-muted text-sm md:text-lg lg:text-base">
            Save your searches, track enquiries and more.
          </p>
          <p className="text-brand-accent text-sm md:text-base lg:text-base">
            Available on iOS and Android
          </p>

          {/* App Store Button */}
          <AppStoreButtons />
        </div>

        <div
          className="absolute -top-24 right-10 hidden h-[150px] overflow-visible md:h-[400px] lg:block"
          aria-hidden="true"
        >
          {/* Featured Properties Phone */}
          <div
            className={`absolute top-[-30px] right-10 z-10 -rotate-6 transform transition-all duration-700 ease-in-out motion-reduce:transform-none motion-reduce:transition-none lg:right-[-20px] ${isHovering ? "translate-y-[-10px]" : "translate-y-[0px]"}`}
            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
          >
            <div
              className="relative h-[200px] w-[100px] overflow-hidden rounded-xl border-8 border-white bg-white shadow-2xl lg:h-[450px] lg:w-[220px] lg:rounded-3xl"
              style={{
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="absolute top-0 left-0 flex h-full w-full flex-col">
                <div className="bg-white p-3">
                  <div className="text-brand-accent origin-top-left -rotate-[1deg] transform text-sm font-semibold">
                    Featured Project Units -{" "}
                    <span className="text-brand-blue">See all</span>
                  </div>
                </div>
                <div className="flex-1 bg-gray-100 p-2">
                  <div className="mb-3 overflow-hidden rounded-lg bg-white">
                    <div className="h-24 bg-gray-200"></div>
                    <div className="p-2">
                      <div className="mb-1 h-2 w-3/4 rounded bg-gray-200"></div>
                      <div className="h-2 w-1/2 rounded bg-gray-200"></div>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-lg bg-white">
                    <div className="h-24 bg-gray-200"></div>
                    <div className="p-2">
                      <div className="mb-1 h-2 w-3/4 rounded bg-gray-200"></div>
                      <div className="h-2 w-1/2 rounded bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Phone reflection/shadow effect */}
            <div
              className="absolute right-[10px] bottom-[-15px] left-[10px] h-[20px] -rotate-6 transform rounded-full bg-black opacity-20 blur-md motion-reduce:transform-none"
              aria-hidden="true"
            ></div>
          </div>

          {/* Search Interface Phone */}
          <div
            className={`absolute top-[20px] right-[100px] z-0 rotate-6 transform transition-all duration-700 ease-in-out motion-reduce:transform-none motion-reduce:transition-none ${isHovering ? "translate-y-[-10px] delay-300" : "translate-y-[0px]"}`}
            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
          >
            <div
              className="relative h-[200px] w-[100px] overflow-hidden rounded-xl border-8 border-white bg-white shadow-2xl lg:h-[450px] lg:w-[220px] lg:rounded-3xl"
              style={{
                boxShadow:
                  "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="absolute top-0 left-0 flex h-full w-full flex-col">
                <div className="bg-white p-3">
                  <div className="mb-2 h-4 w-1/2 rounded bg-gray-200"></div>
                </div>
                <div className="flex-1 bg-gray-100 p-2">
                  <div className="mb-3 rounded-lg bg-white p-3">
                    <div className="mb-2 h-3 w-1/3 rounded bg-gray-200"></div>
                    <div className="mb-3 h-6 rounded bg-gray-200"></div>
                    <div className="mb-2 h-3 w-1/3 rounded bg-gray-200"></div>
                    <div className="mb-3 h-6 rounded bg-gray-200"></div>
                    <div className="mb-3 grid grid-cols-2 gap-2">
                      <div>
                        <div className="mb-2 h-3 w-1/2 rounded bg-gray-200"></div>
                        <div className="h-6 rounded bg-gray-200"></div>
                      </div>
                      <div>
                        <div className="mb-2 h-3 w-1/2 rounded bg-gray-200"></div>
                        <div className="h-6 rounded bg-gray-200"></div>
                      </div>
                    </div>
                    <div className="flex h-10 items-center justify-center rounded bg-[#ff6d84]">
                      <div className="h-3 w-1/3 rounded bg-white"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Phone reflection/shadow effect */}
            <div
              className="absolute right-[10px] bottom-[-15px] left-[10px] h-[20px] rotate-6 transform rounded-full bg-black opacity-20 blur-md motion-reduce:transform-none"
              aria-hidden="true"
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
