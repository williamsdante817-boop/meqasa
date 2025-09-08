/**
 * Blog article data types based on API response structure
 */

export interface BlogArticle {
  /** Thumbnail image URL (from WordPress) */
  thumbnail: string;
  /** Article source (e.g., "meQasa Blog") */
  source: string;
  /** Article summary/title */
  summary: string;
  /** Publication date in human-readable format */
  date: string;
  /** External blog URL */
  url: string;
}

export interface BlogResponse {
  /** Featured articles array */
  featured: BlogArticle[];
  /** Market news articles array */
  market: BlogArticle[];
}

export interface BlogSectionProps {
  initialData?: BlogResponse;
  className?: string;
}
