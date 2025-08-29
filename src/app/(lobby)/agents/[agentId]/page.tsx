export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

import ContactCard from "@/components/common/contact-card";
import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import { siteConfig } from "@/config/site";
import Shell from "@/layouts/shell";
import { getAgentDetails } from "@/lib/get-agent-details";
import type { Metadata } from "next";
import { AgentHeader } from "../_components/agent-header";
import { AgentListings } from "../_components/agent-listings";

interface AgentDetailsPageProps {
  params: Promise<{ agentId: string }>;
  searchParams: Promise<Record<string, string>>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
  searchParams,
}: AgentDetailsPageProps): Promise<Metadata> {
  try {
    const { agentId: agentNameParam } = await params;
    const resolvedSearchParams = await searchParams;
    const agentIdFromQuery = resolvedSearchParams.g;

    if (!agentNameParam || !agentIdFromQuery) {
      return {
        title: "Agent Not Found | MeQasa",
        description: "The requested real estate agent could not be found.",
      };
    }

    const agentName = decodeURIComponent(agentNameParam);
    const agent = await getAgentDetails(agentIdFromQuery, agentName);

    if (!agent) {
      return {
        title: "Agent Not Found | MeQasa",
        description: "The requested real estate agent could not be found.",
      };
    }

    const title = `${agent.name} - Real Estate Agent | MeQasa Ghana`;
    const description = `Connect with ${agent.name}, a professional real estate agent on MeQasa. View their listings, contact information, and professional profile. ${agent.activelistings} active listings available.`;

    const keywords = [
      agent.name,
      "real estate agent",
      "property agent",
      "Ghana real estate",
      "MeQasa agent",
      "property broker",
      "real estate professional",
      `${agent.name} agent`,
      "property listings",
      "real estate services",
    ];

    return {
      title,
      description,
      keywords,
      authors: [{ name: "MeQasa" }],
      creator: "MeQasa",
      publisher: "MeQasa",
      metadataBase: new URL(siteConfig.url),
      alternates: {
        canonical: `/agents/${agentNameParam}?g=${agentIdFromQuery}`,
      },
      openGraph: {
        type: "profile",
        locale: "en_US",
        url: `/agents/${agentNameParam}?g=${agentIdFromQuery}`,
        siteName: siteConfig.name,
        title,
        description,
        images: agent.logo
          ? [
              {
                url: agent.logo.startsWith("http")
                  ? agent.logo
                  : `https://dve7rykno93gs.cloudfront.net${agent.logo.startsWith("/") ? agent.logo : `/${agent.logo}`}`,
                width: 1200,
                height: 630,
                alt: `${agent.name} - Real Estate Agent`,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        site: "@meqasa",
        creator: "@meqasa",
        title,
        description,
        images: agent.logo
          ? [
              agent.logo.startsWith("http")
                ? agent.logo
                : `https://dve7rykno93gs.cloudfront.net${agent.logo.startsWith("/") ? agent.logo : `/${agent.logo}`}`,
            ]
          : [],
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
  } catch {
    return {
      title: "Real Estate Agent | MeQasa",
      description: "Connect with professional real estate agents on MeQasa.",
    };
  }
}

export default async function AgentDetailsPage({
  params,
  searchParams,
}: AgentDetailsPageProps) {
  const { agentId: agentNameParam } = await params;
  const resolvedSearchParams = await searchParams;
  const agentIdFromQuery = resolvedSearchParams.g;

  if (!agentNameParam || !agentIdFromQuery) {
    notFound();
  }

  const agentName = decodeURIComponent(agentNameParam);
  const agent = await getAgentDetails(agentIdFromQuery, agentName);
  const CDN_PREFIX = "https://dve7rykno93gs.cloudfront.net";

  // Handle different logo path formats
  let logoUrl: string | undefined;
  if (agent.logo) {
    if (agent.logo.startsWith("http")) {
      // Logo is already a full URL
      logoUrl = agent.logo;
    } else if (agent.logo.startsWith("/")) {
      // Logo starts with slash, append to CDN
      logoUrl = `${CDN_PREFIX}${agent.logo}`;
    } else {
      // Logo is a relative path, append to CDN with slash
      logoUrl = `${CDN_PREFIX}/${agent.logo}`;
    }
  }

  if (!agent) {
    notFound();
  }

  // Generate structured data for the agent
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: agent.name,
    description: `Professional real estate agent on MeQasa with ${agent.activelistings} active listings`,
    url: `${siteConfig.url}/agents/${agentNameParam}?g=${agentIdFromQuery}`,
    image: logoUrl,
    logo: logoUrl,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      areaServed: "Ghana",
    },
    areaServed: {
      "@type": "Country",
      name: "Ghana",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${agent.name} Property Listings`,
      description: `Properties listed by ${agent.name}`,
      itemListElement:
        agent.listings?.map((listing, _index) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "RealEstateListing",
            name: listing.summary || `Property by ${agent.name}`,
            description:
              listing.description || `Property listed by ${agent.name}`,
            image: listing.image
              ? `${siteConfig.url}/uploads/imgs/${listing.image}`
              : undefined,
          },
        })) || [],
    },
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div>
        <Shell>
          <AgentHeader
            agent={{
              ...agent,
              activelistings: agent.activelistings?.toString(),
            }}
            logoUrl={logoUrl}
          />
        </Shell>

        <Shell className="mt-20">
          <div className="grid grid-cols-1 text-brand-accent w-full mt-4 lg:grid-cols-[2fr_1fr] lg:gap-8 lg:px-0">
            {/* <section className="grid md:grid-cols-[736px,1fr] md:gap-8"> */}
            <div>
              <Breadcrumbs
                className="mb-6"
                segments={[
                  { title: "Home", href: "/" },
                  { title: "Agents", href: "/agents" },
                  { title: agent.name, href: "#" },
                ]}
              />

              {/* <AgentInfo agent={agent} /> */}
              <AgentListings
                agentId={agent.id}
                agentName={agent.name}
                initialListings={agent.listings}
                totalCount={agent.activelistings}
              />
            </div>

            <aside className="relative mb-5 pb-8 md:mb-0">
              <ContactCard
                name={agent.name}
                image={agent.logo || ""}
                listingId={agentIdFromQuery}
                pageType="listing"
              />
            </aside>
          </div>
          {/* </section> */}
        </Shell>
      </div>
    </>
  );
}
