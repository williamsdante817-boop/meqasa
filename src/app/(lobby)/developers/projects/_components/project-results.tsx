import type { Development } from "@/types/development";
import { DevelopmentCardsGrid } from "../../_components/development-cards-grid";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import Link from "next/link";

interface ProjectResultsProps {
  developments: Development[];
}

/**
 * Component that handles rendering of project results or empty state
 */
export function ProjectResults({ developments }: ProjectResultsProps) {
  if (developments.length === 0) {
    return (
      <Empty className="min-h-[400px]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Building2 />
          </EmptyMedia>
          <EmptyTitle>No Developer Projects Found</EmptyTitle>
          <EmptyDescription>
            We&apos;re currently updating our developer projects. Please check
            back soon or explore our other property listings.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/search/sale?q=ghana">Browse All Properties</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <>
      <DevelopmentCardsGrid developments={developments} />

      {/* Results count */}
      <div className="text-brand-muted mt-8 text-center">
        <p>
          Showing {developments.length} developer{" "}
          {developments.length === 1 ? "project" : "projects"}
        </p>
      </div>
    </>
  );
}