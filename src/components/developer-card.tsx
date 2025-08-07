"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Dot, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ContactCard from "./contact-card";

interface Developer {
  developerid: string;
  about: string;
  email: string;
  logo: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
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

export function DeveloperCard({ developer, className }: DeveloperCardProps) {
  const [imageError, setImageError] = useState(false);
  const [heroError, setHeroError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [heroLoading, setHeroLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const handleImageError = () => setImageError(true);
  const handleHeroError = () => setHeroError(true);

  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-gray-200 text-b-accent shadow-sm p-0 gap-3",
        className,
      )}
      role="article"
      aria-labelledby={`developer-title-${developer.developerid}`}
    >
      <div
        className="relative flex h-14 items-center bg-[#A48851] justify-between px-3 font-bold text-white"
        role="banner"
      >
        <h2 id={`developer-title-${developer.developerid}`}>
          {developer.companyname}
        </h2>
        <div className="absolute right-3 top-6 max-h-[60px] w-full max-w-[60px] overflow-hidden rounded-full shadow">
          <div className="h-full w-full">
            {!imageError ? (
              <div className="relative h-[60px] w-[60px]">
                <div
                  className={cn(
                    "absolute inset-0 rounded-full bg-gray-200 transition-opacity duration-300",
                    imageLoading ? "opacity-100" : "opacity-0",
                  )}
                />
                <Image
                  className="h-[60px] w-[60px] rounded-full object-contain"
                  width={170}
                  height={100}
                  src={
                    developer.logo
                      ? `https://dve7rykno93gs.cloudfront.net/uploads/imgs/${developer.logo}`
                      : "/placeholder-image.png"
                  }
                  alt={`${developer.companyname} logo`}
                  sizes="120px"
                  onError={handleImageError}
                  onLoad={() => setImageLoading(false)}
                  priority
                />
              </div>
            ) : (
              <div className="h-[60px] w-[60px] rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm ">
                  {developer.companyname.charAt(0)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <CardContent className="flex flex-col gap-2 p-0 md:flex-row md:p-3">
        <Link
          href={`/projects-by-developer/${developer.companyname.toLowerCase().replace(/\s+/g, "-")}-${developer.developerid}`}
          className="flex w-full flex-col md:min-w-[200px] md:max-w-[200px]"
          aria-label={`View ${developer.companyname} projects`}
        >
          <div className="w-full rounded-md">
            {!heroError ? (
              <div className="relative h-[150px] w-full md:h-full">
                <div
                  className={cn(
                    "absolute inset-0 rounded-xl bg-gray-200 transition-opacity duration-300",
                    heroLoading ? "opacity-100" : "opacity-0",
                  )}
                />
                <Image
                  className="h-[150px] w-full rounded-xl object-cover md:h-full"
                  width={200}
                  height={100}
                  src={`https://dve7rykno93gs.cloudfront.net/uploads/imgs/${developer.hero}`}
                  alt={`${developer.companyname} cover image`}
                  sizes="120px"
                  onError={handleHeroError}
                  onLoad={() => setHeroLoading(false)}
                />
              </div>
            ) : (
              <div className="h-[150px] w-full rounded-xl bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
        </Link>
        <div className="grow p-3 pt-0">
          <Link
            href={`/projects-by-developer/${developer.companyname.toLowerCase().replace(/\s+/g, "-")}-${developer.developerid}`}
            aria-label={`View ${developer.companyname} projects`}
          >
            <div className="flex">
              <div className="grow">
                <h3 className="mb-1.5 text-lg text-brand-accent font-bold capitalize">
                  {developer.companyname}
                </h3>
                <div className="flex items-center gap-2 text-brand-muted mb-2">
                  <MapPin className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="line-clamp-1">
                    {developer.address !== ""
                      ? developer.address
                      : "Not Available"}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-[#1d2951] font-medium">
                  <span>{developer.unitcount} units</span>
                  <Dot aria-hidden="true" />
                  <span>{developer.prcount} projects</span>
                </div>
              </div>
            </div>
            <p className="text-brand-muted leading-relaxed mt-2">
              {developer.about}
            </p>
          </Link>
        </div>
      </CardContent>
      <CardFooter className="flex items-center">
        <div className="flex h-fit w-full mb-3 items-end justify-end">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-brand-primary hover:bg-brand-primary"
                aria-label={`Contact ${developer.companyname}`}
              >
                Contact Developer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-fit h-fit overflow-y-auto p-0">
              <div className="h-full">
                <ContactCard
                  name={developer.companyname}
                  image={developer.logo}
                  src
                  projectId={developer.developerid}
                  pageType="project"
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardFooter>
    </Card>
  );
}
