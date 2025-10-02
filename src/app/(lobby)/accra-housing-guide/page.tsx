import { StructuredData } from "@/components/structured-data";
import { siteConfig } from "@/config/site";
import Shell from "@/layouts/shell";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "Accra Housing Guide | Complete Guide to Finding Property in Accra",
  description:
    "Comprehensive housing guide for Accra, Ghana. Learn about the real estate market, property search process, taxes, financing options, and everything you need to know about finding accommodation in Accra.",
  keywords: [
    "Accra housing guide",
    "Ghana real estate guide",
    "property search Accra",
    "housing in Accra",
    "real estate Ghana",
    "property taxes Ghana",
    "mortgage Ghana",
    "renting in Accra",
    "buying property Accra",
    "real estate agents Ghana",
  ],
  authors: [{ name: "MeQasa" }],
  creator: "MeQasa",
  publisher: "MeQasa",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/accra-housing-guide",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/accra-housing-guide",
    siteName: siteConfig.name,
    title: "Accra Housing Guide | Complete Guide to Finding Property in Accra",
    description:
      "Comprehensive housing guide for Accra, Ghana. Learn about the real estate market, property search process, taxes, financing options, and everything you need to know about finding accommodation in Accra.",
    images: [
      {
        url: `${siteConfig.url}/og-housing-guide.jpg`,
        width: 1200,
        height: 630,
        alt: "Accra Housing Guide - Complete Property Search Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@meqasa",
    creator: "@meqasa",
    title: "Accra Housing Guide | Complete Guide to Finding Property in Accra",
    description:
      "Comprehensive housing guide for Accra, Ghana. Learn about the real estate market, property search process, taxes, financing options, and everything you need to know about finding accommodation in Accra.",
    images: [`${siteConfig.url}/og-housing-guide.jpg`],
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

export default function AccraHousingGuide() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Accra Housing Guide",
    description:
      "A comprehensive guide to finding accommodation in Accra, Ghana. Learn about the real estate market, property search process, taxes, financing options, and everything you need to know about housing in Accra.",
    author: {
      "@type": "Organization",
      name: "MeQasa",
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: "MeQasa",
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    datePublished: "2024-01-01",
    dateModified: "2024-01-01",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/accra-housing-guide`,
    },
    image: `${siteConfig.url}/og-housing-guide.jpg`,
    url: `${siteConfig.url}/accra-housing-guide`,
  };

  const navigationSections = [
    { id: "introduction", title: "INTRODUCTION" },
    { id: "overview", title: "OVERVIEW" },
    { id: "house-hunting", title: "HOUSE HUNTING IN GHANA" },
    { id: "rent-or-buy", title: "TO RENT OR TO BUY? THAT IS THE QUESTION" },
    { id: "property-taxes", title: "A CLEAR VIEW OF PROPERTY TAXES" },
    { id: "paying-for-home", title: "PAYING FOR YOUR HOME" },
    { id: "insuring-home", title: "INSURING YOUR HOME" },
    { id: "landlord-tenant", title: "DEALING WITH A LANDLORD OR TENANT" },
    {
      id: "land-acquisition",
      title: "LAND: ACQUISITION, REGISTRATION AND EVERYTHING IN BETWEEN",
    },
    { id: "selling-letting", title: "SELLING & LETTING PROPERTY" },
    {
      id: "questions",
      title: "18 QUESTIONS TO ANSWER BEFORE YOU START YOUR HOME SEARCH",
    },
  ];

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData data={structuredData} />

      {/* Header Section - Full Width Image */}
      <div className="relative h-[300px] w-full">
        <Image
          src="/accra-housing-guide.jpg"
          alt="Accra Housing Guide - Aerial view of Accra cityscape"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <Shell className="py-8">
        {/* Two-column grid layout: Sidebar navigation + Main content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
          {/* Sidebar Navigation */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="text-brand-accent mb-4 font-semibold">
                Table of Contents
              </h3>
              <nav className="space-y-2">
                {navigationSections.map((section) => (
                  <Link
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-brand-muted hover:text-brand-primary block py-1 text-sm transition-colors"
                  >
                    {section.title}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="space-y-8">
            {/* Introduction Section */}
            <section id="introduction" className="space-y-6">
              <div className="prose prose-lg max-w-none">
                <p className="text-brand-muted leading-relaxed">
                  As a{" "}
                  <span className="font-semibold text-red-600">
                    recognised leader in the real estate classified industry
                  </span>{" "}
                  in Ghana, meQasa has crafted this Housing Guide as a resource
                  for all who seek to understand the ins and outs of looking for
                  accommodation in Ghana, specifically in the capital of Accra.
                  This guide serves as an invaluable reference material for home
                  seekers; home owners; real estate agents; real estate
                  investors; developers and other professionals in the business;
                  policy makers, students and real estate enthusiasts worldwide.
                </p>
                <p className="text-brand-muted leading-relaxed">
                  The real estate landscape in Ghana has evolved into one that
                  is vast and exciting over the last decade and though there is
                  still a gaping deficit in housing as compared to the needs of
                  the populace, Ghana's capital city offers an impressive
                  portfolio of property that run the gamut of styles and price.
                  Housing is a big decision and can be daunting with so many
                  questions to ask oneself as you begin to explore what would
                  suit you best. You are not alone. We are here to serve as your
                  trusted partner as you move along this journey and are happy
                  to help, no matter your inquiry. Give us a shout.
                </p>
              </div>

              {/* Contact Information */}
              <div className="bg-brand-blue-light rounded-md p-6 text-center">
                <h3 className="text-brand-accent mb-2 font-semibold">
                  meQasa Ltd.
                </h3>
                <p className="text-brand-muted">
                  23 Kofi Annan Avenue, North Legon
                </p>
                <p className="text-brand-muted">Accra, Ghana</p>
                <p className="text-brand-muted">Tel. +233 506 866 060</p>
                <Link
                  href="mailto:info@meqasa.com"
                  className="text-brand-blue hover:text-brand-blue-dark transition-colors"
                >
                  info@meqasa.com
                </Link>
              </div>
            </section>

            {/* Overview Section */}
            <section id="overview" className="space-y-6">
              <h2 className="text-brand-accent text-3xl font-bold">OVERVIEW</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-brand-muted leading-relaxed">
                  Ghana currently has a social housing problem, with a deficit
                  of 1.7 million units, and counting. Ideally, spreading it over
                  a 10-year period, a minimum of{" "}
                  <span className="font-semibold text-red-600">
                    170,000 housing units would have to be built annually to
                    solve the issue
                  </span>{" "}
                  [Source:{" "}
                  <Link
                    href="https://ghananewsagency.org"
                    className="text-brand-blue hover:text-brand-blue-dark"
                  >
                    GhanaNewsAgency.org
                  </Link>
                  ] This would require a public-private partnership to address,
                  since the government alone cannot erase this deficit and,
                  therefore, welcomes any initiative from private entities to
                  complement their efforts.
                </p>
                <p className="text-brand-muted leading-relaxed">
                  The Borteyman and Kpone Housing projects are two of six
                  projects across the country the government is pursuing to
                  provide just about 5,000 of affordable one and two bedroom
                  houses for public sector workers. The other projects are in
                  Tamale (Northern Region), Koforidua (Eastern Region), Asokore
                  Mampong (Ashanti Region) and Wa (Upper West Region).This
                  deficit, however, may not really be as severe as portrayed.
                </p>
                <p className="text-brand-muted leading-relaxed">
                  There are thousands of homes up for sale and rent that are
                  uninhabited and which would greatly reduce the housing problem
                  if they were occupied. The main reason they remain unoccupied
                  is price and ease of finding them.There are a lot of beautiful
                  habitable properties on the market whose price deters
                  potential tenants. Some of such houses are justifiably
                  expensive if you take into consideration the cost of materials
                  used in their construction, but a majority of them are high
                  priced simply because they are located in "prime locations" or
                  the owners were told they stood to make more profit if they
                  sold or rented at such a price. There is an amazing
                  opportunity for private investors to provide affordable
                  housing options.
                </p>
              </div>
            </section>

            {/* House Hunting Section */}
            <section id="house-hunting" className="space-y-6">
              <h2 className="text-brand-accent text-3xl font-bold">
                HOUSE HUNTING IN GHANA
              </h2>

              <div className="space-y-6">
                <h3 className="text-brand-accent text-2xl font-semibold">
                  The Players and Process
                </h3>
                <p className="text-brand-muted leading-relaxed">
                  If you are in the market to purchase a home or are looking to
                  rent, the search for a home in Ghana is a tasking yet
                  thrilling process that requires a level of commitment from you
                  if you are to find a place you are happy with. There are
                  primarily four methods of going about searching for
                  accommodation -- working directly with a selected estate agent
                  and communicating your criteria so (s)he searches on your
                  behalf; approaching a homeowner directly; speaking with a
                  developer; or taking control of such a major decision with an
                  online search using a real estate marketplace like meQasa.com.
                  Before you get started you are going to need to settle on a
                  budget range as well as a list of what you seek in a home.{" "}
                  <Link
                    href="#questions"
                    className="text-brand-blue hover:text-brand-blue-dark"
                  >
                    These questions
                  </Link>{" "}
                  should help you out.
                </p>

                <h3 className="text-brand-accent text-2xl font-semibold">
                  The Players
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-brand-accent mb-2 text-xl font-semibold">
                      Real Estate Agents
                    </h4>
                    <p className="text-brand-muted leading-relaxed">
                      Many developers and homeowners rely heavily on real estate
                      agents to assist them in renting out and selling their
                      property a lot faster, in exchange for a commission. There
                      are 3 tiers of agents -- more high-end, middle tier and
                      low-end agents -- differentiated by the kind of property
                      they manage, their level of education and professionalism,
                      and the overall value of their customer service. There
                      aren't any mandatory national or regional real estate
                      licensing programs in place to ensure that only registered
                      individuals who have enrolled in industry courses and
                      passed can open and operate formal real estate agencies in
                      Ghana. Many real estate agents (mostly low-end) are simply
                      people who have taken an interest in the industry. This
                      group of low-end professionals is actually thinning as
                      more of them are striving to be more professional and are
                      upgrading. They can be very helpful, though using them as
                      the first point in your search may lengthen the process as
                      they report back to you on properties they think are
                      appropriate and may not indeed suit your taste,
                      requirements or budget, even when one is communicated
                      ahead. There are also a number of real estate agents now
                      in Ghana who were trained and received certification
                      abroad. However, they are much fewer and hard to find.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-brand-accent mb-2 text-xl font-semibold">
                      Homeowners/Landlords
                    </h4>
                    <p className="text-brand-muted leading-relaxed">
                      Some people exclaim in frustration at having to work with
                      a real estate agent to secure accommodation and seek to
                      approach a homeowner/landlord directly. That is a
                      possibility, but most times, it is hard to get in touch
                      with these homeowners who may not be readily available at
                      the property to conduct showings and answer face-to-face
                      questions on a daily basis. They find it more convenient
                      for a real estate agent to serve as an intermediary and
                      therefore task one or more of them to assist finding a
                      tenant or buyer.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-brand-accent mb-2 text-xl font-semibold">
                      Developers
                    </h4>
                    <p className="text-brand-muted leading-relaxed">
                      If you want to buy property and live in a planned and
                      structured community, you might want to look to real
                      estate developers. Developments tend to have the same home
                      design across board however, meaning you have limited
                      choice in the style of home. You can also work with a
                      developer to build you a home to your specifications. The
                      advantage of finding a house via a developer is that they
                      are very organised and many work with banks to be able to
                      offer you help with financing options like mortgages. Some
                      developers also try to sell their properties online via
                      real estate marketplaces like meQasa.com.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-brand-accent mb-2 text-xl font-semibold">
                      Online Property Search Portals
                    </h4>
                    <p className="text-brand-muted leading-relaxed">
                      There are a few other web-based real estate marketplaces
                      though we cannot vouch for their product or level of
                      service. Our renowned online housing search platform -
                      meQasa.com - makes your house-hunting the easiest
                      possible. Offering a safe and secure network backed by
                      strong offline customer support, there isn't a better
                      website on which to conduct your search. With a beautiful
                      user interface that is simple, user-friendly and
                      exhaustive in offerings, you can search for property
                      anywhere in Accra and beyond. You can use our filter
                      function to narrow down to exactly the kind of housing you
                      seek, be it a studio rental in the heart of the city or a
                      4 bedroom house with a pool away from the hustle and
                      bustle. Once you settle on certain properties that
                      interest you, you can immediately reach out to the
                      managing real estate agent or owner.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Rent or Buy Section */}
            <section id="rent-or-buy" className="space-y-6">
              <h2 className="text-brand-accent text-3xl font-bold">
                TO RENT OR TO BUY? THAT IS THE QUESTION
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-brand-muted leading-relaxed">
                  This is one of the most important decisions you'll make when
                  it comes to housing. Both options have their advantages and
                  disadvantages, and the choice depends on your personal
                  circumstances, financial situation, and long-term goals.
                </p>
                <p className="text-brand-muted leading-relaxed">
                  Renting offers flexibility and lower upfront costs, while
                  buying provides stability and potential long-term investment
                  benefits. Consider your current financial situation, job
                  stability, and future plans when making this decision.
                </p>
              </div>
            </section>

            {/* Property Taxes Section */}
            <section id="property-taxes" className="space-y-6">
              <h2 className="text-brand-accent text-3xl font-bold">
                A CLEAR VIEW OF PROPERTY TAXES
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-brand-muted leading-relaxed">
                  Understanding property taxes in Ghana is crucial for both
                  buyers and sellers. Property taxes vary depending on the
                  location and value of the property, and it's important to
                  factor these costs into your budget when considering a
                  property purchase.
                </p>
                <h3 className="text-brand-accent mt-6 mb-3 text-xl font-semibold">
                  Designated Rating Zones
                </h3>
                <p className="text-brand-muted leading-relaxed">
                  Different areas in Accra have different tax rates based on
                  their designated rating zones. These zones are determined by
                  factors such as location, infrastructure, and property values.
                  It's important to understand which zone your property falls
                  into to calculate the correct tax amount.
                </p>
              </div>
            </section>

            {/* Paying for Home Section */}
            <section id="paying-for-home" className="space-y-6">
              <h2 className="text-brand-accent text-3xl font-bold">
                PAYING FOR YOUR HOME
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-brand-muted leading-relaxed">
                  There are several ways to finance your home purchase in Ghana,
                  each with its own advantages and considerations.
                </p>

                <h3 className="text-brand-accent mt-6 mb-3 text-xl font-semibold">
                  Paying Cash
                </h3>
                <p className="text-brand-muted leading-relaxed">
                  Paying cash for a property offers the advantage of avoiding
                  interest payments and potentially negotiating a better price
                  with the seller. However, it requires significant upfront
                  capital and may not be feasible for most buyers.
                </p>

                <h3 className="text-brand-accent mt-6 mb-3 text-xl font-semibold">
                  Taking Out a Loan/Mortgage
                </h3>
                <p className="text-brand-muted leading-relaxed">
                  Mortgages are becoming more accessible in Ghana, with various
                  banks and financial institutions offering home loans. It's
                  important to shop around for the best interest rates and
                  terms, and to understand all the associated costs and
                  requirements.
                </p>
              </div>
            </section>

            {/* Insuring Home Section */}
            <section id="insuring-home" className="space-y-6">
              <h2 className="text-brand-accent text-3xl font-bold">
                INSURING YOUR HOME
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-brand-muted leading-relaxed">
                  Home insurance is an important consideration for property
                  owners in Ghana. It provides protection against various risks
                  including fire, theft, natural disasters, and other unforeseen
                  events. Different types of insurance coverage are available,
                  and it's important to choose the right level of coverage for
                  your needs and budget.
                </p>
              </div>
            </section>

            {/* Landlord/Tenant Section */}
            <section id="landlord-tenant" className="space-y-6">
              <h2 className="text-brand-accent text-3xl font-bold">
                DEALING WITH A LANDLORD OR TENANT
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-brand-muted leading-relaxed">
                  Whether you're a landlord or tenant, understanding your rights
                  and responsibilities is crucial for a successful rental
                  relationship.
                </p>

                <h3 className="text-brand-accent mt-6 mb-3 text-xl font-semibold">
                  A Note to Landlords
                </h3>
                <p className="text-brand-muted leading-relaxed">
                  As a landlord, it's important to maintain your property,
                  respond to tenant concerns promptly, and follow all legal
                  requirements for rental properties. This includes proper
                  documentation, fair rent pricing, and timely repairs.
                </p>

                <h3 className="text-brand-accent mt-6 mb-3 text-xl font-semibold">
                  A Note to Tenants
                </h3>
                <p className="text-brand-muted leading-relaxed">
                  As a tenant, you have rights to a habitable living space,
                  privacy, and fair treatment. It's important to pay rent on
                  time, maintain the property, and communicate openly with your
                  landlord about any issues or concerns.
                </p>
              </div>
            </section>

            {/* Land Acquisition Section */}
            <section id="land-acquisition" className="space-y-6">
              <h2 className="text-brand-accent text-3xl font-bold">
                LAND: ACQUISITION, REGISTRATION AND EVERYTHING IN BETWEEN
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-brand-muted leading-relaxed">
                  Land acquisition in Ghana involves several important steps and
                  legal requirements. It's crucial to understand the process,
                  verify land ownership, and ensure all documentation is
                  properly completed to avoid future disputes.
                </p>
                <p className="text-brand-muted leading-relaxed">
                  The land registration process involves various government
                  agencies and requires specific documentation. It's advisable
                  to work with qualified legal professionals to navigate this
                  complex process successfully.
                </p>
              </div>
            </section>

            {/* Selling & Letting Section */}
            <section id="selling-letting" className="space-y-6">
              <h2 className="text-brand-accent text-3xl font-bold">
                SELLING & LETTING PROPERTY
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-brand-muted leading-relaxed">
                  Whether you're selling or letting your property, there are
                  several important considerations to ensure a successful
                  transaction. This includes proper pricing, marketing, legal
                  requirements, and working with qualified professionals.
                </p>
                <p className="text-brand-muted leading-relaxed">
                  For property owners looking to sell or rent, working with
                  experienced real estate agents can help streamline the process
                  and ensure you get the best possible outcome. Agents can
                  handle marketing, showings, negotiations, and legal
                  documentation on your behalf.
                </p>
              </div>
            </section>

            {/* 18 Questions Section */}
            <section id="questions" className="space-y-6">
              <h2 className="text-brand-accent text-3xl font-bold">
                18 QUESTIONS TO ANSWER BEFORE YOU START YOUR HOME SEARCH
              </h2>
              <p className="text-brand-muted leading-relaxed">
                Finding your next home - one that you will love - requires some
                groundwork from you. It's necessary to be honest with yourself
                about certain things and make some decisions even before you log
                into meQasa.com. Once you have gone through these questions,
                which will help paint the picture of what you seek in a home,
                you'll be ready to take off and are more likely to pick
                effectively, having set your criteria.
              </p>

              <div className="rounded-lg bg-gray-50 p-6">
                <ol className="text-brand-muted space-y-3">
                  <li>1. How much can you afford?</li>
                  <li>
                    2. How long are you seeking accommodation for? (a few months
                    or years)
                  </li>
                  <li>
                    3. Is renting or buying a place the best decision for you?
                  </li>
                  <li>4. How many bedrooms and bathrooms do you need?</li>
                  <li>
                    5. Do you need a fully furnished, unfurnished or
                    semi-furnished place?
                  </li>
                  <li>6. How much square footage do you need?</li>
                  <li>
                    7. Is living in the city centre important? Or do you prefer
                    to be in a more suburban and quiet area?
                  </li>
                  <li>8. What neighbourhoods would you prefer to live in?</li>
                  <li>
                    9. Which neighbourhoods would you absolutely not consider
                    living in?
                  </li>
                  <li>
                    10. Do you have a car for daily commute? (this affects
                    whether living close to main streets matter)
                  </li>
                  <li>
                    11. Do the neighbourhoods you like offer great amenities
                    that are important to you? (e.g. supermarkets and other
                    shops closeby, good transportation links, well-lit streets,
                    etc)
                  </li>
                  <li>
                    12. If looking to purchase from a developer, are they
                    registered members of the Ghana Real Estate Developers
                    Association?
                  </li>
                  <li>13. Will you need a roommate to help split expenses?</li>
                  <li>
                    14. What are your must-haves in a place versus your desired
                    amenities but ones that you can do without?
                  </li>
                  <li>
                    15. Do you prefer an apartment or a self-compound detached
                    house?
                  </li>
                  <li>16. Do you have a pet/pets?</li>
                  <li>
                    17. Do you have needs that require you to be on the ground
                    floor? (e.g. hip or leg problems)
                  </li>
                  <li>
                    18. Do you foresee having a live-in househelp? (if so, you
                    would need a room for him/her)
                  </li>
                </ol>
              </div>

              <p className="text-brand-muted leading-relaxed">
                With regards to neighbourhoods, you may refer to our LIVING IN:
                Accra neighbourhood profiles for insight into various areas in
                the capital and what they have to offer.
              </p>

              <div className="bg-brand-blue-light rounded-md p-6">
                <p className="text-brand-muted leading-relaxed">
                  Still have a few questions about finding accommodation or
                  living in Accra? We're here to help make your residential
                  experience as smooth as can be so give us a call or send us an
                  email and let's get you on your way to happy home life!
                </p>
              </div>
            </section>
          </main>
        </div>
      </Shell>
    </>
  );
}
