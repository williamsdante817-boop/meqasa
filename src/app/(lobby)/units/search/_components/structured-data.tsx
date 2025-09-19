import { siteConfig } from "@/config/site";
import type { DeveloperUnit, SearchParams } from "./types";

interface StructuredDataProps {
  units: DeveloperUnit[];
  searchParams: SearchParams;
  address?: string;
}

export function StructuredData({
  units,
  searchParams,
  address,
}: StructuredDataProps) {
  const terms = searchParams.terms || "sale";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Developer Units for ${terms} in ${address || "Ghana"}`,
    description: `Search results for newly built developer units available for ${terms} in ${address || "Ghana"}`,
    url: `${siteConfig.url}/units/search?${new URLSearchParams(searchParams as Record<string, string>).toString()}`,
    numberOfItems: units.length,
    itemListElement: units.map((unit, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "RealEstateListing",
        "@id": `${siteConfig.url}/developer-unit/${unit.unitid || unit.id}`,
        name: unit.title || `Developer unit for ${terms}`,
        description:
          unit.description ||
          `Developer unit available for ${terms} in ${address || "Ghana"}`,
        url: `${siteConfig.url}/developer-unit/${unit.unitid || unit.id}`,
        image: unit.coverphoto
          ? `https://meqasa.com/uploads/imgs/${unit.coverphoto}`
          : unit.image || undefined,
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          price: unit.price?.toString() || "Contact for price",
          priceCurrency: "GHS",
          seller: {
            "@type": "Organization",
            name: unit.developer || unit.companyname || "Developer",
          },
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: unit.city || address || "Ghana",
          addressRegion: "Greater Accra",
          addressCountry: "Ghana",
        },
        floorSize: unit.floorarea
          ? {
              "@type": "QuantitativeValue",
              value: unit.floorarea,
              unitCode: "SQM",
            }
          : undefined,
        numberOfRooms: unit.bedrooms || unit.beds || undefined,
        numberOfBathroomsTotal: unit.bathrooms || unit.baths || undefined,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
