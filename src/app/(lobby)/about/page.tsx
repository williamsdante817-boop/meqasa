import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "About MeQasa | Ghana's Leading Real Estate Platform",
  description:
    "Learn about MeQasa, Ghana's trusted real estate marketplace. Discover our mission to connect property seekers with verified listings, professional agents, and reliable developers across Ghana.",
  keywords: [
    "MeQasa about",
    "Ghana real estate platform",
    "MeQasa mission",
    "real estate marketplace Ghana",
    "property platform",
    "MeQasa company",
    "Ghana property search",
    "real estate technology",
    "MeQasa story",
    "property marketplace",
  ],
  authors: [{ name: "MeQasa" }],
  creator: "MeQasa",
  publisher: "MeQasa",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/about",
    siteName: siteConfig.name,
    title: "About MeQasa | Ghana's Leading Real Estate Platform",
    description:
      "Learn about MeQasa, Ghana's trusted real estate marketplace. Discover our mission to connect property seekers with verified listings and professional agents.",
    images: [
      {
        url: `${siteConfig.url}/og-about.jpg`,
        width: 1200,
        height: 630,
        alt: "About MeQasa - Ghana's Real Estate Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@meqasa",
    creator: "@meqasa",
    title: "About MeQasa | Ghana's Leading Real Estate Platform",
    description:
      "Learn about MeQasa, Ghana's trusted real estate marketplace. Discover our mission to connect property seekers with verified listings and professional agents.",
    images: [`${siteConfig.url}/og-about.jpg`],
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
};

export default function About() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "MeQasa",
            description:
              "Ghana's leading real estate marketplace connecting property seekers with verified listings, professional agents, and reliable developers.",
            url: siteConfig.url,
            logo: `${siteConfig.url}/logo.png`,
            sameAs: [
              siteConfig.socialLinks.facebook,
              siteConfig.socialLinks.twitter,
              siteConfig.socialLinks.instagram,
              siteConfig.socialLinks.youtube,
            ],
            address: {
              "@type": "PostalAddress",
              addressCountry: "Ghana",
              addressLocality: "Accra",
            },
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+233-xxx-xxx-xxx",
              email: siteConfig.email,
              contactType: "customer service",
            },
            areaServed: {
              "@type": "Country",
              name: "Ghana",
            },
            foundingDate: "2013",
            founder: {
              "@type": "Person",
              name: "MeQasa Team",
            },
            knowsAbout: [
              "Real Estate",
              "Property Management",
              "Property Search",
              "Real Estate Agents",
              "Property Development",
              "Ghana Real Estate Market",
            ],
          }),
        }}
      />
      <div>About</div>
    </>
  );
}
