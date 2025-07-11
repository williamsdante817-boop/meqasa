"use client";
import Image from "next/image";
import React from "react";
import { Badge } from "@/components/ui/badge";

interface PropertyImageProps {
  listing: {
    listingid?: number;
    image: string;
    type: string;
    contract: string;
  };
  index: number;
}

function PropertyImage({ listing, index }: PropertyImageProps) {
  const [imgLoading, setImgLoading] = React.useState(true);
  const [imgError, setImgError] = React.useState(false);

  return (
    <div key={listing.listingid ?? index} className="relative overflow-hidden">
      {!imgError ? (
        <Image
          src={listing.image}
          alt={`Property image for ${listing.type}`}
          fill
          sizes="(max-width: 768px) 33vw, 25vw"
          className={`object-cover transition-opacity duration-300 ${imgLoading ? "opacity-0" : "opacity-100"}`}
          onLoad={() => setImgLoading(false)}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gray-100" />
      )}
      {imgLoading && !imgError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse z-10" />
      )}
      <Badge className="absolute top-2 left-2 bg-brand-accent text-white uppercase">
        {listing.contract}
      </Badge>
    </div>
  );
}

interface AgentHeaderProps {
  agent: {
    name: string;
    logo?: string;
    listings?: Array<{
      listingid?: number;
      image: string;
      type: string;
      contract: string;
    }>;
  };
  logoUrl?: string;
}

export function AgentHeader({ agent, logoUrl }: AgentHeaderProps) {
  // Logo shimmer state
  const [logoLoading, setLogoLoading] = React.useState(true);
  const [logoError, setLogoError] = React.useState(false);

  return (
    <header className="h-[225px] gap-3 border-t-2 border-[#FD5372] md:flex md:h-[525px]">
      <div className="relative isolate flex h-full items-center justify-center shadow-sm md:w-[650px]">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <svg
            className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <pattern
                id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                width={200}
                height={200}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M100 200V.5M.5 .5H200" fill="none" />
              </pattern>
            </defs>
            <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
              <path
                d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                strokeWidth={0}
              />
            </svg>
            <rect
              width="100%"
              height="100%"
              strokeWidth={0}
              fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
            />
          </svg>
        </div>
        <div className="aspect-square rounded-md border bg-white p-4 shadow-sm relative">
          {!logoError ? (
            <Image
              alt={agent.name}
              src={logoUrl ?? ""}
              width={50}
              height={50}
              className={`h-[100px] w-[100px] object-cover rounded-md transition-opacity duration-300 ${logoLoading ? "opacity-0" : "opacity-100"}`}
              onLoad={() => setLogoLoading(false)}
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="h-[100px] w-[100px] bg-gray-100 rounded-md" />
          )}
          {logoLoading && !logoError && (
            <div className="absolute top-4 left-4 h-[100px] w-[100px] bg-gray-100 animate-pulse rounded-md z-10" />
          )}
        </div>
      </div>
      <div className="hidden h-full w-full grid-cols-3 grid-rows-2 gap-1 md:grid">
        {agent.listings?.slice(0, 6).map((listing, index) => (
          <PropertyImage key={listing.listingid ?? index} listing={listing} index={index} />
        ))}
      </div>
    </header>
  );
}
