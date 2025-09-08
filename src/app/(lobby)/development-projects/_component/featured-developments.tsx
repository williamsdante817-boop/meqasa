"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { ArrowRight, Star, MapPin, Building2 } from "lucide-react";
import Link from "next/link";
import { cn, formatNumber } from "@/lib/utils";

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
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedDevelopment[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});

  // API call function
  const fetchFeaturedProjects = async (): Promise<FeaturedDevelopment[]> => {
    try {
      const response = await fetch('/api/development-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const data = await response.json();
      // Filter for featured projects and limit to 2
      return (data.projects || [])
        .filter((project: FeaturedDevelopment) => project.isFeatured)
        .slice(0, 2);
    } catch (error) {
      console.error('Error fetching featured development projects:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadFeaturedProjects = async () => {
      setLoading(true);
      try {
        const projects = await fetchFeaturedProjects();
        setFeaturedProjects(projects);
      } catch (error) {
        console.error('Error loading featured projects:', error);
        setFeaturedProjects([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProjects();
  }, []);

  const handleImageLoad = (projectId: number) => {
    setImageLoaded(prev => ({ ...prev, [projectId]: true }));
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
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-96 animate-pulse" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-80 rounded-lg mb-4" />
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
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
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            <h2 className="text-2xl font-bold text-brand-accent">
              Featured Developments
            </h2>
          </div>
          <p className="text-brand-muted">
            Discover our hand-picked premium projects from Ghana's leading developers
          </p>
        </div>
        
        <Button
          variant="outline"
          asChild
          className="hidden md:flex items-center gap-2"
        >
          <Link href="/development-projects?featured=true">
            View All Featured
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Featured Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {featuredProjects.map((project, index) => (
          <Card 
            key={project.projectid} 
            className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500"
          >
            <Link
              href={project.weburl || `/development-projects/${project.projectid}`}
              className="absolute inset-0 z-10"
              aria-label={`View details for ${project.projectname}`}
              {...(project.weburl ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            />
            
            <div className="relative">
              <AspectRatio ratio={16 / 10} className="relative overflow-hidden">
                {/* Loading skeleton */}
                {!imageLoaded[project.projectid] && (
                  <div className="absolute inset-0 z-20 bg-gray-100 animate-pulse" />
                )}
                
                <ImageWithFallback
                  src={project.photoUrl || "/images/placeholder-development.jpg"}
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
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Featured badge */}
                <div className="absolute top-4 left-4 z-30">
                  <Badge className="bg-yellow-500 text-black font-semibold shadow-lg">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                </div>
                
                {/* Status badge */}
                <div className="absolute top-4 right-4 z-30">
                  <Badge className="bg-white/90 text-brand-accent font-semibold shadow-lg">
                    {getCompletionStatus(project.status)}
                  </Badge>
                </div>
                
                {/* Project info overlay */}
                <div className="absolute bottom-0 left-0 right-0 z-30 p-6 text-white">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold group-hover:text-yellow-300 transition-colors">
                        {project.projectname}
                      </h3>
                      <p className="text-white/90 text-sm font-medium">
                        {formatNumber(project.pageviews)} views • {project.unitcount} units
                      </p>
                    </div>
                    
                    <div className="flex items-center text-white/90">
                      <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                      <span className="text-sm">{project.fullLocation}</span>
                    </div>
                  </div>
                </div>
              </AspectRatio>
            </div>

            <CardContent className="p-6 space-y-4">
              {/* Description */}
              <p className="text-brand-muted line-clamp-3 leading-relaxed">
                {project.aboutproject}
              </p>
              
              {/* Stats Row */}
              <div className="flex items-center justify-between py-3 border-y">
                <div className="text-center">
                  <div className="text-lg font-bold text-brand-accent">
                    {project.unitcount}
                  </div>
                  <div className="text-xs text-brand-muted">Total Units</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-brand-primary">
                    {formatNumber(project.pageviews)}
                  </div>
                  <div className="text-xs text-brand-muted">Page Views</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {project.region}
                  </div>
                  <div className="text-xs text-brand-muted">Location</div>
                </div>
              </div>
              
              {/* Status info */}
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-brand-accent flex-shrink-0" />
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="text-xs font-medium bg-gray-50 text-gray-700"
                  >
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Badge>
                  {project.isFeatured && (
                    <Badge
                      variant="outline"
                      className="text-xs font-medium bg-yellow-50 text-yellow-700 border-yellow-300"
                    >
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* CTA Button */}
              <Button
                variant="default"
                className="w-full relative z-20 bg-brand-primary hover:bg-brand-primary/90"
                asChild
              >
                <Link href={project.weburl || `/development-projects/${project.projectid}`}
                      {...(project.weburl ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  <Building2 className="h-4 w-4 mr-2" />
                  {project.weburl ? "Visit Project Site" : "View Project Details"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Mobile CTA */}
      <div className="md:hidden">
        <Button
          variant="outline"
          asChild
          className="w-full"
        >
          <Link href="/development-projects?featured=true">
            View All Featured Developments
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
}