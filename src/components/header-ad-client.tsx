"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buildRichInnerHtml } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function HeaderAdClient() {
  const pathname = usePathname();
  const isSearchRoute = pathname?.startsWith("/search") || false;

  const [leaderboardBanner, setLeaderboardBanner] = React.useState<string[]>(
    []
  );
  const [isLoading, setIsLoading] = React.useState(true);

  console.log("leaderboardBanner", leaderboardBanner);

  React.useEffect(() => {
    const fetchBanner = async () => {
      setIsLoading(true);
      try {
        const endpoint = isSearchRoute
          ? "/api/banner/search"
          : "/api/banner/default";
        const response = await fetch(endpoint);
        const data = (await response.json()) as string[];
        setLeaderboardBanner(data);
      } catch {
        setLeaderboardBanner([]);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchBanner();
  }, [isSearchRoute]);

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
          <Skeleton
            className="h-[90px] w-[728px] rounded-sm"
            variant="shimmer"
            aria-label="Loading advertisement banner"
          />
        ) : (
          leaderboardBanner &&
          leaderboardBanner.length > 0 && (
            <Card
              className="overflow-hidden rounded-sm p-0 shadow-none"
              role="complementary"
              aria-label="Advertisement"
            >
              <div
                dangerouslySetInnerHTML={buildRichInnerHtml(
                  String(leaderboardBanner)
                )}
              ></div>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
