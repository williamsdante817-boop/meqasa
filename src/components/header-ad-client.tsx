"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorStateCard } from "@/components/common/error-state-card";
import { buildRichInnerHtml } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useResilientFetch } from "@/hooks/use-resilient-fetch";

const bannerCache = new Map<string, string[]>();

const arraysEqual = (a: string[] | null, b: string[] | null): boolean => {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
};

export default function HeaderAdClient() {
  const pathname = usePathname();
  const isSearchRoute = pathname?.startsWith("/search") || false;

  const endpoint = useMemo(
    () => (isSearchRoute ? "/api/banner/search" : "/api/banner/default"),
    [isSearchRoute]
  );

  const [cachedBanner, setCachedBanner] = useState<string[] | null>(() =>
    bannerCache.get(endpoint) ?? null
  );

  useEffect(() => {
    setCachedBanner(bannerCache.get(endpoint) ?? null);
  }, [endpoint]);

  const {
    data: bannerData,
    loading: isLoading,
    error,
  } = useResilientFetch<string[]>({
    input: endpoint,
  });

  useEffect(() => {
    if (!error) return;
    console.error("Header leaderboard fetch failed", error);
  }, [error]);

  useEffect(() => {
    if (!bannerData || bannerData.length === 0) {
      return;
    }

    if (!arraysEqual(cachedBanner, bannerData)) {
      bannerCache.set(endpoint, bannerData);
      setCachedBanner(bannerData);
    }
  }, [bannerData, cachedBanner, endpoint]);

  const leaderboardBanner = cachedBanner ?? bannerData ?? [];
  const hasError = Boolean(error);
  const isBannerLoading = !cachedBanner && isLoading;

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
        {isBannerLoading ? (
          <Skeleton
            className="h-[90px] w-[728px] rounded-sm"
            variant="shimmer"
            aria-label="Loading advertisement banner"
          />
        ) : leaderboardBanner.length > 0 ? (
          <Card
            className="overflow-hidden rounded-sm p-0 shadow-none"
            role="complementary"
            aria-label="Advertisement"
          >
            <div
              dangerouslySetInnerHTML={buildRichInnerHtml(
                String(leaderboardBanner)
              )}
            />
          </Card>
        ) : hasError ? (
          <ErrorStateCard
            variant="error"
            title="Unable to load sponsored content"
            description="Please refresh the page or try again later."
            className="w-[728px]"
          />
        ) : (
          <ErrorStateCard
            variant="info"
            title="Sponsored content is currently unavailable"
            description="Our partners will update this space shortly."
            className="w-[728px]"
          />
        )}
      </div>
    </div>
  );
}
