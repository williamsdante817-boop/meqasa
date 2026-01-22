"use client";

import { siteConfig } from "@/config/site";
import Image from "next/image";
import Link from "next/link";

import { AuthDropdown } from "./auth-group";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";

export function SiteHeader() {
  const isAuthenticated = false;

  return (
    <header
      className="bg-background sticky top-0 z-[100] flex w-full items-center justify-center border-b border-gray-200"
      role="banner"
    >
      <div className="container flex h-16 items-center px-3">
        {/* Desktop Logo - Always visible in sticky header */}
        <Link
          href="/"
          aria-label="MeQasa Home"
          className="mr-4 hidden items-center lg:flex"
        >
          <Image
            src="/meqasa-logo-minimize.png"
            alt="MeQasa"
            width={36}
            height={36}
            className="h-9 w-9"
            priority
          />
        </Link>

        <MainNav items={siteConfig.mainNav} />

        {/* Mobile Logo and Nav */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/" aria-label="MeQasa Home" className="flex items-center">
            <Image
              src="/meqasa-logo-minimize.png"
              alt="MeQasa"
              width={40}
              height={40}
              className="h-10 w-10"
              priority
            />
          </Link>
          <MobileNav />
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2 text-slate-900">
            <AuthDropdown user={isAuthenticated} />
          </nav>
        </div>
      </div>
    </header>
  );
}
