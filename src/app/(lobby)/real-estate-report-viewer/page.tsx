import { StructuredData } from "@/components/structured-data";
import { siteConfig } from "@/config/site";
import Shell from "@/layouts/shell";
import type { Metadata } from "next";
import Link from "next/link";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "Real Estate Report Viewer | Meqasa Real Estate Report 2020",
  description:
    "Interactive viewer for the Meqasa Real Estate Report 2020. Browse through comprehensive market analysis, trends, and insights about Ghana's real estate market during COVID-19.",
  keywords: [
    "real estate report viewer",
    "Meqasa report 2020",
    "interactive report viewer",
    "Ghana real estate analysis",
    "flipbook report",
    "real estate market trends",
    "COVID-19 real estate impact",
    "property market insights",
  ],
  authors: [{ name: "MeQasa" }],
  creator: "MeQasa",
  publisher: "MeQasa",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/real-estate-report-viewer",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/real-estate-report-viewer",
    siteName: siteConfig.name,
    title: "Real Estate Report Viewer | Meqasa Real Estate Report 2020",
    description:
      "Interactive viewer for the Meqasa Real Estate Report 2020. Browse through comprehensive market analysis and insights.",
    images: [
      {
        url: `${siteConfig.url}/real-estate-report.jpg`,
        width: 1200,
        height: 630,
        alt: "Meqasa Real Estate Report 2020 - Interactive Viewer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@meqasa",
    creator: "@meqasa",
    title: "Real Estate Report Viewer | Meqasa Real Estate Report 2020",
    description:
      "Interactive viewer for the Meqasa Real Estate Report 2020. Browse through comprehensive market analysis and insights.",
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

export default function RealEstateReportViewer() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Real Estate Report Viewer",
    description:
      "Interactive viewer for the Meqasa Real Estate Report 2020 featuring comprehensive analysis of Ghana's real estate market.",
    url: `${siteConfig.url}/real-estate-report-viewer`,
    mainEntity: {
      "@type": "Report",
      name: "Meqasa Real Estate Report 2020",
      description:
        "Comprehensive analysis of Ghana's real estate market during the COVID-19 pandemic.",
      url: `${siteConfig.url}/real-estate-report`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Real Estate Report",
          item: `${siteConfig.url}/real-estate-report`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Report Viewer",
          item: `${siteConfig.url}/real-estate-report-viewer`,
        },
      ],
    },
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData data={structuredData} />

      <Shell className="py-8">
        {/* Breadcrumb Navigation */}
        <nav className="text-brand-muted mb-6 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <Link
                href="/"
                className="hover:text-brand-primary transition-colors"
              >
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <a
                href="https://blog.meqasa.com/real-estate-report-viewer/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-brand-primary transition-colors"
              >
                Real Estate Report Viewer
              </a>
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-brand-accent mb-4 text-3xl font-bold">
            Real Estate Report Viewer
          </h1>
          <p className="text-brand-muted text-lg">
            The interactive Real Estate Report viewer is now available on our
            blog platform. Click the button below to access the full flipbook
            experience.
          </p>
        </div>

        {/* Redirect to Blog Viewer */}
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mb-6">
            <div className="mb-4 text-6xl">📊</div>
            <h2 className="text-brand-accent mb-2 text-xl font-semibold">
              Access Interactive Report Viewer
            </h2>
            <p className="text-brand-muted">
              Experience the full interactive flipbook with page navigation,
              zoom controls, and comprehensive market analysis.
            </p>
          </div>

          <a
            href="https://blog.meqasa.com/real-estate-report-viewer/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-primary hover:bg-brand-primary-dark inline-flex items-center gap-2 rounded-md px-8 py-3 font-medium text-white transition-colors"
          >
            Open Report Viewer
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        {/* Share Section */}
        <div className="bg-brand-gray mt-8 rounded-lg p-6">
          <h3 className="text-brand-accent mb-4 text-lg font-semibold">
            Share with a friend
          </h3>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value="https://blog.meqasa.com/real-estate-report-viewer/"
              readOnly
              className="focus:border-brand-primary focus:ring-brand-primary/50 flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm focus:ring-2 focus:outline-none"
            />
            <button
              onClick={() => {
                void navigator.clipboard.writeText(
                  "https://blog.meqasa.com/real-estate-report-viewer/"
                );
                // You could add a toast notification here
              }}
              className="bg-brand-primary hover:bg-brand-primary-dark rounded-md px-6 py-2 font-medium text-white transition-colors"
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* Technical Note */}
        <div className="mt-6 rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This viewer requires JavaScript to be
            enabled. If you&apos;re experiencing issues loading the report,
            please try downloading the PDF version instead.
          </p>
        </div>
      </Shell>
    </>
  );
}
