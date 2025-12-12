"use client";

import { Dot } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildDeveloperLogoUrl, buildProjectImageUrl } from "@/lib/image-utils";
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

  // Generate URLs with proper fallbacks using image optimization
  const mainImage = buildProjectImageUrl(photo, "large", {
    disableOptimization: true,
  });
  const logoImage = buildDeveloperLogoUrl(logo, "medium", {
    disableOptimization: true,
  });
  const projectLink = `/development-projects/${projectid}`;

  // Generate proper alt text
  const mainImageAlt = `${projectname} project image`;
  const logoAlt = `${projectname} logo`;

  return (
    <Card
      className="text-brand-accent relative mb-8 h-[230px] w-full overflow-hidden rounded-lg border-none p-0 md:h-[321px]"
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
        <ImageWithFallback
          className="h-[230px] w-full rounded-lg object-cover md:h-[321px]"
          width={1028}
          height={321}
          src={mainImage}
          alt={mainImageAlt}
          unoptimized
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(
            shimmer(728, 321)
          )}`}
          sizes="728px"
          onError={() => setImgError(true)}
          onLoad={() => setIsLoading(false)}
          priority
          imageType="project-photo"
          imageSize="large"
          fallbackAlt="Project image not available"
        />

        {isLoading && !imgError && (
          <div
            className="absolute inset-0 animate-pulse rounded-lg bg-gray-100"
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
                    className="rounded hover:underline focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent focus:outline-none"
                    aria-label={`View details for ${projectname}`}
                  >
                    {projectname}
                  </Link>
                </h2>

                <div
                  className="flex items-center gap-1 text-sm text-[#E4E5EA] md:text-base"
                  aria-label={`Location: ${location}, ${city}`}
                >
                  <span>{location}</span>
                  <Dot className="h-4 w-4" aria-hidden="true" />
                  <span>{city}</span>
                </div>

                <Button
                  asChild
                  className="bg-brand-primary hover:bg-brand-primary mt-3 w-full focus:ring-2 focus:ring-white focus:ring-offset-2"
                  variant="default"
                >
                  <Link
                    href={projectLink}
                    aria-label={`View ${projectname} project details`}
                  >
                    View project
                  </Link>
                </Button>
              </div>
              <div className="flex items-end rounded-md bg-white p-2">
                <ImageWithFallback
                  src={logoImage}
                  alt={logoAlt}
                  width={80}
                  height={80}
                  unoptimized
                  className="h-20 w-20 rounded-md object-contain"
                  onError={undefined}
                  imageType="developer-logo"
                  imageSize="medium"
                  fallbackAlt="Developer logo not available"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
