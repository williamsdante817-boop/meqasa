import ContentSection from "@/components/layout/content-section";
import FeaturedProjectsCarousel from "@/components/developer/projects/featured-projects-carousel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { logError } from "@/lib/logger";
import type { getFeaturedProjects } from "@/lib/get-featured-projects";

interface StreamingFeaturedProjectsProps {
  featuredProjectsPromise: ReturnType<typeof getFeaturedProjects>;
}

export async function StreamingFeaturedProjects({
  featuredProjectsPromise,
}: StreamingFeaturedProjectsProps) {
  try {
    const raw = await featuredProjectsPromise;

    const isFeaturedProjectsArray = (value: unknown): value is unknown[] => {
      return Array.isArray(value);
    };

    if (!isFeaturedProjectsArray(raw)) {
      return (
        <ContentSection
          title="Featured Projects"
          description="View all featured properties"
          href="/developments"
          className="w-full pt-14 md:pt-20 lg:pt-24 [&_h2]:px-4 md:[&_h2]:px-0 [&_p]:px-4 md:[&_p]:px-0"
        >
          <Alert className="mx-auto max-w-md">
            <AlertTitle>No featured projects available</AlertTitle>
            <AlertDescription>
              There are no featured projects to show right now. Please check
              back later.
            </AlertDescription>
          </Alert>
        </ContentSection>
      );
    }

    const featuredProjects = raw;

    if (featuredProjects.length === 0) {
      return (
        <ContentSection
          title="Featured Projects"
          description="View all featured properties"
          href="/developments"
          className="w-full pt-14 md:pt-20 lg:pt-24 [&_h2]:px-4 md:[&_h2]:px-0 [&_p]:px-4 md:[&_p]:px-0"
        >
          <Alert className="mx-auto max-w-md">
            <AlertTitle>No featured projects available</AlertTitle>
            <AlertDescription>
              There are no featured projects to show right now. Please check
              back later.
            </AlertDescription>
          </Alert>
        </ContentSection>
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
    return (
      <ContentSection
        title="Featured Projects"
        description="View all featured properties"
        href="/developments"
        className="w-full pt-14 md:pt-20 lg:pt-24 [&_h2]:px-4 md:[&_h2]:px-0 [&_p]:px-4 md:[&_p]:px-0"
      >
        <Alert variant="destructive" className="mx-auto max-w-md">
          <AlertTitle>Unable to load featured projects</AlertTitle>
          <AlertDescription>
            Something went wrong while fetching featured projects. Please try
            again later.
          </AlertDescription>
        </Alert>
      </ContentSection>
    );
  }
}
