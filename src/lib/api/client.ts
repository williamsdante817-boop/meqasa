/**
 * MeQasa API client with form-encoded request support
 */

import { apiConfig, defaultHeaders, endpoints } from "@/config/api";
import { apiClient } from "@/lib/axios-client";
import { logError } from "@/lib/handle-error";
import type { AxiosRequestConfig } from "axios";

export class MeQasaApiClient {
  private baseClient = apiClient;
  private baseUrl = apiConfig.baseUrl;

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

  async postForm<T>(
    endpoint: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig,
    context?: string
  ): Promise<T> {
    const formData = new URLSearchParams();
    formData.append("app", "vercel");

    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === "object" && value !== null) {
            formData.append(key, JSON.stringify(value));
          } else if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
          ) {
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

  // Convenience methods used in data-fetchers
  getPropertyDetails<T>(
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

  searchProperties<T>(
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

  getFeaturedProjects<T>(config?: AxiosRequestConfig): Promise<T> {
    return this.postForm<T>(
      endpoints.projects.featured,
      {},
      config,
      "Featured Projects"
    );
  }

  getHeroBanner<T>(config?: AxiosRequestConfig): Promise<T> {
    return this.postForm<T>(endpoints.banners.hero, {}, config, "Hero Banner");
  }

  getFlexiBanner<T>(config?: AxiosRequestConfig): Promise<T> {
    return this.postForm<T>(
      endpoints.banners.flexi,
      {},
      config,
      "Flexi Banner"
    );
  }

  getGridBanner<T>(config?: AxiosRequestConfig): Promise<T> {
    return this.postForm<T>(endpoints.banners.grid, {}, config, "Grid Banner");
  }

  getFeaturedBlogPosts<T>(config?: AxiosRequestConfig): Promise<T> {
    return this.postForm<T>(
      endpoints.blog.featured,
      {},
      config,
      "Featured Blog Posts"
    );
  }
}

export const meqasaApiClient = new MeQasaApiClient();
export type { NetworkError } from "@/lib/axios-client";
