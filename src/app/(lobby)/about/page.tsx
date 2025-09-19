import React from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Shell from "@/layouts/shell";
import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import { StructuredData } from "@/components/structured-data";
import Link from "next/link";

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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MeQasa",
    description:
      "Ghana's leading real estate marketplace connecting property seekers with verified listings, professional agents, and reliable developers.",
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [
      "https://facebook.com/meqasa",
      "https://twitter.com/meqasa",
      "https://instagram.com/meqasa",
      "https://youtube.com/meqasa",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "Ghana",
      addressLocality: "Accra",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+233-xxx-xxx-xxx",
      email: "info@meqasa.com",
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
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData data={structuredData} />

      <Shell>
        <div className="py-8">
          {/* Breadcrumb */}
          <Breadcrumbs
            className="mb-8"
            segments={[
              { title: "Home", href: "/" },
              { title: "About", href: "#" },
            ]}
          />

          {/* Hero Section */}
          <div className="mb-16 text-center">
            <h1 className="text-brand-accent mb-6 text-4xl font-bold md:text-5xl">
              About MeQasa
            </h1>
            <p className="text-brand-muted mx-auto max-w-3xl text-xl">
              MeQasa helps you find residential and commercial property to rent
              or buy in Ghana. We connect property seekers with owners, brokers,
              and developers across Accra, Tema, and beyond.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-16 grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-brand-accent mb-4 text-3xl font-bold">
                Our Mission
              </h2>
              <p className="text-brand-muted mb-6 leading-relaxed">
                We collaborate with brokers, owners and tenants to create
                complete and dynamic property profiles. MeQasa facilitates
                communication and meetings between prospective tenants and
                owners.
              </p>
              <p className="text-brand-muted leading-relaxed">
                We believe everyone deserves access to quality housing and
                reliable real estate information, which is why we focus on
                creating comprehensive property profiles and seamless
                connections.
              </p>
            </div>
            <div>
              <h2 className="text-brand-accent mb-4 text-3xl font-bold">
                Our Vision
              </h2>
              <p className="text-brand-muted mb-6 leading-relaxed">
                MeQasa is working toward an efficient housing search experience
                in Africa primarily for prospective tenants. We aspire to be the
                source of reliable information on housing in Africa.
              </p>
              <p className="text-brand-muted leading-relaxed">
                We envision a future where finding property is seamless, secure,
                and accessible to everyone across Ghana and throughout Africa,
                with reliable and comprehensive property information.
              </p>
            </div>
          </div>

          {/* What We Do Section */}
          <div className="mb-16">
            <h2 className="text-brand-accent mb-8 text-center text-3xl font-bold">
              What We Do
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-blue-50 p-6 text-center">
                <h3 className="text-brand-accent mb-4 text-xl font-semibold">
                  Property Listings
                </h3>
                <p className="text-brand-muted">
                  Browse thousands of verified property listings across Ghana,
                  from apartments and houses to commercial spaces and land.
                </p>
              </div>
              <div className="rounded-lg bg-orange-50 p-6 text-center">
                <h3 className="text-brand-accent mb-4 text-xl font-semibold">
                  Agent Network
                </h3>
                <p className="text-brand-muted">
                  Connect with professional, verified real estate agents and
                  brokers who understand the local market and your needs.
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-6 text-center">
                <h3 className="text-brand-accent mb-4 text-xl font-semibold">
                  Development Projects
                </h3>
                <p className="text-brand-muted">
                  Discover new development projects from trusted developers,
                  with detailed information and transparent pricing.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose MeQasa Section */}
          <div className="mb-16">
            <h2 className="text-brand-accent mb-8 text-center text-3xl font-bold">
              Why Choose MeQasa
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="bg-brand-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <span className="font-bold text-white">✓</span>
                </div>
                <h3 className="text-brand-accent mb-2 font-semibold">
                  Verified Listings
                </h3>
                <p className="text-brand-muted text-sm">
                  All properties are verified for authenticity and accuracy
                </p>
              </div>
              <div className="text-center">
                <div className="bg-brand-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <span className="font-bold text-white">🏆</span>
                </div>
                <h3 className="text-brand-accent mb-2 font-semibold">
                  Trusted Platform
                </h3>
                <p className="text-brand-muted text-sm">
                  Over a decade of serving Ghana&apos;s real estate market
                </p>
              </div>
              <div className="text-center">
                <div className="bg-brand-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <span className="font-bold text-white">📱</span>
                </div>
                <h3 className="text-brand-accent mb-2 font-semibold">
                  Easy to Use
                </h3>
                <p className="text-brand-muted text-sm">
                  User-friendly platform accessible on all devices
                </p>
              </div>
              <div className="text-center">
                <div className="bg-brand-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                  <span className="font-bold text-white">🤝</span>
                </div>
                <h3 className="text-brand-accent mb-2 font-semibold">
                  Expert Support
                </h3>
                <p className="text-brand-muted text-sm">
                  Professional agents and customer support team
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="rounded-lg bg-gray-50 p-12 text-center">
            <h2 className="text-brand-accent mb-4 text-3xl font-bold">
              Ready to Find Your Perfect Property?
            </h2>
            <p className="text-brand-muted mx-auto mb-8 max-w-2xl">
              Join thousands of satisfied customers who have found their dream
              homes through MeQasa. Start your property search today or get in
              touch with our team for personalized assistance.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/"
                className="bg-brand-primary hover:bg-brand-primary-dark rounded-lg px-8 py-3 text-white transition-colors"
              >
                Browse Properties
              </Link>
              <Link
                href="/agents"
                className="border-brand-primary text-brand-primary hover:bg-brand-primary rounded-lg border px-8 py-3 transition-colors hover:text-white"
              >
                Find an Agent
              </Link>
            </div>
          </div>
        </div>
      </Shell>
    </>
  );
}
