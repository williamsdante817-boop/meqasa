import FeaturedPropertiesAsideWrapper from "@/components/about/featured-properties-aside-wrapper";
import { StructuredData } from "@/components/structured-data";
import { siteConfig } from "@/config/site";
import Shell from "@/layouts/shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work With Us - Join the MeQasa Team | Ghana's Property Platform",
  description:
    "Explore career opportunities at MeQasa. Join our team and help shape the future of real estate in Ghana. Find open positions and learn about our company culture.",
  keywords: [
    "work with meqasa",
    "meqasa careers",
    "jobs at meqasa",
    "ghana real estate jobs",
    "meqasa hiring",
    "property platform careers",
    "real estate technology jobs",
    "meqasa team",
    "ghana tech jobs",
  ],
  authors: [{ name: "MeQasa" }],
  creator: "MeQasa",
  publisher: "MeQasa",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/work-with-us",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/work-with-us",
    siteName: siteConfig.name,
    title: "Work With Us - Join the MeQasa Team | Ghana's Property Platform",
    description:
      "Explore career opportunities at MeQasa. Join our team and help shape the future of real estate in Ghana.",
    images: [
      {
        url: `${siteConfig.url}/og-work-with-us.jpg`,
        width: 1200,
        height: 630,
        alt: "Work With Us - MeQasa Careers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@meqasa",
    creator: "@meqasa",
    title: "Work With Us - Join the MeQasa Team",
    description:
      "Explore career opportunities at MeQasa. Join our team and help shape the future of real estate in Ghana.",
    images: [`${siteConfig.url}/og-work-with-us.jpg`],
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

export default function WorkWithUsPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MeQasa",
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "23 Kofi Annan Ave",
      addressLocality: "North Legon, Accra",
      addressRegion: "Greater Accra Region",
      addressCountry: "Ghana",
    },
    sameAs: [
      "https://facebook.com/meqasa",
      "https://twitter.com/meqasa",
      "https://instagram.com/meqasa",
      "https://linkedin.com/company/meqasa",
    ],
    hiringOrganization: {
      "@type": "Organization",
      name: "MeQasa",
      sameAs: siteConfig.url,
    },
    jobPosting: {
      "@type": "JobPosting",
      title: "Various Positions",
      description:
        "We are not currently hiring, but check back for future opportunities.",
      employmentType: "FULL_TIME",
      hiringOrganization: {
        "@type": "Organization",
        name: "MeQasa",
      },
      jobLocation: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressCountry: "Ghana",
          addressLocality: "Accra",
        },
      },
      datePosted: new Date().toISOString(),
    },
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData data={structuredData} />

      <Shell className="py-8">
        {/* Two-column grid layout: Main content + Featured properties aside */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main content - Work with us information */}
          <main className="lg:col-span-1">
            {/* Work With Us Heading */}
            <div className="mb-8">
              <h1 className="text-brand-accent text-3xl font-bold md:text-4xl">
                Work With Us
              </h1>
            </div>

            {/* Introductory Text */}
            <div className="mb-8">
              <p className="text-brand-muted text-lg leading-relaxed">
                Do you want to join our team? Keep up with this page to find
                something that suits you!
              </p>
            </div>

            {/* Visual Separator */}
            <div className="border-brand-muted/20 mb-8 border-t"></div>

            {/* Current Status */}
            <div className="mb-8">
              <h2 className="text-brand-accent text-xl font-bold">
                We are not hiring at this time.
              </h2>
            </div>

            {/* Visual Separator */}
            <div className="border-brand-muted/20 mb-8 border-t"></div>

            {/* Future Opportunities Section */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 md:p-8">
              <h2 className="text-brand-accent mb-4 text-xl font-bold">
                Future Opportunities
              </h2>
              <p className="text-brand-muted mb-4 leading-relaxed">
                While we're not currently hiring, we're always looking for
                talented individuals to join our mission of transforming Ghana's
                real estate market.
              </p>
              <p className="text-brand-muted mb-6 leading-relaxed">
                Check back regularly for updates on open positions, or follow us
                on social media to stay informed about career opportunities at
                MeQasa.
              </p>

              {/* Contact for Future Opportunities */}
              <div className="space-y-4">
                <h3 className="text-brand-accent text-lg font-semibold">
                  Stay Connected
                </h3>
                <p className="text-brand-muted">
                  Interested in future opportunities? Send us your CV and we'll
                  keep you in mind for upcoming roles.
                </p>
                <a
                  href="mailto:careers@meqasa.com?subject=Future Opportunities - CV Submission"
                  className="text-brand-primary hover:text-brand-primary/80 focus-visible:ring-brand-primary inline-flex items-center rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  aria-label="Email us your CV for future opportunities"
                >
                  careers@meqasa.com
                </a>
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
