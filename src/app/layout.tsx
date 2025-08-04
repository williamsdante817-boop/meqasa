import "@/styles/globals.css";

import { cn } from "@/lib/utils";
import { type Metadata, type Viewport } from "next";
import { fontSans } from "@/lib/fonts";
import { Toaster } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Meqasa ",
  description: "Ghana's no.1 property website",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
