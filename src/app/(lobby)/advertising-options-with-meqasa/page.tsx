import FeaturedPropertiesAsideWrapper from "@/components/about/featured-properties-aside-wrapper";
import { StructuredData } from "@/components/structured-data";
import { siteConfig } from "@/config/site";
import Shell from "@/layouts/shell";
import { ArrowRight, BarChart3, Newspaper, Target } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Advertising Options with MeQasa | Ghana's Leading Property Platform",
  description:
    "Discover powerful advertising opportunities with MeQasa. Reach thousands of property seekers through web banners, newsletter advertising, and agent partnerships. Contact us at +233 506 866 060.",
  keywords: [
    "advertise with meqasa",
    "ghana property advertising",
    "real estate marketing",
    "property platform advertising",
    "meqasa banner ads",
    "newsletter advertising",
    "property marketing ghana",
    "real estate advertising",
    "meqasa advertising options",
    "property platform marketing",
  ],
  authors: [{ name: "MeQasa" }],
  creator: "MeQasa",
  publisher: "MeQasa",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/advertising-options-with-meqasa",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/advertising-options-with-meqasa",
    siteName: siteConfig.name,
    title:
      "Advertising Options with MeQasa | Ghana's Leading Property Platform",
    description:
      "Discover powerful advertising opportunities with MeQasa. Reach thousands of property seekers through web banners, newsletter advertising, and agent partnerships.",
    images: [
      {
        url: `${siteConfig.url}/og-advertising.jpg`,
        width: 1200,
        height: 630,
        alt: "Advertising Options with MeQasa - Ghana's Property Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@meqasa",
    creator: "@meqasa",
    title: "Advertising Options with MeQasa | Ghana's Property Platform",
    description:
      "Discover powerful advertising opportunities with MeQasa. Reach thousands of property seekers through web banners, newsletter advertising, and agent partnerships.",
    images: [`${siteConfig.url}/og-advertising.jpg`],
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

export default function AdvertisingOptionsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Advertising Options with MeQasa",
    description:
      "Discover powerful advertising opportunities with MeQasa. Reach thousands of property seekers through web banners, newsletter advertising, and agent partnerships.",
    url: `${siteConfig.url}/advertising-options-with-meqasa`,
    mainEntity: {
      "@type": "Organization",
      name: "MeQasa",
      url: siteConfig.url,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+233-506-866-060",
        email: "info@meqasa.com",
        contactType: "sales",
        areaServed: "GH",
        availableLanguage: ["en"],
      },
    },
  };

  const advertisingOptions = [
    {
      title: "meQasa Web Banner Advertisement Options",
      description:
        "Reach your target market with prominent banner placements across all pages of MeQasa.com",
      icon: BarChart3,
      href: "/web-banner-advertisement-options",
    },
    {
      title: "Advertise in the meQasa Newsletter",
      description:
        "Connect with our engaged subscriber base through newsletter advertising",
      icon: Newspaper,
      href: "/advertise-in-the-meqasa-newsletter",
    },
    {
      title: "Advertising Opportunities for meQasa Agents",
      description:
        "Special advertising packages designed for real estate agents and agencies",
      icon: Target,
      href: "/contact",
    },
  ];

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData data={structuredData} />

      <Shell className="py-8">
        {/* Two-column grid layout: Main content + Featured properties aside */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main content */}
          <main className="space-y-8 lg:col-span-1">
            {/* Header Section */}
            <div className="text-center">
              <h1 className="text-brand-accent mb-4 text-3xl font-bold">
                Advertising Options with meQasa
              </h1>
              <p className="text-brand-muted mx-auto max-w-2xl text-lg leading-relaxed">
                Discover powerful advertising opportunities to reach thousands
                of property seekers across Ghana
              </p>
            </div>

            {/* Advertising Options Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {advertisingOptions.map((option, index) => {
                const IconComponent = option.icon;
                return (
                  <Link key={index} href={option.href} className="group block">
                    <div className="border-brand-muted/10 hover:border-brand-accent/20 h-full rounded-lg border bg-white p-4 transition-all">
                      <div className="mb-3 flex items-center justify-center">
                        <div className="bg-brand-primary/10 text-brand-primary flex h-10 w-10 items-center justify-center rounded-lg">
                          <IconComponent className="h-5 w-5" />
                        </div>
                      </div>
                      <h2 className="text-brand-accent mb-2 text-center text-base font-semibold">
                        {option.title}
                      </h2>
                      <p className="text-brand-muted text-center text-sm leading-relaxed">
                        {option.description}
                      </p>
                      <div className="mt-3 flex items-center justify-center">
                        <div className="text-brand-primary group-hover:text-brand-primary/80 flex items-center gap-1 text-xs font-medium transition-colors">
                          Learn More
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </main>

          {/* Aside - Featured Properties (Streamed) - Hidden on mobile */}
          <aside className="hidden lg:sticky lg:top-20 lg:block lg:self-start">
            <FeaturedPropertiesAsideWrapper />
          </aside>
        </div>
      </Shell>
    </>
  );
}
