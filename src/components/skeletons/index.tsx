// Enhanced skeleton components for MeQasa platform
export { Skeleton, type SkeletonProps } from "@/components/ui/skeleton";

// Specialized skeleton components
export {
  PropertyCardSkeleton,
  propertyCardSkeletonVariants,
} from "./property-card-skeleton";
export {
  LoadingBoundary,
  PropertyGridLoading,
  PropertyListLoading,
  SearchResultsLoading,
  DashboardLoading,
} from "./loading-boundary";

// Enhanced legacy skeleton components (updated with new system)
export { default as FeaturedPropertySkeleton } from "@/components/featured-property-skeleton";
export { default as SearchResultsSkeleton } from "@/components/search/SearchResultsSkeleton";
export {
  HeroBannerSkeleton,
  GridBannerSkeleton,
  FeaturedProjectsSkeleton,
  LatestListingsSkeleton,
  FeaturedListingsSkeleton,
} from "@/components/streaming/LoadingSkeletons";

// Blog and content skeletons
export {
  ArticleCardSkeleton,
  FeaturedArticlesSkeleton,
  MarketNewsSkeleton,
  BlogSectionSkeleton,
} from "@/components/blog/BlogSkeleton";

// Developer and agent skeletons
export { DevelopersSkeleton } from "@/components/developer/developers/developers-skeleton";
export { AgentLogosSkeleton } from "./agent-logos-skeleton";
export { AgentListingsSkeleton } from "@/app/(lobby)/agents/_components/agent-listings-skeleton";
