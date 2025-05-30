import React from "react";

export default function InfoBanner() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-brand-accent mb-3">
        Real Estate Agents and Brokers on meQasa
      </h2>
      <p className="text-brand-muted mb-4">
        We work with a growing list of professional agents to offer you
        fantastic property options so you can{" "}
        <span className="text-blue-600 font-medium">find that dream home</span>.
        We also assist our{" "}
        <span className="text-blue-600 font-medium">agents</span> in their
        profession with valuable{" "}
        <span className="text-blue-600 font-medium">insights and tips</span>.
      </p>
      <a href="#" className="text-blue-600 font-medium hover:underline">
        Join the real estate professionals on meQasa
      </a>
    </div>
  );
}
