import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Link from "next/link";

interface NoResultsProps {
  title?: string;
  message?: string;
  onClearFilters?: () => void;
}

export function NoResults({
  title = "No properties found",
  message = "We couldn't find any properties matching your search criteria. Try adjusting your filters or search for a different location.",
  onClearFilters,
}: NoResultsProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
      <div className="mb-4 rounded-full bg-gray-100 p-4">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mb-8 max-w-md text-sm text-gray-500">{message}</p>
      <div className="flex gap-4">
        {onClearFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
