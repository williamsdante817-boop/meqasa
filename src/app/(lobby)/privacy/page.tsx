import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import Shell from "@/layouts/shell";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { Shield, Lock, Eye, Database, UserCheck, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const metadata: Metadata = {
  title: "Privacy Policy - How MeQasa Protects Your Personal Data",
  description:
    "Learn how MeQasa collects, uses, and protects your personal information. Our comprehensive privacy policy explains your data rights and our commitment to privacy protection in Ghana.",
  keywords: [
    "meqasa privacy policy",
    "data protection ghana",
    "personal information security",
    "privacy rights",
    "data collection policy",
    "user privacy protection",
    "ghana data protection",
  ],
  authors: [{ name: "MeQasa" }],
  creator: "MeQasa",
  publisher: "MeQasa",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/privacy",
    siteName: siteConfig.name,
    title: "Privacy Policy - How MeQasa Protects Your Personal Data",
    description:
      "Learn how MeQasa collects, uses, and protects your personal information. Our comprehensive privacy policy explains your data rights and commitment to privacy.",
    images: [
      {
        url: `${siteConfig.url}/og-privacy.jpg`,
        width: 1200,
        height: 630,
        alt: "MeQasa Privacy Policy",
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

export default function PrivacyPage() {
  const segments = [
    { title: "Home", href: "/", key: "home" },
    { title: "Privacy Policy", href: "/privacy", key: "privacy" },
  ];

  const lastUpdated = "December 1, 2024";

  const privacyPrinciples = [
    {
      icon: <Shield className="text-brand-primary h-8 w-8" />,
      title: "Data Protection",
      description:
        "We implement robust security measures to protect your personal information from unauthorized access, disclosure, or misuse.",
    },
    {
      icon: <Lock className="text-brand-primary h-8 w-8" />,
      title: "Secure Storage",
      description:
        "Your data is stored on secure servers with encryption and regular security audits to ensure maximum protection.",
    },
    {
      icon: <Eye className="text-brand-primary h-8 w-8" />,
      title: "Transparency",
      description:
        "We clearly explain what data we collect, how we use it, and provide you with control over your information.",
    },
    {
      icon: <UserCheck className="text-brand-primary h-8 w-8" />,
      title: "User Control",
      description:
        "You have the right to access, modify, or delete your personal information at any time through your account settings.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Shell className="py-8 md:py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs segments={segments} className="mb-8" />

        {/* Header */}
        <section className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <Shield className="text-brand-primary h-16 w-16" />
          </div>
          <h1 className="text-brand-accent mb-4 text-4xl font-bold md:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-brand-muted mx-auto mb-6 max-w-3xl text-xl">
            Your privacy is important to us. This policy explains how we
            collect, use, and protect your personal information when you use
            MeQasa&apos;s services.
          </p>
          <div className="text-brand-muted flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </section>

        {/* Privacy Principles */}
        <section className="mb-16">
          <h2 className="text-brand-accent mb-8 text-center text-3xl font-bold">
            Our Privacy Principles
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {privacyPrinciples.map((principle, index) => (
              <Card
                key={index}
                className="hover:border-brand-primary/30 border-gray-200 text-center transition-colors"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    {principle.icon}
                  </div>
                  <h3 className="text-brand-accent mb-3 text-lg font-semibold">
                    {principle.title}
                  </h3>
                  <p className="text-brand-muted text-sm leading-relaxed">
                    {principle.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Summary */}
        <Alert className="mb-8 border-blue-200 bg-blue-50">
          <Database className="h-4 w-4" />
          <AlertDescription>
            <strong>Quick Summary:</strong> We collect information you provide
            when creating an account, listing properties, and using our
            services. We use this information to provide our services, improve
            user experience, and communicate with you. We never sell your
            personal data to third parties.
          </AlertDescription>
        </Alert>

        {/* Privacy Policy Content */}
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              1. Information We Collect
            </h2>

            <h3 className="text-brand-accent mb-3 text-xl font-semibold">
              Personal Information
            </h3>
            <p className="text-brand-muted mb-4 leading-relaxed">
              We collect information you provide directly to us, including:
            </p>
            <ul className="text-brand-muted mb-6 list-disc space-y-2 pl-6 leading-relaxed">
              <li>Name, email address, and phone number</li>
              <li>Profile information and preferences</li>
              <li>Property listings and related information</li>
              <li>Messages and communications with other users</li>
              <li>Payment information for premium services</li>
              <li>Identity verification documents when required</li>
            </ul>

            <h3 className="text-brand-accent mb-3 text-xl font-semibold">
              Automatically Collected Information
            </h3>
            <p className="text-brand-muted mb-4 leading-relaxed">
              When you use our services, we automatically collect:
            </p>
            <ul className="text-brand-muted mb-6 list-disc space-y-2 pl-6 leading-relaxed">
              <li>
                Device information (IP address, browser type, operating system)
              </li>
              <li>Usage data (pages visited, time spent, features used)</li>
              <li>Location information (with your permission)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              2. How We Use Your Information
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="text-brand-muted mb-6 list-disc space-y-2 pl-6 leading-relaxed">
              <li>Provide, maintain, and improve our services</li>
              <li>Create and manage your account</li>
              <li>Process property listings and facilitate connections</li>
              <li>Verify the authenticity of listings and users</li>
              <li>Send important updates and notifications</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              3. Information Sharing and Disclosure
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              We may share your information in the following circumstances:
            </p>

            <h3 className="text-brand-accent mb-3 text-xl font-semibold">
              With Other Users
            </h3>
            <p className="text-brand-muted mb-4 leading-relaxed">
              When you list a property or inquire about a listing, relevant
              information may be shared with other users to facilitate the
              connection. This includes your name, contact information, and any
              messages you send.
            </p>

            <h3 className="text-brand-accent mb-3 text-xl font-semibold">
              With Service Providers
            </h3>
            <p className="text-brand-muted mb-4 leading-relaxed">
              We work with trusted third-party service providers who help us
              operate our platform, including payment processors, email
              services, and analytics providers. These partners are bound by
              confidentiality agreements and may only use your information to
              provide services to us.
            </p>

            <h3 className="text-brand-accent mb-3 text-xl font-semibold">
              Legal Requirements
            </h3>
            <p className="text-brand-muted mb-4 leading-relaxed">
              We may disclose your information if required by law, legal
              process, or government request, or if we believe disclosure is
              necessary to protect our rights, your safety, or the safety of
              others.
            </p>
          </section>

          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              4. Data Security and Protection
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              We implement comprehensive security measures to protect your
              personal information:
            </p>
            <ul className="text-brand-muted mb-6 list-disc space-y-2 pl-6 leading-relaxed">
              <li>SSL encryption for data transmission</li>
              <li>Secure servers with regular security updates</li>
              <li>Access controls and authentication systems</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Employee training on data protection practices</li>
              <li>Incident response procedures for data breaches</li>
            </ul>
            <p className="text-brand-muted mb-4 leading-relaxed">
              While we strive to protect your information, no internet
              transmission is completely secure. We encourage you to use strong
              passwords and keep your account information confidential.
            </p>
          </section>

          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              5. Your Rights and Choices
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              You have several rights regarding your personal information:
            </p>

            <h3 className="text-brand-accent mb-3 text-xl font-semibold">
              Access and Correction
            </h3>
            <p className="text-brand-muted mb-4 leading-relaxed">
              You can access and update your personal information through your
              account settings or by contacting our support team.
            </p>

            <h3 className="text-brand-accent mb-3 text-xl font-semibold">
              Data Portability
            </h3>
            <p className="text-brand-muted mb-4 leading-relaxed">
              You can request a copy of your personal data in a structured,
              machine-readable format.
            </p>

            <h3 className="text-brand-accent mb-3 text-xl font-semibold">
              Deletion
            </h3>
            <p className="text-brand-muted mb-4 leading-relaxed">
              You can request deletion of your account and personal information,
              subject to legal and operational requirements.
            </p>

            <h3 className="text-brand-accent mb-3 text-xl font-semibold">
              Marketing Communications
            </h3>
            <p className="text-brand-muted mb-4 leading-relaxed">
              You can opt out of marketing communications at any time by using
              the unsubscribe link in emails or updating your preferences in
              your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              6. Cookies and Tracking Technologies
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              We use cookies and similar technologies to:
            </p>
            <ul className="text-brand-muted mb-6 list-disc space-y-2 pl-6 leading-relaxed">
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and user behavior</li>
              <li>Provide personalized content and recommendations</li>
              <li>Improve our services and user experience</li>
            </ul>
            <p className="text-brand-muted leading-relaxed">
              You can control cookie settings through your browser preferences.
              However, disabling cookies may affect the functionality of our
              services.
            </p>
          </section>

          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              7. Data Retention
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              We retain your personal information for as long as necessary to
              provide our services, comply with legal obligations, resolve
              disputes, and enforce our agreements. Specific retention periods
              include:
            </p>
            <ul className="text-brand-muted mb-6 list-disc space-y-2 pl-6 leading-relaxed">
              <li>
                Account information: Retained while your account is active
              </li>
              <li>Property listings: Retained for 2 years after removal</li>
              <li>Communication records: Retained for 3 years</li>
              <li>
                Financial records: Retained for 7 years as required by law
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              8. International Data Transfers
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              Your information may be transferred to and processed in countries
              other than Ghana. When we transfer your information
              internationally, we ensure appropriate safeguards are in place to
              protect your privacy rights.
            </p>
          </section>

          <section>
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              9. Changes to This Privacy Policy
            </h2>
            <p className="text-brand-muted mb-4 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or applicable laws. When we make
              significant changes, we will notify you through our platform or
              via email.
            </p>
            <p className="text-brand-muted leading-relaxed">
              Your continued use of our services after the effective date of any
              changes constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>
        </div>

        {/* Contact Section */}
        <Card className="bg-brand-primary/5 border-brand-primary/20 mt-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              Questions About Your Privacy?
            </h2>
            <p className="text-brand-muted mx-auto mb-6 max-w-2xl">
              If you have questions about this Privacy Policy or how we handle
              your personal information, our privacy team is here to help.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/contact"
                className="bg-brand-primary hover:bg-brand-primary-dark rounded-lg px-6 py-3 font-semibold text-white transition-colors"
              >
                Contact Support
              </a>
              <a
                href="mailto:privacy@meqasa.com"
                className="border-brand-primary text-brand-primary hover:bg-brand-primary rounded-lg border px-6 py-3 font-semibold transition-colors hover:text-white"
              >
                Email Privacy Team
              </a>
            </div>
          </CardContent>
        </Card>
      </Shell>
    </div>
  );
}
