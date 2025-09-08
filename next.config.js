/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
// import "./src/env.js";

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

  // Image optimizations
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "meqasa.com",
      },
      {
        protocol: "https",
        hostname: "dve7rykno93gs.cloudfront.net",
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
    ],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 3600, // 1 hour cache
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    qualities: [75, 85, 90, 95],
  },

  // Production optimizations
  poweredByHeader: false,

  // Compression
  compress: true,
};

// If ANALYZE=true, wrap config with bundle analyzer
let finalConfig = config;
if (process.env.ANALYZE === "true") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true,
  });
  finalConfig = withBundleAnalyzer(finalConfig);
}

export default finalConfig;
