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
        className={`w-full bg-white transition-all duration-300 rounded-lg overflow-hidden hover:shadow-md ${
          className ?? ""
        }`}
        role="article"
        aria-label={`View details for ${developerName}`}
      >
        <div className="p-4 md:p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            {/* Logo/Avatar Section - Clickable */}
            <Link
              href={developerDetailUrl}
              className="flex-shrink-0 hover:opacity-80 transition-opacity"
              aria-label={`View details for ${developerName}`}
            >
              <div
                className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200"
                role="img"
                aria-label={`${developerName} company logo`}
              >
                {logoLoading && !logoError && (
                  <Skeleton
                    className="absolute bg-gray-50 animate-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-md"
                    aria-label="Loading logo"
                  />
                )}

                <ImageWithFallback
                  src={logoSrc || FALLBACK_IMAGE}
                  alt={`${developerName} logo`}
                  className={`w-full h-full object-contain transition-opacity duration-300 ${
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
              className="flex-1 min-w-0 hover:opacity-80 transition-opacity"
              aria-label={`View details for ${developerName}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-brand-accent font-semibold text-xl line-clamp-1">
                      {developerName}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 text-brand-muted mb-3 flex-nowrap overflow-hidden">
                    <MapPin className="h-4 w-4 flex-shrink-0 text-brand-muted" />
                    <span className="text-sm truncate">
                      {developer.address || "Location not available"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <Badge
                      variant="secondary"
                      className="bg-brand-blue/10 text-brand-blue rounded-sm hover:bg-brand-blue/20 border-brand-blue/30"
                    >
                      {unitsCount} units
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="bg-brand-badge-completed/10 text-brand-badge-completed rounded-sm hover:bg-brand-badge-completed/20 border-brand-badge-completed/30"
                    >
                      {projectsCount} projects
                    </Badge>
                  </div>
                </div>

                {/* Contact Button - Separate from navigation */}
                <div className="relative z-10">
                  <Button
                    onClick={handleContactDeveloper}
                    className="bg-brand-primary cursor-pointer hover:bg-brand-primary-darken text-white px-6 py-2 rounded-md transition-all"
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
              className="block mb-6 hover:opacity-80 transition-opacity"
              aria-label={`View details for ${developerName}`}
            >
              <div className="relative w-full h-48 rounded-md overflow-hidden border bg-gray-100">
                {heroLoading && !heroError && (
                  <Skeleton
                    className="absolute bg-gray-50 animate-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full"
                    aria-label="Loading hero image"
                  />
                )}

                <ImageWithFallback
                  src={heroSrc || FALLBACK_IMAGE}
                  alt={`${developerName} cover image`}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
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
              className="block hover:opacity-80 transition-opacity"
              aria-label={`View details for ${developerName}`}
            >
              <div className="space-y-4">
                <div className="text-brand-muted leading-relaxed line-clamp-3">
                  {developer.about}
                </div>
              </div>
            </Link>
          )}
        </div>
      </Card>

      {/* Contact Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg w-full overflow-hidden p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-center text-brand-accent">
              Contact {developerName}
            </DialogTitle>
            <DialogDescription className="text-center text-brand-muted">
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
