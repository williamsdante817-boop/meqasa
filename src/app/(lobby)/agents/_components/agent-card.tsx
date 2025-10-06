"use client";

import {
  CheckCircle,
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  MapPin,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";
import Link from "next/link";
import type { MouseEvent } from "react";
import { useState } from "react";

import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { DeveloperContactCard } from "@/components/developer/cards/developer-contact-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { buildAgentLogoUrl } from "@/lib/image-utils";
import { formatNumber } from "@/lib/utils";

interface BrokerSocials {
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  youtube: string | null;
  facebook: string | null;
}

interface AgentCardProps {
  id: string;
  name: string;
  logo: string;
  location: string;
  listings: string;
  description: string;
  isVerified: string | boolean;
  socials: BrokerSocials;
  website: string;
  className?: string;
}

export function AgentCard({
  description,
  id,
  isVerified,
  listings,
  location,
  logo,
  name,
  socials,
  className,
}: AgentCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [logoLoading, setLogoLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);

  const agentName = name;
  const listingsCount = formatNumber(listings);
  const logoSrc = buildAgentLogoUrl(logo);
  const fallbackImage = "/placeholder-image.png";

  const handleContactAgent = () => setIsOpen(true);

  const handleSocialClick = (platform: string, url: string | null) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleLogoError = () => {
    setLogoLoading(false);
    setLogoError(true);
  };

  const handleLogoLoad = () => {
    setLogoLoading(false);
    setLogoError(false);
  };

  const socialIcons = [
    {
      platform: "LinkedIn",
      icon: LinkedinIcon,
      url: socials.linkedin,
      hoverColor: "hover:bg-blue-50 hover:text-blue-600",
    },
    {
      platform: "Facebook",
      icon: FacebookIcon,
      url: socials.facebook,
      hoverColor: "hover:bg-blue-50 hover:text-blue-600",
    },
    {
      platform: "Instagram",
      icon: InstagramIcon,
      url: socials.instagram,
      hoverColor: "hover:bg-pink-50 hover:text-pink-600",
    },
    {
      platform: "Twitter",
      icon: TwitterIcon,
      url: socials.twitter,
      hoverColor: "hover:bg-sky-50 hover:text-sky-600",
    },
    {
      platform: "YouTube",
      icon: YoutubeIcon,
      url: socials.youtube,
      hoverColor: "hover:bg-red-50 hover:text-red-600",
    },
  ].filter(({ url }) => url);

  const agentDetailUrl = `/agents/${encodeURIComponent(name.toLowerCase())}?g=${id}`;

  return (
    <>
      <Card
        className={`w-full overflow-hidden rounded-lg bg-white transition-all duration-300 hover:shadow-md ${
          className ?? ""
        }`}
        role="article"
        aria-label={`View details for ${agentName}`}
      >
        <div className="p-4 md:p-8">
          {/* Header Section */}
          <div className="mb-6 flex flex-col gap-6 sm:flex-row">
            {/* Logo/Avatar Section */}
            <div className="flex-shrink-0">
              <div className="relative h-16 w-16 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                {logoLoading && !logoError && (
                  <Skeleton
                    className="absolute top-1/2 left-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 transform animate-pulse rounded-md bg-gray-50"
                    aria-label="Loading logo"
                  />
                )}

                <ImageWithFallback
                  src={logoSrc || fallbackImage}
                  alt={`${agentName} logo`}
                  className={`h-full w-full object-contain transition-opacity duration-300 ${
                    logoLoading ? "opacity-0" : "opacity-100"
                  }`}
                  width={96}
                  height={96}
                  onLoad={handleLogoLoad}
                  onError={handleLogoError}
                  quality={95}
                  imageType="agent-logo"
                  imageSize="medium"
                />
              </div>
            </div>

            {/* Agent Info Section */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <Link
                      href={agentDetailUrl}
                      className="hover:text-brand-accent-darken transition-colors duration-200"
                    >
                      <h2 className="text-brand-accent line-clamp-1 text-xl font-semibold">
                        {agentName}
                      </h2>
                    </Link>
                    {isVerified === true ||
                    isVerified === "plus" ||
                    isVerified === "basic" ? (
                      <div className="flex items-center gap-1 rounded-md border border-green-200 bg-green-50 px-2 py-1">
                        <CheckCircle
                          className="h-4 w-4 flex-shrink-0 text-green-600"
                          aria-label="Verified agent"
                        />
                        <span className="line-clamp-1 text-xs font-medium text-green-700">
                          {isVerified === "plus"
                            ? "Premium Verified"
                            : "Verified"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-1">
                        <span className="text-brand-muted text-xs font-medium">
                          Unverified
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-brand-muted mb-3 flex flex-nowrap items-center gap-2 overflow-hidden">
                    <MapPin className="text-brand-muted h-4 w-4 flex-shrink-0" />
                    <span className="truncate text-sm">
                      {location || "Location not available"}
                    </span>
                  </div>

                  <div className="mb-3 flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="rounded-sm border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      {listingsCount} listings
                    </Badge>
                  </div>
                </div>

                {/* Contact Button - Separate from navigation */}
                <div className="relative z-10">
                  <Button
                    onClick={handleContactAgent}
                    className="bg-brand-primary hover:bg-brand-primary-darken cursor-pointer rounded-md px-6 py-2 text-white transition-all"
                  >
                    Contact Agent
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          {socialIcons.length > 0 && (
            <div className="mb-6 flex items-center gap-3">
              <span className="text-brand-muted mr-2 text-sm">Follow:</span>
              {socialIcons.map(({ platform, icon: Icon, url, hoverColor }) => (
                <button
                  key={platform}
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    handleSocialClick(platform, url);
                  }}
                  className={`text-brand-muted rounded-full border border-gray-200 p-3 transition-all duration-200 hover:border-transparent ${hoverColor} hover:scale-110 active:scale-95`}
                  aria-label={`Visit ${agentName}'s ${platform} profile`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          )}

          {/* Description Section */}
          {description && (
            <div className="space-y-4">
              <div className="text-brand-muted line-clamp-3 leading-relaxed">
                {description}
              </div>
            </div>
          )}

          {/* Navigation link - only for the agent name and info area */}
          <div className="mt-4">
            <Link
              href={agentDetailUrl}
              className="text-brand-accent hover:text-brand-accent-darken inline-flex items-center font-medium transition-colors duration-200"
              aria-label={`View details for ${agentName}`}
            >
              View Details →
            </Link>
          </div>
        </div>
      </Card>

      {/* Contact Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="w-full max-w-lg overflow-hidden p-4 sm:p-6"
          aria-label={`Contact ${name} dialog`}
        >
          <DeveloperContactCard
            developerName={name}
            developerId={id}
            logoSrc={logoSrc || fallbackImage}
            fallbackImage={fallbackImage}
            onClose={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
