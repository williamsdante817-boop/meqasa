// Simple analytics utility for production monitoring
export const analytics = {
  // Track page views
  trackPageView: (page: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", "GA_MEASUREMENT_ID", {
        page_path: page,
      });
    }
  },

  // Track user interactions
  trackEvent: (
    action: string,
    category: string,
    label?: string,
    value?: number,
  ) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  },

  // Track errors
  trackError: (error: Error, context?: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "exception", {
        description: error.message,
        fatal: false,
        custom_map: {
          context: context ?? "unknown",
          stack: error.stack,
        },
      });
    }

    // Also log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Analytics Error:", { error, context });
    }
  },

  // Track performance metrics
  trackPerformance: (metric: string, value: number) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "timing_complete", {
        name: metric,
        value: Math.round(value),
      });
    }
  },
};

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}
