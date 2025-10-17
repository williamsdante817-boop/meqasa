import { BlogSectionStatic } from "@/components/blog/BlogSectionStatic";
import { ErrorStateCard } from "@/components/common/error-state-card";
import type { BlogResponse } from "@/types/blog";
import ContentSection from "../layout/content-section";

interface StreamingBlogProps {
  blogDataPromise: Promise<BlogResponse>;
}

export async function StreamingBlog({ blogDataPromise }: StreamingBlogProps) {
  try {
    const blogData = await blogDataPromise;

    if (!blogData || (!blogData.featured?.length && !blogData.market?.length)) {
      return (
        <ContentSection
          title="Property Guides & Insights"
          description="Read our blog"
          href="/blog"
          className="flex-[2] pt-14 md:pt-20 lg:pt-24"
          border
        >
          <ErrorStateCard
            variant="info"
            title="Blog content is currently unavailable."
            description="Please check back later for the latest property insights."
            className="my-8"
          />
        </ContentSection>
      );
    }

    return <BlogSectionStatic blogData={blogData} />;
  } catch {
    // Return empty state on error
    return (
      <ContentSection
        title="Property Guides & Insights"
        description="Read our blog"
        href="/blog"
        className="flex-[2] pt-14 md:pt-20 lg:pt-24"
        border
      >
        <ErrorStateCard
          variant="error"
          title="Unable to load blog content."
          description="Please refresh the page or try again later."
          className="my-8"
        />
      </ContentSection>
    );
  }
}
