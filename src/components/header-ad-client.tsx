"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { buildRichInnerHtml } from "@/lib/utils";

export default function HeaderAdClient() {
  const pathname = usePathname();
  const isSearchRoute = pathname?.startsWith("/search") || false;

  const [leaderboardBanner, setLeaderboardBanner] = React.useState<string[]>(
    [],
  );

  React.useEffect(() => {
    const fetchBanner = async () => {
      try {
        const endpoint = isSearchRoute
          ? "/api/banner/search"
          : "/api/banner/default";
        const response = await fetch(endpoint);
        const data = (await response.json()) as string[];
        setLeaderboardBanner(data);
      } catch {
        setLeaderboardBanner([]);
      }
    };

    void fetchBanner();
  }, [isSearchRoute]);

  return (
    <div
      className="py-[10px] border-b hidden lg:flex"
      role="banner"
      aria-label="Header advertisement"
    >
      <div className="mx-auto flex justify-between h-auto max-w-6xl w-[72rem]">
        <Link
          href="/"
          className="relative w-[240px] h-[90px]"
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
        {leaderboardBanner && leaderboardBanner.length > 0 && (
          <Card
            className="overflow-hidden rounded-sm p-0 shadow-none"
            role="complementary"
            aria-label="Advertisement"
          >
            <div
              dangerouslySetInnerHTML={buildRichInnerHtml(
                String(leaderboardBanner),
              )}
            ></div>
          </Card>
        )}
      </div>
    </div>
  );
}
