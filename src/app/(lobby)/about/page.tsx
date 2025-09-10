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
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-accent mb-6">
              About MeQasa
            </h1>
            <p className="text-xl text-brand-muted max-w-3xl mx-auto">
              Ghana&apos;s leading real estate marketplace, connecting property seekers 
              with verified listings, professional agents, and reliable developers since 2013.
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-brand-accent mb-4">Our Mission</h2>
              <p className="text-brand-muted leading-relaxed mb-6">
                To revolutionize Ghana&apos;s real estate market by providing a transparent, 
                efficient, and trustworthy platform that connects property seekers with 
                their perfect homes and investment opportunities.
              </p>
              <p className="text-brand-muted leading-relaxed">
                We believe everyone deserves access to quality housing and reliable 
                real estate information, which is why we&apos;ve built Ghana&apos;s most 
                comprehensive property marketplace.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-brand-accent mb-4">Our Vision</h2>
              <p className="text-brand-muted leading-relaxed mb-6">
                To be Africa&apos;s premier real estate platform, setting the standard 
                for innovation, transparency, and customer service in the property market.
              </p>
              <p className="text-brand-muted leading-relaxed">
                We envision a future where finding, buying, renting, or selling 
                property is seamless, secure, and accessible to everyone across Ghana 
                and beyond.
              </p>
            </div>
          </div>

          {/* What We Do Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-brand-accent text-center mb-8">
              What We Do
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-semibold text-brand-accent mb-4">
                  Property Listings
                </h3>
                <p className="text-brand-muted">
                  Browse thousands of verified property listings across Ghana, 
                  from apartments and houses to commercial spaces and land.
                </p>
              </div>
              <div className="text-center p-6 bg-orange-50 rounded-lg">
                <h3 className="text-xl font-semibold text-brand-accent mb-4">
                  Agent Network
                </h3>
                <p className="text-brand-muted">
                  Connect with professional, verified real estate agents and 
                  brokers who understand the local market and your needs.
                </p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <h3 className="text-xl font-semibold text-brand-accent mb-4">
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
            <h2 className="text-3xl font-bold text-brand-accent text-center mb-8">
              Why Choose MeQasa
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">✓</span>
                </div>
                <h3 className="font-semibold text-brand-accent mb-2">Verified Listings</h3>
                <p className="text-sm text-brand-muted">
                  All properties are verified for authenticity and accuracy
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">🏆</span>
                </div>
                <h3 className="font-semibold text-brand-accent mb-2">Trusted Platform</h3>
                <p className="text-sm text-brand-muted">
                  Over a decade of serving Ghana&apos;s real estate market
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">📱</span>
                </div>
                <h3 className="font-semibold text-brand-accent mb-2">Easy to Use</h3>
                <p className="text-sm text-brand-muted">
                  User-friendly platform accessible on all devices
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">🤝</span>
                </div>
                <h3 className="font-semibold text-brand-accent mb-2">Expert Support</h3>
                <p className="text-sm text-brand-muted">
                  Professional agents and customer support team
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="text-center bg-gray-50 rounded-lg p-12">
            <h2 className="text-3xl font-bold text-brand-accent mb-4">
              Ready to Find Your Perfect Property?
            </h2>
            <p className="text-brand-muted mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have found their dream homes 
              through MeQasa. Start your property search today or get in touch with 
              our team for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/" 
                className="bg-brand-primary text-white px-8 py-3 rounded-lg hover:bg-brand-primary-dark transition-colors"
              >
                Browse Properties
              </Link>
              <Link 
                href="/agents" 
                className="border border-brand-primary text-brand-primary px-8 py-3 rounded-lg hover:bg-brand-primary hover:text-white transition-colors"
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
