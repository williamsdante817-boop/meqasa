import HeaderAdClient from "@/components/header-ad-client";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/layouts/site-header";
import React from "react";

export default function LobbyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <HeaderAdClient />
      {children}
      <SiteFooter />
    </div>
  );
}
