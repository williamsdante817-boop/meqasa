"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buildRichInnerHtml } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logger } from "@/lib/logger";

export default function HeaderAdClient() {
  const pathname = usePathname();
  const [bannerData, setBannerData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBanner() {
      setIsLoading(true);
      try {
        // Determine which banner endpoint to use based on route
        const isSearchPage = pathname?.includes("/search");
        const endpoint = isSearchPage
          ? "/api/banner/search"
          : "/api/banner/default";

        const response = await fetch(endpoint);
        const data = await response.json();

        // Extract HTML from banner array
        if (Array.isArray(data) && data.length > 0) {
          const htmlArray = data
            .map((b: { html: string }) => b.html)
            .filter(Boolean);
          setBannerData(htmlArray);
        } else {
          setBannerData([]);
        }
      } catch (error) {
        logger.error("Failed to fetch leaderboard banner:", error);
        setBannerData([]);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchBanner();
  }, [pathname]);

  const hasBanner = bannerData.length > 0;

  return (
    <div
      className="hidden border-b border-gray-200 py-[10px] lg:flex"
      role="banner"
      aria-label="Header advertisement"
    >
      <div className="mx-auto flex h-auto w-[72rem] max-w-6xl justify-between">
        <Link
          href="/"
          className="relative h-[90px] w-[240px]"
          aria-label="Meqasa Home"
        >
          <Image
            src="/logo.png"
            alt="Meqasa Logo"
            fill
            sizes="(max-width: 240px) 100vw, 240px"
            className="object-contain"
            priority
          />
        </Link>
        {isLoading ? (
          <Skeleton className="h-[90px] w-[728px] rounded-sm" />
        ) : hasBanner ? (
          <Card
            className="overflow-hidden rounded-sm p-0 shadow-none"
            role="complementary"
            aria-label="Advertisement"
          >
            <div
              className="[&_a]:pointer-events-auto [&_a]:cursor-pointer [&_img]:pointer-events-none"
              dangerouslySetInnerHTML={buildRichInnerHtml(bannerData[0] || "")}
            />
          </Card>
        ) : null}
      </div>
    </div>
  );
}
