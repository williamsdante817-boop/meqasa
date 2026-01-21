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

  // Image optimizations - CloudFront loader for AWS Amplify
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "meqasa.com",
      },
      {
        protocol: "https",
        hostname: "staging.meqasa.com",
      },
      {
        protocol: "https",
        hostname: "dve7rykno93gs.cloudfront.net",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "i0.wp.com",
      },
      {
        protocol: "https",
        hostname: "blog.meqasa.com",
      },
    ],
    localPatterns: [
      {
        pathname: "/placeholder.svg**",
      },
      {
        pathname: "/logo.png",
      },
      {
        pathname: "/insights_**",
      },
      {
        pathname: "/placeholder-image.png",
      },
      {
        pathname: "/plan-4.webp",
      },
      {
        pathname: "/accra-housing-guide.jpg",
      },
      {
        pathname: "/real-estate-report.jpg",
      },
      {
        pathname: "/meqasa-newsletter-leaderboard.png",
      },
      {
        pathname: "/desktop-leaderboard.png",
      },
      {
        pathname: "/leaderboard-ad.png",
      },
      {
        pathname: "/mobile-ad.png",
      },
      {
        pathname: "/east-legon-poster.jpg",
      },
      {
        pathname: "/airport-poster.jpg",
      },
      {
        pathname: "/Osu-poster.jpg",
      },
      {
        pathname: "/dzorwulu-poster.jpg",
      },
      {
        pathname: "/fallback.png",
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
