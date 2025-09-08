import { MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo } from "react";

interface DistanceIndicatorProps {
  distance: string | number;
  travelTime?: number;
  unit?: "km" | "mi" | "m";
  className?: string;
  showTravelTime?: boolean;
  variant?: "default" | "compact" | "detailed";
}

function DistanceIndicatorComponent({
  distance,
  travelTime,
  unit = "km",
  className,
  showTravelTime = false,
  variant = "default",
}: DistanceIndicatorProps) {
  // Format the distance properly
  const formatDistance = (dist: string | number): string => {
    if (typeof dist === "string") return dist;

    if (unit === "m") {
      return dist >= 1000
        ? `${(dist / 1000).toFixed(1)}km`
        : `${Math.round(dist)}m`;
    }

    return typeof dist === "number" ? dist.toFixed(1) : dist;
  };

  const formattedDistance = formatDistance(distance);

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center gap-1 text-brand-blue font-medium text-xs",
          className
        )}
      >
        <MapPin className="w-3 h-3" aria-hidden="true" />
        <span>
          {formattedDistance}
          {unit !== "m" ? unit : ""}
        </span>
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <div className={cn("space-y-1", className)}>
        <div className="flex items-center gap-2 text-brand-blue font-medium text-sm">
          <MapPin className="w-4 h-4" aria-hidden="true" />
          <span>
            {formattedDistance}
            {unit !== "m" ? unit : ""} away
          </span>
        </div>
        {showTravelTime && travelTime && (
          <div className="flex items-center gap-2 text-brand-muted text-xs">
            <Clock className="w-3 h-3" aria-hidden="true" />
            <span>{travelTime} min</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 text-brand-blue font-medium text-sm transition-all duration-200",
        "group-hover:text-brand-accent",
        className
      )}
    >
      <MapPin
        className="w-4 h-4 transition-transform group-hover:scale-110"
        aria-hidden="true"
      />
      <div className="flex flex-col">
        <span>
          {formattedDistance}
          {unit !== "m" ? unit : ""}
        </span>
        {showTravelTime && travelTime && (
          <div className="flex items-center gap-1 text-brand-muted text-xs">
            <Clock className="w-3 h-3" aria-hidden="true" />
            <span>{travelTime}min</span>
          </div>
        )}
      </div>
    </div>
  );
}

const DistanceIndicator = memo(DistanceIndicatorComponent);
DistanceIndicator.displayName = "DistanceIndicator";

export default DistanceIndicator;
