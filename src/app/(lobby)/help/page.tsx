import FeaturedPropertiesAsideWrapper from "@/components/about/featured-properties-aside-wrapper";
import { StructuredData } from "@/components/structured-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { siteConfig } from "@/config/site";
import Shell from "@/layouts/shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Frequently Asked Questions - MeQasa Help Center | Ghana's Property Platform",
  description:
    "Find answers to frequently asked questions about MeQasa. Get help with property search, listings, agent verification, and more on Ghana's leading real estate platform.",
  keywords: [
    "meqasa faq",
    "property platform help",
    "ghana real estate faq",
    "meqasa support",
    "property search help",
    "real estate questions",
    "meqasa help center",
    "property listing help",
  ],
  authors: [{ name: "MeQasa" }],
  creator: "MeQasa",
  publisher: "MeQasa",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/help",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/help",
    siteName: siteConfig.name,
    title: "Frequently Asked Questions - MeQasa Help Center",
    description:
      "Find answers to frequently asked questions about MeQasa. Get help with property search, listings, and more.",
    images: [
      {
        url: `${siteConfig.url}/og-faq.jpg`,
        width: 1200,
        height: 630,
        alt: "MeQasa FAQ - Help Center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@meqasa",
    creator: "@meqasa",
    title: "Frequently Asked Questions - MeQasa Help Center",
    description:
      "Find answers to frequently asked questions about MeQasa. Get help with property search, listings, and more.",
    images: [`${siteConfig.url}/og-faq.jpg`],
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

// FAQ data from the live MeQasa site
const faqData = [
  {
    id: "home-seeker-1",
    category: "Home Seeker Questions",
    question:
      "I need a place to rent for just a few months. Do you have such options available?",
    answer:
      'Short stays are not the easiest to come by in Ghana and are often gone before they can be listed online. However when we do have some available, you can find them by selecting "1-to-6 months" from the "Rent period" drop-down menu on the search results page or be sure to go to the "Short Lease" tab when you start your search from the meQasa home page.',
  },
  {
    id: "home-seeker-2",
    category: "Home Seeker Questions",
    question: "Can I find properties outside of Accra on meQasa.com?",
    answer:
      "Absolutely! Our search portal features thousands of properties for rent and sale in Accra and beyond. You can find a house, apartment or commercial property in some of the other regions of Ghana including in major cities like Kumasi and Takoradi. Simply select the region and locality you are interested in from the filter options.",
  },
  {
    id: "home-seeker-3",
    category: "Home Seeker Questions",
    question:
      "I'm finding a lot of amazing houses and apartments and want to save them for later review. Is that possible?",
    answer:
      "Definitely! You can favourite properties that you like in order to return to them easily. If you see a house, apartment or office you are interested in just click the star icon and it will save. On property results, the star is near the bottom right corner of the result. On property pages the star is below the photos display. You may be prompted to create or log in to your personal account.",
  },
  {
    id: "home-seeker-4",
    category: "Home Seeker Questions",
    question: "Does your website offer land for purchase?",
    answer:
      "No, we do not. We focus on real estate and have thousands of amazing residential and commercial properties for rent and purchase.",
  },
  {
    id: "home-seeker-5",
    category: "Home Seeker Questions",
    question:
      "I'm not a fan of working with agents due to past experience. Can't I just deal with the homeowner?",
    answer:
      "We understand your frustration. The house hunting process can be a stressful one. We do have a number of properties listed and managed by homeowners themselves but the truth is most times they enlist agents to assist them in finding a tenant faster. We try to work with the best real estate agents out there and offer them training so they can serve you in the best way possible. If you ever have an issue working with an agent managing a property listed on our website, please let us know.",
  },
  {
    id: "home-seeker-6",
    category: "Home Seeker Questions",
    question: "What is the Reference Number/Ref No.?",
    answer:
      "Every property listing on our website has a Reference Number, found at the very end of the description box. This number serves as an easy way for you to identify specific properties that you want to return to, show someone else or refer to when you call in with questions. From our home page you can simply enter the Ref No. and hit enter to go directly to its property page.",
  },
  {
    id: "home-seeker-7",
    category: "Home Seeker Questions",
    question: "This website is amazing! How can I stay active with meQasa?",
    answer:
      "meQasa aims to make your property search experience as smooth and enjoyable as possible, not only via this website but also with our stellar offline customer support line, mobile application, highly read blog, e-newsletter and engaging social media presence on Facebook, Twitter, Instagram and LinkedIn. Whether you are just beginning to think about renting/buying property, have just started your process, have been unsuccessful using other websites, are helping friends and family with their search, are a professional in the industry or simply love all things related to real estate, you should definitely stay in the loop with us! Like and follow us today. If you have feedback, we appreciate that too. You can tell us your thoughts here.",
  },
  {
    id: "agent-1",
    category: "Real Estate Professional Questions",
    question: "How do I sign up for an agent account on meQasa?",
    answer:
      'All you need is an email account. Click on Sign up at the top right corner of the page. Choose "Register to list properties". Select the account type you would like to use. Provide your phone number. Accept the terms of use. Once you have signed up, one of our sales executives will contact you to discuss account plan options and charges.',
  },
  {
    id: "agent-2",
    category: "Real Estate Professional Questions",
    question: "How do I Log in and Log out of my account?",
    answer:
      "To log in to your account, simply click on Log in at the top right area of the page and enter your log in details or select the email service you used to create your account. To log out of your account, simply click the Log out link at the top left corner of the page",
  },
  {
    id: "agent-3",
    category: "Real Estate Professional Questions",
    question: "How do I change my account details?",
    answer:
      "You can edit your details under your Profile tab on your dashboard page. Log in or click Logged in as [Your Name] at the top left area of the page. To log out of your account, simply click the Log out link at the top left corner of the page",
  },
  {
    id: "agent-4",
    category: "Real Estate Professional Questions",
    question:
      "Its amazing that the website offers so many property options to home seekers but I'd like my properties to be seen more prominently. How can I make that happen?",
    answer:
      'Amidst thousands of houses, apartments and office listings from several different real estate agents, developers and homeowners, you are right, it can be a struggle to have your listings stand out. To assist your sales potential we do offer advertising in 4 forms: Property of the Month Feature: Boost visibility of your listing and help it stand out to serious home seekers ready to buy now. Your listing will appear on our homepage. Top Ads: Secure for your listing the top position of property search results in its given locality. Bump Ups: Automatically refresh the listing for your available property periodically so it appears among the first recently updated listings. Featured Property: As part of our "Agent List Feature" offer, you get to select one of your listings to be featured on the meQasa homepage. Learn more about our advertising offers for real estate professionals and other advertising options.',
  },
  {
    id: "verification-1",
    category: "Questions About Agent/Agency Verification",
    question: 'What Does "Verified Agent" Mean?',
    answer:
      "A verified agent has furnished meQasa with additional proof of their identity as a real estate professional. The Verified Agent symbol signals credibility of the verified agent and should reassure most property seekers they are dealing with a professional.",
  },
  {
    id: "verification-2",
    category: "Questions About Agent/Agency Verification",
    question: "How Does meQasa Verify Agents/Agencies?",
    answer:
      "To verify an agent, we request their Valid Driver's License, Passport or National ID card bearing the same name as the one indicated on meqasa.com account. And to verify an agency, we request their Certificate of Incorporation and business registration documents. The verification process helps ensure that users are dealing with legitimate real estate professionals.",
  },
];

export default function HelpPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData data={structuredData} />

      <Shell className="py-8">
        {/* Two-column grid layout: Main content + Featured properties aside */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main content - FAQ sections */}
          <main className="lg:col-span-1">
            {/* FAQ Heading */}
            <div className="mb-8">
              <h1 className="text-brand-accent text-3xl font-bold md:text-4xl">
                Frequently Asked Questions
              </h1>
            </div>

            {/* Introductory Text */}
            <div className="mb-8">
              <p className="text-brand-muted text-lg leading-relaxed">
                Searching for the perfect property to rent or buy presents a
                number of questions that we get all the time. This page should
                help make things a lot easier.
              </p>
            </div>

            <div className="mb-8">
              <p className="text-brand-muted text-lg leading-relaxed">
                If you are a real estate professional, your goal is to assist
                seekers to secure real estate and our website puts you in touch
                with homeowners and renters-to-be through your dashboard. This
                page should help you make the best of the tools we offer you to
                succeed.
              </p>
            </div>

            {/* FAQ Navigation Links */}
            <div className="mb-12 space-y-4">
              <a
                href="#home-seeker-questions"
                className="text-brand-primary hover:text-brand-primary/80 focus-visible:ring-brand-primary block rounded-md p-3 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Home Seeker Questions
              </a>
              <a
                href="#real-estate-professional-questions"
                className="text-brand-primary hover:text-brand-primary/80 focus-visible:ring-brand-primary block rounded-md p-3 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Real Estate Professional Questions
              </a>
              <a
                href="#agent-verification-questions"
                className="text-brand-primary hover:text-brand-primary/80 focus-visible:ring-brand-primary block rounded-md p-3 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                Questions About Agent/Agency Verification
              </a>
            </div>

            {/* Home Seeker Questions */}
            <section id="home-seeker-questions" className="mb-12">
              <h2 className="text-brand-accent mb-6 text-2xl font-bold underline">
                Home Seeker Questions
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqData
                  .filter((faq) => faq.category === "Home Seeker Questions")
                  .map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="overflow-hidden rounded-lg border border-gray-200"
                    >
                      <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50">
                        <span className="text-brand-accent text-lg font-semibold">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <p className="text-brand-muted leading-relaxed">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </section>

            {/* Real Estate Professional Questions */}
            <section id="real-estate-professional-questions" className="mb-12">
              <h2 className="text-brand-accent mb-6 text-2xl font-bold underline">
                Real Estate Professional Questions
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqData
                  .filter(
                    (faq) =>
                      faq.category === "Real Estate Professional Questions"
                  )
                  .map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="overflow-hidden rounded-lg border border-gray-200"
                    >
                      <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50">
                        <span className="text-brand-accent text-lg font-semibold">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <p className="text-brand-muted leading-relaxed">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </section>

            {/* Agent/Agency Verification Questions */}
            <section id="agent-verification-questions" className="mb-12">
              <h2 className="text-brand-accent mb-6 text-2xl font-bold underline">
                Questions About Agent/Agency Verification
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {faqData
                  .filter(
                    (faq) =>
                      faq.category ===
                      "Questions About Agent/Agency Verification"
                  )
                  .map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="overflow-hidden rounded-lg border border-gray-200"
                    >
                      <AccordionTrigger className="px-6 py-4 text-left hover:bg-gray-50">
                        <span className="text-brand-accent text-lg font-semibold">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <p className="text-brand-muted leading-relaxed">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
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
