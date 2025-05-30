import type { ReactNode } from "react";
import { formatDistanceToNow, type FormatDistanceOptions } from "date-fns";

interface PropertyDetail {
  title: string;
  value: string | number | boolean | null | undefined;
  formatter?: (
    value: string | number | boolean | null | undefined,
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
  className = "",
  title,
}: PropertyDetailsTableProps) {
  // Filter out any details that should not be displayed
  const filteredDetails = details.filter(
    (detail) =>
      detail.value !== undefined &&
      detail.value !== null &&
      detail.value !== "",
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
    <div className={`overflow-hidden ${className}`}>
      {title && (
        <h2 className="text-lg font-semibold mb-4" id="property-details-title">
          {title}
        </h2>
      )}
      <table
        className="w-full divide-y divide-gray-200"
        aria-labelledby={title ? "property-details-title" : undefined}
      >
        <thead className="sr-only">
          <tr>
            <th scope="col">Property</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {filteredDetails.map((detail, index) => (
            <tr
              key={`${detail.title}-${index}`}
              className={`flex items-center justify-between border-b first-of-type:border-t 
                  bg-white`}
            >
              <td
                className="py-6 whitespace-nowrap text-brand-accent font-semibold"
                scope="row"
              >
                {detail.title}
              </td>
              <td className="py-6 whitespace-nowrap text-brand-muted capitalize">
                {formatValue(detail)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
