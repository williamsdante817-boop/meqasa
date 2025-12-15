export const env = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  VERCEL_URL: process.env.VERCEL_URL,
  SITE_URL: process.env.SITE_URL,
  NODE_ENV: process.env.NODE_ENV,
};

export const getBaseUrl = (): string => {
  if (typeof window !== "undefined") return ""; // Browser should use relative path
  
  // Priority order for server-side URL resolution:
  // 1. NEXT_PUBLIC_SITE_URL (explicitly set)
  // 2. VERCEL_URL (auto-provided by Vercel)
  // 3. Localhost fallback
  if (env.NEXT_PUBLIC_SITE_URL) {
    return env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  
  if (env.VERCEL_URL) {
    // Vercel automatically provides VERCEL_URL without protocol
    return `https://${env.VERCEL_URL}`;
  }
  
  if (env.SITE_URL) {
    return env.SITE_URL.replace(/\/$/, "");
  }
  
  return "http://localhost:3000";
};

export const getApiUrl = (): string => {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return "/api/properties";
  return `${baseUrl}/api/properties`;
};
