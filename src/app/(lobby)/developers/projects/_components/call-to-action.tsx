import { Button } from "@/components/ui/button";
import Shell from "@/layouts/shell";
import { Building2, Search } from "lucide-react";
import Link from "next/link";

/**
 * Call-to-action section component with property browsing links
 */
export function CallToAction() {
  return (
    <section className="border-brand-border border-t bg-gray-50">
      <Shell className="py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-brand-accent mb-6 text-3xl leading-tight font-bold md:text-4xl">
            Looking for Your Dream Property?
          </h2>
          <p className="text-brand-muted mb-8 text-lg leading-relaxed md:text-xl">
            Explore our extensive portfolio of premium developments across
            Ghana. From luxury apartments to family homes, find the perfect
            property that suits your lifestyle.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-brand-primary hover:bg-brand-primary-dark w-full text-white sm:w-auto"
            >
              <Link href="/search/sale?q=ghana">
                <Search className="mr-2 h-5 w-5" />
                Browse All Properties
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-brand-accent border-brand-primary hover:text-brand-accent w-full sm:w-auto"
            >
              <Link href="/newly-built-units">
                <Building2 className="mr-2 h-5 w-5" />
                View New Units
              </Link>
            </Button>
          </div>
        </div>
      </Shell>
    </section>
  );
}