import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { TrendingUp, Eye, Flame } from "lucide-react";

interface TrendingPropertyCardProps {
  /** Property type to determine the contact text */
  propertyType: "listing" | "developer-unit";
  /** Owner type for listings (Agent, Owner, etc.) */
  ownerType?: string;
  /** View count or listing count to display */
  count: number;
  /** Minimum threshold to show the card */
  threshold?: number;
}

/**
 * Reusable trending property card that adapts messaging based on property and owner type
 */
export default function TrendingPropertyCard({
  propertyType,
  ownerType,
  count,
  threshold = 5,
}: TrendingPropertyCardProps) {
  // Don't show the card if count doesn't meet threshold
  if (count < threshold) {
    return null;
  }

  // Check if this is a truly trending property (500+ views)
  const isTrending = count >= 500;

  // Determine the appropriate contact text based on property and owner type
  const getContactText = (): string => {
    if (propertyType === "developer-unit") {
      return isTrending ? "Contact developer before it's gone!" : "Contact developer for more details";
    }
    
    // For listings, check owner type
    if (ownerType === "Agent") {
      return isTrending ? "Contact agent before it's gone!" : "Contact agent for more details";
    } else if (ownerType === "Owner") {
      return isTrending ? "Contact owner before it's gone!" : "Contact owner for more details";
    }
    
    // Default fallback
    return isTrending ? "Contact agent before it's gone!" : "Contact agent for more details";
  };

  // Determine the count label based on property type and owner type
  const getCountLabel = (): string => {
    if (propertyType === "developer-unit") {
      return "views";
    }
    
    // For listings, determine if it's views or listings count
    if (ownerType === "Agent") {
      return "listings"; // Agent listings count
    } else if (ownerType === "Owner") {
      return "views"; // Owner property views
    }
    
    return "views"; // Default
  };

  return (
    <aside className="mb-6">
      <Card className="relative overflow-hidden border-l-3 border-l-orange-500 bg-gradient-to-r rounded-lg from-orange-50 to-amber-50 p-4 md:p-6">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            {isTrending ? (
              <Flame className="h-6 w-6" />
            ) : (
              <TrendingUp className="h-6 w-6" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {isTrending ? (
                <>
                  <Badge
                    variant="warning"
                    className="text-xs font-semibold flex-shrink-0 flex items-center gap-1"
                  >
                    <Flame className="h-3 w-3" />
                    TRENDING
                  </Badge>
                  <span className="text-xs text-orange-600 font-medium">
                    High Interest Property
                  </span>
                </>
              ) : (
                <Badge
                  variant="secondary"
                  className="text-xs font-semibold flex-shrink-0 flex items-center gap-1"
                >
                  <TrendingUp className="h-3 w-3" />
                  POPULAR
                </Badge>
              )}
            </div>
            <h3 className="text-brand-accent font-semibold text-base md:text-lg mb-2 leading-tight">
              {isTrending ? "This property is in high demand" : "This property is gaining interest"}
            </h3>
            <div className="flex items-center gap-2 text-sm md:text-base flex-wrap">
              <span className="font-medium text-brand-accent flex-shrink-0">
                {`${formatNumber(count, { notation: "compact" })} ${getCountLabel()}`}
              </span>
              <span className="text-brand-muted">•</span>
              <span className="text-orange-600 font-medium">
                {getContactText()}
              </span>
            </div>
          </div>
        </div>
        {/* Subtle background pattern */}
        <div className="absolute top-2 right-2 opacity-5">
          {isTrending ? (
            <Flame className="h-16 w-16 md:h-20 md:w-20 text-orange-500" />
          ) : (
            <TrendingUp className="h-16 w-16 md:h-20 md:w-20 text-orange-500" />
          )}
        </div>
      </Card>
    </aside>
  );
}