import React from "react";
import { SiteHeader } from "@/layouts/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import BackToTopButton from "@/components/back-to-top-button";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <BackToTopButton />
      <SiteFooter />
    </div>
  );
}
