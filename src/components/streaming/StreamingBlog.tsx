import { BlogSectionStatic } from "@/components/blog/BlogSectionStatic";
import { AlertCard } from "@/components/common/alert-card";
import type { BlogResponse } from "@/types/blog";

interface StreamingBlogProps {
  blogDataPromise: Promise<BlogResponse>;
}

export async function StreamingBlog({ blogDataPromise }: StreamingBlogProps) {
  try {
    const blogData = await blogDataPromise;

    if (!blogData || (!blogData.featured?.length && !blogData.market?.length)) {
      return (
        <AlertCard
          title="Blog content is currently unavailable."
          description="Please check back later for the latest property insights."
          className="my-8"
        />
      );
    }

    return <BlogSectionStatic blogData={blogData} />;
  } catch {
    // Return empty state on error
    return (
      <AlertCard
        title="Unable to load blog content."
        description="Please refresh the page or try again later."
        className="my-8"
      />
    );
  }
}