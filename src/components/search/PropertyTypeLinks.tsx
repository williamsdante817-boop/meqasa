"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Building, Building2, MapPin, Warehouse, Store, Briefcase } from "lucide-react";

// Categorized property types with proper hrefs and icons
const propertyCategories = [
  {
    title: "Residential",
    types: [
      { label: "Houses", href: "/search/sale?ftype=house", icon: Building2, count: "2.5K+" },
      { label: "Apartments", href: "/search/rent?ftype=apartment", icon: Building, count: "1.8K+" },
      { label: "Townhouses", href: "/search/sale?ftype=townhouse", icon: Building2, count: "450+" },
      { label: "Guest Houses", href: "/search/rent?ftype=guesthouse", icon: Building, count: "120+" }
    ]
  },
  {
    title: "Commercial", 
    types: [
      { label: "Office Space", href: "/search/rent?ftype=office", icon: Briefcase, count: "680+" },
      { label: "Shops", href: "/search/rent?ftype=shop", icon: Store, count: "320+" },
      { label: "Warehouses", href: "/search/rent?ftype=warehouse", icon: Warehouse, count: "95+" },
      { label: "Commercial", href: "/search/sale?ftype=commercial", icon: Briefcase, count: "150+" }
    ]
  },
  {
    title: "Land & Others",
    types: [
      { label: "Land", href: "/search/sale?ftype=land", icon: MapPin, count: "890+" },
      { label: "Retail", href: "/search/rent?ftype=retail", icon: Store, count: "200+" }
    ]
  }
];

export default function PropertyTypeLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentType = searchParams?.get('ftype');
  
  const isActive = (href: string) => {
    const url = new URL(href, 'http://localhost');
    const hrefType = url.searchParams.get('ftype') ?? '';
    return currentType === hrefType || (pathname.includes((href.split('?')[0]) || '') && currentType === hrefType);
  };

  return (
    <aside className="hidden lg:block w-44 xl:w-60 flex-shrink-0" role="complementary" aria-label="Property type navigation">
      <nav className="space-y-6">
        {propertyCategories.map((category, categoryIndex) => (
          <div key={category.title} className="space-y-3">
            {/* Category Header */}
            <div className="flex items-center gap-2 px-2">
              <div className="h-px flex-1 bg-gradient-to-r from-brand-primary/30 to-transparent" />
              <h3 className="text-xs font-semibold text-brand-accent uppercase tracking-wider">
                {category.title}
              </h3>
              <div className="h-px flex-1 bg-gradient-to-l from-brand-primary/30 to-transparent" />
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
                      className={`group flex items-center justify-between w-full px-2.5 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:translate-x-0.5 ${
                        active
                          ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/25'
                          : 'bg-gray-50 text-brand-muted hover:bg-brand-primary/10 hover:text-brand-primary hover:shadow-sm'
                      }`}
                      aria-label={`View ${type.label} properties`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-3.5 h-3.5 transition-colors duration-200 flex-shrink-0 ${
                          active ? 'text-white' : 'text-brand-accent group-hover:text-brand-primary'
                        }`} />
                        <span className="font-medium text-sm truncate">{type.label}</span>
                      </div>
                      
                      {/* Property Count */}
                      <span className={`text-xs px-1.5 py-0.5 rounded-sm block flex items-center h-full justify-center font-medium transition-colors duration-200 flex-shrink-0 ${
                        active 
                          ? 'bg-white/20 text-white' 
                          : 'bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary/20'
                      }`}>
                        {type.count}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        
        {/* Browse All CTA */}
        {/* <div className="pt-4 border-t border-gray-100">
          <Link
            href="/search/sale"
            className="flex items-center justify-center gap-2 w-full px-3 py-2.5 bg-gradient-to-r from-brand-primary to-brand-primary-dark text-white rounded-md font-semibold text-xs xl:text-sm hover:from-brand-primary-dark hover:to-brand-primary transition-all duration-300 hover:shadow-lg hover:shadow-brand-primary/25 hover:-translate-y-0.5 group"
            aria-label="Browse all available properties"
          >
            <Building className="w-3.5 h-3.5 xl:w-4 xl:h-4 transition-transform duration-200 group-hover:scale-110" />
            <span className="truncate">Browse All</span>
          </Link>
        </div> */}
      </nav>
    </aside>
  );
}
