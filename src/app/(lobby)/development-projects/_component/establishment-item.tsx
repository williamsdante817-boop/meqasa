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
  type: 'school' | 'bank' | 'hospital' | 'supermarket' | 'airport';
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
  variant?: 'compact' | 'detailed';
}

const ESTABLISHMENT_TYPES = {
  school: { label: 'School', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  bank: { label: 'Bank', color: 'bg-green-100 text-green-700 border-green-200' },
  hospital: { label: 'Hospital', color: 'bg-red-100 text-red-700 border-red-200' },
  supermarket: { label: 'Supermarket', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  airport: { label: 'Airport', color: 'bg-purple-100 text-purple-700 border-purple-200' },
} as const;

function EstablishmentItemComponent({
  establishment,
  className,
  onSelect,
  showDetails = false,
  variant = 'compact'
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
  
  const handleExternalLink = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (establishment.website) {
      window.open(establishment.website, '_blank', 'noopener,noreferrer');
    }
  }, [establishment.website]);
  
  if (variant === 'compact') {
    return (
      <Button
        variant="ghost"
        className={cn(
          "w-full h-auto p-4 justify-start hover:bg-brand-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue transition-all duration-200",
          className
        )}
        onClick={handleClick}
        aria-label={`${establishment.name}, ${formatDistance(establishment.distance)} away`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className={cn("text-xs px-2 py-0.5", typeConfig.color)}>
                {typeConfig.label}
              </Badge>
              {establishment.openNow === true && (
                <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                  Open
                </Badge>
              )}
              {establishment.openNow === false && (
                <Badge variant="outline" className="text-xs text-red-600 border-red-300">
                  Closed
                </Badge>
              )}
            </div>
            <h4 className="font-semibold text-brand-accent text-left truncate mb-1">
              {establishment.name}
            </h4>
            <p className="text-sm text-brand-muted text-left truncate">
              {establishment.address}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 ml-4 flex-shrink-0">
            <div className="flex items-center gap-1 text-brand-blue font-medium text-sm">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              <span>{formatDistance(establishment.distance)}</span>
            </div>
            {establishment.travelTime && (
              <div className="flex items-center gap-1 text-brand-muted text-xs">
                <Clock className="w-3 h-3" aria-hidden="true" />
                <span>{establishment.travelTime}min</span>
              </div>
            )}
            {establishment.rating && (
              <div className="flex items-center gap-1 text-amber-600 text-xs">
                <Star className="w-3 h-3 fill-current" aria-hidden="true" />
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
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className={cn("text-xs", typeConfig.color)}>
                {typeConfig.label}
              </Badge>
              {establishment.openNow !== undefined && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs",
                    establishment.openNow 
                      ? "text-green-600 border-green-300" 
                      : "text-red-600 border-red-300"
                  )}
                >
                  {establishment.openNow ? 'Open' : 'Closed'}
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold text-brand-accent mb-1">
              {establishment.name}
            </h3>
            <p className="text-brand-muted mb-2">
              {establishment.address}
            </p>
          </div>
          {establishment.website && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExternalLink}
              className="flex-shrink-0 ml-4"
              aria-label={`Visit ${establishment.name} website`}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {/* Metrics */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-brand-blue">
            <MapPin className="w-4 h-4" aria-hidden="true" />
            <span className="font-medium">{formatDistance(establishment.distance)} away</span>
          </div>
          {establishment.travelTime && (
            <div className="flex items-center gap-2 text-brand-muted">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>{establishment.travelTime} min drive</span>
            </div>
          )}
          {establishment.rating && (
            <div className="flex items-center gap-2 text-amber-600">
              <Star className="w-4 h-4 fill-current" aria-hidden="true" />
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
                  window.open(`tel:${establishment.phone}`, '_self');
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
EstablishmentItem.displayName = 'EstablishmentItem';

export default EstablishmentItem;
