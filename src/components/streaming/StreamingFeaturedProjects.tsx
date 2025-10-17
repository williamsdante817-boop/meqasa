import { ErrorStateCard } from "@/components/common/error-state-card";
import FeaturedProjectsCarousel from "@/components/developer/projects/featured-projects-carousel";
import ContentSection from "@/components/layout/content-section";
import type { getFeaturedProjects } from "@/lib/get-featured-projects";
import { logError } from "@/lib/logger";

interface StreamingFeaturedProjectsProps {
  featuredProjectsPromise: ReturnType<typeof getFeaturedProjects>;
}

export async function StreamingFeaturedProjects({
  featuredProjectsPromise,
}: StreamingFeaturedProjectsProps) {
  const sectionClassName =
    "w-full pt-14 md:pt-20 lg:pt-24 [&_h2]:px-4 md:[&_h2]:px-0 [&_p]:px-4 md:[&_p]:px-0";

  const renderMessage = (
    title: string,
    description: string,
    variant: "info" | "error"
  ) => (
    <ContentSection
      title="Featured Projects"
      description="View all featured properties"
      href="/developments"
      className={sectionClassName}
    >
      <ErrorStateCard
        variant={variant === "error" ? "error" : "info"}
        title={title}
        description={description}
      />
    </ContentSection>
  );

  try {
    const raw = await featuredProjectsPromise;

    const isFeaturedProjectsArray = (value: unknown): value is unknown[] => {
      return Array.isArray(value);
    };

    if (!isFeaturedProjectsArray(raw)) {
      return renderMessage(
        "No featured projects available",
        "There are no featured projects to show right now. Please check back later.",
        "info"
      );
    }

    const featuredProjects = raw;

    if (featuredProjects.length === 0) {
      return renderMessage(
        "No featured projects available",
        "There are no featured projects to show right now. Please check back later.",
        "info"
      );
    }

    return (
      <ContentSection
        title="Featured Projects"
        description="View all featured properties"
        href="/developments"
        className="w-full pt-14 md:pt-20 lg:pt-24 [&_h2]:px-4 md:[&_h2]:px-0 [&_p]:px-4 md:[&_p]:px-0"
      >
        <FeaturedProjectsCarousel properties={featuredProjects} delay={5000} />
      </ContentSection>
    );
  } catch (error) {
    logError("Failed to load featured projects", error, {
      component: "StreamingFeaturedProjects",
    });
    return renderMessage(
      "Unable to load featured projects",
      "Something went wrong while fetching featured projects. Please try again later.",
      "error"
    );
  }
}
