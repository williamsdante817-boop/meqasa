"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface DeveloperLogo {
  id: string;
  name: string;
  logoUrl: string;
}

interface DeveloperLogosProps {
  className?: string;
}

export function DeveloperLogos({ className }: DeveloperLogosProps) {
  const developerLogos: DeveloperLogo[] = [
    {
      id: "1",
      name: "Empire Domus",
      logoUrl:
        "https://images.unsplash.com/photo-1612519348055-5948319a0714?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYW55JTIwbG9nbyUyMGRlc2lnbiUyMG1vZGVybnxlbnwxfHx8fDE3NTczNDA3MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "2",
      name: "Devtraco Plus",
      logoUrl:
        "https://images.unsplash.com/photo-1581626216082-f8497d54e0a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwYnJhbmQlMjBsb2dvfGVufDF8fHx8MTc1NzM0MDcwN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "3",
      name: "SSNIT Builders",
      logoUrl:
        "https://images.unsplash.com/photo-1581626216082-f8497d54e0a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBsb2dvJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzU3MzQwNzEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "4",
      name: "Regimanuel Gray",
      logoUrl:
        "https://images.unsplash.com/photo-1575246105595-9cf29941858c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBmaXJtJTIwYnJhbmRpbmd8ZW58MXx8fHwxNzU3MzQwNzEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "5",
      name: "TransHomes Ghana",
      logoUrl:
        "https://images.unsplash.com/photo-1554260570-9140fd3b7614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGxvZ28lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzU3Mjc3NzMwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "6",
      name: "Urbanet Properties",
      logoUrl:
        "https://images.unsplash.com/photo-1632400386307-2b2f275b35da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9wZXJ0eSUyMGRldmVsb3BlciUyMGNvbXBhbnl8ZW58MXx8fHwxNzU3MzQwNzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "7",
      name: "African Land Development",
      logoUrl:
        "https://images.unsplash.com/photo-1612519348055-5948319a0714?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wYW55JTIwbG9nbyUyMGRlc2lnbiUyMG1vZGVybnxlbnwxfHx8fDE3NTczNDA3MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: "8",
      name: "Meridian Estates",
      logoUrl:
        "https://images.unsplash.com/photo-1575246105595-9cf29941858c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBmaXJtJTIwYnJhbmRpbmd8ZW58MXx8fHwxNzU3MzQwNzEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  // Duplicate the logos for seamless infinite scroll
  const allLogos = [...developerLogos, ...developerLogos];

  return (
    <div className={cn("mt-8 space-y-6", className)}>
      {/* Marquee Container */}
      <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white py-8">
        {/* Gradient overlays */}
        <div className="absolute top-0 bottom-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
        <div className="absolute top-0 right-0 bottom-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />

        {/* Scrolling logos */}
        <div
          className="animate-marquee flex space-x-12 hover:[animation-play-state:paused]"
          style={{ "--duration": "30s" } as React.CSSProperties}
        >
          {allLogos.map((logo, index) => (
            <div
              key={`${logo.id}-${index}`}
              className="group flex-shrink-0 cursor-pointer"
            >
              <div className="h-20 w-32 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                <img
                  src={logo.logoUrl}
                  alt={`${logo.name} logo`}
                  className="h-full w-full object-cover transition-all duration-300"
                />
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-600 transition-colors group-hover:text-gray-900">
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
