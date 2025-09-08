/**
 * Performance monitoring and Web Vitals tracking
 * Based on skateshop patterns for production monitoring
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

// Declare gtag as a global variable
declare const gtag: (...args: unknown[]) => void;

// Web Vitals thresholds
const VITALS_THRESHOLDS = {
  CLS: { good: 0.1, needs_improvement: 0.25 },
  FCP: { good: 1800, needs_improvement: 3000 },
  INP: { good: 200, needs_improvement: 500 },
  LCP: { good: 2500, needs_improvement: 4000 },
  TTFB: { good: 800, needs_improvement: 1800 },
} as const;

// Metric rating
function getMetricRating(
  value: number,
  metric: keyof typeof VITALS_THRESHOLDS
): "good" | "needs_improvement" | "poor" {
  const thresholds = VITALS_THRESHOLDS[metric];
  if (value <= thresholds.good) return "good";
  if (value <= thresholds.needs_improvement) return "needs_improvement";
  return "poor";
}

// Web Vitals reporting
interface WebVitalMetric {
  name: string;
  value: number;
  rating: "good" | "needs_improvement" | "poor";
  delta: number;
  id: string;
}

// Custom analytics endpoint (replace with your analytics service)
function sendToAnalytics(metric: WebVitalMetric) {
  if (process.env.NODE_ENV === "development") {
    console.log("📊 Web Vital:", {
      name: metric.name,
      value: Math.round(metric.value),
      rating: metric.rating,
      delta: Math.round(metric.delta),
    });
    return;
  }

  // In production, send to your analytics service
  // Example: Google Analytics 4
  if (typeof gtag !== "undefined") {
    gtag("event", metric.name, {
      event_category: "Web Vitals",
      event_label: metric.id,
      value: Math.round(metric.value),
      custom_map: {
        metric_rating: metric.rating,
      },
    });
  }

  // Example: Send to custom API endpoint
  fetch("/api/analytics/web-vitals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      page: window.location.pathname,
      timestamp: Date.now(),
    }),
  }).catch((error) => console.error("Web vitals tracking error:", error));
}

// Initialize Web Vitals tracking
export function initWebVitals() {
  if (typeof window === "undefined") return;

  // Cumulative Layout Shift
  onCLS((metric) => {
    const webVital: WebVitalMetric = {
      ...metric,
      rating: getMetricRating(metric.value, "CLS"),
    };
    sendToAnalytics(webVital);
  });

  // First Contentful Paint
  onFCP((metric) => {
    const webVital: WebVitalMetric = {
      ...metric,
      rating: getMetricRating(metric.value, "FCP"),
    };
    sendToAnalytics(webVital);
  });

  // Interaction to Next Paint (replaces FID)
  onINP((metric) => {
    const webVital: WebVitalMetric = {
      ...metric,
      rating: getMetricRating(metric.value, "INP"),
    };
    sendToAnalytics(webVital);
  });

  // Largest Contentful Paint
  onLCP((metric) => {
    const webVital: WebVitalMetric = {
      ...metric,
      rating: getMetricRating(metric.value, "LCP"),
    };
    sendToAnalytics(webVital);
  });

  // Time to First Byte
  onTTFB((metric) => {
    const webVital: WebVitalMetric = {
      ...metric,
      rating: getMetricRating(metric.value, "TTFB"),
    };
    sendToAnalytics(webVital);
  });
}

// Page performance tracking
export function trackPagePerformance(pageName: string) {
  if (typeof window === "undefined") return;

  // Track navigation timing
  if ("performance" in window && "timing" in window.performance) {
    const timing = window.performance.timing;
    const navigationStart = timing.navigationStart;

    const metrics = {
      page: pageName,
      domLoaded: timing.domContentLoadedEventEnd - navigationStart,
      windowLoaded: timing.loadEventEnd - navigationStart,
      firstByte: timing.responseStart - navigationStart,
      domInteractive: timing.domInteractive - navigationStart,
    };

    if (process.env.NODE_ENV === "development") {
      console.log("⏱️ Page Performance:", metrics);
    } else {
      // Send to analytics in production
      fetch("/api/analytics/page-performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...metrics,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      }).catch((error) => console.error("Performance tracking error:", error));
    }
  }
}

// Error tracking
export function trackError(error: Error, context?: Record<string, unknown>) {
  const errorData = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    url: typeof window !== "undefined" ? window.location.href : "",
    timestamp: Date.now(),
    context,
  };

  if (process.env.NODE_ENV === "development") {
    console.error("🔥 Error tracked:", errorData);
  } else {
    // Send to error tracking service in production
    fetch("/api/analytics/errors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(errorData),
    }).catch((error) => console.error("Error tracking error:", error));
  }
}

// User interaction tracking
export function trackUserInteraction(
  action: string,
  element: string,
  value?: string | number
) {
  const interactionData = {
    action,
    element,
    value,
    page: typeof window !== "undefined" ? window.location.pathname : "",
    timestamp: Date.now(),
  };

  if (process.env.NODE_ENV === "development") {
    console.log("👆 User Interaction:", interactionData);
  } else {
    // Send to analytics in production
    fetch("/api/analytics/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(interactionData),
    }).catch((error) => console.error("Interaction tracking error:", error));
  }
}

// Export default performance monitor
const performanceMonitor = {
  initWebVitals,
  trackPagePerformance,
  trackError,
  trackUserInteraction,
};

export default performanceMonitor;
