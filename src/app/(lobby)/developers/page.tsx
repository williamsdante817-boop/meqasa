import Shell from "@/layouts/shell";
import { DeveloperCard } from "@/components/developer-card";
import SearchInput from "@/components/search-input";
import { getDevelopers } from "@/lib/get-developers";

export const metadata = {
  title: "Real Estate Developers | Meqasa",
  description:
    "Browse through our list of trusted real estate developers in Ghana",
};

export default async function DevelopersPage() {
  const { developers } = await getDevelopers();
  console.log("Developers Data:", developers);

  return (
    <Shell>
      <div className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
          <div>
            <header className="mb-8 text-b-accent">
              <h1 className="mb-2 text-lg font-bold leading-tight tracking-tighter text-brand-accent md:text-xl">
                Find a Developer
              </h1>
              <div className="w-full">
                <SearchInput data={developers} path="projects-by-developer" />
              </div>
            </header>
            <div className="space-y-8">
              {developers.map((developer) => (
                <DeveloperCard
                  key={developer.developerid}
                  developer={developer}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
