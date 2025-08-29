import { DevelopersSkeleton } from "@/components/developer/developers/developers-skeleton";
import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import Shell from "@/layouts/shell";

export default function DevelopersLoading() {
  return (
    <Shell>
      <div className="py-8">
        <div className="grid grid-cols-1 text-brand-accent w-full mt-4 lg:grid-cols-[2fr_1fr] lg:gap-8 lg:px-0">
          <div>
            <Breadcrumbs
              className="mb-6"
              segments={[
                { title: "Home", href: "/" },
                { title: "Developers", href: "#" },
              ]}
            />
            <header className="mb-8 text-b-accent">
              <h1 className="mb-2 text-lg font-bold leading-tight tracking-tighter text-brand-accent md:text-xl">
                Find a Developer
              </h1>
            </header>

            <DevelopersSkeleton />
          </div>
        </div>
      </div>
    </Shell>
  );
}
