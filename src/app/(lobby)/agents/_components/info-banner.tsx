import React from "react";

export default function InfoBanner() {
  return (
    <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
      <h2 className="text-brand-accent mb-3 text-xl font-bold">
        Real Estate Agents and Brokers on meQasa
      </h2>
      <p className="text-brand-muted mb-4">
        We work with a growing list of professional agents to offer you
        fantastic property options so you can{" "}
        <span className="font-medium text-blue-600">find that dream home</span>.
        We also assist our{" "}
        <span className="font-medium text-blue-600">agents</span> in their
        profession with valuable{" "}
        <span className="font-medium text-blue-600">insights and tips</span>.
      </p>
      <a href="#" className="font-medium text-blue-600 hover:underline">
        Join the real estate professionals on meQasa
      </a>
    </div>
  );
}
