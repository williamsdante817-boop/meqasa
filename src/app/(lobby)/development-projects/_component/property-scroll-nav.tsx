import { cn } from "@/lib/utils";
import { BuildingIcon, LayoutIcon, MapIcon, MapPinIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

export default function PropertyScrollNav({
  sectionRefs,
}: PropertyScrollNavProps) {
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
        icon: <MapIcon className="w-5 h-5 mr-2" />,
      },
      {
        id: "floor-plan",
        label: "Floor Plan",
        icon: <LayoutIcon className="w-5 h-5 mr-2" />,
      },
      {
        id: "location",
        label: "Location",
        icon: <MapPinIcon className="w-5 h-5 mr-2" />,
      },
      {
        id: "available-units",
        label: "Available Units",
        icon: <BuildingIcon className="w-5 h-5 mr-2" />,
      },
    ],
    [],
  );

  // Memoize scroll to section function
  const scrollToSection = useCallback(
    (sectionId: string) => {
      try {
        const section = sectionRefs[sectionId]?.current;

        if (!section) {
          console.warn(`Section ${sectionId} not found`);
          return;
        }

        // Account for both navigation heights
        const propertyNavHeight = navRef.current?.offsetHeight ?? 0;
        const totalNavHeight = mainNavHeight + propertyNavHeight;

        // Get the section's position relative to the document
        const sectionRect = section.getBoundingClientRect();
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const sectionTop = sectionRect.top + scrollTop - totalNavHeight;

        // Set scrolling state
        setIsScrolling(true);

        // Scroll to the section
        window.scrollTo({
          top: sectionTop,
          behavior: "smooth",
        });

        // Clear scrolling state after animation
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 1000);
      } catch (error) {
        console.error("Error scrolling to section:", error);
      }
    },
    [sectionRefs, mainNavHeight],
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

    const observerOptions = {
      rootMargin: `-${mainNavHeight + (navRef.current.offsetHeight ?? 0)}px 0px 0px 0px`,
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isScrolling) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    // Observe all sections
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionRefs, isScrolling, mainNavHeight]);

  // Auto-scroll active navigation item into view
  useEffect(() => {
    if (activeSection && navRef.current) {
      // eslint-disable-next-line @typescript-eslint/non-nullable-type-assertion-style, @typescript-eslint/no-unnecessary-type-assertion
      const activeButton = navRef.current!.querySelector(
        `[data-section="${activeSection}"]`,
      ) as HTMLElement;
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeSection]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, sectionId: string) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        scrollToSection(sectionId);
      }
    },
    [scrollToSection],
  );

  return (
    <nav
      ref={navRef}
      aria-label="Property sections navigation"
      className={cn(
        "sticky top-16 z-10 w-full bg-white border-y transition-all duration-200",
        isSticky && "shadow-none",
      )}
    >
      <Shell>
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div
              className={cn("flex overflow-x-auto scrollbar-hide touch-pan-x")}
              role="tablist"
              aria-orientation="horizontal"
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
                    aria-selected={isActive}
                    aria-controls={`${item.id}-section`}
                    tabIndex={isActive ? 0 : -1}
                    data-section={item.id}
                    onClick={() => scrollToSection(item.id)}
                    onKeyDown={(e) => handleKeyDown(e, item.id)}
                    className={cn(
                      "flex items-center whitespace-nowrap flex-shrink-0 px-6 py-4 font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                      isActive
                        ? "text-brand-blue border-b-2 border-brand-blue"
                        : "text-brand-muted hover:text-brand-blue  hover:border-transparent",
                    )}
                  >
                    <span className="sr-only">{item.label}</span>
                    {item.icon}
                    <span aria-hidden="true">{item.label}</span>
                  </button>
                );
              })}
            </div>
            {isSticky && (
              <BrochureButton
                className="hidden rounded-md md:flex items-center justify-center bg-brand-accent font-semibold hover:bg-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                showIcon
                aria-label="Download property brochure"
              />
            )}
          </div>
        </div>
      </Shell>
    </nav>
  );
}
