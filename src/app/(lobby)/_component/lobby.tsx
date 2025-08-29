import { HomepagePopup } from "@/components/homepage-popup";

import { SearchFilter } from "@/components/search";
import {
  StaticAgentLogos,
  StaticFooterContent,
  StaticLocationSection,
} from "@/components/static/StaticContent";

import {
  FeaturedListingsSkeleton,
  FeaturedProjectsSkeleton,
  GridBannerSkeleton,
  HeroBannerSkeleton,
} from "@/components/streaming/LoadingSkeletons";
import { StreamingErrorBoundary } from "@/components/streaming/StreamingErrorBoundary";
import { StreamingFeaturedListings } from "@/components/streaming/StreamingFeaturedListings";
import { StreamingFeaturedProjects } from "@/components/streaming/StreamingFeaturedProjects";
import { StreamingGridBanner } from "@/components/streaming/StreamingGridBanner";
import { StreamingHeroBanner } from "@/components/streaming/StreamingHeroBanner";
import { StreamingLatestListings } from "@/components/streaming/StreamingLatestListings";
import { StreamingBlog } from "@/components/streaming/StreamingBlog";
import type { getFeaturedListings } from "@/lib/get-featured-listings";
import type { getFeaturedProjects } from "@/lib/get-featured-projects";
import type { getFeaturedUnits } from "@/lib/get-featured-units";
import type { getFlexiBanner } from "@/lib/get-flexi-banner";
import type { getHeroBanner } from "@/lib/get-hero-banner";
import type { getLatestListings } from "@/lib/get-latest-listing";
import type { StaticData } from "@/lib/static-data";
import type { BlogResponse } from "@/types/blog";
import MobilePageHeader from "./mobile-page-header";

interface LobbyProps {
  // Fresh data promises (always fetched)
  latestListingsPromise: ReturnType<typeof getLatestListings>;
  featuredProjectsPromise: ReturnType<typeof getFeaturedProjects>;
  featuredListingsPromise: ReturnType<typeof getFeaturedListings>;
  featuredUnitsPromise: ReturnType<typeof getFeaturedUnits>;
  heroBannerPromise: ReturnType<typeof getHeroBanner>;
  flexiBannerPromise: ReturnType<typeof getFlexiBanner>;
  blogDataPromise: Promise<BlogResponse>;
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
  blogDataPromise,
}: {
  staticData: StaticData;
  heroBannerPromise: ReturnType<typeof getHeroBanner>;
  featuredProjectsPromise: ReturnType<typeof getFeaturedProjects>;
  featuredListingsPromise: ReturnType<typeof getFeaturedListings>;
  latestListingsPromise: ReturnType<typeof getLatestListings>;
  flexiBannerPromise: ReturnType<typeof getFlexiBanner>;
  blogDataPromise: Promise<BlogResponse>;
}) {
  return (
    <main>
      {/* Hero Banner - Streamed */}
      <div className="relative">
        <StreamingErrorBoundary fallback={<HeroBannerSkeleton />}>
          <StreamingHeroBanner heroBannerPromise={heroBannerPromise} />
        </StreamingErrorBoundary>

        <MobilePageHeader />
        <SearchFilter />
      </div>

      {/* Static Content - Rendered Immediately */}
      <StaticAgentLogos staticData={staticData} />

      <div className="w-full lg:p-4">
        {/* Grid Banner - Streamed */}
        <StreamingErrorBoundary fallback={<GridBannerSkeleton />}>
          <StreamingGridBanner flexiBannerPromise={flexiBannerPromise} />
        </StreamingErrorBoundary>

        {/* Featured Projects - Streamed */}
        <StreamingErrorBoundary fallback={<FeaturedProjectsSkeleton />}>
          <StreamingFeaturedProjects
            featuredProjectsPromise={featuredProjectsPromise}
          />
        </StreamingErrorBoundary>

        {/* Latest Listings - Streamed */}
        <StreamingErrorBoundary fallback={<FeaturedListingsSkeleton />}>
          <StreamingLatestListings
            latestListingsPromise={latestListingsPromise}
          />
        </StreamingErrorBoundary>

        {/* Featured Listings - Streamed */}
        <StreamingErrorBoundary fallback={<FeaturedListingsSkeleton />}>
          <StreamingFeaturedListings
            featuredListingsPromise={featuredListingsPromise}
          />
        </StreamingErrorBoundary>

        {/* Blog Section - Streamed */}
        <StreamingErrorBoundary fallback={<div className="py-14" />}>
          <StreamingBlog blogDataPromise={blogDataPromise} />
        </StreamingErrorBoundary>

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  featuredUnitsPromise,
  latestListingsPromise,
  heroBannerPromise,
  flexiBannerPromise,
  blogDataPromise,
}: LobbyProps) {
  return (
    <>
      <LobbyContent
        staticData={staticData}
        heroBannerPromise={heroBannerPromise}
        featuredProjectsPromise={featuredProjectsPromise}
        featuredListingsPromise={featuredListingsPromise}
        latestListingsPromise={latestListingsPromise}
        flexiBannerPromise={flexiBannerPromise}
        blogDataPromise={blogDataPromise}
      />
      
    </>
  );
}
