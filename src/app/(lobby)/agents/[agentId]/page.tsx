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
}

export default async function AgentDetailsPage({
  params,
}: AgentDetailsPageProps) {
  const { agentId } = await params;
  const agent = await getAgentDetails(1071249313, agentId);
  const CDN_PREFIX = "https://dve7rykno93gs.cloudfront.net";
  const logoUrl = agent.logo ? `${CDN_PREFIX}${agent.logo}` : undefined;

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
            <ContactCard name={agent.name} image={agent.logo || ""} />
          </aside>
        </section>
      </Shell>
    </div>
  );
}
