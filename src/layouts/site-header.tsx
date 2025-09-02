"use client";

import { siteConfig } from "@/config/site";

import { AuthDropdown } from "./auth-group";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  // TODO: Replace with actual auth state
  const isAuthenticated = false;

  return (
    <header
      className="sticky top-0 z-[100] w-full border-b border-gray-200 bg-background flex items-center justify-center"
      role="banner"
    >
      <div className="flex items-center container h-16 px-4 lg:px-6">
        <MainNav items={siteConfig.mainNav} />
        <MobileNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2 text-slate-900">
            <AuthDropdown user={isAuthenticated} />
          </nav>
        </div>
      </div>
    </header>
  );
}
