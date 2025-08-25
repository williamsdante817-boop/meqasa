import HeaderAdClient from "@/components/header-ad-client";
import ScrollToTop from "@/components/scroll-to-top";
import BackToTopButton from "@/components/back-to-top-button";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/layouts/site-header";
import React from "react";

export default function LobbyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <HeaderAdClient />
      <ScrollToTop />
      {children}
      <BackToTopButton />
      <SiteFooter />
    </div>
  );
}
