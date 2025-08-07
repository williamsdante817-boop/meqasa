/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Building2,
  FacebookIcon,
  InstagramIcon,
  MapPin,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import ContactCard from "@/components/contact-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn, formatNumber } from "@/lib/utils";

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
  isVerified: boolean;
  socials: BrokerSocials;
  website: string;
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
}: AgentCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const logoUrl = logo
    ? `https://dve7rykno93gs.cloudfront.net/fascimos/somics/${logo}`
    : "";

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  const socialLinks = [
    { icon: FacebookIcon, url: socials.facebook, label: "Facebook" },
    { icon: InstagramIcon, url: socials.instagram, label: "Instagram" },
    { icon: TwitterIcon, url: socials.twitter, label: "Twitter" },
    { icon: YoutubeIcon, url: socials.youtube, label: "YouTube" },
  ].filter((social) => social.url);

  return (
    <Card className="w-full max-w-5xl mx-auto p-8 bg-white border border-gray-200 rounded-xl">
      <div className="flex items-start gap-8">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <div className="relative w-32 h-32 bg-white border border-gray-200 rounded-md flex items-center justify-center p-4">
            <Link href={`/agents/${id}`} aria-label={`View ${name}'s profile`}>
              {!imageError && logo ? (
                <>
                  {isImageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-muted">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                  )}
                  <Image
                    className={cn(
                      "h-full w-full object-contain transition-opacity duration-300",
                      isImageLoading ? "opacity-0" : "opacity-100",
                    )}
                    width={170}
                    height={100}
                    src={logoUrl}
                    alt={`${name} logo`}
                    sizes="120px"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    priority={false}
                  />
                </>
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center bg-muted"
                  role="img"
                  aria-label={`Placeholder for ${name}'s logo`}
                >
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <Link
          href={`/agents/${id}`}
          className="flex-1 hover:opacity-80 transition-opacity"
        >
          <div className="mb-6">
            <h3 className="mb-1.5 text-lg text-brand-accent font-bold capitalize">
              {name.toLocaleLowerCase()}
            </h3>

            <div className="flex items-center gap-2 text-brand-muted mb-2">
              <MapPin className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="line-clamp-1">
                {location !== "" ? location : "Not Available"}
              </span>
            </div>

            <Badge
              variant="secondary"
              className="text-brand-accent text-sm font-medium"
            >
              {formatNumber(listings)} listings
            </Badge>
          </div>

          {description && (
            <div className="mb-6">
              <p className="text-brand-muted leading-relaxed">{description}</p>
            </div>
          )}
        </Link>

        {/* Social Media Section - moved outside the main Link to avoid nested <a> tags */}
        {socialLinks.length > 0 && (
          <div className="flex items-center gap-3 mt-2">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                aria-label={`Visit ${name}'s ${social.label}`}
              >
                <social.icon className="w-5 h-5 text-gray-400 hover:text-brand-primary cursor-pointer" />
              </a>
            ))}
          </div>
        )}

        {/* Contact Button */}
        <div className="flex-shrink-0">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-brand-primary hover:bg-brand-primary focus:ring-2 focus:ring-offset-2"
                aria-label={`Contact ${name}`}
              >
                Contact Agent
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-4xl w-fit h-fit overflow-y-auto p-0"
              aria-label={`Contact ${name} dialog`}
            >
              <div className="h-full">
                <ContactCard
                  name={name}
                  image={logoUrl}
                  src
                  listingId={id}
                  pageType="listing"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Card>
  );
}
