"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { BlogArticle } from "@/types/blog";
import { ImageIcon, ExternalLink } from "lucide-react";

interface ArticleCardProps {
  article: BlogArticle;
  variant?: "featured" | "compact" | "list";
  priority?: boolean;
  className?: string;
}

function ArticlePlaceholder({
  message = "Image not available",
}: {
  message?: string;
}) {
  return (
    <div
      className="w-full h-full bg-gray-100 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300"
      role="img"
      aria-label={message}
    >
      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
      <span className="text-gray-500 text-sm text-center px-2">{message}</span>
    </div>
  );
}

export function ArticleCard({
  article,
  variant = "compact",
  priority = false,
  className = "",
}: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // Different layouts based on variant
  const isFeatured = variant === "featured";
  const isList = variant === "list";

  const cardClasses = `
    group transition-all duration-200 hover:shadow-lg hover:-translate-y-1
    ${isFeatured ? "h-full" : ""}
    ${className}
  `.trim();

  const imageHeight = isFeatured
    ? "h-48 md:h-56"
    : isList
      ? "h-20 w-20"
      : "h-40";

  return (
    <Card className={cardClasses}>
      <CardContent className={`p-0 h-full ${isList ? "flex" : ""}`}>
        {/* Article Image */}
        <div
          className={`
            relative overflow-hidden rounded-t-lg flex-shrink-0
            ${imageHeight}
            ${isList ? "rounded-l-lg rounded-t-none mr-3" : ""}
          `}
        >
          {imageError ? (
            <ArticlePlaceholder message="Blog image unavailable" />
          ) : (
            <Image
              src={article.thumbnail}
              alt={article.summary}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes={
                isFeatured
                  ? "(min-width: 768px) 50vw, 100vw"
                  : "(min-width: 768px) 25vw, 50vw"
              }
              onError={handleImageError}
              priority={priority}
              loading={priority ? undefined : "lazy"}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAEAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          )}

          {/* External link indicator */}
          <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="w-3 h-3 text-white" />
          </div>
        </div>

        {/* Article Content */}
        <div
          className={`p-4 flex-1 flex flex-col ${isList ? "justify-center" : ""}`}
        >
          {/* Source and Date */}
          <div
            className={`flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-2 ${isList ? "mb-1" : ""}`}
          >
            <span className="font-medium">{article.source}</span>
            <span>•</span>
            <time dateTime={article.date}>{article.date}</time>
          </div>

          {/* Article Summary/Title */}
          <Link
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link"
          >
            <h3
              className={`
                font-semibold text-gray-900 group-hover/link:text-brand-primary 
                transition-colors duration-200 line-clamp-2
                ${isFeatured ? "text-base sm:text-lg md:text-xl mb-3" : "text-sm sm:text-base mb-2"}
                ${isList ? "text-sm sm:text-base leading-tight" : ""}
              `}
              title={article.summary}
            >
              {article.summary}
            </h3>
          </Link>

          {/* Read More - Only for featured variant */}
          {isFeatured && (
            <Link
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm sm:text-base text-brand-primary hover:text-brand-primary/80 transition-colors mt-auto"
            >
              Read More
              <ExternalLink className="w-4 h-4 ml-1" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
