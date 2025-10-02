import { StructuredData } from "@/components/structured-data";
import { siteConfig } from "@/config/site";
import Shell from "@/layouts/shell";
import { ArrowLeft, Mail } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Advertise in the MeQasa Newsletter | Ghana Property Marketing",
  description:
    "Reach engaged property seekers through MeQasa's newsletter advertising. Connect with our subscriber base who actively follow the Ghana real estate market. Contact sales@meqasa.com.",
  keywords: [
    "meqasa newsletter advertising",
    "ghana property newsletter ads",
    "real estate newsletter marketing",
    "property platform newsletter",
    "meqasa email advertising",
    "newsletter marketing ghana",
    "property newsletter ads",
    "real estate email marketing",
    "ghana property newsletter",
    "meqasa subscriber advertising",
  ],
  authors: [{ name: "MeQasa" }],
  creator: "MeQasa",
  publisher: "MeQasa",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/advertise-in-the-meqasa-newsletter",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/advertise-in-the-meqasa-newsletter",
    siteName: siteConfig.name,
    title: "Advertise in the MeQasa Newsletter | Ghana Property Marketing",
    description:
      "Reach engaged property seekers through MeQasa's newsletter advertising. Connect with our subscriber base who actively follow the Ghana real estate market.",
    images: [
      {
        url: `${siteConfig.url}/og-newsletter-advertising.jpg`,
        width: 1200,
        height: 630,
        alt: "Advertise in the MeQasa Newsletter - Ghana Property Marketing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@meqasa",
    creator: "@meqasa",
    title: "Advertise in the MeQasa Newsletter | Ghana Property Marketing",
    description:
      "Reach engaged property seekers through MeQasa's newsletter advertising. Connect with our subscriber base who actively follow the Ghana real estate market.",
    images: [`${siteConfig.url}/og-newsletter-advertising.jpg`],
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

export default function NewsletterAdvertisingPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Advertise in the MeQasa Newsletter",
    description:
      "Reach engaged property seekers through MeQasa's newsletter advertising. Connect with our subscriber base who actively follow the Ghana real estate market.",
    url: `${siteConfig.url}/advertise-in-the-meqasa-newsletter`,
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

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData data={structuredData} />

      <Shell className="py-8">
        {/* Main content */}
        <main className="space-y-8">
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
              meQasa Newsletter Advertisement Options
            </h1>
            <p className="text-brand-muted text-lg leading-relaxed">
              Our popular Dream Homes newsletter reaches thousands of readers
              weekly and you can convert them into customers with our banner or
              feature options.
            </p>
          </div>

          {/* Main Content Grid - Newsletter Mockup + Advertising Options */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Left Column - Newsletter Mockup */}
            <div className="lg:col-span-1">
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <Image
                  src="/meqasa-newsletter-leaderboard.png"
                  alt="MeQasa Newsletter Layout Mockup"
                  width={660}
                  height={800}
                  className="h-auto w-full rounded-md"
                />
              </div>
            </div>

            {/* Right Column - Advertising Options */}
            <div className="space-y-8 lg:col-span-1">
              {/* Banners Section */}
              <section>
                <h2 className="text-brand-accent mb-3 text-xl font-semibold">
                  Banners
                </h2>
                <p className="text-brand-muted text-lg leading-relaxed">
                  Use either the top banner or bottom banner to tell our
                  subscribers about your business.
                </p>
              </section>

              {/* Feature Ad Section */}
              <section>
                <h2 className="text-brand-accent mb-3 text-xl font-semibold">
                  Feature Ad
                </h2>
                <p className="text-brand-muted text-lg leading-relaxed">
                  Amidst our engaging content, insert your ad so readers can
                  find out how to buy from you.
                </p>
              </section>

              {/* Dedicated Email Blast Section */}
              <section>
                <h2 className="text-brand-accent mb-3 text-xl font-semibold">
                  Dedicated Email Blast
                </h2>
                <p className="text-brand-muted text-lg leading-relaxed">
                  From the email subject line to full details provided within,
                  send a strong brand message to thousands of consumers seeking
                  your products and services. With nice photos, important
                  information, contact details and links to your website, this
                  is a fantastic way to boost your brand awareness and sales.
                </p>
              </section>
            </div>
          </div>

          {/* Call to Action */}
          <div className="border-brand-border border-t bg-gray-50">
            <div className="mx-auto max-w-2xl py-12 text-center">
              <h2 className="text-brand-accent mb-4 text-xl font-semibold">
                Ready to Reach Our Newsletter Audience?
              </h2>
              <p className="text-brand-muted mb-6 text-sm leading-relaxed">
                Contact our sales team to discuss newsletter advertising
                opportunities and get a customized proposal with placement
                options and pricing.
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
      </Shell>
    </>
  );
}
