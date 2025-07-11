import { cn } from "@/lib/utils";
import { BuildingIcon, LayoutIcon, MapIcon, MapPinIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Shell from "@/layouts/shell";
import BrochureDialog from "./brochure-dialog";

type SectionRefs = Record<string, React.RefObject<HTMLDivElement | null>>;

export default function PropertyScrollNav({
  sectionRefs,
}: {
  sectionRefs: SectionRefs;
}) {
  const [activeSection, setActiveSection] = useState("floor-plan");
  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const mainNavHeight = 64; // Height of main navigation in pixels

  const navItems = [
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
  ];

  // Handle scroll to section
  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs[sectionId]?.current ?? null;

    if (section) {
      // Account for both navigation heights
      const propertyNavHeight = navRef.current?.offsetHeight ?? 0;
      const totalNavHeight = mainNavHeight + propertyNavHeight;

      // Get the section's position relative to the top of the document
      const sectionRect = section.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const sectionTop = sectionRect.top + scrollTop - totalNavHeight;

      // Scroll to the section
      window.scrollTo({
        top: sectionTop,
        behavior: "smooth",
      });
    }
  };

  // Handle scroll event to detect when nav becomes sticky
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        const navRect = navRef.current.getBoundingClientRect();
        setIsSticky(navRect.top <= mainNavHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mainNavHeight]);

  // Set up intersection observer to detect active section
  useEffect(() => {
    const observerOptions = {
      rootMargin: `-${mainNavHeight + (navRef.current?.offsetHeight ?? 0)}px 0px 0px 0px`,
      threshold: 0.1,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
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
  }, [sectionRefs]);

  return (
    <nav
      ref={navRef}
      aria-label="Property sections navigation"
      className={cn(
        "sticky top-16 z-10 w-ful overflow-scroll bg-white border-y transition-all duration-200",
        isSticky && "shadow-sm",
      )}
    >
      <Shell>
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex" role="tablist" aria-orientation="horizontal">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={activeSection === item.id}
                  aria-controls={`${item.id}-section`}
                  tabIndex={activeSection === item.id ? 0 : -1}
                  onClick={() => scrollToSection(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }
                  }}
                  className={cn(
                    "flex items-center whitespace-nowrap flex-shrink-0 px-6 py-4 font-medium transition-colors",
                    activeSection === item.id
                      ? "text-brand-blue border-b-2 border-brand-blue"
                      : "text-brand-muted hover:text-brand-blue",
                  )}
                >
                  <span className="sr-only">{item.label}</span>
                  {item.icon}
                  <span aria-hidden="true">{item.label}</span>
                </button>
              ))}
            </div>
            {isSticky && (
              <BrochureDialog
                className="hidden rounded-md md:flex items-center justify-center bg-brand-accent font-semibold hover:bg-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
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
