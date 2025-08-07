# Axios HTTP Client Integration with axios-retry

This document outlines the integration of Axios as your HTTP client with the [axios-retry](https://www.npmjs.com/package/axios-retry) package for robust retry strategies, replacing the previous `apiFetch` function.

## Overview

The new Axios integration provides:

- **Automatic retry logic** using the battle-tested `axios-retry` package
- **Exponential backoff** and linear delay strategies
- **Comprehensive error handling** and logging
- **Request/response interceptors** for monitoring
- **Flexible retry configuration** per request type
- **Request-specific retry overrides**
- **Backward compatibility** with existing `apiFetch` calls

## Files Created

1. **`src/lib/axios-client.ts`** - Main Axios client with axios-retry integration
2. **`src/lib/api-client-compat.ts`** - Compatibility layer for existing code
3. **`src/lib/axios-examples.ts`** - Usage examples and patterns
4. **`AXIOS_INTEGRATION.md`** - This documentation

## Quick Start

### Basic Usage

```typescript
import { apiClient } from "@/lib/axios-client";

// Simple GET request with automatic retries (exponential backoff)
const userData = await apiClient.get("/api/users/123");

// POST request with data
const newUser = await apiClient.post("/api/users", {
  name: "John Doe",
  email: "john@example.com",
});
```

### Using the Compatibility Layer

Your existing code will continue to work without changes:

```typescript
import { apiFetch } from "@/lib/api-client-compat";

// This works exactly as before, but now uses Axios with axios-retry underneath
const data = await apiFetch({
  url: "/api/endpoint",
  method: "GET",
  params: { id: "123" },
});
```

## Retry Configuration

### Default Retry Strategy

The default configuration includes:

- **3 retry attempts**
- **Exponential backoff** delay (built-in from axios-retry)
- **Retries on**: Network errors, 5xx server errors, 429 rate limits

### Built-in Delay Strategies

The `axios-retry` package provides several built-in delay strategies:

```typescript
import { axiosRetry } from "@/lib/axios-client";

// Exponential backoff (default)
retryDelay: axiosRetry.exponentialDelay;

// Linear delay
retryDelay: axiosRetry.linearDelay();

// No delay
retryDelay: axiosRetry.noDelay;
```

### Custom Retry Configuration

```typescript
import { ApiClient, RetryConfig, axiosRetry } from "@/lib/axios-client";

const customRetryConfig: Partial<RetryConfig> = {
  retries: 5,
  retryDelay: axiosRetry.exponentialDelay, // Built-in exponential backoff
  retryCondition: (error) => {
    // Custom retry logic
    return !error.response || error.response.status >= 500;
  },
  onRetry: (retryCount, error, requestConfig) => {
    console.log(`Retry ${retryCount} for ${requestConfig?.url}`);
  },
  onMaxRetryTimesExceeded: (error, retryCount) => {
    console.error(
      `Max retries (${retryCount}) exceeded for ${error.config?.url}`,
    );
  },
  shouldResetTimeout: false, // Don't reset timeout between retries
};

const customClient = new ApiClient(customRetryConfig);
const result = await customClient.get("/api/critical-endpoint");
```

## Retry Strategies by Use Case

### 1. Critical Operations (Payments, etc.)

```typescript
const criticalConfig = {
  retries: 5,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return (
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600) ||
      error.response.status === 429 ||
      error.response.status === 503
    );
  },
  onMaxRetryTimesExceeded: (error, retryCount) => {
    console.error(`Critical operation failed after ${retryCount} retries`);
  },
};
```

### 2. Search Operations (Linear Delay)

```typescript
const searchConfig = {
  retries: 2,
  retryDelay: axiosRetry.linearDelay(),
  retryCondition: (error) => {
    return (
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600)
    );
  },
};
```

### 3. File Uploads (Custom Delay)

```typescript
const uploadConfig = {
  retries: 3,
  retryDelay: (retryCount: number) => {
    return retryCount * 2000; // Custom linear delay
  },
  retryCondition: (error) => {
    return (
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600) ||
      error.response.status === 429 ||
      error.response.status === 413 ||
      error.response.status === 408
    );
  },
};
```

## Features

### 1. Built-in Exponential Backoff

The `axios-retry` package provides optimized exponential backoff:

- 1st retry: ~1000ms delay
- 2nd retry: ~2000ms delay
- 3rd retry: ~4000ms delay
- And so on...

### 2. Request-Specific Retry Configuration

Override retry settings for individual requests:

```typescript
// Disable retries for this specific request
const result = await apiClient.get("/api/endpoint", {
  "axios-retry": {
    retries: 0,
  },
});

// Custom retry configuration for this request
const result = await apiClient.get("/api/endpoint", {
  "axios-retry": {
    retries: 2,
    retryDelay: axiosRetry.linearDelay(),
  },
});
```

### 3. Request/Response Logging

In development mode, all requests and responses are logged:

```
🚀 API Request: GET /api/users/123
✅ API Response: GET /api/users/123 (200ms)
❌ API Error: POST /api/payments (500ms) - 500 Internal Server Error
```

### 4. Enhanced Error Handling

Improved error messages with retry information:

- Network errors: "API request failed: No response received from server"
- Server errors: "API request failed: 500 Internal Server Error"
- Retry exhaustion: "Max retry attempts (3) exceeded"

### 5. Timeout Configuration

Default 10-second timeout with per-request override:

```typescript
// Custom timeout for file uploads
const result = await apiClient.post("/api/upload", formData, {
  timeout: 30000, // 30 seconds
});
```

### 6. Timeout Reset Between Retries

```typescript
const timeoutResetConfig = {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  shouldResetTimeout: true, // Reset timeout between retries
};

const client = new ApiClient(timeoutResetConfig);
const result = await client.get("/api/endpoint", {
  timeout: 5000, // 5 second timeout per attempt
});
```

## Migration Guide

### Step 1: Update Imports

Replace:

```typescript
import { apiFetch } from "@/lib/api-client";
```

With:

```typescript
import { apiFetch } from "@/lib/api-client-compat";
// OR for new code:
import { apiClient } from "@/lib/axios-client";
```

### Step 2: Gradual Migration

Your existing code will work immediately. For new features, use the new API:

```typescript
// Old way (still works)
const data = await apiFetch({
  url: "/api/endpoint",
  method: "GET",
  params: { id: "123" },
});

// New way (recommended)
const data = await apiClient.get("/api/endpoint", {
  params: { id: "123" },
});
```

### Step 3: Custom Retry Logic

For endpoints that need specific retry behavior:

```typescript
const paymentClient = new ApiClient({
  retries: 5,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Custom retry logic for payments
    return !error.response || error.response.status >= 500;
  },
});

const result = await paymentClient.post("/api/payments", paymentData);
```

## Advanced Patterns

### Circuit Breaker Pattern

For critical services, implement circuit breaker:

```typescript
import { CircuitBreaker } from "@/lib/axios-examples";

const circuitBreaker = new CircuitBreaker();
const result = await circuitBreaker.execute(() =>
  apiClient.get("/api/critical-service"),
);
```

### Batch Operations with Selective Retries

```typescript
const batchClient = new ApiClient({
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
});

const results = await Promise.allSettled(
  users.map((user) => {
    // Disable retries for critical users
    if (user.id === "critical-user") {
      return batchClient.requestWithoutRetry({
        method: "PUT",
        url: `/api/users/${user.id}`,
        data: user,
      });
    }

    // Use default retry configuration
    return batchClient.put(`/api/users/${user.id}`, user);
  }),
);
```

### Environment-Specific Retry Strategies

```typescript
export function createEnvironmentSpecificClient(
  environment: "dev" | "staging" | "prod",
) {
  const configs = {
    dev: {
      retries: 1,
      retryDelay: axiosRetry.linearDelay(),
    },
    staging: {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
    },
    prod: {
      retries: 5,
      retryDelay: axiosRetry.exponentialDelay,
    },
  };

  return new ApiClient(configs[environment]);
}
```

### Custom Axios Instance with Retry

```typescript
import { axiosRetry } from "@/lib/axios-client";

const customAxios = require("axios").create({
  baseURL: "https://api.example.com",
  timeout: 5000,
});

// Apply axios-retry to custom instance
axiosRetry(customAxios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return !error.response || error.response.status >= 500;
  },
});
```

## Configuration Options

### RetryConfig Interface

```typescript
interface RetryConfig {
  retries: number; // Number of retry attempts
  retryDelay: (retryCount: number, error: AxiosError) => number; // Delay function
  retryCondition: (error: AxiosError) => boolean; // When to retry
  shouldResetTimeout: boolean; // Reset timeout between retries
  onRetry?: (
    retryCount: number,
    error: AxiosError,
    requestConfig?: any,
  ) => void;
  onMaxRetryTimesExceeded?: (error: AxiosError, retryCount: number) => void;
}
```

### Global Configuration

```typescript
// Update global retry configuration
apiClient.setRetryConfig({
  retries: 4,
  retryDelay: axiosRetry.exponentialDelay,
});

// Get current configuration
const config = apiClient.getRetryConfig();
```

## Best Practices

1. **Use appropriate retry strategies** for different types of operations
2. **Leverage built-in delay functions** from axios-retry
3. **Monitor retry patterns** in production to optimize configurations
4. **Implement circuit breakers** for critical services
5. **Use request-specific overrides** for special cases
6. **Set appropriate timeouts** based on operation type
7. **Consider timeout reset** for long-running operations

## Troubleshooting

### Common Issues

1. **Too many retries**: Reduce `retries` count or adjust `retryCondition`
2. **Long delays**: Use `axiosRetry.linearDelay()` instead of exponential
3. **Memory leaks**: Ensure proper error handling in retry callbacks
4. **Server overload**: Implement circuit breaker patterns

### Debug Mode

Enable detailed logging in development:

```typescript
// All requests/responses are logged in development mode
// Check browser console for detailed information including retry attempts
```

## Performance Considerations

- **Exponential backoff** prevents thundering herd problems
- **Linear delay** is faster for non-critical operations
- **Request-specific overrides** allow fine-grained control
- **Timeout reset** can be useful for long-running operations
- **Circuit breakers** protect against cascading failures

## Monitoring

The client provides built-in logging for:

- Request/response timing
- Retry attempts and reasons
- Error details and status codes
- Performance metrics
- Max retry exhaustion events

Use these logs to monitor API health and optimize retry strategies.

## axios-retry Package Benefits

Using the [axios-retry](https://www.npmjs.com/package/axios-retry) package provides:

- **Battle-tested reliability**: Used by millions of projects
- **Optimized algorithms**: Efficient exponential backoff implementation
- **Flexible configuration**: Multiple delay strategies and conditions
- **Request-specific overrides**: Fine-grained control per request
- **Active maintenance**: Regular updates and bug fixes
- **TypeScript support**: Full type definitions included
