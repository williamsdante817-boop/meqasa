"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Building,
  Building2,
  MapPin,
  Warehouse,
  Store,
  Briefcase,
} from "lucide-react";

// Categorized property types with proper hrefs pointing to units search and icons
const propertyCategories = [
  {
    title: "Residential",
    types: [
      {
        label: "Houses",
        href: "/units/search?terms=sale&unittype=house&address=&maxprice=&beds=0&baths=0",
        icon: Building2,
        count: "2.5K+",
      },
      {
        label: "Apartments",
        href: "/units/search?terms=rent&unittype=apartment&address=&maxprice=&beds=0&baths=0",
        icon: Building,
        count: "1.8K+",
      },
      {
        label: "Townhouses",
        href: "/units/search?terms=sale&unittype=townhouse&address=&maxprice=&beds=0&baths=0",
        icon: Building2,
        count: "450+",
      },
      {
        label: "Studio Apartments",
        href: "/units/search?terms=rent&unittype=studio%20apartment&address=&maxprice=&beds=0&baths=0",
        icon: Building,
        count: "50+",
      },
      {
        label: "Villas",
        href: "/units/search?terms=sale&unittype=villa&address=&maxprice=&beds=0&baths=0",
        icon: Building2,
        count: "180+",
      },
    ],
  },
  {
    title: "Commercial",
    types: [
      {
        label: "Office Space",
        href: "/search/rent?ftype=office",
        icon: Briefcase,
        count: "680+",
      },
      {
        label: "Shops",
        href: "/search/rent?ftype=shop",
        icon: Store,
        count: "320+",
      },
      {
        label: "Warehouses",
        href: "/search/rent?ftype=warehouse",
        icon: Warehouse,
        count: "95+",
      },
      {
        label: "Commercial",
        href: "/search/sale?ftype=commercial%20space",
        icon: Briefcase,
        count: "150+",
      },
    ],
  },
  {
    title: "Land & Others",
    types: [
      {
        label: "Land",
        href: "/search/sale?ftype=land",
        icon: MapPin,
        count: "890+",
      },
      {
        label: "Retail",
        href: "/search/rent?ftype=retail",
        icon: Store,
        count: "200+",
      },
      {
        label: "Beach Houses",
        href: "/search/rent?ftype=beach%20house",
        icon: Building2,
        count: "25+",
      },
      {
        label: "Hotels",
        href: "/search/rent?ftype=hotel",
        icon: Building,
        count: "15+",
      },
    ],
  },
];

export default function PropertyTypeLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentType = searchParams?.get("ftype");

  const isActive = (href: string) => {
    try {
      const url = new URL(href, "http://localhost");

      // Handle new units search format
      if (url.pathname.includes("/units/search")) {
        const hrefUnitType = url.searchParams.get("unittype") ?? "";
        const hrefTerms = url.searchParams.get("terms") ?? "";
        const currentUnitType = searchParams?.get("unittype") ?? "";
        const currentTerms = searchParams?.get("terms") ?? "";

        return (
          pathname.includes("/units/search") &&
          hrefUnitType === currentUnitType &&
          hrefTerms === currentTerms
        );
      }

      // Handle old search format
      const hrefType = url.searchParams.get("ftype") ?? "";
      return (
        currentType === hrefType ||
        (pathname.includes(href.split("?")[0] || "") &&
          currentType === hrefType)
      );
    } catch {
      return false;
    }
  };

  return (
    <aside
      className="hidden w-44 flex-shrink-0 lg:block xl:w-60"
      role="complementary"
      aria-label="Property type navigation"
    >
      <nav className="space-y-6">
        {propertyCategories.map((category, _categoryIndex) => (
          <div key={category.title} className="space-y-3">
            {/* Category Header */}
            <div className="flex items-center gap-2 px-2">
              <div className="from-brand-primary/30 h-px flex-1 bg-gradient-to-r to-transparent" />
              <h3 className="text-brand-accent text-xs font-semibold tracking-wider uppercase">
                {category.title}
              </h3>
              <div className="from-brand-primary/30 h-px flex-1 bg-gradient-to-l to-transparent" />
            </div>

            {/* Property Type Links */}
            <ul className="space-y-1" role="list">
              {category.types.map((type) => {
                const Icon = type.icon;
                const active = isActive(type.href);

                return (
                  <li key={type.label}>
                    <Link
                      href={type.href}
                      className={`group flex w-full items-center justify-between rounded-sm px-2.5 py-2 text-sm font-medium transition-all duration-200 hover:translate-x-0.5 ${
                        active
                          ? "bg-brand-primary shadow-brand-primary/25 text-white shadow-sm"
                          : "text-brand-muted hover:bg-brand-primary/10 hover:text-brand-primary bg-gray-50 hover:shadow-sm"
                      }`}
                      aria-label={`View ${type.label} properties`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`h-3.5 w-3.5 flex-shrink-0 transition-colors duration-200 ${
                            active
                              ? "text-white"
                              : "text-brand-accent group-hover:text-brand-primary"
                          }`}
                        />
                        <span className="truncate text-sm font-medium">
                          {type.label}
                        </span>
                      </div>

                      {/* Property Count */}
                      <span
                        className={`block flex h-full flex-shrink-0 items-center justify-center rounded-sm px-1.5 py-0.5 text-xs font-medium transition-colors duration-200 ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary/20"
                        }`}
                      >
                        {type.count}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
