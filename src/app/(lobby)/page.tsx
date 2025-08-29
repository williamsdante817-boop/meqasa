export const dynamic = "force-dynamic";
import React from "react";
import { getFeaturedListings } from "@/lib/get-featured-listings";
import { getFeaturedProjects } from "@/lib/get-featured-projects";
import { getFeaturedUnits } from "@/lib/get-featured-units";
import { getHeroBanner } from "@/lib/get-hero-banner";
import { getLatestListings } from "@/lib/get-latest-listing";
import { getFlexiBanner } from "@/lib/get-flexi-banner";
import { getStaticData } from "@/lib/static-data";
import { getBlogData } from "@/lib/get-blog-data";
import { LobbySkeleton } from "./_component/lobby-skeleton";
import { HomepageClient } from "@/components/homepage/homepage-client";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { sanitizeStructuredData } from "@/lib/dom-sanitizer";

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Find Your Dream Home | MeQasa - Ghana's Real Estate Marketplace",
    description:
      "Discover the perfect property for rent or sale in Ghana. Browse houses, apartments, offices, and land on MeQasa - your trusted real estate platform with verified listings and professional agents.",
    keywords: [
      "real estate Ghana",
      "properties for rent",
      "properties for sale",
      "houses Ghana",
      "apartments Accra",
      "office spaces",
      "land for sale",
      "MeQasa",
      "Ghana real estate",
      "property search",
      "rental properties",
      "buy property Ghana",
    ],
    authors: [{ name: "MeQasa" }],
    creator: "MeQasa",
    publisher: "MeQasa",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: siteConfig.name,
      title: "Find Your Dream Home | MeQasa - Ghana's Real Estate Marketplace",
      description:
        "Discover the perfect property for rent or sale in Ghana. Browse houses, apartments, offices, and land on MeQasa - your trusted real estate platform.",
      images: [
        {
          url: `${siteConfig.url}/og-homepage.jpg`,
          width: 1200,
          height: 630,
          alt: "MeQasa - Ghana's leading real estate marketplace",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@meqasa",
      creator: "@meqasa",
      title: "Find Your Dream Home | MeQasa - Ghana's Real Estate Marketplace",
      description:
        "Discover the perfect property for rent or sale in Ghana. Browse houses, apartments, offices, and land on MeQasa.",
      images: [`${siteConfig.url}/og-homepage.jpg`],
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
      google: "your-google-verification-code",
      yandex: "your-yandex-verification-code",
      yahoo: "your-yahoo-verification-code",
    },
  };
}

export default async function HomePage() {
  /**
   * Hybrid rendering strategy with React Query:
   * - Server-side: Fast initial load with fresh data for SEO and performance
   * - Client-side: React Query manages background updates and caching
   * - Best of both worlds: Fast initial render + smart client-side updates
   */

  // Server-side: Get initial data for fast first load
  const staticData = await getStaticData();

  // Await all data in parallel for initial render
  const [
    featuredProjects,
    featuredUnits,
    featuredListings,
    latestListings,
    heroBanner,
    flexiBanner,
    blogData
  ] = await Promise.all([
    getFeaturedProjects(),
    getFeaturedUnits(),
    getFeaturedListings(),
    getLatestListings(),
    getHeroBanner(),
    getFlexiBanner(),
    getBlogData()
  ]);


  const initialData = {
    staticData,
    featuredProjects,
    featuredUnits,
    featuredListings,
    latestListings,
    heroBanner,
    flexiBanner,
    blogData
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={sanitizeStructuredData({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: "MeQasa",
          description:
            "Ghana's leading real estate marketplace for properties for rent and sale",
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
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Properties for Rent and Sale",
            description:
              "Comprehensive listing of properties available for rent and sale in Ghana",
          },
        })}
      />
      {/* Use hybrid client component with server-rendered initial data */}
      <React.Suspense fallback={<LobbySkeleton />}>
        <HomepageClient initialData={initialData} />
      </React.Suspense>
    </>
  );
}
