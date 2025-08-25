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
    list: (filters: Record<string, any>) => 
      [...queryKeys.properties.lists(), filters] as const,
    details: () => [...queryKeys.properties.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.properties.details(), id] as const,
    featured: () => [...queryKeys.properties.all, "featured"] as const,
    latest: () => [...queryKeys.properties.all, "latest"] as const,
    similar: (id: string) => [...queryKeys.properties.all, "similar", id] as const,
    search: (params: Record<string, any>) => 
      [...queryKeys.properties.all, "search", params] as const,
  },

  // Agents
  agents: {
    all: ["agents"] as const,
    lists: () => [...queryKeys.agents.all, "list"] as const,
    details: () => [...queryKeys.agents.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.agents.details(), id] as const,
    listings: (id: string) => [...queryKeys.agents.all, id, "listings"] as const,
  },

  // Developers
  developers: {
    all: ["developers"] as const,
    lists: () => [...queryKeys.developers.all, "list"] as const,
    details: () => [...queryKeys.developers.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.developers.details(), id] as const,
    projects: (id: string) => [...queryKeys.developers.all, id, "projects"] as const,
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
    properties: (filters: Record<string, any>) => 
      [...queryKeys.search.all, "properties", filters] as const,
    propertiesInfinite: (filters: Record<string, any>) => 
      [...queryKeys.search.all, "properties", "infinite", filters] as const,
    suggestions: (type: string, query: string) => 
      [...queryKeys.search.all, "suggestions", type, query] as const,
    history: () => [...queryKeys.search.all, "history"] as const,
  },
} as const;