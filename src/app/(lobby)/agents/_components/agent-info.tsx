"use client";

import Link from "next/link";
import {
  Building,
  FacebookIcon,
  InstagramIcon,
  MapPin,
  Share2,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AgentInfoProps {
  agent: {
    name: string;
    verified: string;
    locality: string;
    company: string;
    socials?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      youtube?: string;
    };
    rentcommission?: string;
    salecommission?: string;
    about: string;
    experience?: string;
    activelistings: number;
  };
}

export function AgentInfo({ agent }: AgentInfoProps) {
  // Format commission values with two decimal places and % sign
  const formatCommission = (value?: string) => {
    if (!value) return "-";
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "-";
    return `${numValue.toFixed(2)}%`;
  };

  return (
    <div className="text-brand-accent">
      <div className="flex flex-col items-start gap-3 md:flex-row md:justify-between md:gap-0">
        <div>
          <h1 className="flex items-center text-[23px] font-bold leading-5 text-brand-accent md:leading-8">
            {agent.name}
            {agent.verified && (
              <Badge className="ml-2 bg-green-500 uppercase text-white">
                {agent.verified ? "Verified Agent" : ""}
              </Badge>
            )}
          </h1>
          <p className="text-l mt-2 flex items-center gap-2 text-brand-muted">
            <MapPin className="h-5 w-5 text-brand-primary" strokeWidth="1.3" />
            {agent.locality}
          </p>
          {agent.company ? (
            <p className="text-l mt-2 flex items-center gap-2 text-brand-muted">
              <Building
                className="h-5 w-5 text-brand-primary"
                strokeWidth="1.3"
              />
              {agent.company}
            </p>
          ) : null}
        </div>
        <Button
          size="default"
          variant="outline"
          aria-label="Share agent profile"
          onClick={async () => {
            const shareUrl = window.location.href;
            const shareData = {
              title: `Agent: ${agent.name}`,
              text: `Check out this agent on Meqasa: ${agent.name}`,
              url: shareUrl,
            };
            if (navigator.share) {
              try {
                await navigator.share(shareData);
              } catch (err) {
                // User cancelled or error
              }
            } else if (navigator.clipboard) {
              try {
                await navigator.clipboard.writeText(shareUrl);
                toast.success("Link copied to clipboard!");
              } catch (err) {
                toast.error("Failed to copy link.");
              }
            } else {
              // fallback for very old browsers
              toast("Copy this link: " + shareUrl);
            }
          }}
        >
          <span>Share</span>
          <Share2
            className="h-5 w-5 text-brand-muted"
            strokeWidth="1.3"
            aria-hidden="true"
            focusable="false"
          />
        </Button>
      </div>

      <div className="my-8 flex max-w-full items-center gap-6 md:gap-3">
        <Link
          href={agent.socials?.facebook ?? "#"}
          aria-label="Facebook (placeholder)"
          tabIndex={-1}
          aria-disabled="true"
        >
          <FacebookIcon
            className="h-5 w-5"
            strokeWidth="1.3"
            aria-hidden="true"
            focusable="false"
          />
        </Link>
        <Link
          href={agent.socials?.instagram ?? "#"}
          aria-label="Instagram (placeholder)"
          tabIndex={-1}
          aria-disabled="true"
        >
          <InstagramIcon
            className="h-5 w-5"
            strokeWidth="1.3"
            aria-hidden="true"
            focusable="false"
          />
        </Link>
        <Link
          href={agent.socials?.twitter ?? "#"}
          aria-label="Twitter (placeholder)"
          tabIndex={-1}
          aria-disabled="true"
        >
          <TwitterIcon
            className="h-5 w-5"
            strokeWidth="1.3"
            aria-hidden="true"
            focusable="false"
          />
        </Link>
        <Link
          href={agent.socials?.youtube ?? "#"}
          aria-label="YouTube (placeholder)"
          tabIndex={-1}
          aria-disabled="true"
        >
          <YoutubeIcon
            className="h-6 w-6"
            strokeWidth="1.3"
            aria-hidden="true"
            focusable="false"
          />
        </Link>
      </div>

      <div className="mb-10 grid grid-cols-3 divide-x border-y border-gray-100 px-2 py-8">
        <div>
          <p className="font-semibold capitalize md:text-lg">commission</p>
        </div>
        <div>
          <p className="text-center font-semibold capitalize md:text-lg">
            rental :{" "}
            <span className="font-medium text-brand-muted">
              {formatCommission(agent.rentcommission)}
            </span>
          </p>
        </div>
        <div>
          <p className="text-center font-semibold capitalize md:text-lg">
            sale :{" "}
            <span className="font-medium text-brand-muted">
              {formatCommission(agent.salecommission)}
            </span>
          </p>
        </div>
      </div>

      <div className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">
          About {agent.name.split(" ")[0]}
        </h2>
        <p className="text-brand-muted">{agent.about}</p>
      </div>

      {agent.experience?.trim() && (
        <div className="mb-10 border-b border-gray-100 pb-8">
          <p className="text-lg font-semibold capitalize">
            Experience :{" "}
            <span className="inline-block font-medium lowercase text-brand-muted">
              {agent.experience}
            </span>
          </p>
        </div>
      )}

      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-2xl font-bold text-brand-accent">
          Listings By {agent.name}
        </h2>
        <Badge className="bg-brand-primary text-white font-semibold">
          {agent.activelistings}{" "}
          {agent.activelistings === 1 ? "listing" : "listings"}
        </Badge>
      </div>
    </div>
  );
}
