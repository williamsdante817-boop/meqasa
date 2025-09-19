import { InfiniteMovingCards } from "@/components/infinite-moving-card";
import ContentSection from "@/components/layout/content-section";
import BlogCard from "@/components/common/blog-card";
import MarketNewsCard from "@/components/market-news-card";
import LocationCard from "@/components/common/location-card";
import SeoText from "@/components/seo-text";
import AppPromotion from "@/components/app-promotion";
import Shell from "@/layouts/shell";
import { AgentLogosSkeleton } from "@/components/skeletons/agent-logos-skeleton";
import { AgentLogosErrorBoundary } from "@/components/error-boundaries/agent-logos-error-boundary";
import type { StaticData } from "@/lib/static-data";

interface StaticContentProps {
  staticData: StaticData;
}

export function StaticAgentLogos({ staticData }: StaticContentProps) {
  // More robust check - only show skeleton if we truly have no data
  // During React Query background refetches, we want to keep showing existing data
  // This prevents the "stuck in loading mode" issue when React Query refetches
  if (!staticData?.agentLogos || staticData.agentLogos.length === 0) {
    return <AgentLogosSkeleton />;
  }

  return (
    <AgentLogosErrorBoundary>
      <div
        className="mt-[125px] hidden overflow-hidden lg:flex"
        role="complementary"
        aria-label="Partner logos"
      >
        <InfiniteMovingCards
          items={staticData.agentLogos}
          direction="left"
          speed="normal"
        />
      </div>
    </AgentLogosErrorBoundary>
  );
}

export function StaticBlogSection({ staticData }: StaticContentProps) {
  return (
    <ContentSection
      title="Property Guides & Insights"
      description="Read our blog"
      href="/blog"
      className="flex-[2] px-4 pt-14 md:px-0 md:pt-20 lg:pt-24"
      border
    >
      {staticData.blogData.map((blog, index) => (
        <BlogCard
          datePosted={blog.datePosted}
          description={blog.description}
          href={blog.href}
          poster={blog.poster}
          title={blog.title}
          key={index}
        />
      ))}
    </ContentSection>
  );
}

export function StaticMarketNews({ staticData }: StaticContentProps) {
  return (
    <aside className="mt-28 hidden flex-1 md:block" aria-label="Market News">
      <h2 className="text-brand-accent mb-6 text-2xl leading-tight font-bold tracking-tighter lg:text-3xl">
        Market News
      </h2>
      <div role="list">
        {staticData.blogData.slice(0, 3).map((blog, index) => (
          <div key={index} role="listitem">
            <MarketNewsCard
              title={blog.title}
              displayDate="Jan 23, 2023"
              index={index}
            />
          </div>
        ))}
      </div>
    </aside>
  );
}

export function StaticLocationSection({ staticData }: StaticContentProps) {
  return (
    <ContentSection
      title="Choice Neighborhoods"
      description="These neighborhoods are highly desirable for business, living, and pleasure. Find out why!"
      href="/"
      className="w-full flex-[2] pt-14 md:pt-20 lg:pt-24 [&_h2]:px-4 md:[&_h2]:px-0 [&_p]:px-4 md:[&_p]:px-0"
    >
      <div
        className="overflow-x-auto lg:overflow-visible"
        role="region"
        aria-label="Neighborhoods"
      >
        <div className="flex gap-3 pb-4 lg:grid lg:grid-cols-4 lg:gap-8 lg:pb-0">
          {staticData.locationData.map((item, i) => (
            <div
              className={`h-full w-[calc((100vw-48px)/2)] max-w-full min-w-[280px] flex-none lg:w-full lg:min-w-0 lg:flex-initial ${i === 0 ? "pl-4" : ""} ${i === staticData.locationData.length - 1 ? "pr-4" : ""} lg:pr-0 lg:pl-0`}
              key={i}
            >
              <div className="h-full">
                <LocationCard {...item} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ContentSection>
  );
}

export function StaticFooterContent() {
  return (
    <Shell className="md:px-0">
      <SeoText />
      <AppPromotion />
    </Shell>
  );
}
