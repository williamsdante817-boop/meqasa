import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCard } from "@/components/common/alert-card";
import Shell from "@/layouts/shell";

export default function NotFound() {
  return (
    <Shell>
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-8">
        <AlertCard className="max-w-md" />
        <div className="space-y-4 text-center">
          <h1 className="text-brand-accent text-4xl font-bold">404</h1>
          <h2 className="text-brand-accent text-2xl font-semibold">
            Page Not Found
          </h2>
          <p className="text-brand-muted max-w-md">
            Sorry, we couldn&lsquo;t find the page you&lsquo;re looking for. It
            might have been moved, deleted, or you entered the wrong URL.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button asChild variant="default">
              <Link href="/">Go home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/search/sale">Browse properties</Link>
            </Button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
