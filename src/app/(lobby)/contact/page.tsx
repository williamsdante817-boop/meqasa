import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import Shell from "@/layouts/shell";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Users,
  Headphones,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch with MeQasa | Ghana's Property Platform",
  description:
    "Contact MeQasa for support, inquiries, or assistance with property listings. Find our office locations, phone numbers, email addresses, and contact forms for all your real estate needs.",
  keywords: [
    "contact meqasa",
    "meqasa support",
    "ghana property help",
    "real estate assistance",
    "property platform contact",
    "meqasa office",
    "customer service ghana",
    "property listing help",
  ],
  authors: [{ name: "MeQasa" }],
  creator: "MeQasa",
  publisher: "MeQasa",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/contact",
    siteName: siteConfig.name,
    title: "Contact Us - Get in Touch with MeQasa | Ghana's Property Platform",
    description:
      "Contact MeQasa for support, inquiries, or assistance with property listings. Find our office locations, phone numbers, email addresses, and contact forms.",
    images: [
      {
        url: `${siteConfig.url}/og-contact.jpg`,
        width: 1200,
        height: 630,
        alt: "Contact MeQasa - Ghana's Property Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@meqasa",
    creator: "@meqasa",
    title: "Contact Us - Get in Touch with MeQasa",
    description:
      "Contact MeQasa for support, inquiries, or assistance with property listings. Get help with all your real estate needs.",
    images: [`${siteConfig.url}/og-contact.jpg`],
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

export default function ContactPage() {
  const segments = [
    { title: "Home", href: "/", key: "home" },
    { title: "Contact Us", href: "/contact", key: "contact" },
  ];

  const contactMethods = [
    {
      icon: <Phone className="text-brand-primary h-6 w-6" />,
      title: "Phone Support",
      primary: "+233 506 866 060",
      secondary: "+233 302 123 456",
      description: "Call us for immediate assistance",
      available: "Mon - Fri, 8:00 AM - 6:00 PM",
    },
    {
      icon: <Mail className="text-brand-primary h-6 w-6" />,
      title: "Email Support",
      primary: "info@meqasa.com",
      secondary: "support@meqasa.com",
      description: "Send us an email anytime",
      available: "24/7 - We'll respond within 24 hours",
    },
    {
      icon: <MessageSquare className="text-brand-primary h-6 w-6" />,
      title: "Live Chat",
      primary: "Available on website",
      secondary: "WhatsApp: +233 506 866 060",
      description: "Chat with our support team",
      available: "Mon - Fri, 8:00 AM - 6:00 PM",
    },
  ];

  const departments = [
    {
      icon: <Users className="text-brand-primary h-8 w-8" />,
      title: "Property Seekers",
      email: "help@meqasa.com",
      description:
        "Get help finding your perfect property, search assistance, and viewing arrangements",
    },
    {
      icon: <MapPin className="text-brand-primary h-8 w-8" />,
      title: "Property Owners",
      email: "list@meqasa.com",
      description:
        "List your property, manage listings, and connect with potential tenants or buyers",
    },
    {
      icon: <Headphones className="text-brand-primary h-8 w-8" />,
      title: "Technical Support",
      email: "tech@meqasa.com",
      description: "Website issues, account problems, and technical assistance",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Shell className="py-8 md:py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs segments={segments} className="mb-8" />

        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="text-brand-accent mb-6 text-4xl leading-tight font-bold tracking-tight md:text-5xl lg:text-6xl">
            Get in Touch
          </h1>
          <p className="text-brand-muted mx-auto mb-8 max-w-3xl text-xl leading-relaxed md:text-2xl">
            Have a question, need assistance, or want to partner with us? We&apos;re
            here to help you with all your real estate needs.
          </p>
        </section>

        {/* Contact Methods */}
        <section className="mb-16">
          <div className="grid gap-8 md:grid-cols-3">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="hover:border-brand-primary/30 border-gray-200 text-center transition-colors"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    <div className="bg-brand-primary/10 rounded-full p-4">
                      {method.icon}
                    </div>
                  </div>
                  <h3 className="text-brand-accent mb-3 text-xl font-semibold">
                    {method.title}
                  </h3>
                  <div className="mb-4 space-y-2">
                    <p className="text-brand-primary font-medium">
                      {method.primary}
                    </p>
                    {method.secondary && (
                      <p className="text-brand-muted">{method.secondary}</p>
                    )}
                  </div>
                  <p className="text-brand-muted mb-2 text-sm">
                    {method.description}
                  </p>
                  <p className="text-brand-muted text-xs">{method.available}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Form and Office Info */}
        <section className="mb-16 grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-brand-accent text-2xl font-bold">
                Send us a Message
              </CardTitle>
              <p className="text-brand-muted">
                Fill out the form below and we&apos;ll get back to you as soon as
                possible.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+233 xxx xxx xxx"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="What is this regarding?"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us how we can help you..."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Office Information */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-brand-accent flex items-center gap-2 text-2xl font-bold">
                  <MapPin className="h-6 w-6" />
                  Our Office
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-brand-accent mb-2 font-semibold">
                    MeQasa Head Office
                  </h4>
                  <p className="text-brand-muted">
                    23 Kofi Annan Ave
                    <br />
                    North Legon, Accra
                    <br />
                    Greater Accra Region, Ghana
                  </p>
                </div>

                <div className="text-brand-muted flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Monday - Friday: 8:00 AM - 6:00 PM</span>
                </div>

                <div className="text-brand-muted flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Saturday: 9:00 AM - 2:00 PM</span>
                </div>

                <div className="text-brand-muted flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Sunday: Closed</span>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardContent className="p-0">
                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100">
                  <div className="text-center">
                    <MapPin className="text-brand-primary mx-auto mb-2 h-12 w-12" />
                    <p className="text-brand-muted">Interactive Map</p>
                    <p className="text-brand-muted text-sm">
                      Click to view location
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Department-specific Contact */}
        <section className="mb-16">
          <div className="mb-12 text-center">
            <h2 className="text-brand-accent mb-4 text-3xl font-bold md:text-4xl">
              Department-Specific Support
            </h2>
            <p className="text-brand-muted mx-auto max-w-2xl text-xl">
              Get specialized help from our expert teams
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {departments.map((dept, index) => (
              <Card
                key={index}
                className="hover:border-brand-primary/30 border-gray-200 text-center transition-colors"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">{dept.icon}</div>
                  <h3 className="text-brand-accent mb-3 text-xl font-semibold">
                    {dept.title}
                  </h3>
                  <p className="text-brand-muted mb-4 text-sm">
                    {dept.description}
                  </p>
                  <a
                    href={`mailto:${dept.email}`}
                    className="text-brand-primary font-medium hover:underline"
                  >
                    {dept.email}
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="mb-12 text-center">
            <h2 className="text-brand-accent mb-4 text-3xl font-bold md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-brand-muted mx-auto max-w-2xl text-xl">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-brand-accent mb-2 text-lg font-semibold">
                How do I list my property?
              </h3>
              <p className="text-brand-muted mb-4">
                You can list your property by creating an account and using our
                &quot;List Property&quot; feature. Our team will verify your listing
                within 24 hours.
              </p>
            </div>

            <div>
              <h3 className="text-brand-accent mb-2 text-lg font-semibold">
                Is MeQasa free to use?
              </h3>
              <p className="text-brand-muted mb-4">
                Browsing and searching properties is completely free. Property
                owners pay a fee only when they successfully rent or sell
                through our platform.
              </p>
            </div>

            <div>
              <h3 className="text-brand-accent mb-2 text-lg font-semibold">
                How are properties verified?
              </h3>
              <p className="text-brand-muted mb-4">
                Our team physically visits and verifies each property listing to
                ensure authenticity, accuracy of details, and quality photos.
              </p>
            </div>

            <div>
              <h3 className="text-brand-accent mb-2 text-lg font-semibold">
                Can I schedule property viewings?
              </h3>
              <p className="text-brand-muted mb-4">
                Yes! You can request viewings directly through our platform, and
                we&apos;ll coordinate with the property owner or agent to arrange a
                convenient time.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <a href="/help">View All FAQs</a>
            </Button>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-red-800">
            Emergency or Urgent Issues?
          </h2>
          <p className="mb-6 text-red-700">
            If you&apos;re experiencing a serious issue with a property or need
            immediate assistance, please contact our emergency hotline.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="tel:+233506866060"
              className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700"
            >
              Emergency Hotline: +233 506 866 060
            </a>
            <a
              href="mailto:emergency@meqasa.com"
              className="rounded-lg border border-red-600 px-6 py-3 font-semibold text-red-600 transition-colors hover:bg-red-600 hover:text-white"
            >
              emergency@meqasa.com
            </a>
          </div>
        </section>
      </Shell>
    </div>
  );
}
