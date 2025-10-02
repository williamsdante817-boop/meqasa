import RealEstateReportModal from "@/components/real-estate-report/real-estate-report-modal";
import { StructuredData } from "@/components/structured-data";
import { siteConfig } from "@/config/site";
import Shell from "@/layouts/shell";
import type { Metadata } from "next";
import Image from "next/image";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "Meqasa Real Estate Report 2020 | Ghana Real Estate Market Analysis",
  description:
    "Access the comprehensive Meqasa Real Estate Report 2020 featuring detailed insights into Ghana's real estate market during COVID-19, emerging markets, and government interventions.",
  keywords: [
    "Meqasa real estate report",
    "Ghana real estate market 2020",
    "real estate trends Ghana",
    "COVID-19 real estate impact",
    "Ghana property market analysis",
    "real estate report download",
    "Meqasa market insights",
    "Ghana housing market trends",
    "real estate data Ghana",
    "property market report",
  ],
  authors: [{ name: "MeQasa" }],
  creator: "MeQasa",
  publisher: "MeQasa",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/real-estate-report",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/real-estate-report",
    siteName: siteConfig.name,
    title: "Meqasa Real Estate Report 2020 | Ghana Real Estate Market Analysis",
    description:
      "Access the comprehensive Meqasa Real Estate Report 2020 featuring detailed insights into Ghana's real estate market during COVID-19.",
    images: [
      {
        url: `${siteConfig.url}/real-estate-report.jpg`,
        width: 1200,
        height: 630,
        alt: "Meqasa Real Estate Report 2020 - Ghana Real Estate Market Analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@meqasa",
    creator: "@meqasa",
    title: "Meqasa Real Estate Report 2020 | Ghana Real Estate Market Analysis",
    description:
      "Access the comprehensive Meqasa Real Estate Report 2020 featuring detailed insights into Ghana's real estate market during COVID-19.",
    images: [`${siteConfig.url}/real-estate-report.jpg`],
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

export default function RealEstateReport() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Report",
    name: "Meqasa Real Estate Report 2020",
    description:
      "Comprehensive analysis of Ghana's real estate market during the COVID-19 pandemic, featuring trends, challenges, and government interventions.",
    url: `${siteConfig.url}/real-estate-report`,
    publisher: {
      "@type": "Organization",
      name: "MeQasa",
      url: siteConfig.url,
      logo: `${siteConfig.url}/logo.png`,
    },
    datePublished: "2020-12-31",
    dateModified: "2020-12-31",
    author: {
      "@type": "Organization",
      name: "MeQasa Research Team",
    },
    about: [
      "Ghana Real Estate Market",
      "COVID-19 Impact on Real Estate",
      "Property Market Trends",
      "Government Interventions",
      "Emerging Real Estate Markets",
    ],
    inLanguage: "en-US",
    isAccessibleForFree: true,
    genre: "Real Estate Analysis",
    keywords: [
      "Ghana real estate",
      "property market analysis",
      "COVID-19 real estate impact",
      "real estate trends",
      "market research",
    ],
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData data={structuredData} />

      <Shell className="py-8">
        {/* Two-column grid layout: Main content + Report cover and actions */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
          {/* Main content - Report description */}
          <main className="space-y-6 lg:col-span-1">
            {/* Report Title */}
            <div>
              <h1 className="text-brand-accent mb-4 text-3xl font-bold">
                Meqasa Real Estate Report 2020
              </h1>
              <p className="text-brand-muted text-lg leading-relaxed">
                The Real Estate Market in Ghana has been through an interesting
                phase in the year 2020. The global pandemic that struck during
                the first quarter of 2020 forced Ghana to lock down its borders
                to human traffic in March and only opened up its airport to
                human traffic on
                <span className="text-brand-blue font-medium">
                  {" "}
                  1st September 2020
                </span>
                .
              </p>
            </div>

            {/* Report Description */}
            <div>
              <p className="text-brand-muted leading-relaxed">
                This document is intended to serve as a public library for data
                concerning the real estate economy, its challenges during this
                pandemic, the upsides, and the way forward. The report also
                features articles about acquiring land in Ghana, emerging real
                estate markets and government interventions in the face of
                COVID-19.
              </p>
            </div>

            {/* Report Features */}
            <div className="space-y-4">
              <h2 className="text-brand-accent text-xl font-semibold">
                What&apos;s Included in This Report:
              </h2>
              <ul className="text-brand-muted space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-brand-primary font-bold">•</span>
                  <span>
                    Comprehensive analysis of Ghana&apos;s real estate market
                    during COVID-19
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-primary font-bold">•</span>
                  <span>
                    Detailed insights into market challenges and opportunities
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-primary font-bold">•</span>
                  <span>Government interventions and policy impacts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-primary font-bold">•</span>
                  <span>Emerging real estate markets across Ghana</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-primary font-bold">•</span>
                  <span>Expert analysis on land acquisition in Ghana</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-brand-primary font-bold">•</span>
                  <span>Future outlook and market predictions</span>
                </li>
              </ul>
            </div>
          </main>

          {/* Aside - Report Cover and Actions */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              {/* Report Cover Image */}
              <div className="relative mb-6">
                <Image
                  src="/real-estate-report.jpg"
                  alt="Meqasa Real Estate Report 2020 Cover"
                  width={400}
                  height={520}
                  className="shadow-elegant h-auto w-full rounded-lg"
                  priority
                />
                {/* Overlay Text */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute right-4 bottom-4 left-4 text-white">
                  <h3 className="mb-1 text-xl font-bold">
                    MEQASA REAL ESTATE REPORT 2020
                  </h3>
                  <p className="text-sm opacity-90">
                    TRENDS AND PREDICTIONS IN THE MIDST OF COVID-19
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <RealEstateReportModal
                  triggerText="View Online"
                  triggerVariant="brand-primary"
                  modalType="view"
                />

                <div className="text-center">
                  <span className="text-brand-muted text-sm">OR</span>
                </div>

                <RealEstateReportModal
                  triggerText="Download (12MB)"
                  triggerVariant="brand-primary"
                  modalType="download"
                />
              </div>
            </div>
          </aside>
        </div>
      </Shell>
    </>
  );
}
