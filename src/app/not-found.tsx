import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCard } from "@/components/alert-card";
import Shell from "@/layouts/shell";

export default function NotFound() {
  return (
    <Shell>
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <AlertCard className="max-w-md" />
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-brand-accent">404</h1>
          <h2 className="text-2xl font-semibold text-brand-accent">
            Page Not Found
          </h2>
          <p className="text-brand-muted max-w-md">
            Sorry, we couldn&lsquo;t find the page you&lsquo;re looking for. It
            might have been moved, deleted, or you entered the wrong URL.
          </p>
          <div className="flex gap-4 justify-center pt-4">
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
