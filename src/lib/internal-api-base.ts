export function resolveInternalApiBase(isServer: boolean): string {
  if (isServer) {
    if (process.env.NODE_ENV === "development") {
      return "http://localhost:3000";
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      return process.env.NEXT_PUBLIC_SITE_URL;
    }
    return "https://meqasa.com";
  }
  return "";
}
