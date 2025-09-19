"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FAQItem {
  question: string;
  answer: string;
  highlights?: string[];
}

interface AgentsFAQProps {
  className?: string;
}

export function AgentsFAQ({ className = "" }: AgentsFAQProps) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0]));

  const toggleItem = (index: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const faqItems: FAQItem[] = [
    {
      question: "Why do I need an Agent?",
      answer: "Agents provide valuable expertise and services:",
      highlights: [
        "Agents are connected to professional networks and numerous list of properties.",
        "Agents are experienced with detailed information about Geographical areas, their culture and other personal neighbourhood information not gotten from the internet.",
        "Agents are real marketers and salespersons to offer. They offer credible sources of information to get your listing or provide you with the right source of buyers or sellers.",
      ],
    },
    {
      question: "Why do some Agents Charge Registration fees?",
      answer: "Registration fees serve multiple purposes:",
      highlights: [
        "Agent Commitment fee: Most Agents or Brokers charge commitment fees to enable them to see how serious clients are and also to bind them to the buyer or the seller. This makes both parties committed and also prevent the buyer or seller from contacting other Realtor or Agent.",
        "Agent Transport Fee: Sometimes these fees are termed as Transport fees to enable them to roam with you the buyer or potential tenant to the various property locations.",
        "Agent Consultation Fee: Some elite or professional agents term these charge are Consultation fee.",
      ],
    },
    {
      question:
        "What are the qualities of a great Agent, Realtor or Associate Broker?",
      answer: "Key qualities to look for in a professional agent:",
      highlights: [
        "Knowledge of the Locality: Most great Agents are profoundly knowledgeable about the neighborhoods and vicinity you're...",
      ],
    },
  ];

  return (
    <Card className={`border border-gray-200 bg-gray-50 p-6 ${className}`}>
      <h2 className="mb-6 text-lg font-medium text-gray-900">
        Agents Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
          >
            <button
              onClick={() => toggleItem(index)}
              className="group flex w-full cursor-pointer items-center justify-between text-left focus:outline-none"
            >
              <h3 className="font-medium text-gray-900 transition-colors group-hover:text-blue-600">
                {item.question}
              </h3>
              {expandedItems.has(index) ? (
                <ChevronUp className="h-4 w-4 text-gray-500 transition-colors group-hover:text-blue-600" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500 transition-colors group-hover:text-blue-600" />
              )}
            </button>

            {expandedItems.has(index) && (
              <div className="mt-3 space-y-3 text-sm text-gray-600">
                <p>{item.answer}</p>
                {item.highlights && (
                  <ul className="space-y-2">
                    {item.highlights.map((highlight, highlightIndex) => (
                      <li
                        key={highlightIndex}
                        className="flex items-start gap-2"
                      >
                        <span className="mt-1 text-xs text-blue-600">
                          {highlightIndex + 1}.
                        </span>
                        <span className="leading-relaxed">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
