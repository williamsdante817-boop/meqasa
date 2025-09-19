"use client";

import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, CheckCircle, MapPin, Share } from "lucide-react";
import React from "react";

interface AgentHeaderProps {
  agent: {
    name: string;
    logo?: string;
    locality?: string;
    company?: string;
    verified?: "plus" | "agent" | "owner" | "";
    activelistings?: string;
    listings?: Array<{
      listingid?: number;
      image: string;
      type: string;
      contract: string;
    }>;
    socials?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      youtube?: string;
    };
    rentcommission?: string;
    salecommission?: string;
    about?: string;
  };
  logoUrl?: string;
}

export function AgentHeader({ agent, logoUrl }: AgentHeaderProps) {
  const [isSharing, setIsSharing] = React.useState(false);
  const [shareMessage, setShareMessage] = React.useState("");
  const [showFullAbout, setShowFullAbout] = React.useState(false);
  const [shouldShowToggle, setShouldShowToggle] = React.useState(false);
  const aboutRef = React.useRef<HTMLDivElement>(null);

  // Use actual data from API instead of hardcoded values
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const companyName = agent.company ?? agent.name;
  const location = agent.locality?.trim() ?? "Not available";

  const totalListings = parseInt(agent.activelistings ?? "0") || 0;

  // Check if agent is verified
  const isVerified = Boolean(agent.verified);

  // Format commission values with two decimal places and % sign
  const formatCommission = (value?: string) => {
    if (!value) return "-";
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "-";
    return `${numValue.toFixed(2)}%`;
  };

  const handleShare = async () => {
    setIsSharing(true);
    setShareMessage("");

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${agent.name} - Real Estate Agent`,
          text: `Check out ${agent.name}'s real estate listings and services`,
          url: window.location.href,
        });
        setShareMessage("Shared successfully!");
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setShareMessage("Link copied to clipboard!");
      }
    } catch {
      setShareMessage("Failed to share. Please try again.");
    } finally {
      setIsSharing(false);
      // Clear message after 3 seconds
      setTimeout(() => setShareMessage(""), 3000);
    }
  };

  const toggleAbout = () => {
    setShowFullAbout(!showFullAbout);
  };

  // Check if text needs truncation after component mounts
  React.useEffect(() => {
    if (aboutRef.current && agent.about) {
      const element = aboutRef.current;
      const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
      const maxHeight = lineHeight * 4; // 4 lines
      setShouldShowToggle(element.scrollHeight > maxHeight);
    }
  }, [agent.about]);

  return (
    <div className="w-full">
      {/* Agent Profile Section */}
      <Card className="my-4 rounded-lg border border-gray-200 bg-white p-4 shadow-none sm:my-6 sm:p-6 lg:my-8 lg:p-8">
        <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:gap-8">
          {/* Left: Agent Info */}
          <div className="flex-1">
            <div className="mb-4 flex flex-col items-start gap-4 sm:mb-6 sm:flex-row sm:gap-6">
              {/* Logo */}
              <div className="mx-auto flex-shrink-0 sm:mx-0">
                <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 sm:h-20 sm:w-20 md:h-16 md:w-16">
                  {logoUrl ? (
                    <ImageWithFallback
                      src={logoUrl}
                      alt={`${agent.name} logo`}
                      width={80}
                      height={80}
                      className="h-full w-full object-contain"
                      fallbackAlt={`${agent.name} logo`}
                      quality={95}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs font-medium text-gray-500">
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Agent Details */}
              <div className="w-full flex-1">
                <div className="mb-3 flex flex-col gap-3 text-center sm:mb-2 sm:flex-row sm:items-start sm:justify-between sm:gap-2 sm:text-left">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <h1 className="text-brand-accent text-xl font-semibold break-words sm:text-2xl">
                      {agent.name}
                    </h1>
                    {isVerified && (
                      <div className="flex w-fit items-center gap-1 rounded-sm bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                        <CheckCircle className="h-3 w-3" />
                        <span className="hidden sm:inline">
                          {agent.verified === "plus"
                            ? "Plus Verified"
                            : agent.verified === "agent"
                              ? "Verified Agent"
                              : agent.verified === "owner"
                                ? "Verified Owner"
                                : "Verified"}
                        </span>
                        <span className="sm:hidden">
                          {agent.verified === "plus"
                            ? "Plus"
                            : agent.verified === "agent"
                              ? "Agent"
                              : agent.verified === "owner"
                                ? "Owner"
                                : "✓"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mb-4 flex items-center gap-4 md:hidden">
                    <div className="flex items-center gap-1">
                      <MapPin className="text-brand-muted h-4 w-4 flex-shrink-0" />
                      <span className="text-brand-muted text-sm break-words">
                        {location || "Not available"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      disabled={isSharing}
                      className="text-brand-muted hover:text-brand-accent flex w-full items-center gap-2 shadow-none sm:w-auto"
                      aria-label={`Share ${agent.name}'s profile`}
                    >
                      <Share className="h-4 w-4" />
                      <span className="hidden sm:inline">
                        {isSharing ? "Sharing..." : "Share"}
                      </span>
                      <span className="sm:hidden">
                        {isSharing ? "..." : "Share"}
                      </span>
                    </Button>
                    {shareMessage && (
                      <span className="text-brand-muted text-xs">
                        {shareMessage}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-4 hidden items-center gap-4 md:flex">
                  <div className="flex items-center gap-1">
                    <MapPin className="text-brand-muted h-4 w-4 flex-shrink-0" />
                    <span className="text-brand-muted text-sm break-words">
                      {location || "Not available"}
                    </span>
                  </div>
                </div>

                {/* About Section */}
                {agent.about && (
                  <div className="mb-4 hidden md:block">
                    <div
                      ref={aboutRef}
                      className={`text-brand-muted text-sm leading-relaxed transition-all duration-300 ease-in-out ${
                        showFullAbout ? "" : "overflow-hidden"
                      }`}
                      style={{
                        display: showFullAbout ? "block" : "-webkit-box",
                        WebkitLineClamp: showFullAbout ? "unset" : 4,
                        WebkitBoxOrient: showFullAbout ? "unset" : "vertical",
                        maxHeight: showFullAbout ? "none" : "2.5rem", // 4 lines * 1.375 line-height
                        transform: showFullAbout ? "scale(1)" : "scale(0.98)",
                        opacity: showFullAbout ? 1 : 0.95,
                      }}
                    >
                      {agent.about}
                    </div>
                    {shouldShowToggle && (
                      <button
                        onClick={toggleAbout}
                        className="text-brand-accent hover:text-brand-accent/80 mt-2 text-sm font-medium transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
                      >
                        {showFullAbout ? "See less" : "See more"}
                      </button>
                    )}
                  </div>
                )}

                {/* Commission Information */}
                {(agent.rentcommission ?? agent.salecommission) && (
                  <div className="grid grid-cols-2 gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:gap-4 sm:p-4">
                    <div className="text-center">
                      <p className="text-brand-muted mb-1 text-xs font-medium sm:text-sm">
                        Rental Commission
                      </p>
                      <p className="text-brand-accent text-base font-semibold sm:text-lg">
                        {formatCommission(agent.rentcommission)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-brand-muted mb-1 text-xs font-medium sm:text-sm">
                        Sale Commission
                      </p>
                      <p className="text-brand-accent text-base font-semibold sm:text-lg">
                        {formatCommission(agent.salecommission)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="hidden flex-row justify-center gap-4 sm:flex-col sm:gap-6 md:flex lg:flex-row lg:justify-start lg:gap-8">
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 sm:h-12 sm:w-12">
                <Building2 className="h-5 w-5 text-blue-600 sm:h-6 sm:w-6" />
              </div>
              <div className="text-brand-accent text-lg font-semibold sm:text-xl">
                {totalListings}
              </div>
              <div className="text-brand-muted text-xs sm:text-sm">
                Active Listings
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
