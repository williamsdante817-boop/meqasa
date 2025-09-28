import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import Link from "next/link";

/**
 * Empty state component displayed when no developer projects are found
 */
export function EmptyState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
      <Building2 className="text-brand-muted mx-auto mb-4 h-16 w-16 opacity-50" />
      <h3 className="text-brand-accent mb-2 text-xl font-semibold">
        No Developer Projects Found
      </h3>
      <p className="text-brand-muted max-w-md">
        We&apos;re currently updating our developer projects. Please check
        back soon or explore our other property listings.
      </p>
      <Button asChild className="mt-6">
        <Link href="/search/sale?q=ghana">Browse All Properties</Link>
      </Button>
    </div>
  );
}