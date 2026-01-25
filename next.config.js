/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// import "./src/env.js";

import { withSentryConfig } from "@sentry/nextjs";

/** @type {import("next").NextConfig} */
const config = {
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      "@radix-ui/react-icons",
      "lucide-react",
      "@/components/ui",
    ],
  },

  // Bundle analysis is configured below via wrapper when ANALYZE=true

  // Image optimizations - Standard Next.js Optimization (uses 'sharp' in production)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dve7rykno93gs.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    localPatterns: [
      {
        pathname: "/**",
        search: "",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Production optimizations
  poweredByHeader: false,

  // Compression
  compress: true,

  // Allow ESLint warnings during build
  eslint: {
    ignoreDuringBuilds: false,
  },
};

// If ANALYZE=true, wrap config with bundle analyzer
let finalConfig = config;
if (process.env.ANALYZE === "true") {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true,
  });
  finalConfig = withBundleAnalyzer(finalConfig);
}

export default withSentryConfig(finalConfig, {
  org: "meqasa",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});
