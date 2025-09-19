import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import Shell from "@/layouts/shell";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms of Service - MeQasa Platform Terms & Conditions",
  description:
    "Read MeQasa's Terms of Service to understand your rights and responsibilities when using Ghana's leading property platform. Updated terms and conditions for users, property owners, and agents.",
  keywords: [
    "meqasa terms of service",
    "ghana property platform terms",
    "real estate terms conditions",
    "meqasa user agreement",
    "property listing terms",
    "legal terms ghana",
    "user rights responsibilities",
  ],
  authors: [{ name: "MeQasa" }],
  creator: "MeQasa",
  publisher: "MeQasa",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/terms",
    siteName: siteConfig.name,
    title: "Terms of Service - MeQasa Platform Terms & Conditions",
    description:
      "Read MeQasa's Terms of Service to understand your rights and responsibilities when using Ghana's leading property platform.",
    images: [
      {
        url: `${siteConfig.url}/og-terms.jpg`,
        width: 1200,
        height: 630,
        alt: "MeQasa Terms of Service",
      },
    ],
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

export default function TermsPage() {
  const segments = [
    { title: "Home", href: "/", key: "home" },
    { title: "Terms of Service", href: "/terms", key: "terms" },
  ];

  const lastUpdated = "December 1, 2024";

  return (
    <div className="min-h-screen bg-white">
      <Shell className="py-8 md:py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs segments={segments} className="mb-8" />

        {/* Header */}
        <section className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <FileText className="text-brand-primary h-16 w-16" />
          </div>
          <h1 className="text-brand-accent mb-4 text-4xl font-bold md:text-5xl">
            Terms of Service
          </h1>
          <p className="text-brand-muted mx-auto mb-6 max-w-3xl text-xl">
            These terms and conditions govern your use of the MeQasa platform
            and services. Please read them carefully before using our services.
          </p>
          <div className="text-brand-muted flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </section>

        {/* Quick Navigation */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="text-brand-primary h-5 w-5" />
              Quick Navigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <a
                href="#acceptance"
                className="text-brand-primary hover:underline"
              >
                1. Acceptance of Terms
              </a>
              <a
                href="#services"
                className="text-brand-primary hover:underline"
              >
                2. Description of Services
              </a>
              <a
                href="#accounts"
                className="text-brand-primary hover:underline"
              >
                3. User Accounts
              </a>
              <a href="#conduct" className="text-brand-primary hover:underline">
                4. User Conduct
              </a>
              <a
                href="#listings"
                className="text-brand-primary hover:underline"
              >
                5. Property Listings
              </a>
              <a
                href="#payments"
                className="text-brand-primary hover:underline"
              >
                6. Payments and Fees
              </a>
              <a href="#privacy" className="text-brand-primary hover:underline">
                7. Privacy Protection
              </a>
              <a
                href="#liability"
                className="text-brand-primary hover:underline"
              >
                8. Limitation of Liability
              </a>
              <a
                href="#termination"
                className="text-brand-primary hover:underline"
              >
                9. Termination
              </a>
              <a
                href="#governing"
                className="text-brand-primary hover:underline"
              >
                10. Governing Law
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="mb-8 border-amber-200 bg-amber-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-amber-600" />
              <div>
                <h3 className="mb-2 font-semibold text-amber-800">
                  Important Notice
                </h3>
                <p className="text-sm text-amber-700">
                  By accessing or using the MeQasa platform, you agree to be
                  bound by these Terms of Service. If you do not agree to these
                  terms, please do not use our services.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Content */}
        <div className="prose prose-lg max-w-none space-y-8">
          <section id="acceptance">
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              1. Acceptance of Terms
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              These Terms of Service ("Terms") constitute a legally binding
              agreement between you and MeQasa regarding your use of the MeQasa
              platform, website, mobile applications, and related services
              (collectively, the "Services").
            </p>
            <p className="text-brand-muted leading-relaxed">
              By creating an account, accessing, or using our Services, you
              acknowledge that you have read, understood, and agree to be bound
              by these Terms and our Privacy Policy.
            </p>
          </section>

          <section id="services">
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              2. Description of Services
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              MeQasa provides an online platform that connects property seekers
              with property owners, real estate agents, and developers in Ghana.
              Our Services include:
            </p>
            <ul className="text-brand-muted list-disc space-y-2 pl-6 leading-relaxed">
              <li>Property search and listing services</li>
              <li>Communication tools between users</li>
              <li>Property verification and validation</li>
              <li>Agent and developer networking</li>
              <li>Market insights and analytics</li>
              <li>Customer support and assistance</li>
            </ul>
          </section>

          <section id="accounts">
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              3. User Accounts and Registration
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              To access certain features of our Services, you must create an
              account. When creating an account, you agree to:
            </p>
            <ul className="text-brand-muted mb-4 list-disc space-y-2 pl-6 leading-relaxed">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>
                Notify us immediately of any unauthorized use of your account
              </li>
              <li>
                Accept responsibility for all activities under your account
              </li>
            </ul>
            <p className="text-brand-muted leading-relaxed">
              You must be at least 18 years old to create an account and use our
              Services.
            </p>
          </section>

          <section id="conduct">
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              4. User Conduct and Prohibited Activities
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              When using our Services, you agree not to:
            </p>
            <ul className="text-brand-muted mb-4 list-disc space-y-2 pl-6 leading-relaxed">
              <li>Post false, misleading, or fraudulent property listings</li>
              <li>
                Engage in any form of harassment, discrimination, or abuse
              </li>
              <li>Use the platform for illegal activities or purposes</li>
              <li>Attempt to circumvent our verification processes</li>
              <li>Collect user information without consent</li>
              <li>Interfere with the proper functioning of our Services</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section id="listings">
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              5. Property Listings and Content
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              When listing properties on our platform, you represent and warrant
              that:
            </p>
            <ul className="text-brand-muted mb-4 list-disc space-y-2 pl-6 leading-relaxed">
              <li>You have the legal right to list the property</li>
              <li>All information provided is accurate and up-to-date</li>
              <li>Photos and descriptions accurately represent the property</li>
              <li>
                You comply with all applicable housing and discrimination laws
              </li>
              <li>You will respond promptly to legitimate inquiries</li>
            </ul>
            <p className="text-brand-muted leading-relaxed">
              MeQasa reserves the right to remove or modify listings that
              violate these Terms or our community standards.
            </p>
          </section>

          <section id="payments">
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              6. Payments and Fees
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              MeQasa may charge fees for certain services, including but not
              limited to:
            </p>
            <ul className="text-brand-muted mb-4 list-disc space-y-2 pl-6 leading-relaxed">
              <li>Premium property listing features</li>
              <li>Featured placement and promotion</li>
              <li>Professional services and consultations</li>
              <li>Transaction facilitation services</li>
            </ul>
            <p className="text-brand-muted leading-relaxed">
              All fees are clearly disclosed before purchase. Payments are
              processed securely through our approved payment partners. Refund
              policies vary by service type.
            </p>
          </section>

          <section id="privacy">
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              7. Privacy and Data Protection
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              Your privacy is important to us. Our collection, use, and
              disclosure of personal information is governed by our Privacy
              Policy, which forms part of these Terms.
            </p>
            <p className="text-brand-muted leading-relaxed">
              By using our Services, you consent to the collection and use of
              your information as described in our Privacy Policy.
            </p>
          </section>

          <section id="liability">
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              8. Limitation of Liability
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              MeQasa acts as an intermediary platform and does not own, operate,
              or control any properties listed on our platform. We are not
              responsible for:
            </p>
            <ul className="text-brand-muted mb-4 list-disc space-y-2 pl-6 leading-relaxed">
              <li>
                The accuracy of property listings or user-generated content
              </li>
              <li>
                The condition, legality, or availability of listed properties
              </li>
              <li>Disputes between users regarding property transactions</li>
              <li>
                Any damages resulting from property viewings or transactions
              </li>
              <li>Third-party services or external website content</li>
            </ul>
            <p className="text-brand-muted leading-relaxed">
              Our total liability for any claims arising from your use of our
              Services shall not exceed the amount you have paid to MeQasa in
              the 12 months preceding the claim.
            </p>
          </section>

          <section id="termination">
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              9. Termination
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              You may terminate your account at any time by contacting our
              support team. MeQasa may suspend or terminate your account if you
              violate these Terms or engage in activities that harm our platform
              or other users.
            </p>
            <p className="text-brand-muted leading-relaxed">
              Upon termination, your right to use our Services will cease
              immediately, but these Terms will continue to apply to your past
              use of the Services.
            </p>
          </section>

          <section id="governing">
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              10. Governing Law and Disputes
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              These Terms are governed by the laws of Ghana. Any disputes
              arising from these Terms or your use of our Services will be
              resolved through binding arbitration in Accra, Ghana, except where
              prohibited by applicable law.
            </p>
            <p className="text-brand-muted leading-relaxed">
              Before initiating any legal proceedings, we encourage you to
              contact our support team to resolve disputes amicably.
            </p>
          </section>
        </div>

        {/* Contact Section */}
        <Card className="bg-brand-primary/5 border-brand-primary/20 mt-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              Questions About These Terms?
            </h2>
            <p className="text-brand-muted mx-auto mb-6 max-w-2xl">
              If you have any questions about these Terms of Service or need
              clarification on any provisions, please don't hesitate to contact
              our legal team.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/contact"
                className="bg-brand-primary hover:bg-brand-primary-dark rounded-lg px-6 py-3 font-semibold text-white transition-colors"
              >
                Contact Support
              </a>
              <a
                href="mailto:legal@meqasa.com"
                className="border-brand-primary text-brand-primary hover:bg-brand-primary rounded-lg border px-6 py-3 font-semibold transition-colors hover:text-white"
              >
                Email Legal Team
              </a>
            </div>
          </CardContent>
        </Card>
      </Shell>
    </div>
  );
}
