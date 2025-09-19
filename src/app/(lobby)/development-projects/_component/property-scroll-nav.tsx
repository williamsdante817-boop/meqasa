import { cn } from "@/lib/utils";
import { BuildingIcon, LayoutIcon, MapIcon, MapPinIcon } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Shell from "@/layouts/shell";
import BrochureButton from "./brochure-button";

type SectionRefs = Record<string, React.RefObject<HTMLDivElement | null>>;

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface PropertyScrollNavProps {
  sectionRefs: SectionRefs;
}

function PropertyScrollNavComponent({ sectionRefs }: PropertyScrollNavProps) {
  const [activeSection, setActiveSection] = useState("floor-plan");
  const [isSticky, setIsSticky] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const mainNavHeight = 64; // Height of main navigation in pixels
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Memoize nav items to prevent unnecessary re-renders
  const navItems: NavItem[] = useMemo(
    () => [
      {
        id: "site-plan",
        label: "Site Plan",
        icon: <MapIcon className="h-5 w-5" />,
      },
      {
        id: "floor-plan",
        label: "Floor Plan",
        icon: <LayoutIcon className="h-5 w-5" />,
      },
      {
        id: "location",
        label: "Location",
        icon: <MapPinIcon className="h-5 w-5" />,
      },
      {
        id: "available-units",
        label: "Available Units",
        icon: <BuildingIcon className="h-5 w-5" />,
      },
    ],
    []
  );

  // Enhanced scroll to section function with better error handling
  const scrollToSection = useCallback(
    (sectionId: string) => {
      try {
        const section = sectionRefs[sectionId]?.current;

        if (!section) {
          console.warn(`PropertyScrollNav: Section '${sectionId}' not found`);
          // Fallback: try to find section by ID in DOM
          const domSection = document.getElementById(sectionId);
          if (!domSection) {
            return;
          }

          // Use DOM element as fallback
          const rect = domSection.getBoundingClientRect();
          const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
          const propertyNavHeight = navRef.current?.offsetHeight ?? 64;
          const totalNavHeight = mainNavHeight + propertyNavHeight;
          const targetTop = rect.top + scrollTop - totalNavHeight;

          setIsScrolling(true);
          setActiveSection(sectionId);

          window.scrollTo({
            top: Math.max(0, targetTop),
            behavior: "smooth",
          });

          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
          }

          scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
          }, 800);

          return;
        }

        // Account for both navigation heights
        const propertyNavHeight = navRef.current?.offsetHeight ?? 64;
        const totalNavHeight = mainNavHeight + propertyNavHeight;

        // Get the section's position relative to the document
        const sectionRect = section.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const sectionTop = sectionRect.top + scrollTop - totalNavHeight;

        // Immediately update active section to provide visual feedback
        setActiveSection(sectionId);
        setIsScrolling(true);

        // Scroll to the section with bounds checking
        const targetTop = Math.max(0, sectionTop);
        const maxScrollTop = Math.max(
          0,
          document.documentElement.scrollHeight - window.innerHeight
        );
        const finalScrollTop = Math.min(targetTop, maxScrollTop);

        window.scrollTo({
          top: finalScrollTop,
          behavior: "smooth",
        });

        // Clear scrolling state after animation with shorter timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 800); // Reduced from 1000ms for better responsiveness
      } catch (error) {
        console.error("PropertyScrollNav: Error scrolling to section:", error);
        setIsScrolling(false); // Ensure we don't get stuck in scrolling state
      }
    },
    [sectionRefs, mainNavHeight]
  );

  // Handle scroll event to detect when nav becomes sticky
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        const navRect = navRef.current.getBoundingClientRect();
        setIsSticky(navRect.top <= mainNavHeight);
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledHandleScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, [mainNavHeight]);

  // Set up intersection observer to detect active section
  useEffect(() => {
    if (!navRef.current) return;

    // Calculate fixed root margin to avoid recreation
    const navHeight = navRef.current.offsetHeight || 64;
    const totalNavHeight = mainNavHeight + navHeight;

    const observerOptions = {
      rootMargin: `-${totalNavHeight}px 0px -50% 0px`,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    let ticking = false;
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (ticking) return;

      ticking = true;
      requestAnimationFrame(() => {
        // Skip updates during programmatic scrolling
        if (isScrolling) {
          ticking = false;
          return;
        }

        // Find the most visible section
        let mostVisibleSection = "";
        let maxVisibility = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxVisibility) {
            mostVisibleSection = entry.target.id;
            maxVisibility = entry.intersectionRatio;
          }
        });

        // Fallback: if no section is intersecting, find the closest one
        if (!mostVisibleSection) {
          const scrollY = window.scrollY;
          let closestSection = "";
          let minDistance = Infinity;

          Object.entries(sectionRefs).forEach(([sectionId, ref]) => {
            if (ref.current) {
              const rect = ref.current.getBoundingClientRect();
              const sectionTop = rect.top + scrollY;
              const distance = Math.abs(sectionTop - scrollY - totalNavHeight);

              if (distance < minDistance) {
                minDistance = distance;
                closestSection = sectionId;
              }
            }
          });

          mostVisibleSection = closestSection;
        }

        if (mostVisibleSection) {
          setActiveSection(mostVisibleSection);
        }

        ticking = false;
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    // Observe all sections with error handling
    const observedElements: Element[] = [];
    Object.entries(sectionRefs).forEach(([sectionId, ref]) => {
      if (ref.current) {
        observer.observe(ref.current);
        observedElements.push(ref.current);
      } else {
        console.warn(`PropertyScrollNav: Section '${sectionId}' ref is null`);
      }
    });

    // Initial active section detection
    if (observedElements.length > 0 && !activeSection) {
      const scrollY = window.scrollY;
      let initialSection = navItems[0]?.id ?? "site-plan"; // Default to first section

      Object.entries(sectionRefs).forEach(([sectionId, ref]) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const sectionTop = rect.top + scrollY;

          if (sectionTop <= scrollY + totalNavHeight + 100) {
            initialSection = sectionId;
          }
        }
      });

      setActiveSection(initialSection);
    }

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionRefs, mainNavHeight, navItems, activeSection]);

  // Auto-scroll active navigation item into view with error handling
  useEffect(() => {
    if (!activeSection || !navRef.current) return;
    try {
      const activeButton = navRef.current?.querySelector(
        `[data-section="${activeSection}"]`
      );
      // Use ! assertion to remove null and undefined from the type
      // This tells TypeScript we expect navRef.current to be non-null here
      // (since we already checked above)
      // No runtime change, just more succinct typing
      // Example: navRef.current!.querySelector(...)
      if (activeButton && typeof activeButton.scrollIntoView === "function") {
        // Check if the element is not already in view
        const containerRect = navRef.current.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        const isInView =
          buttonRect.left >= containerRect.left &&
          buttonRect.right <= containerRect.right;

        if (!isInView) {
          activeButton.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
    } catch (error) {
      console.warn(
        "PropertyScrollNav: Error scrolling nav item into view:",
        error
      );
    }
  }, [activeSection]);

  // Enhanced cleanup on unmount with error boundary
  useEffect(() => {
    // Validate navigation items on mount
    const missingNavItems = navItems.filter((item) => !sectionRefs[item.id]);
    if (missingNavItems.length > 0) {
      console.warn(
        "PropertyScrollNav: Missing section refs for:",
        missingNavItems.map((item) => item.id)
      );
    }

    // Setup error handler for scroll events
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes("PropertyScrollNav")) {
        console.error("PropertyScrollNav: Unhandled error:", event.error);
      }
    };

    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    };
  }, [navItems, sectionRefs]);

  // Enhanced keyboard navigation with arrow key support
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, sectionId: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        scrollToSection(sectionId);
        return;
      }

      // Arrow key navigation
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        const currentIndex = navItems.findIndex(
          (item) => item.id === activeSection
        );
        if (currentIndex === -1) return;

        const nextIndex =
          e.key === "ArrowRight"
            ? Math.min(currentIndex + 1, navItems.length - 1)
            : Math.max(currentIndex - 1, 0);

        const nextSection = navItems[nextIndex];
        if (nextSection) {
          scrollToSection(nextSection.id);

          // Focus the next button
          setTimeout(() => {
            const nextButton = navRef.current!.querySelector(
              `[data-section="${nextSection.id}"]`
            )!;
            (nextButton as HTMLButtonElement)?.focus();
          }, 100);
        }
      }
    },
    [scrollToSection, navItems, activeSection]
  );

  return (
    <nav
      ref={navRef}
      role="navigation"
      aria-label="Property sections navigation"
      aria-describedby="nav-instructions"
      className={cn(
        "sticky top-16 z-10 w-full border-y bg-white transition-all duration-200",
        isSticky && "shadow-md"
      )}
    >
      {/* Screen reader instructions */}
      <div id="nav-instructions" className="sr-only">
        Use arrow keys to navigate between sections, Enter or Space to jump to
        section. Current active section:{" "}
        {navItems.find((item) => item.id === activeSection)?.label ?? "None"}
      </div>
      <Shell>
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "scrollbar-hide flex touch-pan-x overflow-x-auto",
                "w-full md:w-auto", // Full width on mobile, auto on desktop
                "snap-x snap-mandatory", // Add snap scrolling for better mobile UX
                "-mx-2 px-2 md:mx-0 md:px-0" // Negative margin on mobile to use full width
              )}
              role="tablist"
              aria-orientation="horizontal"
              aria-live="polite"
              aria-atomic="false"
              style={{
                WebkitOverflowScrolling: "touch",
                scrollBehavior: "smooth",
              }}
            >
              {navItems.map((item) => {
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    role="tab"
                    type="button"
                    aria-selected={isActive}
                    aria-controls={`${item.id}-section`}
                    aria-current={isActive ? "page" : undefined}
                    aria-describedby={`${item.id}-description`}
                    tabIndex={isActive ? 0 : -1}
                    data-section={item.id}
                    title={`Navigate to ${item.label} section`}
                    onClick={() => scrollToSection(item.id)}
                    onKeyDown={(e) => handleKeyDown(e, item.id)}
                    className={cn(
                      "focus-visible:ring-brand-blue flex flex-shrink-0 cursor-pointer items-center font-medium whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none",
                      // Responsive padding - smaller on mobile
                      "px-3 py-3 md:px-6 md:py-4",
                      // Responsive text size
                      "text-sm md:text-base",
                      // Snap alignment for mobile scroll
                      "snap-start",
                      // Minimum width to prevent squashing
                      "min-w-fit",
                      isActive
                        ? "text-brand-blue border-brand-blue border-b-2 bg-blue-50/50"
                        : "text-brand-muted hover:text-brand-blue hover:border-transparent hover:bg-gray-50/50",
                      "disabled:pointer-events-none disabled:opacity-50"
                    )}
                  >
                    <span className="sr-only">
                      {isActive ? "Current section: " : "Navigate to "}
                      {item.label} section
                    </span>
                    <span
                      aria-hidden="true"
                      role="img"
                      className="mr-1.5 flex-shrink-0 md:mr-2"
                    >
                      {item.icon}
                    </span>
                    <span aria-hidden="true" className="truncate">
                      {item.label}
                    </span>
                    {/* Hidden description for screen readers */}
                    <span id={`${item.id}-description`} className="sr-only">
                      {isActive
                        ? "You are currently viewing this section"
                        : "Click to scroll to this section"}
                    </span>
                  </button>
                );
              })}
            </div>
            {isSticky && (
              <div className="ml-2 flex-shrink-0">
                <BrochureButton
                  className="bg-brand-accent hover:bg-brand-accent focus-visible:ring-primary hidden items-center justify-center rounded-md font-semibold focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:flex"
                  showIcon
                  aria-label="Download property brochure"
                />
              </div>
            )}
          </div>
        </div>
      </Shell>
    </nav>
  );
}

// Memoize component to prevent unnecessary re-renders
// Only re-render when sectionRefs actually changes (deep comparison not needed since refs are stable)
const PropertyScrollNav = memo(
  PropertyScrollNavComponent,
  (prevProps, nextProps) => {
    // Custom comparison to check if sectionRefs object keys changed
    const prevKeys = Object.keys(prevProps.sectionRefs || {}).sort();
    const nextKeys = Object.keys(nextProps.sectionRefs || {}).sort();

    if (prevKeys.length !== nextKeys.length) return false;

    return prevKeys.every((key, index) => key === nextKeys[index]);
  }
);

PropertyScrollNav.displayName = "PropertyScrollNav";

export default PropertyScrollNav;
