/**
 * API configuration
 * Centralized API endpoints, configurations, and constants
 */

// Base API configuration
export const apiConfig = {
  baseUrl: process.env.API_BASE_URL ?? "https://meqasa.com",
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const

// API endpoints
export const endpoints = {
  // Property endpoints
  properties: {
    search: "/search",
    details: "/mqrouter/ref",
    featured: "/featured-listings",
    latest: "/latest-listings",
    similar: "/similar-properties",
  },

  // Project endpoints  
  projects: {
    featured: "/featured-projects",
    details: "/project-details",
    units: "/project-units",
  },

  // Agent endpoints
  agents: {
    list: "/agents",
    details: "/agent-details", 
    listings: "/agent-listings",
  },

  // Content endpoints
  banners: {
    hero: "/hero-banner",
    flexi: "/flexi-banner",
    grid: "/grid-banner",
  },

  // Blog endpoints
  blog: {
    featured: "/blog/featured",
    posts: "/blog/posts",
    categories: "/blog/categories",
  },

  // Contact endpoints
  contact: {
    submit: "/contact",
    agent: "/contact-agent",
    callback: "/request-callback",
  },

  // User endpoints  
  user: {
    favorites: "/user/favorites",
    searches: "/user/searches",
    alerts: "/user/alerts",
  },
} as const

// Request headers
export const defaultHeaders = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "X-Client": "meqasa-web",
} as const

// Response status codes
export const statusCodes = {
  success: 200,
  created: 201,
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  internalServerError: 500,
  serviceUnavailable: 503,
} as const

// API error messages
export const apiErrors = {
  network: "Network error. Please check your connection.",
  timeout: "Request timed out. Please try again.",
  serverError: "Server error. Please try again later.",
  notFound: "Resource not found.",
  unauthorized: "You need to log in to access this resource.",
  forbidden: "You don't have permission to access this resource.",
  validationError: "Please check your input and try again.",
  unknown: "An unexpected error occurred. Please try again.",
} as const

// Rate limiting configuration
export const rateLimits = {
  search: {
    requests: 100,
    window: 60 * 1000, // 1 minute
  },
  contact: {
    requests: 5,
    window: 60 * 1000, // 1 minute  
  },
  general: {
    requests: 1000,
    window: 60 * 1000, // 1 minute
  },
} as const

// Cache configuration for different endpoints
export const cacheConfig = {
  staticData: {
    ttl: 24 * 60 * 60, // 24 hours
    staleWhileRevalidate: true,
  },
  listings: {
    ttl: 5 * 60, // 5 minutes
    staleWhileRevalidate: true,
  },
  propertyDetails: {
    ttl: 30 * 60, // 30 minutes
    staleWhileRevalidate: true,
  },
  agentProfiles: {
    ttl: 60 * 60, // 1 hour
    staleWhileRevalidate: true,
  },
  banners: {
    ttl: 15 * 60, // 15 minutes
    staleWhileRevalidate: true,
  },
} as const

// Type exports
export type Endpoint = typeof endpoints
export type StatusCode = typeof statusCodes[keyof typeof statusCodes]
export type ApiError = typeof apiErrors[keyof typeof apiErrors]