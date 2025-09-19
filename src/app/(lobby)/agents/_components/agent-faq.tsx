import React from "react";

export default function AgentFaq() {
  return (
    <div className="mb-6 rounded-lg bg-gray-50 p-6">
      <h2 className="text-brand-accent mb-8 text-xl font-bold">
        Agents Frequently Asked Questions
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-brand-accent mb-3 font-semibold">
            Why do I need an Agent?
          </h3>
          <ol className="text-brand-accent space-y-2">
            <li className="text-brand-muted">
              1.{" "}
              <span className="text-blue-600">
                Agents are connected to professional
              </span>{" "}
              networks and numerous list of properties.
            </li>
            <li className="text-brand-muted">
              2. Agents are experienced with detailed information about
              Geographical areas, their culture and other personal neighbourhood
              information not gotten from the internet.
            </li>
            <li className="text-brand-muted">
              3. Agents are marketers and salespersons. They have credible
              sources of information to get your listing or provide you with the
              right source of buyers or sellers.
            </li>
          </ol>
        </div>

        <div>
          <h3 className="text-brand-accent mb-3 font-semibold">
            Why do some Agents Charge Registration fees?
          </h3>
          <ol className="text-brand-accent space-y-2">
            <li className="text-brand-muted">
              1. <strong>Agent Commitment fee:</strong> Most Agents or Brokers
              charge commitment fees to enable them to see how serious clients
              are and also to bind them to the buyer or the seller. This makes
              both parties committed and also prevent the buyer or seller from
              contacting other Realtor or Agent.
            </li>
            <li className="text-brand-muted">
              2. <strong>Agent Transport Fee:</strong> Sometimes these fees are
              termed as Transport fees to enable them to roam with you the buyer
              or potential tenant to the various property locations.
            </li>
            <li className="text-brand-muted">
              3. <strong>Agent Consultation Fee:</strong> Some elite or
              professional agents term these charge are Consultation fee.
            </li>
          </ol>
        </div>

        <div>
          <h3 className="text-brand-accent mb-3 font-semibold">
            What are the qualities of a great Agent, Realtor or Associate
            Broker?
          </h3>
          <ol className="text-brand-accent space-y-2">
            <li className="text-brand-muted">
              1. <strong>Knowledge of the Locality:</strong>{" "}
              <span className="text-blue-600">
                Most great Agents are profoundly knowledgeable
              </span>{" "}
              about the neighborhoods and vicinity with experience in customer
              service and Geographical locations.
            </li>
            <li className="text-brand-muted">
              2. <strong>Attention to Detailed Information:</strong> A great
              Agent also has the patience to listen to clients needs and takes
              notes of information to arrive at the perfect suitable property
              for a client. Read more Agent Qualities from the above link.
            </li>
          </ol>
        </div>

        <div>
          <h3 className="text-brand-accent mb-3 font-semibold">
            What is an Agent average salary
          </h3>
          <p className="text-brand-accent">
            1. <span className="text-blue-600">According to 1salary.com</span>,
            the median annual Agent salary is $40,140,
          </p>
        </div>
      </div>
    </div>
  );
}
