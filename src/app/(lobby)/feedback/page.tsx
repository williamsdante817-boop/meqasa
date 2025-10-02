import FeaturedPropertiesAsideWrapper from "@/components/about/featured-properties-aside-wrapper";
import { StructuredData } from "@/components/structured-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/config/site";
import Shell from "@/layouts/shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Feedback - Share Your Thoughts with MeQasa | Ghana's Property Platform",
  description:
    "Share your feedback with MeQasa. Whether you want to compliment our service, report an issue, or share an idea, we appreciate your input to help us improve.",
  keywords: [
    "meqasa feedback",
    "property platform feedback",
    "ghana real estate feedback",
    "meqasa suggestions",
    "property search feedback",
    "real estate platform feedback",
    "meqasa support",
    "user feedback",
  ],
  authors: [{ name: "MeQasa" }],
  creator: "MeQasa",
  publisher: "MeQasa",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/feedback",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/feedback",
    siteName: siteConfig.name,
    title:
      "Feedback - Share Your Thoughts with MeQasa | Ghana's Property Platform",
    description:
      "Share your feedback with MeQasa. Whether you want to compliment our service, report an issue, or share an idea, we appreciate your input.",
    images: [
      {
        url: `${siteConfig.url}/og-feedback.jpg`,
        width: 1200,
        height: 630,
        alt: "Feedback - MeQasa Property Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@meqasa",
    creator: "@meqasa",
    title: "Feedback - Share Your Thoughts with MeQasa",
    description:
      "Share your feedback with MeQasa. Whether you want to compliment our service, report an issue, or share an idea, we appreciate your input.",
    images: [`${siteConfig.url}/og-feedback.jpg`],
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

export default function FeedbackPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Feedback - MeQasa",
    description:
      "Share your feedback with MeQasa to help us improve our property platform.",
    url: `${siteConfig.url}/feedback`,
    mainEntity: {
      "@type": "Organization",
      name: "MeQasa",
      url: siteConfig.url,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+233-506-866-060",
        email: "feedback@meqasa.com",
        contactType: "customer feedback",
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
        {/* Two-column grid layout: Main content + Featured properties aside */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main content - Feedback form */}
          <main className="lg:col-span-1">
            {/* Feedback Heading */}
            <div className="mb-8">
              <h1 className="text-brand-accent text-3xl font-bold md:text-4xl">
                Feedback
              </h1>
            </div>

            {/* Introductory Text */}
            <div className="mb-8">
              <p className="text-brand-muted text-lg leading-relaxed">
                We love to hear from you! Whether you want to drop a line to
                compliment what we do, have an issue during your search process
                or have an idea to share, we appreciate your feedback.
              </p>
            </div>

            {/* Feedback Form Section */}
            <section
              className="rounded-lg border border-gray-200 bg-gray-50 p-6 md:p-8"
              aria-label="Feedback Form"
            >
              <form className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-brand-accent font-medium"
                  >
                    Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Name"
                    required
                    className="focus-visible:ring-brand-primary"
                    aria-required="true"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-brand-accent font-medium"
                  >
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="focus-visible:ring-brand-primary"
                    aria-required="true"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="message"
                    className="text-brand-accent font-medium"
                  >
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Type in your message"
                    rows={5}
                    required
                    className="focus-visible:ring-brand-primary resize-none"
                    aria-required="true"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-brand-accent hover:bg-brand-accent/90 focus-visible:ring-brand-accent w-full transition-all focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  Send
                </Button>
              </form>
            </section>
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
