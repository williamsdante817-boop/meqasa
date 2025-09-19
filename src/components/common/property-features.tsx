import { BathIcon, BedIcon, ParkingSquare, Square } from "lucide-react";

interface PropertyFeaturesProps {
  /** Number of bedrooms */
  beds?: string | number | null;
  /** Number of bathrooms */
  baths?: string | number | null;
  /** Number of garages/parking spaces */
  garages?: string | number | null;
  /** Floor area in square meters */
  floorArea?: string | number | null;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Reusable property features component that displays beds, baths, parking, and floor area
 * Handles null/undefined values gracefully and provides consistent formatting
 */
export default function PropertyFeatures({
  beds,
  baths,
  garages,
  floorArea,
  className = "",
}: PropertyFeaturesProps) {
  // Helper function to safely parse and validate numeric values
  const parseValue = (
    value: string | number | null | undefined
  ): number | null => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const num = typeof value === "string" ? parseInt(value, 10) : value;
    return isNaN(num) || num <= 0 ? null : num;
  };

  // Helper function to safely parse floor area (can be decimal)
  const parseFloorArea = (
    value: string | number | null | undefined
  ): number | null => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const num = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(num) || num <= 0 ? null : num;
  };

  // Parse all values
  const bedsCount = parseValue(beds);
  const bathsCount = parseValue(baths);
  const garagesCount = parseValue(garages);
  const floorAreaValue = parseFloorArea(floorArea);

  // If no valid features, don't render anything
  if (!bedsCount && !bathsCount && !garagesCount && !floorAreaValue) {
    return null;
  }

  return (
    <div className={`flex items-center gap-4 py-3 ${className}`}>
      <div
        className="flex flex-wrap items-center gap-3 md:gap-6"
        role="list"
        aria-label="Property features"
      >
        {bedsCount && (
          <div className="flex items-center gap-2" role="listitem">
            <div className="text-brand-accent flex items-center gap-2">
              <BedIcon
                className="text-brand-muted h-5 w-5"
                strokeWidth={1.2}
                aria-hidden="true"
              />
              <span>
                {bedsCount} Bed{bedsCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}

        {bathsCount && (
          <div className="flex items-center gap-2" role="listitem">
            <div className="text-brand-accent flex items-center gap-2">
              <BathIcon
                className="text-brand-muted h-5 w-5"
                strokeWidth={1.2}
                aria-hidden="true"
              />
              <span>
                {bathsCount} Bath{bathsCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}

        {garagesCount && (
          <div className="flex items-center gap-2" role="listitem">
            <div className="text-brand-accent flex items-center gap-2">
              <ParkingSquare
                className="text-brand-muted h-5 w-5"
                strokeWidth={1.2}
                aria-hidden="true"
              />
              <span>{garagesCount} Parking</span>
            </div>
          </div>
        )}

        {floorAreaValue && (
          <div className="flex items-center gap-2" role="listitem">
            <div className="text-brand-accent flex items-center gap-2">
              <Square
                className="text-brand-muted h-5 w-5"
                strokeWidth={1.2}
                aria-hidden="true"
              />
              <span>
                {/* Format floor area with appropriate decimal places */}
                {floorAreaValue % 1 === 0
                  ? floorAreaValue.toString()
                  : floorAreaValue.toFixed(1)}{" "}
                sqm
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
