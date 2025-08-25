// Property-related queries
export {
  useFeaturedListings,
  useLatestListings,
  usePropertyDetails,
} from "./use-properties";

// Project-related queries  
export {
  useFeaturedProjects,
  useFeaturedUnits,
  useProjectDetails,
  useProjectUnits,
} from "./use-projects";

// Static content queries
export {
  useHeroBanner,
  useFlexiBanner, 
  useStaticData,
} from "./use-static-content";

// Search functionality queries
export {
  usePropertySearch,
  useLoadMoreProperties,
  useInfinitePropertySearch,
  useSearchSuggestions,
  useSearchHistory,
  type SearchFilters,
} from "./use-search";