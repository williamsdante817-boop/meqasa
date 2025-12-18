import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { FileQuestion } from "lucide-react";
import Shell from "@/layouts/shell";

export default function NotFound() {
  return (
    <Shell>
      <div className="flex min-h-[60vh] items-center justify-center">
        <Empty className="max-w-2xl mx-auto">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileQuestion />
            </EmptyMedia>
            <EmptyTitle>Page Not Found</EmptyTitle>
            <EmptyDescription>
              Sorry, we couldn&lsquo;t find the page you&lsquo;re looking for. It
              might have been moved, deleted, or you entered the wrong URL.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center">
            <Button asChild size="lg">
              <Link href="/">Go Home</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/search/sale">Browse Properties</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    </Shell>
  );
}
