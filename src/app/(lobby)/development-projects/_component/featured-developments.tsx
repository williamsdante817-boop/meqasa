"use client";

import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatNumber } from "@/lib/utils";
import { ArrowRight, Building2, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useResilientFetch } from "@/hooks/use-resilient-fetch";

interface FeaturedDevelopment {
  projectid: number;
  projectname: string;
  address: string;
  city: string;
  region: string;
  aboutproject: string;
  photoUrl: string | null;
  logoUrl: string | null;
  status: "new" | "ongoing" | "completed";
  isFeatured: boolean;
  location: string;
  fullLocation: string;
  unitcount: number;
  pageviews: number;
  weburl?: string;
}

export default function FeaturedDevelopments() {
  const [featuredProjects, setFeaturedProjects] = useState<
    FeaturedDevelopment[]
  >([]);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});

  const requestInit = useMemo<RequestInit>(
    () => ({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }),
    []
  );

  const { data, loading, error } = useResilientFetch<{ projects?: FeaturedDevelopment[] }>({
    input: "/api/development-projects",
    init: requestInit,
  });

  useEffect(() => {
    if (!error) {
      return;
    }
    console.error("Error fetching featured development projects:", error);
  }, [error]);

  useEffect(() => {
    if (!data) {
      return;
    }

    const projects = (data.projects ?? [])
      .filter((project) => project.isFeatured)
      .slice(0, 2);
    setFeaturedProjects(projects);
  }, [data]);

  const handleImageLoad = (projectId: number) => {
    setImageLoaded((prev) => ({ ...prev, [projectId]: true }));
  };

  const getCompletionStatus = (status: string) => {
    switch (status) {
      case "completed":
        return "100% Complete";
      case "ongoing":
        return "In Progress";
      case "new":
        return "Launching Soon";
      default:
        return "Available";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-96 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="mb-4 h-80 rounded-lg bg-gray-200" />
              <div className="space-y-2">
                <div className="h-6 w-3/4 rounded bg-gray-200" />
                <div className="h-4 w-1/2 rounded bg-gray-200" />
                <div className="h-4 w-full rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (featuredProjects.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-current text-yellow-500" />
            <h2 className="text-brand-accent text-2xl font-bold">
              Featured Developments
            </h2>
          </div>
          <p className="text-brand-muted">
            Discover our hand-picked premium projects from Ghana&apos;s leading
            developers
          </p>
        </div>

        <Button
          variant="outline"
          asChild
          className="hidden items-center gap-2 md:flex"
        >
          <Link href="/development-projects?featured=true">
            View All Featured
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Featured Projects Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {featuredProjects.map((project, index) => (
          <Card
            key={project.projectid}
            className="group relative overflow-hidden border-0 shadow-lg transition-all duration-500 hover:shadow-2xl"
          >
            <Link
              href={
                project.weburl || `/development-projects/${project.projectid}`
              }
              className="absolute inset-0 z-10"
              aria-label={`View details for ${project.projectname}`}
              {...(project.weburl
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            />

            <div className="relative">
              <AspectRatio ratio={16 / 10} className="relative overflow-hidden">
                {/* Loading skeleton */}
                {!imageLoaded[project.projectid] && (
                  <div className="absolute inset-0 z-20 animate-pulse bg-gray-100" />
                )}

                <ImageWithFallback
                  src={
                    project.photoUrl || "/images/placeholder-development.jpg"
                  }
                  alt={`${project.projectname} featured development`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  quality={90}
                  priority={index === 0}
                  className={cn(
                    "object-cover transition-all duration-700 group-hover:scale-110",
                    imageLoaded[project.projectid] ? "opacity-100" : "opacity-0"
                  )}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/duYy7cAAAAASUVORK5CYII="
                  fallbackAlt={`${project.projectname} - Image not available`}
                  onLoad={() => handleImageLoad(project.projectid)}
                  imageType="project-photo"
                  imageSize="large"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Featured badge */}
                <div className="absolute top-4 left-4 z-30">
                  <Badge className="bg-yellow-500 font-semibold text-black shadow-lg">
                    <Star className="mr-1 h-3 w-3 fill-current" />
                    Featured
                  </Badge>
                </div>

                {/* Status badge */}
                <div className="absolute top-4 right-4 z-30">
                  <Badge className="text-brand-accent bg-white/90 font-semibold shadow-lg">
                    {getCompletionStatus(project.status)}
                  </Badge>
                </div>

                {/* Project info overlay */}
                <div className="absolute right-0 bottom-0 left-0 z-30 p-6 text-white">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold transition-colors group-hover:text-yellow-300">
                        {project.projectname}
                      </h3>
                      <p className="text-sm font-medium text-white/90">
                        {formatNumber(project.pageviews)} views •{" "}
                        {project.unitcount} units
                      </p>
                    </div>

                    <div className="flex items-center text-white/90">
                      <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{project.fullLocation}</span>
                    </div>
                  </div>
                </div>
              </AspectRatio>
            </div>

            <CardContent className="space-y-4 p-6">
              {/* Description */}
              <p className="text-brand-muted line-clamp-3 leading-relaxed">
                {project.aboutproject}
              </p>

              {/* Stats Row */}
              <div className="flex items-center justify-between border-y py-3">
                <div className="text-center">
                  <div className="text-brand-accent text-lg font-bold">
                    {project.unitcount}
                  </div>
                  <div className="text-brand-muted text-xs">Total Units</div>
                </div>

                <div className="text-center">
                  <div className="text-brand-primary text-lg font-bold">
                    {formatNumber(project.pageviews)}
                  </div>
                  <div className="text-brand-muted text-xs">Page Views</div>
                </div>

                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {project.region}
                  </div>
                  <div className="text-brand-muted text-xs">Location</div>
                </div>
              </div>

              {/* Status info */}
              <div className="flex items-center gap-2">
                <Building2 className="text-brand-accent h-4 w-4 flex-shrink-0" />
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-gray-50 text-xs font-medium text-gray-700"
                  >
                    {project.status.charAt(0).toUpperCase() +
                      project.status.slice(1)}
                  </Badge>
                  {project.isFeatured && (
                    <Badge
                      variant="outline"
                      className="border-yellow-300 bg-yellow-50 text-xs font-medium text-yellow-700"
                    >
                      Featured
                    </Badge>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <Button
                variant="default"
                className="bg-brand-primary hover:bg-brand-primary/90 relative z-20 w-full"
                asChild
              >
                <Link
                  href={
                    project.weburl ||
                    `/development-projects/${project.projectid}`
                  }
                  {...(project.weburl
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  {project.weburl
                    ? "Visit Project Site"
                    : "View Project Details"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="md:hidden">
        <Button variant="outline" asChild className="w-full">
          <Link href="/development-projects?featured=true">
            View All Featured Developments
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
