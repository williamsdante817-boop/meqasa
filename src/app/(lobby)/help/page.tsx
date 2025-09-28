"use client";

import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import Shell from "@/layouts/shell";
import {
  HelpCircle,
  Search,
  Home,
  Users,
  CreditCard,
  Shield,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQ[] = [
  // Getting Started
  {
    id: "1",
    category: "Getting Started",
    question: "How do I create an account on MeQasa?",
    answer:
      "Creating an account is simple! Click the 'Sign Up' button at the top of any page, enter your email address, create a secure password, and verify your email. You can also sign up using your Google or Facebook account for faster registration.",
  },
  {
    id: "2",
    category: "Getting Started",
    question: "Is MeQasa free to use?",
    answer:
      "Yes! Browsing and searching for properties is completely free. Creating an account and contacting property owners is also free. Property owners may choose to pay for premium features like featured listings or enhanced visibility.",
  },
  {
    id: "3",
    category: "Getting Started",
    question: "How do I search for properties?",
    answer:
      "Use our search bar on the homepage to enter your preferred location, then filter by property type (apartment, house, commercial), price range, number of bedrooms, and other criteria. You can also browse by popular locations or newly listed properties.",
  },

  // Property Listings
  {
    id: "4",
    category: "Property Listings",
    question: "How do I list my property on MeQasa?",
    answer:
      "After creating an account, click 'List Property' and follow our step-by-step guide. You'll need to provide property details, upload high-quality photos, set your price, and add a detailed description. Our team will verify your listing within 24 hours.",
  },
  {
    id: "5",
    category: "Property Listings",
    question: "What makes a good property listing?",
    answer:
      "Great listings include: clear, high-quality photos of all rooms, accurate property details, competitive pricing, detailed descriptions highlighting unique features, and prompt responses to inquiries. Properties with virtual tours and floor plans also perform better.",
  },
  {
    id: "6",
    category: "Property Listings",
    question: "How long do listings stay active?",
    answer:
      "Listings remain active for 90 days by default. You can extend, edit, or deactivate your listing anytime through your account dashboard. We'll send reminders before your listing expires so you can renew if needed.",
  },

  // Verification & Safety
  {
    id: "7",
    category: "Verification & Safety",
    question: "How does MeQasa verify property listings?",
    answer:
      "Our verification team conducts physical visits to confirm property existence, accuracy of details, and photo authenticity. We also verify ownership documents and contact information. Verified listings display a blue checkmark badge.",
  },
  {
    id: "8",
    category: "Verification & Safety",
    question: "How can I avoid property scams?",
    answer:
      "Always verify listings through MeQasa, meet agents/landlords in person, view properties before making payments, use secure payment methods, and report suspicious activity. Never send money to unverified accounts or make advance payments without proper documentation.",
  },
  {
    id: "9",
    category: "Verification & Safety",
    question: "What should I do if I encounter a suspicious listing?",
    answer:
      "Report it immediately using the 'Report Listing' button on the property page or contact our support team. Provide details about why you believe it's suspicious. We investigate all reports within 24 hours and take appropriate action.",
  },

  // Payments & Fees
  {
    id: "10",
    category: "Payments & Fees",
    question: "What are the costs for listing a property?",
    answer:
      "Basic listings are free for the first 30 days. Premium features include: Featured listings (₵50/month), Professional photography (₵200), Virtual tours (₵300), and Top placement (₵100/month). Prices may vary based on location and property type.",
  },
  {
    id: "11",
    category: "Payments & Fees",
    question: "What payment methods do you accept?",
    answer:
      "We accept mobile money (MTN, Vodafone, AirtelTigo), bank transfers, credit/debit cards, and cash payments at our offices. All online payments are processed securely through our certified payment partners.",
  },
  {
    id: "12",
    category: "Payments & Fees",
    question: "Do you offer refunds?",
    answer:
      "Refund policies vary by service. Premium listing fees are generally non-refundable once activated, but we offer pro-rated refunds for unused periods in exceptional circumstances. Contact our support team to discuss your specific situation.",
  },

  // Account Management
  {
    id: "13",
    category: "Account Management",
    question: "How do I reset my password?",
    answer:
      "Click 'Forgot Password' on the login page, enter your email address, and we'll send reset instructions. Check your spam folder if you don't see the email within 5 minutes. You can also update your password from your account settings.",
  },
  {
    id: "14",
    category: "Account Management",
    question: "Can I change my email address?",
    answer:
      "Yes, you can update your email address in your account settings. You'll need to verify the new email address before the change takes effect. This helps ensure account security and prevents unauthorized changes.",
  },
  {
    id: "15",
    category: "Account Management",
    question: "How do I delete my account?",
    answer:
      "Contact our support team to request account deletion. We'll remove your personal information within 30 days, but may retain some data for legal compliance. Active listings will be deactivated, and any unused premium services will be refunded per our policy.",
  },
];

const categories = [
  {
    name: "Getting Started",
    icon: <Home className="h-5 w-5" />,
    color: "text-blue-600",
  },
  {
    name: "Property Listings",
    icon: <Search className="h-5 w-5" />,
    color: "text-green-600",
  },
  {
    name: "Verification & Safety",
    icon: <Shield className="h-5 w-5" />,
    color: "text-orange-600",
  },
  {
    name: "Payments & Fees",
    icon: <CreditCard className="h-5 w-5" />,
    color: "text-purple-600",
  },
  {
    name: "Account Management",
    icon: <Users className="h-5 w-5" />,
    color: "text-pink-600",
  },
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<string>("");

  const segments = [
    { title: "Home", href: "/", key: "home" },
    { title: "Help & FAQ", href: "/help", key: "help" },
  ];

  // Filter FAQs based on search term and selected category
  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <Shell className="py-8 md:py-12">
        {/* Breadcrumbs */}
        <Breadcrumbs segments={segments} className="mb-8" />

        {/* Header */}
        <section className="mb-12 text-center">
          <div className="mb-6 flex justify-center">
            <HelpCircle className="text-brand-primary h-16 w-16" />
          </div>
          <h1 className="text-brand-accent mb-4 text-4xl font-bold md:text-5xl">
            Help & Support Center
          </h1>
          <p className="text-brand-muted mx-auto mb-8 max-w-3xl text-xl">
            Find answers to frequently asked questions, get help with common
            issues, and learn how to make the most of MeQasa&apos;s services.
          </p>

          {/* Search Bar */}
          <div className="mx-auto max-w-2xl">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-3 pr-4 pl-10 text-lg"
              />
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="text-center transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <MessageSquare className="text-brand-primary mx-auto mb-4 h-12 w-12" />
                <h3 className="text-brand-accent mb-2 text-lg font-semibold">
                  Contact Support
                </h3>
                <p className="text-brand-muted mb-4 text-sm">
                  Get personalized help from our support team
                </p>
                <Button variant="outline" asChild>
                  <a href="/contact">Contact Us</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <Home className="text-brand-primary mx-auto mb-4 h-12 w-12" />
                <h3 className="text-brand-accent mb-2 text-lg font-semibold">
                  List Your Property
                </h3>
                <p className="text-brand-muted mb-4 text-sm">
                  Step-by-step guide to listing your property
                </p>
                <Button variant="outline" asChild>
                  <a href="/list-property">Get Started</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center transition-shadow hover:shadow-lg">
              <CardContent className="p-6">
                <Search className="text-brand-primary mx-auto mb-4 h-12 w-12" />
                <h3 className="text-brand-accent mb-2 text-lg font-semibold">
                  Search Properties
                </h3>
                <p className="text-brand-muted mb-4 text-sm">
                  Find your perfect property with our search tools
                </p>
                <Button variant="outline" asChild>
                  <Link href="/">Browse Properties</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-8">
          <h2 className="text-brand-accent mb-6 text-2xl font-bold">
            Browse by Category
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="mb-2"
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={
                  selectedCategory === category.name ? "default" : "outline"
                }
                onClick={() => setSelectedCategory(category.name)}
                className="mb-2 flex items-center gap-2"
              >
                <span className={category.color}>{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-brand-accent text-2xl font-bold">
              {selectedCategory
                ? `${selectedCategory} Questions`
                : "Frequently Asked Questions"}
            </h2>
            <span className="text-brand-muted">
              {filteredFAQs.length}{" "}
              {filteredFAQs.length === 1 ? "question" : "questions"}
            </span>
          </div>

          {filteredFAQs.length === 0 ? (
            <Card className="p-12 text-center">
              <CardContent>
                <HelpCircle className="mx-auto mb-4 h-16 w-16 text-gray-400" />
                <h3 className="text-brand-accent mb-2 text-xl font-semibold">
                  No questions found
                </h3>
                <p className="text-brand-muted mb-6">
                  Try adjusting your search terms or browse different
                  categories.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory(null);
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Accordion
              type="single"
              collapsible
              value={openItem}
              onValueChange={setOpenItem}
            >
              {filteredFAQs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="mb-4 overflow-hidden rounded-lg border border-gray-200"
                >
                  <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50 [&[data-state=open]>svg]:rotate-180">
                    <div className="flex w-full items-center justify-between">
                      <span className="text-brand-accent text-lg font-semibold">
                        {faq.question}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="mb-3 flex items-center gap-2">
                      {
                        categories.find((cat) => cat.name === faq.category)
                          ?.icon
                      }
                      <span className="text-brand-muted text-sm">
                        {faq.category}
                      </span>
                    </div>
                    <p className="text-brand-muted leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </section>

        {/* Still Need Help */}
        <Card className="bg-brand-primary/5 border-brand-primary/20 mt-12">
          <CardContent className="p-8 text-center">
            <h2 className="text-brand-accent mb-4 text-2xl font-bold">
              Still Need Help?
            </h2>
            <p className="text-brand-muted mx-auto mb-6 max-w-2xl">
              Can&apos;t find the answer you&apos;re looking for? Our support team is
              ready to assist you with any questions or issues you may have.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild>
                <a href="/contact">Contact Support</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:help@meqasa.com">Email Us</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="tel:+233506866060">Call Us</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </Shell>
    </div>
  );
}
