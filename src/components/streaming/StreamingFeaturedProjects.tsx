import ContentSection from "@/components/content-section";
import FeaturedProjectsCarousel from "@/components/featured-projects-carousel";
import type { getFeaturedProjects } from "@/lib/get-featured-projects";

interface StreamingFeaturedProjectsProps {
  featuredProjectsPromise: ReturnType<typeof getFeaturedProjects>;
}

export async function StreamingFeaturedProjects({
  featuredProjectsPromise,
}: StreamingFeaturedProjectsProps) {
  try {
    const featuredProjects = await featuredProjectsPromise;

    if (!featuredProjects || featuredProjects.length === 0) {
      return (
        <ContentSection
          title="Featured Projects"
          description="View all featured properties"
          href="/developments"
          className="pt-14 md:pt-20 lg:pt-24 w-full mx-auto [&_p]:px-4 [&_h2]:px-4 md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]"
        >
          <div className="text-center py-8 text-brand-muted">
            No featured projects available at the moment.
          </div>
        </ContentSection>
      );
    }

    return (
      <ContentSection
        title="Featured Projects"
        description="View all featured properties"
        href="/developments"
        className="pt-14 md:pt-20 lg:pt-24 w-full mx-auto [&_p]:px-4 [&_h2]:px-4 md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]"
      >
        <FeaturedProjectsCarousel properties={featuredProjects} delay={5000} />
      </ContentSection>
    );
  } catch (error) {
    console.error("Failed to load featured projects:", error);
    return (
      <ContentSection
        title="Featured Projects"
        description="View all featured properties"
        href="/developments"
        className="pt-14 md:pt-20 lg:pt-24 w-full mx-auto [&_p]:px-4 [&_h2]:px-4 md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]"
      >
        <div className="text-center py-8 text-brand-muted">
          Unable to load featured projects. Please try again later.
        </div>
      </ContentSection>
    );
  }
}
