export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/bread-crumbs";
import ContactCard from "@/components/contact-card";
import { AgentHeader } from "../_components/agent-header";
import { AgentInfo } from "../_components/agent-info";
import { AgentListings } from "../_components/agent-listings";
import Shell from "@/layouts/shell";
import { getAgentDetails } from "@/lib/get-agent-details";

interface AgentDetailsPageProps {
  params: Promise<{ agentId: string }>;
  searchParams: Promise<Record<string, string>>;
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
  const logoUrl = agent.logo ? `${CDN_PREFIX}${agent.logo}` : undefined;

  console.log("agentIdFromQuery", agentIdFromQuery);
  console.log("agentName", agentName);

  if (!agent) {
    notFound();
  }

  return (
    <div>
      <AgentHeader agent={agent} logoUrl={logoUrl} />

      <Shell className="mt-20">
        <section className="grid md:grid-cols-[736px,1fr] md:gap-8">
          <div>
            <Breadcrumbs
              className="mb-6"
              segments={[
                { title: "Home", href: "/" },
                { title: "Agents", href: "/agents" },
                { title: agent.name, href: "#" },
              ]}
            />

            <AgentInfo agent={agent} />
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
        </section>
      </Shell>
    </div>
  );
}
