import { memo, useCallback } from "react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Establishment {
  id: string;
  name: string;
  address: string;
  distance: number; // in meters
  travelTime?: number; // in minutes
  type: "school" | "bank" | "hospital" | "supermarket" | "airport";
  rating?: number;
  phone?: string;
  website?: string;
  openNow?: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface EstablishmentItemProps {
  establishment: Establishment;
  className?: string;
  onSelect?: (establishment: Establishment) => void;
  showDetails?: boolean;
  variant?: "compact" | "detailed";
}

const ESTABLISHMENT_TYPES = {
  school: {
    label: "School",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  bank: {
    label: "Bank",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  hospital: {
    label: "Hospital",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  supermarket: {
    label: "Supermarket",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
  airport: {
    label: "Airport",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
} as const;

function EstablishmentItemComponent({
  establishment,
  className,
  onSelect,
  showDetails = false,
  variant = "compact",
}: EstablishmentItemProps) {
  const typeConfig = ESTABLISHMENT_TYPES[establishment.type];

  const handleClick = useCallback(() => {
    onSelect?.(establishment);
  }, [onSelect, establishment]);

  const formatDistance = (distance: number): string => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)}km`;
    }
    return `${Math.round(distance)}m`;
  };

  const handleExternalLink = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (establishment.website) {
        window.open(establishment.website, "_blank", "noopener,noreferrer");
      }
    },
    [establishment.website]
  );

  if (variant === "compact") {
    return (
      <Button
        variant="ghost"
        className={cn(
          "hover:bg-brand-primary/5 focus-visible:ring-brand-blue h-auto w-full justify-start p-4 transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none",
          className
        )}
        onClick={handleClick}
        aria-label={`${establishment.name}, ${formatDistance(establishment.distance)} away`}
      >
        <div className="flex w-full items-center justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn("px-2 py-0.5 text-xs", typeConfig.color)}
              >
                {typeConfig.label}
              </Badge>
              {establishment.openNow === true && (
                <Badge
                  variant="outline"
                  className="border-green-300 text-xs text-green-600"
                >
                  Open
                </Badge>
              )}
              {establishment.openNow === false && (
                <Badge
                  variant="outline"
                  className="border-red-300 text-xs text-red-600"
                >
                  Closed
                </Badge>
              )}
            </div>
            <h4 className="text-brand-accent mb-1 truncate text-left font-semibold">
              {establishment.name}
            </h4>
            <p className="text-brand-muted truncate text-left text-sm">
              {establishment.address}
            </p>
          </div>
          <div className="ml-4 flex flex-shrink-0 flex-col items-end gap-1">
            <div className="text-brand-blue flex items-center gap-1 text-sm font-medium">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              <span>{formatDistance(establishment.distance)}</span>
            </div>
            {establishment.travelTime && (
              <div className="text-brand-muted flex items-center gap-1 text-xs">
                <Clock className="h-3 w-3" aria-hidden="true" />
                <span>{establishment.travelTime}min</span>
              </div>
            )}
            {establishment.rating && (
              <div className="flex items-center gap-1 text-xs text-amber-600">
                <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                <span>{establishment.rating}</span>
              </div>
            )}
          </div>
        </div>
      </Button>
    );
  }

  return (
    <CardContent className={cn("p-6", className)}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn("text-xs", typeConfig.color)}
              >
                {typeConfig.label}
              </Badge>
              {establishment.openNow !== undefined && (
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    establishment.openNow
                      ? "border-green-300 text-green-600"
                      : "border-red-300 text-red-600"
                  )}
                >
                  {establishment.openNow ? "Open" : "Closed"}
                </Badge>
              )}
            </div>
            <h3 className="text-brand-accent mb-1 text-lg font-semibold">
              {establishment.name}
            </h3>
            <p className="text-brand-muted mb-2">{establishment.address}</p>
          </div>
          {establishment.website && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExternalLink}
              className="ml-4 flex-shrink-0"
              aria-label={`Visit ${establishment.name} website`}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-6 text-sm">
          <div className="text-brand-blue flex items-center gap-2">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span className="font-medium">
              {formatDistance(establishment.distance)} away
            </span>
          </div>
          {establishment.travelTime && (
            <div className="text-brand-muted flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden="true" />
              <span>{establishment.travelTime} min drive</span>
            </div>
          )}
          {establishment.rating && (
            <div className="flex items-center gap-2 text-amber-600">
              <Star className="h-4 w-4 fill-current" aria-hidden="true" />
              <span>{establishment.rating}/5</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {showDetails && (
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClick}
              className="flex-1"
            >
              View Details
            </Button>
            {establishment.phone && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`tel:${establishment.phone}`, "_self");
                }}
                aria-label={`Call ${establishment.name}`}
              >
                Call
              </Button>
            )}
          </div>
        )}
      </div>
    </CardContent>
  );
}

const EstablishmentItem = memo(EstablishmentItemComponent);
EstablishmentItem.displayName = "EstablishmentItem";

export default EstablishmentItem;
