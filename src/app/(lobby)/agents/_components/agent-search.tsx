import SearchInput from "@/components/search-input";
import React from "react";

export default function AgentSearch({
  agents,
}: {
  agents: { name: string }[];
}) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-brand-accent mb-4">Find an Agent</h1>
      <SearchInput
        data={agents.map((agent) => ({
          developerid: agent.name.toLowerCase().replace(/\s+/g, "-"),
          name: agent.name,
        }))}
        path="/agents"
      />
    </div>
  );
}
