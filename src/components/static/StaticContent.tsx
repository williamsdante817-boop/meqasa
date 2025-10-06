import AppPromotion from "@/components/app-promotion";
import LocationCard from "@/components/common/location-card";
import { AgentLogosErrorBoundary } from "@/components/error-boundaries/agent-logos-error-boundary";
import { InfiniteMovingCards } from "@/components/infinite-moving-card";
import ContentSection from "@/components/layout/content-section";
import SeoText from "@/components/seo-text";
import { AgentLogosSkeleton } from "@/components/skeletons/agent-logos-skeleton";
import Shell from "@/layouts/shell";
import type { StaticData } from "@/lib/static-data";

interface StaticContentProps {
  staticData: StaticData;
}

export function StaticAgentLogos({ staticData }: StaticContentProps) {
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
          speed="slow"
        />
      </div>
    </AgentLogosErrorBoundary>
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
