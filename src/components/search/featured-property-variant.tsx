"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Dot } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { MeqasaProject, MeqasaEmptyProject } from "@/types/meqasa";

// Add missing utility functions
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="0%" />
      <stop stop-color="#edeef1" offset="20%" />
      <stop stop-color="#f6f7f8" offset="40%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

interface FeaturedPropertyVariantCardProps {
  project: MeqasaProject | MeqasaEmptyProject;
}

export function FeaturedPropertyVariantCard({
  project,
}: FeaturedPropertyVariantCardProps) {
  // If project is empty, render nothing or a fallback
  if ((project as MeqasaEmptyProject).empty) {
    return null;
  }
  const p = project as MeqasaProject;
  // Fallbacks for missing data
  const mainImage =
    p.photo ||
    "https://images.unsplash.com/photo-1694032593958-2d018f015a47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3270&q=80";
  const mainImageAlt = p.projectname || "Project image";
  const projectTitle = p.projectname || "Unnamed Project";
  const projectLink = `/developer/project/${p.projectid}`;
  const location = p.name || "Unknown Location";
  const city = p.city || "Unknown City";
  const bedrooms = "1,2,3 Bedrooms"; 
  const status = "Ongoing";
  const badgeColor = "bg-brand-badge-ongoing";
  const logoImage = p.logo || "";
  const logoAlt = `${p.projectname} logo`;

  return (
    <Card className="relative mb-8 h-[321px] w-full p-0 overflow-hidden rounded-xl border-none text-brand-accent">
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: "linear-gradient( rgba(0,0,0,0.1), rgba(0,0,0,0.8))",
        }}
        aria-hidden="true"
      />
      <CardContent className="p-0">
        <Image
          className="h-[321px] rounded-2xl object-cover "
          width={1028}
          height={321}
          src={mainImage}
          alt={mainImageAlt}
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(
            shimmer(728, 321),
          )}`}
          sizes="728px"
          priority
        />

        <div className="absolute inset-0 rounded-2xl">
          <Badge
            className={`absolute left-4 top-4 z-30 uppercase ${badgeColor}`}
          >
            {status}
          </Badge>

          <div className="absolute inset-x-4 bottom-4 z-20">
            <div className="flex items-end justify-between">
              <div className="text-white">
                <h2 className="font-bold md:text-xl">
                  <Link href={projectLink} className="hover:underline">
                    {projectTitle}
                  </Link>
                </h2>

                <div className="flex items-center gap-1 pt-2 text-sm text-[#E4E5EA] md:text-base">
                  <span>{location}</span>
                  <Dot className="h-4 w-4" />
                  <span>{city}</span>
                </div>
                <div className="text-sm text-[#E4E5EA] md:text-base">
                  <p>{bedrooms}</p>
                </div>
                <Button asChild className="mt-3 bg-brand-primary hover:bg-brand-primary">
                  <Link href={projectLink} aria-label={`View ${projectTitle}`}>
                    View project
                  </Link>
                </Button>
              </div>
              <div className="flex items-end">
                {logoImage && (
                  <Image
                    src={logoImage}
                    alt={logoAlt}
                    width={100}
                    height={100}
                    className="h-14 w-14 rounded-md md:h-auto md:w-auto"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
