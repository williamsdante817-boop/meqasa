import { agentDataFetchers } from "@/lib/api/agent-fetchers";

import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import { StructuredData } from "@/components/structured-data";
import { siteConfig } from "@/config/site";
import Shell from "@/layouts/shell";
import { logError, logInfo } from "@/lib/logger";
import type { Metadata } from "next";
import { AgentsFAQ } from "./_components/agent-faqs";
import AgentSearch from "./_components/agent-search";
import { AgentsList } from "./_components/agents-list";

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Real Estate Agents & Brokers | MeQasa Ghana",
    description:
      "Connect with trusted real estate agents and brokers in Ghana. Find professional property experts to help you buy, rent, or sell properties with confidence on MeQasa.",
    keywords: [
      "real estate agents Ghana",
      "property brokers",
      "real estate professionals",
      "property agents Accra",
      "MeQasa agents",
      "Ghana real estate experts",
      "property consultants",
      "real estate services",
      "property management",
      "real estate advice",
    ],
    authors: [{ name: "MeQasa" }],
    creator: "MeQasa",
    publisher: "MeQasa",
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: "/agents",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/agents",
      siteName: siteConfig.name,
      title: "Real Estate Agents & Brokers | MeQasa Ghana",
      description:
        "Connect with trusted real estate agents and brokers in Ghana. Find professional property experts to help you buy, rent, or sell properties.",
      images: [
        {
          url: `${siteConfig.url}/og-agents.jpg`,
          width: 1200,
          height: 630,
          alt: "MeQasa Real Estate Agents and Brokers",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@meqasa",
      creator: "@meqasa",
      title: "Real Estate Agents & Brokers | MeQasa Ghana",
      description:
        "Connect with trusted real estate agents and brokers in Ghana. Find professional property experts to help you buy, rent, or sell properties.",
      images: [`${siteConfig.url}/og-agents.jpg`],
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
}

export default async function AgentsPage() {
  try {
    const { list } = await agentDataFetchers.getAllAgents();
    const agents = list ?? [];

    logInfo("Agents data loaded successfully", {
      count: agents.length,
      component: "AgentsPage",
    });

    return (
      <>
        {/* Structured Data for SEO */}
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Real Estate Agents and Brokers",
            description:
              "Comprehensive list of professional real estate agents and brokers in Ghana",
            url: `${siteConfig.url}/agents`,
            numberOfItems: agents.length ?? 0,
            itemListElement: agents.map((agent, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "RealEstateAgent",
                name: agent.name ?? agent.company,
                description: `Professional real estate agent on MeQasa`,
                url: `${siteConfig.url}/agents/${encodeURIComponent(agent.name)}`,
                image: agent.logo
                  ? `${siteConfig.url}/uploads/imgs/${agent.logo}`
                  : undefined,
              },
            })),
          }}
        />
        <Shell>
          <div className="py-8">
            {/* Breadcrumb */}
            <Breadcrumbs
              className="mb-6"
              segments={[
                { title: "Home", href: "/" },
                { title: "Agents", href: "#" },
              ]}
            />

            <AgentSearch agents={agents} />

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left Column - Agents */}
              <div className="space-y-6 lg:col-span-2">
                {/* Info Section */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
                  <h2 className="text-brand-accent mb-3 text-lg font-medium">
                    Real Estate Agents and Brokers on meQasa
                  </h2>
                  <div className="text-muted-foreground space-y-2 text-sm">
                    <p>
                      We work with a{" "}
                      <span className="text-brand-blue">
                        growing list of professional agents
                      </span>{" "}
                      to offer you fantastic property options so you can{" "}
                      <span className="text-brand-blue">
                        find that dream home
                      </span>
                      . We also assist our{" "}
                      <span className="text-brand-blue">agents</span> in their
                      profession with valuable{" "}
                      <span className="text-brand-blue">insights and tips</span>
                      .
                    </p>
                    <p>
                      <button
                        // onClick={handleJoinProfessionals}
                        className="text-brand-blue hover:text-brand-blue-dark cursor-pointer underline"
                      >
                        Join the real estate professionals on meQasa
                      </button>
                    </p>
                  </div>
                </div>

                {/* Featured Agents */}
                <div>
                  <h2 className="text-brand-accent mb-4 text-lg font-medium">
                    Featured Agents
                  </h2>
                  <AgentsList agents={agents} />
                </div>
              </div>

              {/* Right Column - FAQ */}
              <div className="lg:col-span-1">
                <AgentsFAQ />
              </div>
            </div>
          </div>
        </Shell>
      </>
    );
  } catch (error) {
    logError("Failed to load agents page", error, {
      component: "AgentsPage",
      action: "getAllAgents",
    });
    throw error;
  }
}
