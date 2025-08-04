import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Debug logging
  console.log("Middleware running for pathname:", pathname);

  const response = NextResponse.next();

  // Set the current pathname
  response.headers.set("x-current-path", pathname);

  // Check if we're on any search route (starts with /search)
  const isSearchRoute = pathname.startsWith("/search");
  response.headers.set("x-is-search-route", isSearchRoute.toString());

  // Add cache control headers to prevent caching
  response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  console.log("Middleware headers set:", {
    "x-current-path": response.headers.get("x-current-path"),
    "x-is-search-route": response.headers.get("x-is-search-route"),
  });

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
