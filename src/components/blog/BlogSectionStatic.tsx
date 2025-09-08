"use client";

import Shell from "@/layouts/shell";
import ContentSection from "@/components/layout/content-section";
import BlogCard from "@/components/common/blog-card";
import MarketNewsCard from "@/components/market-news-card";
import type { BlogResponse, BlogArticle } from "@/types/blog";

// Helper function to convert API data to BlogCard format
function convertToBlogCardProps(article: BlogArticle) {
  return {
    title: article.summary,
    description: article.summary, // Using summary as description since API doesn't provide separate description
    datePosted: article.date,
    poster: article.thumbnail,
    href: article.url,
  };
}

interface BlogSectionStaticProps {
  blogData: BlogResponse;
  className?: string;
}

export function BlogSectionStatic({ blogData }: BlogSectionStaticProps) {
  // Don't render if no data
  if (!blogData || (!blogData.featured?.length && !blogData.market?.length)) {
    return null;
  }

  const featuredArticles = blogData.featured || [];
  const marketArticles = blogData.market || [];

  return (
    <Shell>
      <div className="lg:flex flex-col md:flex-row gap-6">
        <ContentSection
          title="Property Guides & Insights"
          description="Read our blog"
          href="/blog"
          className="pt-14 md:pt-20 lg:pt-24 flex-[2]"
          border
        >
          {featuredArticles.map((article, index) => (
            <BlogCard
              key={`featured-${index}-${article.url}`}
              {...convertToBlogCardProps(article)}
              priority={index === 0}
            />
          ))}
        </ContentSection>

        <aside
          className="hidden md:block flex-1 mt-28"
          aria-label="Market News"
        >
          <h3 className="text-xl font-bold leading-tight tracking-tighter text-brand-accent lg:mb-8 lg:text-[23px] lg:font-extrabold">
            Market News
          </h3>
          <div role="list">
            {marketArticles.slice(0, 3).map((article, index) => (
              <div key={`market-${index}-${article.url}`} role="listitem">
                <MarketNewsCard
                  title={article.summary}
                  dateISO={article.date}
                  displayDate={article.date}
                  index={index}
                />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </Shell>
  );
}
