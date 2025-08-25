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
  console.log("staticData", staticData);

  // Show skeleton if agent logos are not available
  if (!staticData.agentLogos || staticData.agentLogos.length === 0) {
    return <AgentLogosSkeleton />;
  }

  return (
    <AgentLogosErrorBoundary>
      <div
        className="mt-[125px] hidden lg:flex overflow-hidden"
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
      className="pt-14 md:pt-20 lg:pt-24 flex-[2] px-4 md:px-0"
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
    <aside className="hidden md:block flex-1 mt-28" aria-label="Market News">
      <h3 className="text-2xl font-bold text-brand-accent mb-6">Market News</h3>
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
      className="pt-14 md:pt-20 lg:pt-24 flex-[2] w-full [&_p]:px-4 [&_h2]:px-4 md:[&_p]:px-0 md:[&_h2]:px-0"
    >
      <div
        className="overflow-x-auto lg:overflow-visible"
        role="region"
        aria-label="Neighborhoods"
      >
        <div className="flex gap-3 lg:grid lg:grid-cols-4 lg:gap-8 pb-4 lg:pb-0">
          {staticData.locationData.map((item, i) => (
            <div
              className={`w-[calc((100vw-48px)/2)] min-w-[280px] flex-none h-full max-w-full lg:w-full lg:min-w-0 lg:flex-initial ${i === 0 ? "pl-4" : ""} ${i === staticData.locationData.length - 1 ? "pr-4" : ""} lg:pl-0 lg:pr-0`}
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
