/**
 * Query configuration presets for different types of real estate data
 * This provides consistent caching strategies across the application
 */

const isDevelopment = process.env.NODE_ENV === "development";

export const queryConfig = {
  /**
   * For data that changes frequently and needs to be fresh
   * Examples: property listings, availability, pricing
   */
  realtime: {
    staleTime: isDevelopment ? 10 * 1000 : 60 * 1000, // 10s dev, 1min prod
    gcTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: isDevelopment ? 30 * 1000 : 5 * 60 * 1000, // 30s dev, 5min prod
    refetchOnWindowFocus: isDevelopment,
    refetchOnMount: true,
  },

  /**
   * For property data that changes occasionally
   * Examples: featured listings, search results
   */
  properties: {
    staleTime: isDevelopment ? 30 * 1000 : 2 * 60 * 1000, // 30s dev, 2min prod
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  },

  /**
   * For user-specific data
   * Examples: favorites, saved searches, user profile
   */
  user: {
    staleTime: isDevelopment ? 30 * 1000 : 5 * 60 * 1000, // 30s dev, 5min prod
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  },

  /**
   * For relatively static content that rarely changes
   * Examples: agent profiles, developer info, static content
   */
  static: {
    staleTime: isDevelopment ? 2 * 60 * 1000 : 30 * 60 * 1000, // 2min dev, 30min prod
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },

  /**
   * For content that rarely changes
   * Examples: location data, site configuration, blog posts
   */
  longCache: {
    staleTime: isDevelopment ? 5 * 60 * 1000 : 2 * 60 * 60 * 1000, // 5min dev, 2hr prod
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },

  /**
   * For homepage dynamic content that refreshes only on window focus
   * Examples: featured listings, latest listings
   * Removes background polling for efficiency while maintaining data freshness
   */
  homepage: {
    staleTime: isDevelopment ? 60 * 1000 : 5 * 60 * 1000, // 1min dev, 5min prod (longer stale time)
    gcTime: 15 * 60 * 1000, // 15 minutes (longer cache)
    refetchOnWindowFocus: true, // Enable focus-based refresh
    refetchOnMount: true,
    refetchInterval: false, // Disable background polling
  },

  /**
   * For semi-static homepage content (banners, featured projects)
   * Refresh on focus but with longer stale time since they change less frequently
   */
  homepageBanners: {
    staleTime: isDevelopment ? 2 * 60 * 1000 : 15 * 60 * 1000, // 2min dev, 15min prod
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: false, // Remove background polling
  },

  /**
   * For agent listings with pagination
   * Moderate freshness since agents add/remove listings regularly
   */
  agentListings: {
    staleTime: isDevelopment ? 30 * 1000 : 3 * 60 * 1000, // 30s dev, 3min prod
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refresh when user returns
    refetchOnMount: false, // Trust cached data on mount
    refetchInterval: false, // No background polling
  },
} as const;

/**
 * Query key factories for consistent key naming
 * This prevents duplicate queries and enables easy invalidation
 */
export const queryKeys = {
  // Properties
  properties: {
    all: ["properties"] as const,
    lists: () => [...queryKeys.properties.all, "list"] as const,
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.properties.lists(), filters] as const,
    details: () => [...queryKeys.properties.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.properties.details(), id] as const,
    featured: () => [...queryKeys.properties.all, "featured"] as const,
    latest: () => [...queryKeys.properties.all, "latest"] as const,
    similar: (id: string) =>
      [...queryKeys.properties.all, "similar", id] as const,
    search: (params: Record<string, unknown>) =>
      [...queryKeys.properties.all, "search", params] as const,
  },

  // Agents
  agents: {
    all: ["agents"] as const,
    lists: () => [...queryKeys.agents.all, "list"] as const,
    details: () => [...queryKeys.agents.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.agents.details(), id] as const,
    listings: (id: string) =>
      [...queryKeys.agents.all, id, "listings"] as const,
    // Paginated listings for agent pages
    paginatedListings: (agentId: string | number, page: number) =>
      [
        ...queryKeys.agents.all,
        agentId,
        "listings",
        "paginated",
        page,
      ] as const,
  },

  // Developers
  developers: {
    all: ["developers"] as const,
    lists: () => [...queryKeys.developers.all, "list"] as const,
    details: () => [...queryKeys.developers.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.developers.details(), id] as const,
    projects: (id: string) =>
      [...queryKeys.developers.all, id, "projects"] as const,
  },

  // Projects
  projects: {
    all: ["projects"] as const,
    lists: () => [...queryKeys.projects.all, "list"] as const,
    details: () => [...queryKeys.projects.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
    featured: () => [...queryKeys.projects.all, "featured"] as const,
    units: (id: string) => [...queryKeys.projects.all, id, "units"] as const,
  },

  // User-specific data
  user: {
    all: ["user"] as const,
    profile: () => [...queryKeys.user.all, "profile"] as const,
    favorites: () => [...queryKeys.user.all, "favorites"] as const,
    searches: () => [...queryKeys.user.all, "searches"] as const,
    alerts: () => [...queryKeys.user.all, "alerts"] as const,
  },

  // Static content
  static: {
    all: ["static"] as const,
    config: () => [...queryKeys.static.all, "config"] as const,
    locations: () => [...queryKeys.static.all, "locations"] as const,
    banners: () => [...queryKeys.static.all, "banners"] as const,
    banner: (type: string) => [...queryKeys.static.banners(), type] as const,
  },

  // Search functionality
  search: {
    all: ["search"] as const,
    properties: (filters: Record<string, unknown>) =>
      [...queryKeys.search.all, "properties", filters] as const,
    propertiesInfinite: (filters: Record<string, unknown>) =>
      [...queryKeys.search.all, "properties", "infinite", filters] as const,
    suggestions: (type: string, query: string) =>
      [...queryKeys.search.all, "suggestions", type, query] as const,
    history: () => [...queryKeys.search.all, "history"] as const,
  },

  // Blog content
  blog: {
    all: ["blog"] as const,
    featured: () => [...queryKeys.blog.all, "featured"] as const,
    category: (type: string) =>
      [...queryKeys.blog.all, "category", type] as const,
  },
} as const;
