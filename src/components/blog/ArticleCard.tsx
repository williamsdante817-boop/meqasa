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
      className="flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100"
      role="img"
      aria-label={message}
    >
      <ImageIcon className="mb-2 h-8 w-8 text-gray-400" />
      <span className="px-2 text-center text-sm text-gray-500">{message}</span>
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
      <CardContent className={`h-full p-0 ${isList ? "flex" : ""}`}>
        {/* Article Image */}
        <div
          className={`relative flex-shrink-0 overflow-hidden rounded-t-lg ${imageHeight} ${isList ? "mr-3 rounded-t-none rounded-l-lg" : ""} `}
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
          <div className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            <ExternalLink className="h-3 w-3 text-white" />
          </div>
        </div>

        {/* Article Content */}
        <div
          className={`flex flex-1 flex-col p-4 ${isList ? "justify-center" : ""}`}
        >
          {/* Source and Date */}
          <div
            className={`mb-2 flex items-center gap-2 text-xs text-gray-500 sm:text-sm ${isList ? "mb-1" : ""}`}
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
              className={`group-hover/link:text-brand-primary line-clamp-2 font-semibold text-gray-900 transition-colors duration-200 ${isFeatured ? "mb-3 text-base sm:text-lg md:text-xl" : "mb-2 text-sm sm:text-base"} ${isList ? "text-sm leading-tight sm:text-base" : ""} `}
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
              className="text-brand-primary hover:text-brand-primary/80 mt-auto inline-flex items-center text-sm transition-colors sm:text-base"
            >
              Read More
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
