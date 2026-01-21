import "@/styles/globals.css";

import { DisableScrollRestoration } from "@/components/DisableScrollRestoration";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/toast";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";

import { type Metadata, type Viewport } from "next";

export const metadata: Metadata = {
  title: {
    default: "MeQasa | Ghana's Leading Real Estate Marketplace",
    template: "%s | MeQasa",
  },
  description:
    "Find your dream home on MeQasa, Ghana's leading real estate marketplace. Browse thousands of verified properties for rent and sale including houses, apartments, offices, and land across Ghana.",
  keywords: [
    "Ghana property",
    "houses for rent Ghana",
    "apartments for sale Ghana",
    "real estate Ghana",
    "property listings Ghana",
    "Accra properties",
    "Kumasi properties",
    "Tema properties",
    "Ghana real estate marketplace",
    "property search Ghana",
  ],
  authors: [{ name: "MeQasa" }],
  creator: "MeQasa",
  publisher: "MeQasa",
  metadataBase: new URL("https://meqasa.com"),
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://meqasa.com",
    siteName: "MeQasa",
    title: "MeQasa | Ghana's Leading Real Estate Marketplace",
    description:
      "Find your dream home on MeQasa, Ghana's leading real estate marketplace. Browse thousands of verified properties for rent and sale.",
    images: [
      {
        url: "https://meqasa.com/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "MeQasa - Ghana's Real Estate Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@meqasa",
    creator: "@meqasa",
    title: "MeQasa | Ghana's Leading Real Estate Marketplace",
    description:
      "Find your dream home on MeQasa, Ghana's leading real estate marketplace. Browse thousands of verified properties.",
    images: ["https://meqasa.com/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
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
    <html lang="en" suppressHydrationWarning prefix="og: https://ogp.me/ns#">
      <body
        className={cn(
          "min-h-screen bg-gray-50 font-sans antialiased",
          fontSans.variable
        )}
        suppressHydrationWarning
      >
        <DisableScrollRestoration />
        <ScrollToTop />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
