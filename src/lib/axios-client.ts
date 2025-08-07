import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import axiosRetry from "axios-retry";
import type { IAxiosRetryConfig } from "axios-retry";

// Extend the AxiosRequestConfig to include metadata
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}

// Enhanced error types for better categorization
export interface NetworkError {
  type: "network" | "server" | "timeout" | "offline" | "unknown";
  message: string;
  originalError: AxiosError;
  retryable: boolean;
}

// Retry configuration interface that extends axios-retry's interface
interface RetryConfig extends IAxiosRetryConfig {
  onRetry?: (
    retryCount: number,
    error: AxiosError,
    requestConfig?: AxiosRequestConfig,
  ) => void;
  onMaxRetryTimesExceeded?: (error: AxiosError, retryCount: number) => void;
}

// Network status detection
const isOnline = (): boolean => {
  if (typeof window !== "undefined") {
    return navigator.onLine;
  }
  return true; // Assume online on server-side
};

// Enhanced error classification
const classifyError = (error: AxiosError): NetworkError => {
  // Check if user is offline
  if (!isOnline()) {
    return {
      type: "offline",
      message:
        "No internet connection. Please check your network and try again.",
      originalError: error,
      retryable: true,
    };
  }

  // Network errors (no response received)
  if (!error.response) {
    if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
      return {
        type: "timeout",
        message:
          "Request timed out. Please check your connection and try again.",
        originalError: error,
        retryable: true,
      };
    }

    if (
      error.message.includes("Network Error") ||
      error.message.includes("ERR_NETWORK")
    ) {
      return {
        type: "network",
        message:
          "Network error. Please check your internet connection and try again.",
        originalError: error,
        retryable: true,
      };
    }

    return {
      type: "network",
      message: "Unable to connect to server. Please try again later.",
      originalError: error,
      retryable: true,
    };
  }

  // Server errors
  if (error.response.status >= 500) {
    return {
      type: "server",
      message: `Server error (${error.response.status}). Please try again later.`,
      originalError: error,
      retryable: true,
    };
  }

  // Rate limiting
  if (error.response.status === 429) {
    return {
      type: "server",
      message: "Too many requests. Please wait a moment and try again.",
      originalError: error,
      retryable: true,
    };
  }

  // Client errors (4xx)
  if (error.response.status >= 400 && error.response.status < 500) {
    return {
      type: "server",
      message: `Request failed (${error.response.status}). Please check your input and try again.`,
      originalError: error,
      retryable: false,
    };
  }

  return {
    type: "unknown",
    message: `Unexpected error: ${error.message}`,
    originalError: error,
    retryable: false,
  };
};

// Default retry configuration
const defaultRetryConfig: RetryConfig = {
  retries: 3,
  retryDelay: (retryCount: number) => axiosRetry.exponentialDelay(retryCount), // Use exponential backoff
  retryCondition: (error: AxiosError) => {
    const classifiedError = classifyError(error);
    return classifiedError.retryable;
  },
  onRetry: (retryCount, error, requestConfig) => {
    const classifiedError = classifyError(error);
    console.warn(
      `Retry attempt ${retryCount} for ${requestConfig?.url ?? "unknown"}`,
      {
        errorType: classifiedError.type,
        message: classifiedError.message,
        status: error.response?.status,
      },
    );
  },
  onMaxRetryTimesExceeded: (error, retryCount) => {
    const classifiedError = classifyError(error);
    console.error(
      `Max retry attempts (${retryCount}) exceeded for ${error.config?.url ?? "unknown"}`,
      {
        errorType: classifiedError.type,
        message: classifiedError.message,
        status: error.response?.status,
      },
    );
  },
  shouldResetTimeout: false, // Don't reset timeout between retries
};

// Create Axios instance with default configuration
const createAxiosInstance = (
  retryConfig?: Partial<RetryConfig>,
): AxiosInstance => {
  const instance = axios.create({
    timeout: 10000, // 10 seconds timeout
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Apply retry configuration
  const finalRetryConfig = { ...defaultRetryConfig, ...retryConfig };
  axiosRetry(instance, finalRetryConfig);

  // Request interceptor for logging and authentication
  instance.interceptors.request.use(
    (config: ExtendedAxiosRequestConfig) => {
      // Add request timestamp for logging
      config.metadata = { startTime: new Date() };

      // Log outgoing requests in development
      if (process.env.NODE_ENV === "development") {
        console.log(
          `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
          {
            params: config.params as Record<string, unknown>,
            data: config.data as unknown,
          },
        );
      }

      return config;
    },
    (error: AxiosError) => {
      console.error("Request interceptor error:", error);
      return Promise.reject(error);
    },
  );

  // Response interceptor for logging and error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const extendedConfig = response.config as ExtendedAxiosRequestConfig;
      const duration = extendedConfig.metadata?.startTime
        ? new Date().getTime() - extendedConfig.metadata.startTime.getTime()
        : 0;

      // Log successful responses in development
      if (process.env.NODE_ENV === "development") {
        console.log(
          `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
          {
            status: response.status,
            duration: `${duration}ms`,
            data: response.data as unknown,
          },
        );
      }

      return response;
    },
    (error: AxiosError) => {
      const extendedConfig = error.config as ExtendedAxiosRequestConfig;
      const duration = extendedConfig?.metadata?.startTime
        ? new Date().getTime() - extendedConfig.metadata.startTime.getTime()
        : 0;

      // Log errors
      console.error(
        `❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        {
          status: error.response?.status,
          statusText: error.response?.statusText,
          duration: `${duration}ms`,
          message: error.message,
          data: error.response?.data,
        },
      );

      return Promise.reject(error);
    },
  );

  return instance;
};

// Main API client class
export class ApiClient {
  private axiosInstance: AxiosInstance;
  private retryConfig: RetryConfig;

  constructor(retryConfig?: Partial<RetryConfig>) {
    this.retryConfig = { ...defaultRetryConfig, ...retryConfig };
    this.axiosInstance = createAxiosInstance(this.retryConfig);
  }

  // Generic request method
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>(config);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const classifiedError = classifyError(axiosError);

      // Throw error with user-friendly message
      throw new Error(classifiedError.message);
    }
  }

  // Convenience methods for different HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "GET", url });
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>({ ...config, method: "POST", url, data });
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>({ ...config, method: "PUT", url, data });
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "DELETE", url });
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>({ ...config, method: "PATCH", url, data });
  }

  // Method to update retry configuration (creates new instance)
  setRetryConfig(config: Partial<RetryConfig>): void {
    this.retryConfig = { ...this.retryConfig, ...config };
    this.axiosInstance = createAxiosInstance(this.retryConfig);
  }

  // Method to get current retry configuration
  getRetryConfig(): RetryConfig {
    return { ...this.retryConfig };
  }

  // Method to disable retries for a specific request
  async requestWithoutRetry<T>(config: AxiosRequestConfig): Promise<T> {
    const noRetryConfig = {
      ...config,
      "axios-retry": {
        retries: 0,
      },
    };
    return this.request<T>(noRetryConfig);
  }

  // Method to get detailed error information
  getDetailedError(error: unknown): NetworkError | null {
    if (error instanceof Error && "originalError" in error) {
      return error as unknown as NetworkError;
    }
    return null;
  }

  // Method to check if user is online
  isOnline(): boolean {
    return isOnline();
  }
}

// Create default API client instance
export const apiClient = new ApiClient();

// Export types for external use
export type { AxiosRequestConfig, AxiosResponse, AxiosError, RetryConfig };

// Export axios-retry utilities for advanced usage
export { default as axiosRetry } from "axios-retry";
