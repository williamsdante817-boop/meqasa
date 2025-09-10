import dynamic from "next/dynamic";
import { StreamingErrorBoundary } from "@/components/streaming/StreamingErrorBoundary";

// Dynamic imports for non-critical components (remove ssr: false for Server Components)
const HomepagePopup = dynamic(
  () => import("@/components/homepage-popup").then((mod) => ({ 
    default: mod.HomepagePopup 
  })),
  {
    loading: () => (
      <div className="sr-only" role="status">
        Loading popup...
      </div>
    ),
  }
);

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
import { StreamingFeaturedListings } from "@/components/streaming/StreamingFeaturedListings";
import { StreamingFeaturedProjects } from "@/components/streaming/StreamingFeaturedProjects";
import { StreamingGridBanner } from "@/components/streaming/StreamingGridBanner";
import { StreamingHeroBanner } from "@/components/streaming/StreamingHeroBanner";
import { StreamingLatestListings } from "@/components/streaming/StreamingLatestListings";
// Dynamic import for blog section (below fold)
const StreamingBlog = dynamic(
  () => import("@/components/streaming/StreamingBlog").then((mod) => ({
    default: mod.StreamingBlog
  })),
  {
    loading: () => <div className="py-14 animate-pulse bg-gray-50" />,
  }
);
import type { FeaturedListingsResponse } from "@/lib/get-featured-listings";
import type { LatestListingsResponse } from "@/lib/get-latest-listing";
import type { StaticData } from "@/lib/static-data";
import type { FeaturedProject, AdLink } from "@/types";
import type { BlogResponse } from "@/types/blog";
import MobilePageHeader from "./mobile-page-header";

interface LobbyProps {
  // Static data (resolved immediately)
  staticData: StaticData;
  // Hot promises for streaming data (skateshop pattern)
  featuredProjectsPromise: Promise<FeaturedProject[]>;
  featuredListingsPromise: Promise<FeaturedListingsResponse>;
  latestListingsPromise: Promise<LatestListingsResponse>;
  heroBannerPromise: Promise<AdLink>;
  flexiBannerPromise: Promise<string>;
  blogDataPromise: Promise<BlogResponse>;
}

async function LobbyContent({
  staticData,
  featuredProjectsPromise,
  featuredListingsPromise,
  latestListingsPromise,
  heroBannerPromise,
  flexiBannerPromise,
  blogDataPromise,
}: LobbyProps) {
  return (
    <main>
      {/* Hero Banner - Streaming with promise */}
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
        {/* Grid Banner - Streaming with promise */}
        <StreamingErrorBoundary fallback={<GridBannerSkeleton />}>
          <StreamingGridBanner flexiBannerPromise={flexiBannerPromise} />
        </StreamingErrorBoundary>

        {/* Featured Projects - Streaming with promises */}
        <StreamingErrorBoundary fallback={<FeaturedProjectsSkeleton />}>
          <StreamingFeaturedProjects
            featuredProjectsPromise={featuredProjectsPromise}
          />
        </StreamingErrorBoundary>

        {/* Latest Listings - Streaming with promise */}
        <StreamingErrorBoundary fallback={<FeaturedListingsSkeleton />}>
          <StreamingLatestListings
            latestListingsPromise={latestListingsPromise}
          />
        </StreamingErrorBoundary>

        {/* Featured Listings - Streaming with promise */}
        <StreamingErrorBoundary fallback={<FeaturedListingsSkeleton />}>
          <StreamingFeaturedListings
            featuredListingsPromise={featuredListingsPromise}
          />
        </StreamingErrorBoundary>

        {/* Blog Section - Streaming with promise */}
        <StreamingErrorBoundary fallback={<div className="py-14" />}>
          <StreamingBlog blogDataPromise={blogDataPromise} />
        </StreamingErrorBoundary>

        <StaticLocationSection staticData={staticData} />
        <StaticFooterContent />
      </div>
      <StreamingErrorBoundary 
        errorFallback={
          <div className="sr-only" role="status">
            Homepage popup failed to load
          </div>
        }
      >
        <HomepagePopup />
      </StreamingErrorBoundary>
    </main>
  );
}

export default function Lobby({
  staticData,
  featuredProjectsPromise,
  featuredListingsPromise,
  latestListingsPromise,
  heroBannerPromise,
  flexiBannerPromise,
  blogDataPromise,
}: LobbyProps) {
  return (
    <>
      <LobbyContent
        staticData={staticData}
        featuredProjectsPromise={featuredProjectsPromise}
        featuredListingsPromise={featuredListingsPromise}
        latestListingsPromise={latestListingsPromise}
        heroBannerPromise={heroBannerPromise}
        flexiBannerPromise={flexiBannerPromise}
        blogDataPromise={blogDataPromise}
      />
    </>
  );
}
