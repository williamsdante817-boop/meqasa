import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tag, ExternalLink } from "lucide-react";
import Link from "next/link";

interface PropertyContextCardProps {
  /** Property type to determine the context display */
  propertyType: "listing" | "developer-unit";
  /** Owner type for listings (Agent, Owner, etc.) */
  ownerType?: string;
  /** Owner/Developer name */
  ownerName: string;
  /** Property contract type (rent/sale) */
  contract: string;
  /** Property type (apartment, house, etc.) */
  type: string;
  /** Property location */
  location: string;
  /** Additional data for listings */
  listingData?: {
    parenttext?: string;
    categorytext?: string;
  };
  /** Additional data for developer units */
  developerData?: {
    companyName: string;
    developerHref: string;
    similarSearchHref: string;
    unitTypeName?: string;
    city: string;
  };
}

/**
 * Reusable property context card that shows relevant information and links based on property and owner type
 */
export default function PropertyContextCard({
  propertyType,
  ownerType,
  ownerName,
  contract,
  type,
  location,
  listingData,
  developerData,
}: PropertyContextCardProps) {
  // Determine badge text based on property and owner type
  const getBadgeText = (): string => {
    if (propertyType === "developer-unit") {
      return "DEVELOPER PROJECT";
    }

    if (ownerType === "Agent") {
      return "CATEGORIES";
    } else if (ownerType === "Owner") {
      return "OWNER-DIRECT";
    }

    return "PROJECT";
  };

  // Render content based on property and owner type
  const renderContent = () => {
    if (propertyType === "developer-unit" && developerData) {
      return (
        <div className="space-y-2">
          <Link
            href={developerData.developerHref}
            className="group flex items-center gap-2 text-sm text-blue-600 transition-colors hover:text-blue-700 hover:underline"
          >
            <span className="font-medium">
              View all projects by {developerData.companyName}
            </span>
            <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
          <Link
            href={developerData.similarSearchHref}
            className="group flex items-center gap-2 text-sm text-blue-600 transition-colors hover:text-blue-700 hover:underline"
          >
            <span className="font-medium">
              Similar {developerData.unitTypeName?.toLowerCase()}s in{" "}
              {developerData.city}
            </span>
            <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </div>
      );
    }

    // Agent listings
    if (ownerType === "Agent" && listingData) {
      return (
        <div className="space-y-2">
          <Link
            href={`/search/${contract.toLowerCase()}?q=ghana&ftype=${type.toLowerCase()}&page=1`}
            className="group flex items-center gap-2 text-sm text-blue-600 transition-colors hover:text-blue-700 hover:underline"
            key={listingData.parenttext}
          >
            <span className="font-medium">{listingData.parenttext}</span>
            <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
          <Link
            href={`/search/${contract.toLowerCase()}?q=${location.toLowerCase()}&ftype=${type.toLowerCase()}&page=1`}
            className="group flex items-center gap-2 text-sm text-blue-600 transition-colors hover:text-blue-700 hover:underline"
            key={listingData.categorytext}
          >
            <span className="font-medium">{listingData.categorytext}</span>
            <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </div>
      );
    }

    // Owner-direct listings
    if (ownerType === "Owner") {
      return (
        <div className="space-y-2">
          <div className="flex flex-col gap-1">
            <span className="text-brand-muted text-xs">
              Direct negotiation • Authentic information
            </span>
          </div>
          <Link
            href={`/search/${contract.toLowerCase()}?ffsbo=1&q=${location.toLowerCase()}&ftype=${type.toLowerCase()}&page=1`}
            className="group flex items-center gap-2 text-sm text-blue-600 transition-colors hover:text-blue-700 hover:underline"
          >
            <span className="font-medium">
              More owner-direct {type.toLowerCase()}s in {location}
            </span>
            <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        </div>
      );
    }

    // Other/Project type (fallback)
    return (
      <div className="space-y-2">
        <h3 className="text-brand-accent text-base font-semibold">
          Part of {ownerName} Development
        </h3>
        <Link
          href={`/search/${contract.toLowerCase()}?q=${location.toLowerCase()}&ftype=${type.toLowerCase()}&page=1`}
          className="group flex items-center gap-2 text-sm text-blue-600 transition-colors hover:text-blue-700 hover:underline"
        >
          <span className="font-medium">More properties in this area</span>
          <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
      </div>
    );
  };

  return (
    <aside className="mb-6">
      <Card className="rounded-lg border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Tag className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="info" className="text-xs font-semibold">
                {getBadgeText()}
              </Badge>
            </div>
            {renderContent()}
          </div>
        </div>
      </Card>
    </aside>
  );
}
