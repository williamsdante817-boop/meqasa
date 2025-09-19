import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { MetadataGeneratorParams } from "./types";

// Centralized metadata generation utilities
export function generateSearchMetadata(
  params: MetadataGeneratorParams
): Metadata {
  const terms = Array.isArray(params.terms)
    ? params.terms[0]
    : params.terms || "sale";
  const unittype = Array.isArray(params.unittype)
    ? params.unittype[0]
    : params.unittype;
  const address = Array.isArray(params.address)
    ? params.address[0]
    : params.address;

  // Build dynamic title
  let title = "Developer Units";
  if (unittype && unittype !== "all") {
    const typeMap: Record<string, string> = {
      apartment: "Apartments",
      house: "Houses",
      townhouse: "Townhouses",
      villa: "Villas",
      "studio apartment": "Studio Apartments",
      "penthouse apartment": "Penthouse Apartments",
    };
    title = typeMap[unittype] || `${unittype}s`;
  }

  const termsDisplay =
    terms === "rent"
      ? "for Rent"
      : terms === "sale"
        ? "for Sale"
        : "for Preselling";
  title += ` ${termsDisplay}`;

  if (address) {
    title += ` in ${address}`;
  }

  title += " - Developer Units | MeQasa";

  const description = `Find newly built ${unittype || "units"} ${termsDisplay.toLowerCase()} ${address ? `in ${address}` : "in Ghana"}. Browse verified developer properties with modern amenities and competitive prices.`;

  const keywords = [
    "developer units",
    "newly built properties",
    `${unittype || "properties"} ${termsDisplay.toLowerCase()}`,
    address ? `${address} properties` : "Ghana properties",
    "new development units",
    "MeQasa developer properties",
  ];

  // Generate canonical URL with search params
  const searchParams = new URLSearchParams();
  if (terms) searchParams.set("terms", terms);
  if (unittype && unittype !== "all") searchParams.set("unittype", unittype);
  if (address) searchParams.set("address", address);

  const canonicalUrl = `/units/search${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  return {
    title,
    description,
    keywords,
    authors: [{ name: "MeQasa" }],
    creator: "MeQasa",
    publisher: "MeQasa",
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonicalUrl,
      siteName: siteConfig.name,
      title,
      description,
      images: [
        {
          url: `${siteConfig.url}/og-units-search.jpg`,
          width: 1200,
          height: 630,
          alt: "Developer Units Search - MeQasa",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@meqasa",
      creator: "@meqasa",
      title,
      description,
      images: [`${siteConfig.url}/og-units-search.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generatePageTitle(
  params: Record<string, string | string[] | undefined>
): string {
  const terms = params.terms || "sale";
  const unittype = params.unittype;
  const address = params.address;

  let title = "Developer Units";

  if (unittype && unittype !== "all") {
    const typeMap: Record<string, string> = {
      apartment: "Apartments",
      house: "Houses",
      townhouse: "Townhouses",
      villa: "Villas",
      "studio apartment": "Studio Apartments",
      "penthouse apartment": "Penthouse Apartments",
    };
    const unitTypeStr = Array.isArray(unittype) ? unittype[0] : unittype;
    title = typeMap[unitTypeStr!] || `${String(unitTypeStr)}s`;
  }

  const termsDisplay =
    terms === "rent"
      ? "for Rent"
      : terms === "sale"
        ? "for Sale"
        : "for Preselling";
  title += ` ${termsDisplay}`;

  if (address) {
    const addressStr = Array.isArray(address) ? address[0] : address;
    title += ` in ${String(addressStr)}`;
  }

  return title;
}

export function generateSubtitle(
  params: Record<string, string | string[] | undefined>,
  resultCount: number,
  totalCount?: number
): string {
  const beds = params.beds;
  const baths = params.baths;
  const maxprice = params.maxprice;
  const unittype = params.unittype;
  const address = params.address;

  // Show format: "showing X out of Y units" if we have total count, otherwise "showing X results"
  let subtitle;
  if (totalCount && totalCount > resultCount) {
    subtitle = `showing ${resultCount} out of ${totalCount} ${totalCount === 1 ? "unit" : "units"}`;
  } else {
    subtitle = `showing ${resultCount} ${resultCount === 1 ? "result" : "results"}`;
  }

  // Add location if specified
  if (address) {
    const addressStr = Array.isArray(address) ? address[0] : address;
    if (addressStr?.trim()) {
      subtitle += ` • in ${String(addressStr)}`;
    }
  }

  // Add unit type if not 'all' or 'apartment' (since apartment is default)
  if (unittype && unittype !== "all" && unittype !== "apartment") {
    const typeMap: Record<string, string> = {
      house: "Houses",
      "detached house": "Detached Houses",
      "semi-detached house": "Semi-Detached Houses",
      townhouse: "Townhouses",
      "studio apartment": "Studio Apartments",
      "penthouse apartment": "Penthouse Apartments",
      villa: "Villas",
      condominium: "Condominiums",
      "terrace house": "Terrace Houses",
    };
    const unitTypeStr = Array.isArray(unittype) ? unittype[0] : unittype;
    const displayType = typeMap[unitTypeStr!] || String(unitTypeStr);
    subtitle += ` • ${displayType}`;
  }

  // Add bedrooms if specified
  if (beds && beds !== "0") {
    const bedsStr = Array.isArray(beds) ? beds[0] : beds;
    subtitle += ` • ${String(bedsStr)}+ bedroom${Number(bedsStr) > 1 ? "s" : ""}`;
  }

  // Add bathrooms if specified
  if (baths && baths !== "0") {
    const bathsStr = Array.isArray(baths) ? baths[0] : baths;
    subtitle += ` • ${String(bathsStr)}+ bathroom${Number(bathsStr) > 1 ? "s" : ""}`;
  }

  // Add max price if specified
  if (maxprice && maxprice !== "all") {
    const priceNum = Number(maxprice);
    if (!isNaN(priceNum) && priceNum > 0) {
      subtitle += ` • up to GH₵${priceNum.toLocaleString()}`;
    }
  }

  return subtitle;
}
