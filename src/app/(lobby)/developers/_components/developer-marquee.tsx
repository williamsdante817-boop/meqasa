"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

interface DeveloperLogo {
  id: string;
  name: string;
  logoUrl: string;
}

interface ApiDeveloper {
  developerid: string;
  logo: string;
  companyname: string;
  name: string;
  logoUrl?: string;
}

interface DeveloperLogosProps {
  className?: string;
  developers?: ApiDeveloper[];
}

export function DeveloperLogos({ className, developers }: DeveloperLogosProps) {
  const router = useRouter();

  // Helper function to create developer URL slug
  function createDeveloperSlug(developerName: string, developerId: string): string {
    const nameSlug = developerName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    return `${nameSlug}-${developerId}`;
  }

  // Handle developer logo click
  const handleDeveloperClick = (logo: DeveloperLogo) => {
    const developerSlug = createDeveloperSlug(logo.name, logo.id);
    router.push(`/projects-by-developer/${developerSlug}`);
  };

  // Default fallback logos in case API data is not available
  const fallbackLogos: DeveloperLogo[] = [
    {
      id: "1",
      name: "Empire Domus",
      logoUrl: "/images/developer-logo-placeholder.jpg",
    },
    {
      id: "2",
      name: "Devtraco Plus",
      logoUrl:
        "https://images.unsplash.com/photo-1581626216082-f8497d54e0a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwYnJhbmQlMjBsb2dvfGVufDF8fHx8MTc1NzM0MDcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  // Transform API data to component format
  const apiLogos: DeveloperLogo[] = developers
    ? developers.map((dev) => ({
        id: dev.developerid,
        name: dev.companyname || dev.name,
        logoUrl: dev.logoUrl || "/images/developer-logo-placeholder.jpg",
      }))
    : [];

  // Use API data if available, otherwise fallback to default logos
  const developerLogos = apiLogos.length > 0 ? apiLogos : fallbackLogos;

  // Duplicate the logos for seamless infinite scroll - ensure we have enough logos
  const logosToShow =
    developerLogos.length < 4
      ? [...developerLogos, ...developerLogos, ...developerLogos]
      : developerLogos;
  const allLogos = [...logosToShow, ...logosToShow];

  return (
    <div className={cn("mt-8 space-y-6", className)}>
      {/* Marquee Container */}
      <div className="relative overflow-hidden rounded-md border border-brand-border bg-white py-8">
        {/* Gradient overlays */}
        <div className="absolute top-0 bottom-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="absolute top-0 right-0 bottom-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

        {/* Scrolling logos */}
        <div
          className="animate-marquee flex space-x-12"
          style={{ "--duration": "30s" } as React.CSSProperties}
        >
          {allLogos.map((logo, index) => (
            <div
              key={`${logo.id}-${index}`}
              className="group flex-shrink-0 cursor-pointer"
              onClick={() => handleDeveloperClick(logo)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleDeveloperClick(logo);
                }
              }}
              aria-label={`View projects by ${logo.name}`}
            >
              <div className="flex h-20 w-32 items-center justify-center overflow-hidden rounded-lg border border-brand-border bg-white p-3 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                <Image
                  src={logo.logoUrl}
                  alt={`${logo.name} logo`}
                  width={128}
                  height={80}
                  className="max-h-full max-w-full object-contain transition-all duration-300"
                />
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-brand-muted transition-colors group-hover:text-brand-accent">
                  {logo.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
