export const env = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  VERCEL_URL: process.env.VERCEL_URL,
  SITE_URL: process.env.SITE_URL,
  NODE_ENV: process.env.NODE_ENV,
};

export const getBaseUrl = (): string => {
  if (typeof window !== "undefined") return ""; // Browser should use relative path
  if (env.NEXT_PUBLIC_SITE_URL) return env.NEXT_PUBLIC_SITE_URL;
  if (env.VERCEL_URL) {
    // Vercel automatically provides VERCEL_URL without protocol
    return `https://${env.VERCEL_URL}`;
  }
  if (env.SITE_URL) return env.SITE_URL;
  return "http://localhost:3000";
};

export const getApiUrl = (): string => {
  const baseUrl = getBaseUrl();
  return baseUrl ? `${baseUrl.replace(/\/$/, "")}/api/properties` : "/api/properties";
};
