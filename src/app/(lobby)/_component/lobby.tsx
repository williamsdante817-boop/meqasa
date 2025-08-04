import { HomepagePopup } from "@/components/homepage-popup";

import { SearchFilter } from "@/components/search";
import {
  StaticAgentLogos,
  StaticBlogSection,
  StaticFooterContent,
  StaticLocationSection,
  StaticMarketNews,
} from "@/components/static/StaticContent";
import { FreshContentWrapper } from "@/components/streaming/FreshContentWrapper";

import { StreamingFeaturedListings } from "@/components/streaming/StreamingFeaturedListings";
import { StreamingFeaturedProjects } from "@/components/streaming/StreamingFeaturedProjects";
import { StreamingGridBanner } from "@/components/streaming/StreamingGridBanner";
import { StreamingHeroBanner } from "@/components/streaming/StreamingHeroBanner";
import { StreamingLatestListings } from "@/components/streaming/StreamingLatestListings";
import Shell from "@/layouts/shell";
import type { getFeaturedListings } from "@/lib/get-featured-listings";
import type { getFeaturedProjects } from "@/lib/get-featured-projects";
import type { getFeaturedUnits } from "@/lib/get-featured-units";
import type { getFlexiBanner } from "@/lib/get-flexi-banner";
import type { getHeroBanner } from "@/lib/get-hero-banner";
import type { getLatestListings } from "@/lib/get-latest-listing";
import type { StaticData } from "@/lib/static-data";
import MobilePageHeader from "./mobile-page-header";
import {
  FeaturedListingsSkeleton,
  FeaturedProjectsSkeleton,
  GridBannerSkeleton,
  HeroBannerSkeleton,
  LatestListingsSkeleton,
} from "@/components/streaming/LoadingSkeletons";

interface LobbyProps {
  // Fresh data promises (always fetched)
  latestListingsPromise: ReturnType<typeof getLatestListings>;
  featuredProjectsPromise: ReturnType<typeof getFeaturedProjects>;
  featuredListingsPromise: ReturnType<typeof getFeaturedListings>;
  featuredUnitsPromise: ReturnType<typeof getFeaturedUnits>;
  heroBannerPromise: ReturnType<typeof getHeroBanner>;
  flexiBannerPromise: ReturnType<typeof getFlexiBanner>;
  // Static data (cached)
  staticData: StaticData;
}

async function LobbyContent({
  staticData,
  heroBannerPromise,
  featuredProjectsPromise,
  featuredListingsPromise,
  latestListingsPromise,
  flexiBannerPromise,
}: {
  staticData: StaticData;
  heroBannerPromise: ReturnType<typeof getHeroBanner>;
  featuredProjectsPromise: ReturnType<typeof getFeaturedProjects>;
  featuredListingsPromise: ReturnType<typeof getFeaturedListings>;
  latestListingsPromise: ReturnType<typeof getLatestListings>;
  flexiBannerPromise: ReturnType<typeof getFlexiBanner>;
}) {
  return (
    <main>
      {/* Hero Banner - Streamed */}
      <div className="relative">
        <FreshContentWrapper fallback={<HeroBannerSkeleton />}>
          <StreamingHeroBanner heroBannerPromise={heroBannerPromise} />
        </FreshContentWrapper>

        <MobilePageHeader />
        <SearchFilter />
      </div>

      {/* Static Content - Rendered Immediately */}
      <StaticAgentLogos staticData={staticData} />

      <div className="w-full lg:p-4">
        {/* Grid Banner - Streamed */}
        <FreshContentWrapper fallback={<GridBannerSkeleton />}>
          <GridBannerSkeleton />
          <StreamingGridBanner flexiBannerPromise={flexiBannerPromise} />
        </FreshContentWrapper>

        {/* Featured Projects - Streamed */}
        <FreshContentWrapper fallback={<FeaturedProjectsSkeleton />}>
          <FeaturedProjectsSkeleton />
          <StreamingFeaturedProjects
            featuredProjectsPromise={featuredProjectsPromise}
          />
        </FreshContentWrapper>

        {/* Latest Listings - Streamed */}
        <FreshContentWrapper fallback={<LatestListingsSkeleton />}>
          <LatestListingsSkeleton />
          <StreamingLatestListings
            latestListingsPromise={latestListingsPromise}
          />
        </FreshContentWrapper>

        {/* Featured Listings - Streamed */}
        <FreshContentWrapper fallback={<FeaturedListingsSkeleton />}>
          <FeaturedListingsSkeleton />
          <StreamingFeaturedListings
            featuredListingsPromise={featuredListingsPromise}
          />
        </FreshContentWrapper>

        {/* Static Content - Rendered Immediately */}
        <Shell>
          <div className="lg:flex flex-col md:flex-row gap-6">
            <StaticBlogSection staticData={staticData} />
            <StaticMarketNews staticData={staticData} />
          </div>
        </Shell>

        <StaticLocationSection staticData={staticData} />
        <StaticFooterContent />
      </div>
      <HomepagePopup />
    </main>
  );
}

export default async function Lobby({
  staticData,
  featuredProjectsPromise,
  featuredListingsPromise,
  featuredUnitsPromise,
  latestListingsPromise,
  heroBannerPromise,
  flexiBannerPromise,
}: LobbyProps) {
  return (
    <LobbyContent
      staticData={staticData}
      heroBannerPromise={heroBannerPromise}
      featuredProjectsPromise={featuredProjectsPromise}
      featuredListingsPromise={featuredListingsPromise}
      latestListingsPromise={latestListingsPromise}
      flexiBannerPromise={flexiBannerPromise}
    />
  );
}
