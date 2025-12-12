"use client";

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import DeveloperUnitCard from "./developer-unit-card";

interface DeveloperUnit {
  id: string;
  title: string;
  price: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  unittype: string;
  terms: string;
  image?: string;
  developer?: string;
  area?: string;
  featured?: boolean;
  [key: string]: any;
}

// This component fetches real featured developer units from MeQasa API

export default function FeaturedUnits() {
  const [featuredUnits, setFeaturedUnits] = useState<DeveloperUnit[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured units from API
  useEffect(() => {
    async function loadFeaturedUnits() {
      try {
        setLoading(true);

        // Fetch both sale and rent units for featured display
        const [saleResponse, rentResponse] = await Promise.all([
          fetch("/api/developer-units", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ terms: "sale" }),
          }),
          fetch("/api/developer-units", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ terms: "rent" }),
          }),
        ]);

        const saleUnits = saleResponse.ok ? await saleResponse.json() : [];
        const rentUnits = rentResponse.ok ? await rentResponse.json() : [];

        // Combine and take first 6 units as featured
        const allUnits = [...saleUnits.slice(0, 3), ...rentUnits.slice(0, 3)];
        const featuredUnits = allUnits.map((unit: DeveloperUnit) => ({
          ...unit,
          featured: true,
        }));

        setFeaturedUnits(featuredUnits);
      } catch {
        setFeaturedUnits([]);
      } finally {
        setLoading(false);
      }
    }

    void loadFeaturedUnits();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200"></div>
            <div className="h-4 w-64 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-lg bg-gray-100"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (featuredUnits.length === 0) {
    return null; // Don't show the section if no featured units
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-brand-accent mb-1 flex items-center gap-2 text-2xl font-bold leading-tight tracking-tighter lg:text-3xl">
            <Star className="h-5 w-5 fill-yellow-500 text-yellow-500 lg:h-6 lg:w-6" />
            Featured Units
          </h2>
          <p className="text-brand-muted text-sm leading-normal sm:text-base sm:leading-7">
            Handpicked premium properties from trusted developers and agents
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/projects?category=featured">View All Featured</Link>
        </Button>
      </div>

      {/* Featured Units Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredUnits.map((unit, index) => (
          <DeveloperUnitCard
            key={unit.id}
            unit={unit}
            priority={index < 3} // Prioritize first 3 images for featured section
          />
        ))}
      </div>

      {/* Call to Action */}
      <div className="from-brand-primary/10 to-brand-primary-dark/10 rounded-lg bg-gradient-to-r py-6 text-center">
        <h3 className="text-brand-accent mb-2 text-base font-semibold lg:text-lg">
          Want to see your property featured?
        </h3>
        <p className="text-brand-muted mb-4 text-sm sm:text-base">
          Join thousands of successful property owners and agents
        </p>
        <Button asChild>
          <Link href="/contact">List Your Property</Link>
        </Button>
      </div>
    </div>
  );
}
