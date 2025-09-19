import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import Link from "next/link";

interface UnitsEmptyStateProps {
  resetHref?: string;
  resetText?: string;
}

export function UnitsEmptyState({
  resetHref = "/newly-built-units",
  resetText = "Reset Filters",
}: UnitsEmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <div className="space-y-4">
        <Building2 className="mx-auto h-16 w-16 text-gray-300" />
        <h3 className="text-brand-accent text-xl font-semibold">
          No units found
        </h3>
        <p className="text-brand-muted mx-auto max-w-md">
          We couldn&apos;t find any developer units matching your criteria. Try
          adjusting your filters or check back later for new listings.
        </p>
        <Button asChild>
          <Link href={resetHref}>{resetText}</Link>
        </Button>
      </div>
    </div>
  );
}
