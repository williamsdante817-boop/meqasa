"use client";

import {
  Briefcase,
  Building,
  Building2,
  MapPin,
  Store,
  Warehouse,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Categorized property types with proper hrefs pointing to units search and icons
const propertyCategories = [
  {
    title: "Residential",
    types: [
      {
        label: "Houses",
        href: "/search/sale?q=ghana&ftype=house",
        icon: Building2,
      },
      {
        label: "Apartments",
        href: "/search/rent?q=ghana&ftype=apartment",
        icon: Building,
      },
      {
        label: "Townhouses",
        href: "/search/sale?q=ghana&ftype=townhouse",
        icon: Building2,
      },
      {
        label: "Studio Apartments",
        href: "/search/rent?q=ghana&ftype=studio%20apartment",
        icon: Building,
      },
      {
        label: "Villas",
        href: "/search/sale?q=ghana&ftype=villa",
        icon: Building2,
      },
      {
        label: "Guest Houses",
        href: "/search/rent?q=ghana&ftype=guest%20house",
        icon: Building2,
      },
    ],
  },
  {
    title: "Commercial",
    types: [
      {
        label: "Office Space",
        href: "/search/rent?q=ghana&ftype=office",
        icon: Briefcase,
      },
      {
        label: "Shops",
        href: "/search/rent?q=ghana&ftype=shop",
        icon: Store,
      },
      {
        label: "Warehouses",
        href: "/search/rent?q=ghana&ftype=warehouse",
        icon: Warehouse,
      },
      {
        label: "Commercial Space",
        href: "/search/sale?q=ghana&ftype=commercial%20space",
        icon: Briefcase,
      },
    ],
  },
  {
    title: "Land & Others",
    types: [
      {
        label: "Land",
        href: "/search/sale?q=ghana&ftype=land",
        icon: MapPin,
      },
      {
        label: "Retail",
        href: "/search/rent?q=ghana&ftype=retail",
        icon: Store,
      },
      {
        label: "Beach Houses",
        href: "/search/rent?q=ghana&ftype=beach%20house",
        icon: Building2,
      },
      {
        label: "Hotels",
        href: "/search/rent?q=ghana&ftype=hotel",
        icon: Building,
      },
    ],
  },
];

export default function PropertyTypeLinks() {
  const searchParams = useSearchParams();
  const currentType = searchParams?.get("ftype");

  const isActive = (href: string) => {
    try {
      const url = new URL(href, "http://localhost");
      const hrefType = url.searchParams.get("ftype") ?? "";
      return currentType === hrefType;
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
              {category.types.map((type, index) => {
                const Icon = type.icon;
                const active = isActive(type.href);

                return (
                  <li key={`${category.title}-${type.label}-${index}`}>
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
