import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const cities = {
  Accra: "https://example.com/accra",
  "East Legon": "https://example.com/kumasi",
  Takoradi: "https://example.com/takoradi",
  Kumasi: "https://example.com/tamale",
  Kasoa: "https://example.com/tamale",
  Tamale: "https://example.com/tamale",
};

export default function QuickLinks() {
  return (
    <div className="flex flex-wrap gap-2 pt-3">
      {Object.entries(cities).map(([city, url]) => (
        <Link key={city} href={url} className="no-underline">
          <Badge className="bg-accent-foreground cursor-pointer">{city}</Badge>
        </Link>
      ))}
    </div>
  );
}
