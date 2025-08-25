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
      className="w-full bg-white border-t py-6"
      aria-labelledby="property-alerts-heading"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h2
              id="property-alerts-heading"
              className="text-xl font-semibold text-brand-accent"
            >
              Get Property Alerts from meQasa
            </h2>
            <p className="text-brand-muted text-sm">
              Stay up to date with the latest properties, news, and articles.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex w-full md:w-auto gap-2 items-center"
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
              className="flex-1 min-w-0 !border md:min-w-[300px] h-10 rounded-md"
              required
              aria-required="true"
            />
            <Button
              variant={"default"}
              type="submit"
              className="bg-[#f93a5d] hover:bg-[#f93a5d]/80 text-white"
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
