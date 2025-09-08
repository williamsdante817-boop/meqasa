"use client";

import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceholderImage } from "@/components/common/placeholder-image";
import { shimmer, toBase64 } from "@/lib/utils";
import type { MeqasaEmptyProject, MeqasaProject } from "@/types/meqasa";

// Type guard to check if project is not empty
function isMeqasaProject(
  project: MeqasaProject | MeqasaEmptyProject
): project is MeqasaProject {
  return !(project as MeqasaEmptyProject).empty;
}

interface FeaturedPropertyVariantCardProps {
  project: MeqasaProject | MeqasaEmptyProject;
}

export function FeaturedPropertyVariantCard({
  project,
}: FeaturedPropertyVariantCardProps) {
  const [imgError, setImgError] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If project is empty, render nothing
  if (!isMeqasaProject(project)) {
    return null;
  }

  // Destructure with proper fallbacks
  const {
    projectname = "Unnamed Project",
    projectid = "unknown",
    photo,
    logo,
    name: location = "Unknown Location",
    city = "Unknown City",
  } = project;

  // Generate URLs with proper fallbacks
  const mainImage = photo ? `https://meqasa.com/uploads/imgs/${photo}` : "";
  const logoImage = logo
    ? `https://dve7rykno93gs.cloudfront.net/uploads/imgs/${logo}`
    : "";
  const projectLink = `/development-projects/${projectid}`;

  // Generate proper alt text
  const mainImageAlt = `${projectname} project image`;
  const logoAlt = `${projectname} logo`;

  return (
    <Card
      className="relative mb-8 h-[230px] md:h-[321px] w-full p-0 overflow-hidden rounded-lg border-none text-brand-accent"
      role="article"
      aria-labelledby={`project-title-${projectid}`}
    >
      <div
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: "linear-gradient( rgba(0,0,0,0.1), rgba(0,0,0,0.8))",
        }}
        aria-hidden="true"
      />
      <CardContent className="p-0">
        {!imgError && mainImage ? (
          <Image
            className="h-[321px] rounded-lg object-cover"
            width={1028}
            height={321}
            src={mainImage}
            alt={mainImageAlt}
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(
              shimmer(728, 321)
            )}`}
            sizes="728px"
            onError={() => setImgError(true)}
            onLoad={() => setIsLoading(false)}
            priority
          />
        ) : (
          <PlaceholderImage
            className="h-[321px] rounded-lg"
            aria-label="Project image placeholder"
          />
        )}

        {isLoading && !imgError && (
          <div
            className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg"
            aria-hidden="true"
          />
        )}

        <div className="absolute inset-0 rounded-2xl">
          <div className="absolute inset-x-4 bottom-4 z-20">
            <div className="flex items-end justify-between">
              <div className="text-white">
                <h2
                  id={`project-title-${projectid}`}
                  className="font-bold md:text-xl"
                >
                  <Link
                    href={projectLink}
                    className="hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded"
                    aria-label={`View details for ${projectname}`}
                  >
                    {projectname}
                  </Link>
                </h2>

                <div
                  className="flex items-center gap-1 pt-2 text-sm text-[#E4E5EA] md:text-base"
                  aria-label={`Location: ${location}, ${city}`}
                >
                  <span>{location}</span>
                  <Dot className="h-4 w-4" aria-hidden="true" />
                  <span>{city}</span>
                </div>

                <Button
                  asChild
                  className="mt-3 bg-brand-primary hover:bg-brand-primary focus:ring-2 focus:ring-white focus:ring-offset-2"
                >
                  <Link
                    href={projectLink}
                    aria-label={`View ${projectname} project details`}
                  >
                    View project
                  </Link>
                </Button>
              </div>
              <div className="flex items-end">
                {logoImage && !logoError ? (
                  <Image
                    src={logoImage}
                    alt={logoAlt}
                    width={100}
                    height={100}
                    className="h-14 w-14 rounded-md md:h-auto md:w-auto"
                    onError={() => setLogoError(true)}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
