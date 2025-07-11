import { getAllAgents } from "@/lib/get-all-agents";

import Shell from "@/layouts/shell";
import { AgentCard } from "./_components/agent-card";
import AgentFaq from "./_components/agent-faq";
import AgentSearch from "./_components/agent-search";
import InfoBanner from "./_components/info-banner";
import { Breadcrumbs } from "@/components/bread-crumbs";

export default async function AgentsPage() {
  const { list: agents } = await getAllAgents();
  console.log("Agents Data:", agents);

  return (
    <Shell>
      <div className="mt-6 grid gap-8 px-3 transition-all duration-300 ease-in md:container md:grid-cols-[736px,1fr] md:p-0">
        <div>
          <Breadcrumbs
            className="mb-6"
            segments={[
              { title: "Home", href: "/" },
              { title: "Agents", href: "#" },
            ]}
          />
          <AgentSearch agents={agents} />
          <InfoBanner />
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-brand-accent mb-6">
              Featured Agents
            </h2>
            <div className="flex flex-col gap-8">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.name}
                  id={agent.name}
                  name={agent.name}
                  logo={agent.logo}
                  location={agent.locality}
                  listings={agent.listings}
                  description={agent.about}
                  isVerified={agent.verified === "1"}
                  socials={agent.socials}
                  website={agent.company}
                />
              ))}
            </div>
          </section>
        </div>
        <AgentFaq />
      </div>
    </Shell>
  );
}
