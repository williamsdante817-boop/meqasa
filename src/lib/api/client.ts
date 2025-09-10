/**
 * Enhanced API client for MeQasa
 * Built on top of the existing axios-client with MeQasa-specific configurations
 */

import { apiConfig, defaultHeaders, endpoints } from "@/config/api";
import { apiClient, type NetworkError } from "@/lib/axios-client";
import { logError } from "@/lib/handle-error";
import type { AxiosRequestConfig } from "axios";

/**
 * MeQasa-specific API client that extends the base ApiClient
 * with domain-specific configurations and error handling
 */
export class MeQasaApiClient {
  private baseClient = apiClient;
  private baseUrl = apiConfig.baseUrl;

  /**
   * Generic request method with MeQasa-specific defaults
   */
  private async request<T>(
    endpoint: string,
    config: AxiosRequestConfig = {},
    context?: string
  ): Promise<T> {
    try {
      const fullConfig: AxiosRequestConfig = {
        ...config,
        url: endpoint.startsWith("http")
          ? endpoint
          : `${this.baseUrl}${endpoint}`,
        headers: {
          ...defaultHeaders,
          ...config.headers,
        },
        timeout: config.timeout ?? apiConfig.timeout,
      };

      return await this.baseClient.request<T>(fullConfig);
    } catch (error) {
      logError(error, context ?? `API Request: ${endpoint}`);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig,
    context?: string
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "GET",
        params,
        ...config,
      },
      context
    );
  }

  /**
   * POST request with form data (MeQasa's preferred format)
   */
  async postForm<T>(
    endpoint: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig,
    context?: string
  ): Promise<T> {
    const formData = new URLSearchParams();

    // Always include the app identifier for MeQasa API
    formData.append("app", "vercel");

    // Add other data as form fields
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === "object" && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            formData.append(key, String(value));
          }
        }
      });
    }

    return this.request<T>(
      endpoint,
      {
        method: "POST",
        data: formData.toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        ...config,
      },
      context
    );
  }

  /**
   * POST request with JSON data
   */
  async postJson<T>(
    endpoint: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig,
    context?: string
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        data: {
          app: "vercel",
          ...data,
        },
        ...config,
      },
      context
    );
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig,
    context?: string
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "PUT",
        data,
        ...config,
      },
      context
    );
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig,
    context?: string
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "DELETE",
        ...config,
      },
      context
    );
  }

  /**
   * Specialized method for property-related requests
   */
  async getProperty<T>(
    endpoint: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.get<T>(endpoint, params, config, `Property API: ${endpoint}`);
  }

  async searchProperties<T>(
    data: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.postForm<T>(
      endpoints.properties.search,
      data,
      config,
      "Property Search"
    );
  }

  async getPropertyDetails<T>(
    reference: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.postForm<T>(
      endpoints.properties.details,
      { refref: reference },
      config,
      `Property Details: ${reference}`
    );
  }

  /**
   * Specialized methods for projects
   */
  async getFeaturedProjects<T>(config?: AxiosRequestConfig): Promise<T> {
    return this.postForm<T>(
      endpoints.projects.featured,
      {},
      config,
      "Featured Projects"
    );
  }

  /**
   * Specialized methods for agents
   */
  async getAgents<T>(
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.get<T>(endpoints.agents.list, params, config, "Agents List");
  }

  async getAgentDetails<T>(
    agentId: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.get<T>(
      `${endpoints.agents.details}/${agentId}`,
      {},
      config,
      `Agent Details: ${agentId}`
    );
  }

  /**
   * Specialized methods for banners/ads
   */
  async getHeroBanner<T>(config?: AxiosRequestConfig): Promise<T> {
    return this.postForm<T>(endpoints.banners.hero, {}, config, "Hero Banner");
  }

  async getFlexiBanner<T>(config?: AxiosRequestConfig): Promise<T> {
    return this.postForm<T>(
      endpoints.banners.flexi,
      {},
      config,
      "Flexi Banner"
    );
  }

  async getGridBanner<T>(config?: AxiosRequestConfig): Promise<T> {
    return this.postForm<T>(endpoints.banners.grid, {}, config, "Grid Banner");
  }

  /**
   * Specialized methods for blog content
   */
  async getBlogPosts<T>(
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.postForm<T>(endpoints.blog.posts, params, config, "Blog Posts");
  }

  async getFeaturedBlogPosts<T>(config?: AxiosRequestConfig): Promise<T> {
    return this.postForm<T>(
      endpoints.blog.featured,
      {},
      config,
      "Featured Blog Posts"
    );
  }

  /**
   * Contact form submission
   */
  async submitContactForm<T>(
    data: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.postForm<T>(
      endpoints.contact.submit,
      data,
      config,
      "Contact Form Submission"
    );
  }

  async contactAgent<T>(
    data: Record<string, unknown>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.postForm<T>(
      endpoints.contact.agent,
      data,
      config,
      "Agent Contact"
    );
  }

  /**
   * Health check method
   */
  async healthCheck(): Promise<{ status: string; timestamp: number }> {
    try {
      // Simple request to test API connectivity
      await this.get("/", {}, { timeout: 5000 });
      return {
        status: "healthy",
        timestamp: Date.now(),
      };
    } catch {
      return {
        status: "unhealthy",
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get error details from the underlying client
   */
  getDetailedError(error: unknown): NetworkError | null {
    return this.baseClient.getDetailedError(error);
  }

  /**
   * Check network status
   */
  isOnline(): boolean {
    return this.baseClient.isOnline();
  }
}

// Create singleton instance
export const meqasaApiClient = new MeQasaApiClient();

// Export for backward compatibility and direct access
export { apiClient as baseApiClient } from "@/lib/axios-client";
export type { NetworkError } from "@/lib/axios-client";
