import "@/styles/globals.css";

import { Toaster } from "@/components/ui/toast";
import { WebVitals } from "@/components/web-vitals";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { type Metadata, type Viewport } from "next";

export const metadata: Metadata = {
  title: "Meqasa ",
  description: "Ghana's no.1 property website",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
  maximumScale: 1,
  minimumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-gray-50 font-sans antialiased",
          fontSans.variable
        )}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
        <WebVitals />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
