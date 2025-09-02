/**
 * Centralized API layer exports
 * Single point of access for all API functionality
 */

// Core API client
export { meqasaApiClient, baseApiClient, type NetworkError } from "./client";

// Data fetching functions
export { dataFetchers, propertyDataFetchers, projectDataFetchers, bannerDataFetchers, blogDataFetchers } from "./data-fetchers";

// Configuration
export { apiConfig, endpoints, defaultHeaders } from "@/config/api";

// Error handling utilities
export { logError, getErrorMessage, showErrorToast } from "@/lib/handle-error";

// Validation utilities
export * from "@/lib/validations";