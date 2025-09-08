import { Card } from "@/components/ui/card";
import { formatDistanceToNow, type FormatDistanceOptions } from "date-fns";
import type { ReactNode } from "react";

interface PropertyDetail {
  title: string;
  value: string | number | boolean | null | undefined;
  formatter?: (
    value: string | number | boolean | null | undefined
  ) => ReactNode;
}

interface PropertyDetailsTableProps {
  details: PropertyDetail[];
  className?: string;
  title?: string;
  alternateRowColors?: boolean;
}

export default function PropertyDetailsTable({
  details,
}: PropertyDetailsTableProps) {
  // Filter out any details that should not be displayed
  const filteredDetails = details.filter(
    (detail) =>
      detail.value !== undefined && detail.value !== null && detail.value !== ""
  );

  // Format the value based on its type or using a custom formatter
  const formatValue = (detail: PropertyDetail): ReactNode => {
    if (detail.formatter) {
      return detail.formatter(detail.value);
    }

    if (detail.value === null || detail.value === undefined) {
      return "Not specified";
    }

    if (typeof detail.value === "boolean") {
      return detail.value ? "Yes" : "No";
    }

    // Handle arrays by joining them
    if (Array.isArray(detail.value)) {
      return (
        detail.value
          .map((item) => {
            if (typeof item === "object" && item !== null && "type" in item) {
              return (item as { type: string }).type;
            }
            return String(item);
          })
          .join(", ") || "Not specified"
      );
    }

    // Format date if the title is "Date Updated"
    if (detail.title === "Date Updated" && typeof detail.value === "string") {
      const date = new Date(detail.value);
      if (!isNaN(date.getTime())) {
        const options: FormatDistanceOptions = { addSuffix: true };
        return formatDistanceToNow(date, options);
      }
      return "Invalid date";
    }

    return detail.value;
  };

  return (
    <Card className="border-gray-200 bg-gradient-to-r rounded-lg from-gray-50 to-gray-50 p-4 md:p-6">
      <div className="space-y-3">
        {filteredDetails.map((detail, index) => (
          <div
            key={`${detail.title}-${index}`}
            className="flex items-center justify-between py-3 px-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <span className="text-sm font-medium text-brand-accent">
              {detail.title}
            </span>
            <span className="text-sm text-brand-muted font-medium capitalize">
              {formatValue(detail)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
