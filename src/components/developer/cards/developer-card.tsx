"use client";

import { MapPin } from "lucide-react";
import { useState, memo } from "react";
import type { MouseEvent } from "react";
import { analytics } from "@/lib/analytics";
import Link from "next/link";

import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatNumber } from "@/lib/utils";
import { DeveloperContactCard } from "@/components/developer/cards/developer-contact-card";

// Constants
const DEFAULT_CDN_URL = "https://dve7rykno93gs.cloudfront.net/uploads/imgs";
const FALLBACK_IMAGE = "/placeholder-image.png";
const IMAGE_QUALITY = 95;
const IMAGE_SIZES = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";

interface Developer {
  developerid: string;
  about: string;
  email: string;
  logo: string;
  hero: string;
  address: string;
  companyname: string;
  name: string;
  unitcount: number;
  prcount: number;
}

interface DeveloperCardProps {
  developer: Developer;
  className?: string;
}

function DeveloperCardComponent({ developer, className }: DeveloperCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [logoLoading, setLogoLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);
  const [heroLoading, setHeroLoading] = useState(true);
  const [heroError, setHeroError] = useState(false);

  // Validate required props after hooks
  if (!developer?.developerid || !developer?.companyname) {
    return null;
  }

  const developerName = developer.companyname;
  const unitsCount = formatNumber(developer.unitcount ?? 0);
  const projectsCount = formatNumber(developer.prcount ?? 0);

  // Build image URLs with proper fallbacks
  const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL ?? DEFAULT_CDN_URL;
  const logoSrc = developer.logo ? `${cdnUrl}/${developer.logo}` : "";
  const heroSrc = developer.hero ? `${cdnUrl}/${developer.hero}` : "";

  const developerDetailUrl = `/projects-by-developer/${developer.companyname.toLowerCase().replace(/\s+/g, "-")}-${developer.developerid}`;

  const handleContactDeveloper = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Track user interaction
    if (typeof window !== "undefined") {
      analytics.trackEvent(
        "contact_developer_clicked",
        "user_interaction",
        developer.companyname
      );
    }
    setIsOpen(true);
  };

  const handleLogoError = () => {
    setLogoLoading(false);
    setLogoError(true);
  };

  const handleLogoLoad = () => {
    setLogoLoading(false);
    setLogoError(false);
  };

  const handleHeroError = () => {
    setHeroLoading(false);
    setHeroError(true);
  };

  const handleHeroLoad = () => {
    setHeroLoading(false);
    setHeroError(false);
  };

  return (
    <>
      <Card
        className={`w-full overflow-hidden rounded-lg bg-white transition-all duration-300 hover:shadow-md ${
          className ?? ""
        }`}
        role="article"
        aria-label={`View details for ${developerName}`}
      >
        <div className="p-4 md:p-8">
          {/* Header Section */}
          <div className="mb-6 flex flex-col gap-6 sm:flex-row">
            {/* Logo/Avatar Section - Clickable */}
            <Link
              href={developerDetailUrl}
              className="flex-shrink-0 transition-opacity hover:opacity-80"
              aria-label={`View details for ${developerName}`}
            >
              <div
                className="relative h-16 w-16 overflow-hidden rounded-md border border-gray-200 bg-gray-100"
                role="img"
                aria-label={`${developerName} company logo`}
              >
                {logoLoading && !logoError && (
                  <Skeleton
                    className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-md bg-gray-50"
                    aria-label="Loading logo"
                  />
                )}

                <ImageWithFallback
                  src={logoSrc || FALLBACK_IMAGE}
                  alt={`${developerName} logo`}
                  className={`h-full w-full object-contain transition-opacity duration-300 ${
                    logoLoading ? "opacity-0" : "opacity-100"
                  }`}
                  width={96}
                  height={96}
                  sizes="64px"
                  onLoad={handleLogoLoad}
                  onError={handleLogoError}
                  quality={IMAGE_QUALITY}
                />
              </div>
            </Link>

            {/* Developer Info Section - Clickable */}
            <Link
              href={developerDetailUrl}
              className="min-w-0 flex-1 transition-opacity hover:opacity-80"
              aria-label={`View details for ${developerName}`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h2 className="text-brand-accent line-clamp-1 text-xl font-semibold">
                      {developerName}
                    </h2>
                  </div>

                  <div className="text-brand-muted mb-3 flex flex-nowrap items-center gap-2 overflow-hidden">
                    <MapPin className="text-brand-muted h-4 w-4 flex-shrink-0" />
                    <span className="truncate text-sm">
                      {developer.address || "Location not available"}
                    </span>
                  </div>

                  <div className="mb-3 flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 border-brand-blue/30 rounded-sm"
                    >
                      {unitsCount} units
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-brand-badge-completed/10 text-brand-badge-completed hover:bg-brand-badge-completed/20 border-brand-badge-completed/30 rounded-sm"
                    >
                      {projectsCount} projects
                    </Badge>
                  </div>
                </div>

                {/* Contact Button - Separate from navigation */}
                <div className="relative z-10">
                  <Button
                    onClick={handleContactDeveloper}
                    className="bg-brand-primary hover:bg-brand-primary-darken cursor-pointer rounded-md px-6 py-2 text-white transition-all"
                  >
                    Contact Developer
                  </Button>
                </div>
              </div>
            </Link>
          </div>

          {/* Hero Image Section - Clickable */}
          {developer.hero && (
            <Link
              href={developerDetailUrl}
              className="mb-6 block transition-opacity hover:opacity-80"
              aria-label={`View details for ${developerName}`}
            >
              <div className="relative h-48 w-full overflow-hidden rounded-md border bg-gray-100">
                {heroLoading && !heroError && (
                  <Skeleton
                    className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 transform animate-pulse bg-gray-50"
                    aria-label="Loading hero image"
                  />
                )}

                <ImageWithFallback
                  src={heroSrc || FALLBACK_IMAGE}
                  alt={`${developerName} cover image`}
                  className={`h-full w-full object-cover transition-opacity duration-300 ${
                    heroLoading ? "opacity-0" : "opacity-100"
                  }`}
                  width={400}
                  height={200}
                  sizes={IMAGE_SIZES}
                  onLoad={handleHeroLoad}
                  onError={handleHeroError}
                  quality={IMAGE_QUALITY}
                />
              </div>
            </Link>
          )}

          {/* Description Section - Clickable */}
          {developer.about && (
            <Link
              href={developerDetailUrl}
              className="block transition-opacity hover:opacity-80"
              aria-label={`View details for ${developerName}`}
            >
              <div className="space-y-4">
                <div className="text-brand-muted line-clamp-3 leading-relaxed">
                  {developer.about}
                </div>
              </div>
            </Link>
          )}
        </div>
      </Card>

      {/* Contact Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-full max-w-lg overflow-hidden p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-brand-accent text-center">
              Contact {developerName}
            </DialogTitle>
            <DialogDescription className="text-brand-muted text-center">
              Get in touch with {developerName} to learn more about their
              properties
            </DialogDescription>
          </DialogHeader>

          <DeveloperContactCard
            developerName={developerName}
            developerId={developer.developerid}
            logoSrc={logoSrc || FALLBACK_IMAGE}
            fallbackImage={FALLBACK_IMAGE}
            onClose={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export const DeveloperCard = memo(DeveloperCardComponent);
DeveloperCard.displayName = "DeveloperCard";
