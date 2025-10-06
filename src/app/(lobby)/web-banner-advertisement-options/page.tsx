import FeaturedPropertiesAsideWrapper from "@/components/about/featured-properties-aside-wrapper";
import { StructuredData } from "@/components/structured-data";
import { siteConfig } from "@/config/site";
import Shell from "@/layouts/shell";
import { ArrowLeft, Mail, Monitor, Smartphone, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Web Banner Advertisement Options | MeQasa Advertising",
  description:
    "Discover MeQasa's web banner advertising options including leaderboard, desktop rectangles, and mobile formats. Reach your target market with prominent placements across all pages. Contact sales@meqasa.com.",
  keywords: [
    "meqasa banner advertising",
    "web banner ads ghana",
    "property platform advertising",
    "real estate banner ads",
    "meqasa leaderboard ads",
    "mobile banner advertising",
    "desktop rectangle ads",
    "property marketing banners",
    "ghana real estate advertising",
    "meqasa advertising formats",
  ],
  authors: [{ name: "MeQasa" }],
  creator: "MeQasa",
  publisher: "MeQasa",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/web-banner-advertisement-options",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/web-banner-advertisement-options",
    siteName: siteConfig.name,
    title: "Web Banner Advertisement Options | MeQasa Advertising",
    description:
      "Discover MeQasa's web banner advertising options including leaderboard, desktop rectangles, and mobile formats. Reach your target market with prominent placements.",
    images: [
      {
        url: `${siteConfig.url}/og-banner-advertising.jpg`,
        width: 1200,
        height: 630,
        alt: "Web Banner Advertisement Options - MeQasa Advertising",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@meqasa",
    creator: "@meqasa",
    title: "Web Banner Advertisement Options | MeQasa Advertising",
    description:
      "Discover MeQasa's web banner advertising options including leaderboard, desktop rectangles, and mobile formats. Reach your target market with prominent placements.",
    images: [`${siteConfig.url}/og-banner-advertising.jpg`],
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

export default function WebBannerAdvertisementPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Web Banner Advertisement Options with MeQasa",
    description:
      "Discover MeQasa's web banner advertising options including leaderboard, desktop rectangles, and mobile formats. Reach your target market with prominent placements.",
    url: `${siteConfig.url}/web-banner-advertisement-options`,
    mainEntity: {
      "@type": "Organization",
      name: "MeQasa",
      url: siteConfig.url,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+233-506-866-060",
        email: "sales@meqasa.com",
        contactType: "sales",
        areaServed: "GH",
        availableLanguage: ["en"],
      },
    },
  };

  const bannerFormats = [
    {
      title: "Leaderboard",
      description:
        "Reach your target market with the most prominent space available on all pages of MeQasa.com! Attract even more attention with rich media options.",
      icon: TrendingUp,
      features: [
        "Most prominent placement on all pages",
        "Animated banner options with moving text and images",
        "Expandable banner options that extend downward",
        "Maximum visibility for your brand",
        "Rich media support for enhanced engagement",
      ],
      dimensions: "728 x 90 pixels",
      placement: "Top of all pages",
    },
    {
      title: "Desktop Rectangles",
      description:
        "Place your ad on our homepage and property search results pages for a valuable opportunity to increase leads and sales to your business.",
      icon: Monitor,
      features: [
        "Homepage placement for maximum exposure",
        "Search results page placement",
        "Desktop-only targeting",
        "High-intent audience reach",
        "Professional placement context",
      ],
      dimensions: "300 x 250 pixels",
      placement: "Homepage and search results",
    },
    {
      title: "Mobile Rectangles",
      description:
        "The majority of users access MeQasa.com via their mobile devices. Take advantage of these mobile-optimized ad formats for on-the-go discovery.",
      icon: Smartphone,
      features: [
        "Mobile-optimized format",
        "Touch-friendly design",
        "Responsive placement",
        "High mobile traffic volume",
        "On-the-go audience targeting",
      ],
      dimensions: "320 x 50 pixels",
      placement: "Mobile pages",
    },
  ];

  // const benefits = [
  //   {
  //     title: "Maximum Visibility",
  //     description: "Reach thousands of property seekers across Ghana",
  //     icon: Target,
  //   },
  //   {
  //     title: "Targeted Audience",
  //     description: "Connect with people actively looking for properties",
  //     icon: BarChart3,
  //   },
  //   {
  //     title: "Professional Context",
  //     description: "Your ads appear alongside trusted real estate content",
  //     icon: TrendingUp,
  //   },
  // ];

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData data={structuredData} />

      <Shell className="py-8">
        {/* Two-column grid layout: Main content + Featured properties aside */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main content */}
          <main className="space-y-8 lg:col-span-1">
            {/* Back Navigation */}
            <div className="mb-6">
              <Link
                href="/advertising-options-with-meqasa"
                className="text-brand-accent hover:text-brand-accent/80 inline-flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Advertising Options</span>
              </Link>
            </div>

            {/* Header Section */}
            <div>
              <h1 className="text-brand-accent mb-4 text-3xl font-bold">
                MeQasa Web Banner Advertisement Options
              </h1>
              <p className="text-brand-muted text-lg leading-relaxed">
                Reach your target market with prominent banner placements across
                all pages of MeQasa.com. Choose from multiple formats designed
                for maximum visibility and engagement.
              </p>
            </div>

            {/* Banner Formats Grid */}
            <div className="space-y-8">
              {bannerFormats.map((format, index) => {
                const IconComponent = format.icon;
                return (
                  <div
                    key={index}
                    className="border-brand-muted/20 hover:border-brand-accent/30 group rounded-lg border bg-white p-8 transition-all"
                  >
                    <div className="flex items-start gap-6">
                      <div className="bg-brand-primary/10 text-brand-primary flex h-10 w-10 items-center justify-center rounded-lg">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-4 flex items-center justify-between">
                          <h2 className="text-brand-accent text-xl font-semibold">
                            {format.title}
                          </h2>
                          <div className="text-brand-muted text-right text-sm">
                            <div className="font-semibold">
                              {format.dimensions}
                            </div>
                            <div>{format.placement}</div>
                          </div>
                        </div>
                        <p className="text-brand-muted mb-6 text-lg leading-relaxed">
                          {format.description}
                        </p>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h3 className="text-brand-accent mb-3 text-lg font-semibold">
                              Key Features
                            </h3>
                            <ul className="text-brand-muted space-y-2">
                              {format.features.map((feature, featureIndex) => (
                                <li
                                  key={featureIndex}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <div className="bg-brand-accent/20 h-1.5 w-1.5 rounded-full" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="bg-brand-muted/5 rounded-lg p-4">
                            <h4 className="text-brand-accent mb-3 font-semibold">
                              Specifications
                            </h4>
                            <div className="text-brand-muted mb-4 space-y-2 text-sm">
                              <div>
                                <strong>Dimensions:</strong> {format.dimensions}
                              </div>
                              <div>
                                <strong>Placement:</strong> {format.placement}
                              </div>
                            </div>
                            {/* Banner Format Image */}
                            <div className="mt-4">
                              {format.title === "Leaderboard" && (
                                <Image
                                  src="/desktop-leaderboard.png"
                                  alt="Leaderboard banner advertisement example"
                                  width={728}
                                  height={90}
                                  className="h-auto w-full rounded-md border border-gray-200 shadow-sm"
                                />
                              )}
                              {format.title === "Desktop Rectangles" && (
                                <Image
                                  src="/leaderboard-ad.png"
                                  alt="Desktop rectangle banner advertisement example"
                                  width={300}
                                  height={250}
                                  className="h-auto w-full rounded-md border border-gray-200 shadow-sm"
                                />
                              )}
                              {format.title === "Mobile Rectangles" && (
                                <Image
                                  src="/mobile-ad.png"
                                  alt="Mobile rectangle banner advertisement example"
                                  width={320}
                                  height={50}
                                  className="h-auto w-full rounded-md border border-gray-200 shadow-sm"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Call to Action */}
            <div className="border-brand-border border-t bg-gray-50">
              <div className="mx-auto max-w-2xl py-12 text-center">
                <h2 className="text-brand-accent mb-4 text-xl font-bold">
                  Ready to Start Your Banner Campaign?
                </h2>
                <p className="text-brand-muted mb-6 text-sm leading-relaxed">
                  Contact our sales team to discuss your banner advertising
                  needs and get a customized proposal with pricing and placement
                  options.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <a
                    href="mailto:sales@meqasa.com"
                    className="bg-brand-primary hover:bg-brand-primary-dark inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span>Email sales@meqasa.com</span>
                  </a>
                  <a
                    href="tel:+233506866060"
                    className="text-brand-accent border-brand-primary hover:bg-brand-primary/5 inline-flex items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold transition-colors"
                  >
                    <span>Call +233 506 866 060</span>
                  </a>
                </div>
              </div>
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
