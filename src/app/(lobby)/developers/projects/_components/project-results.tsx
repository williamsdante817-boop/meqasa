import type { Development } from "@/types/development";
import { DevelopmentCardsGrid } from "../../_components/development-cards-grid";
import { EmptyState } from "./empty-state";

interface ProjectResultsProps {
  developments: Development[];
}

/**
 * Component that handles rendering of project results or empty state
 */
export function ProjectResults({ developments }: ProjectResultsProps) {
  if (developments.length === 0) {
    return <EmptyState />;
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