import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
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
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Search />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{message}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {onClearFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            Clear Filters
          </Button>
        )}
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
