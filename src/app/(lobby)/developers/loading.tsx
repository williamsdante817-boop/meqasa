import { DevelopersSkeleton } from "@/components/developer/developers/developers-skeleton";
import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import Shell from "@/layouts/shell";

export default function DevelopersLoading() {
  return (
    <Shell>
      <div className="py-8">
        <div className="text-brand-accent mt-4 grid w-full grid-cols-1 lg:grid-cols-[2fr_1fr] lg:gap-8 lg:px-0">
          <div>
            <Breadcrumbs
              className="mb-6"
              segments={[
                { title: "Home", href: "/" },
                { title: "Developers", href: "#" },
              ]}
            />
            <header className="text-b-accent mb-8">
              <h1 className="text-brand-accent mb-2 text-lg leading-tight font-bold tracking-tighter md:text-xl">
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
