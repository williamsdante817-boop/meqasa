"use client";

import { Shield } from "lucide-react";

import { Card } from "./ui/card";

const safetyTips = [
  "Do not make any inspection fee without seeing the agent and property.",
  "Only pay rental fees, sales fees, or any upfront payment after you verify the landlord.",
  "Ensure you meet the agent in an open location.",
  "The agent does not represent Meqasa, and Meqasa is not liable for any monetary transaction between you and the agent.",
];
/**
 * A component that renders a card containing safety tips.
 *
 * This component displays a list of safety tips aimed at guiding users on how to safely interact
 * with agents and landlords. It includes a header with a title and an icon, followed by a list
 * of tips presented in a styled card.
 *
 * @returns {JSX.Element} A section element containing safety tips in a styled card.
 */

export default function SafetyTipsCard() {
  return (
    <section className="md:mt-20" aria-labelledby="safety-tips-heading">
      <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 md:p-5 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="mb-3">
              <h2
                id="safety-tips-heading"
                className="text-base font-semibold text-brand-accent lg:text-lg"
              >
                Safety Tips
              </h2>
            </div>
            <div className="space-y-3">
              {safetyTips.map((tip, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 mt-0.5">
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-sm text-brand-accent leading-relaxed">
                    {tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Subtle background pattern */}
        <div className="absolute bottom-2 right-2 opacity-5">
          <Shield className="h-16 w-16 text-amber-500" />
        </div>
      </Card>
    </section>
  );
}
