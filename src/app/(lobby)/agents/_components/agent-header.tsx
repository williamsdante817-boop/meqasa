"use client";

import { ImageWithFallback } from "@/components/image-with-fallback";
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
      <Card className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8 my-4 sm:my-6 lg:my-8 shadow-none">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Left: Agent Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Logo */}
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <div className="relative w-32 h-32 md:w-16 md:h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  {logoUrl ? (
                    <ImageWithFallback
                      src={logoUrl}
                      alt={`${agent.name} logo`}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                      fallbackAlt={`${agent.name} logo`}
                      quality={95}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs font-medium">
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Agent Details */}
              <div className="flex-1 w-full">
                <div className="flex text-center sm:text-left flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-2 mb-3 sm:mb-2">
                  <div className="flex flex-row items-center justify-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-semibold text-brand-accent break-words">
                      {agent.name}
                    </h1>
                    {isVerified && (
                      <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-sm text-xs font-medium w-fit">
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
                  <div className="md:hidden flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-brand-muted flex-shrink-0" />
                      <span className="text-sm text-brand-muted break-words">
                        {location || "Not available"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      disabled={isSharing}
                      className="flex shadow-none items-center gap-2 text-brand-muted hover:text-brand-accent w-full sm:w-auto"
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
                      <span className="text-xs text-brand-muted">
                        {shareMessage}
                      </span>
                    )}
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-brand-muted flex-shrink-0" />
                    <span className="text-sm text-brand-muted break-words">
                      {location || "Not available"}
                    </span>
                  </div>
                </div>

                {/* About Section */}
                {agent.about && (
                  <div className="mb-4 hidden md:block">
                    <div
                      ref={aboutRef}
                      className={`text-sm text-brand-muted leading-relaxed transition-all duration-300 ease-in-out ${
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
                        className="text-sm text-brand-accent hover:text-brand-accent/80 font-medium mt-2 transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
                      >
                        {showFullAbout ? "See less" : "See more"}
                      </button>
                    )}
                  </div>
                )}

                {/* Commission Information */}
                {(agent.rentcommission ?? agent.salecommission) && (
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-center">
                      <p className="text-xs sm:text-sm font-medium text-brand-muted mb-1">
                        Rental Commission
                      </p>
                      <p className="text-base sm:text-lg font-semibold text-brand-accent">
                        {formatCommission(agent.rentcommission)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs sm:text-sm font-medium text-brand-muted mb-1">
                        Sale Commission
                      </p>
                      <p className="text-base sm:text-lg font-semibold text-brand-accent">
                        {formatCommission(agent.salecommission)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="hidden md:flex flex-row sm:flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center lg:justify-start">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div className="font-semibold text-brand-accent text-lg sm:text-xl">
                {totalListings}
              </div>
              <div className="text-xs sm:text-sm text-brand-muted">
                Active Listings
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
