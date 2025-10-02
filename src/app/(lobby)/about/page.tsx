import FeaturedPropertiesAsideWrapper from "@/components/about/featured-properties-aside-wrapper";
import { StructuredData } from "@/components/structured-data";
import { siteConfig } from "@/config/site";
import Shell from "@/layouts/shell";
import type { Metadata } from "next";

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

      <Shell className="py-8">
        {/* Two-column grid layout: Main content + Featured properties aside */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main content - About text */}
          <main className="space-y-8 lg:col-span-1">
            {/* 1. About Us Heading + Description */}
            <div>
              <h1 className="text-brand-accent mb-4 text-3xl font-bold">
                About Us
              </h1>
              <p className="text-brand-muted leading-relaxed">
                meQasa helps you find residential and commercial property to
                rent or buy in Ghana. Our website features thousands of options
                in the capital of Accra, Tema, and the other regions, whether
                you are looking to buy or rent a new home or office space.
                meQasa is your total solutions partner as you go through your
                property search, offering countless housing alternatives as well
                as offline support and expert advice on the real estate industry
                in Ghana.
              </p>
            </div>

            {/* 2. Mission Section */}
            <div>
              <h2 className="text-brand-accent mb-4 text-2xl font-bold">
                Our Mission
              </h2>
              <p className="text-brand-muted leading-relaxed">
                We collaborate with brokers, owners and tenants to create
                complete and dynamic property profiles. We advertise online all
                adequately profiled properties that are vacant. meQasa
                facilitates communication and meetings between prospective
                tenants and owners or their representatives.
              </p>
            </div>

            {/* 3. Vision Section */}
            <div>
              <h2 className="text-brand-accent mb-4 text-2xl font-bold">
                Our Vision
              </h2>
              <p className="text-brand-muted leading-relaxed">
                meQasa is working toward an efficient housing search experience
                in Africa primarily for prospective tenants. We aspire to be the
                source of reliable information on housing in Africa.
              </p>
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
