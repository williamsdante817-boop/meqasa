import ContentSection from "@/components/content-section";
import FeaturedProjectsCarousel from "@/components/featured-projects-carousel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
          className="pt-14 md:pt-20 lg:pt-24 w-full "
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
          className="pt-14 md:pt-20 lg:pt-24 w-full"
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
        className="pt-14 md:pt-20 lg:pt-24 w-full"
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
