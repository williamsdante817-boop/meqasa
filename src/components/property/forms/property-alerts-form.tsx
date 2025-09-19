"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PropertyAlertsForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing with email:", email);
    // Reset form or show success message
    setEmail(""); // Reset the email input after submission
  };

  return (
    <section
      className="w-full border-t bg-white py-6"
      aria-labelledby="property-alerts-heading"
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="space-y-1">
            <h2
              id="property-alerts-heading"
              className="text-brand-accent text-xl font-semibold"
            >
              Get Property Alerts from meQasa
            </h2>
            <p className="text-brand-muted text-sm">
              Stay up to date with the latest properties, news, and articles.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center gap-2 md:w-auto"
            aria-label="Subscribe to property alerts"
          >
            <label htmlFor="email-input" className="sr-only">
              Email address
            </label>
            <Input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kwame007@meqasa.com"
              className="h-10 min-w-0 flex-1 rounded-md !border md:min-w-[300px]"
              required
              aria-required="true"
            />
            <Button
              variant={"default"}
              type="submit"
              className="bg-[#f93a5d] text-white hover:bg-[#f93a5d]/80"
              aria-label="Subscribe to property alerts"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
