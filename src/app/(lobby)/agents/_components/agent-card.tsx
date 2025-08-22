"use client";

import {
  FacebookIcon,
  InstagramIcon,
  MapPin,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { DeveloperContactCard } from "@/components/developer-contact-card";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  website,
  className,
}: AgentCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [logoLoading, setLogoLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);

  const router = useRouter();

  const agentName = name;
  const listingsCount = formatNumber(listings);
  const logoSrc = logo
    ? `${process.env.NEXT_PUBLIC_CDN_URL ?? "https://dve7rykno93gs.cloudfront.net/fascimos/somics"}/${logo}`
    : "";
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
        className={`w-full bg-white transition-all duration-300 rounded-lg overflow-hidden hover:shadow-md ${
          className ?? ""
        }`}
        role="article"
        aria-label={`View details for ${agentName}`}
      >
        <div className="p-4 md:p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row gap-6 mb-6">
            {/* Logo/Avatar Section */}
            <div className="flex-shrink-0">
              <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                {logoLoading && !logoError && (
                  <Skeleton
                    className="absolute bg-gray-50 animate-pulse top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-md"
                    aria-label="Loading logo"
                  />
                )}

                <ImageWithFallback
                  src={logoSrc || fallbackImage}
                  alt={`${agentName} logo`}
                  className={`w-full h-full object-contain transition-opacity duration-300 ${
                    logoLoading ? "opacity-0" : "opacity-100"
                  }`}
                  width={96}
                  height={96}
                  onLoad={handleLogoLoad}
                  onError={handleLogoError}
                  quality={95}
                />
              </div>
            </div>

            {/* Agent Info Section */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-brand-accent font-semibold text-xl line-clamp-1">
                      {agentName}
                    </h2>
                    {isVerified === true ||
                    isVerified === "plus" ||
                    isVerified === "basic" ? (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 rounded-md">
                        <CheckCircle
                          className="h-4 w-4 text-green-600 flex-shrink-0"
                          aria-label="Verified agent"
                        />
                        <span className="text-xs text-green-700 font-medium line-clamp-1">
                          {isVerified === "plus"
                            ? "Premium Verified"
                            : "Verified"}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 border border-gray-200 rounded-md">
                        <span className="text-xs text-brand-muted font-medium">
                          Unverified
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-brand-muted mb-3">
                    <MapPin className="h-4 w-4 flex-shrink-0 text-brand-muted" />
                    <span className="text-sm line-clamp-1">
                      {location || "Location not available"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <Badge
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 rounded-sm hover:bg-blue-100 border-blue-200"
                    >
                      {listingsCount} listings
                    </Badge>
                  </div>
                </div>

                {/* Contact Button - Separate from navigation */}
                <div className="relative z-10">
                  <Button
                    onClick={handleContactAgent}
                    className="bg-brand-primary cursor-pointer hover:bg-brand-primary-darken text-white px-6 py-2 rounded-md transition-all"
                  >
                    Contact Agent
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          {socialIcons.length > 0 && (
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm text-brand-muted mr-2">Follow:</span>
              {socialIcons.map(({ platform, icon: Icon, url, hoverColor }) => (
                <button
                  key={platform}
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation();
                    handleSocialClick(platform, url);
                  }}
                  className={`p-3 rounded-full border border-gray-200 text-brand-muted transition-all duration-200 hover:border-transparent ${hoverColor} hover:scale-110 active:scale-95`}
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
              <div className="text-brand-muted leading-relaxed line-clamp-3">
                {description}
              </div>
            </div>
          )}

          {/* Clickable overlay for navigation - positioned above content but below button */}
          <Link
            href={agentDetailUrl}
            className="absolute inset-0 z-0"
            aria-label={`View details for ${agentName}`}
          />
        </div>
      </Card>

      {/* Contact Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-lg w-full overflow-hidden p-4 sm:p-6"
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
