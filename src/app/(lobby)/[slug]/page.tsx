import { locationDetails } from "@/assets/data/location-details";
import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import FeaturedPropertiesAsideWrapper from "@/components/about/featured-properties-aside-wrapper";
import Shell from "@/layouts/shell";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const locationData = locationDetails[slug];

  if (!locationData) {
    notFound();
  }

  // Extract location name from slug (remove "Locality Profile" suffix for search)
  const locationName = locationData.title
    .replace(" Locality Profile", "")
    .trim();

  // Popular search configurations
  const popularSearches = [
    {
      label: "Apartments for Rent",
      href: `/search/rent?q=${encodeURIComponent(locationName)}&ftype=apartment`,
    },
    {
      label: "Houses for Sale",
      href: `/search/sale?q=${encodeURIComponent(locationName)}&ftype=house`,
    },
    {
      label: "Land for Sale",
      href: `/search/sale?q=${encodeURIComponent(locationName)}&ftype=land`,
    },
    {
      label: "Commercial Space",
      href: `/search/rent?q=${encodeURIComponent(locationName)}&ftype=office`,
    },
  ];

  return (
    <Shell className="py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        className="mb-6"
        segments={[
          { title: "Home", href: "/" },
          { title: locationData.title, href: `/${slug}` },
        ]}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        {/* Main Content */}
        <main className="space-y-8">
          <div>
            <h1 className="text-brand-accent mb-4 text-3xl font-bold">
              {locationData.title}
            </h1>
            {locationData.description.map((paragraph, index) => (
              <p key={index} className="text-brand-muted leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {locationData.subsections && (
            <>
              {locationData.subsections.map((section, index) => (
                <div key={index}>
                  <h2 className="text-brand-accent mb-4 text-2xl font-bold">
                    {section.title}
                  </h2>
                  <p className="text-brand-muted leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </>
          )}

          {/* SEO / Internal Links Section */}
          <div className="border-t pt-8">
            <h3 className="mb-4 text-lg font-bold">
              Popular Searches in {locationName}
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search) => (
                <Link
                  key={search.label}
                  href={search.href}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 transition-colors hover:bg-slate-200"
                >
                  {search.label}
                </Link>
              ))}
            </div>
          </div>
        </main>

        {/* Aside - Featured Properties (Hidden on mobile) */}
        <aside className="hidden lg:sticky lg:top-20 lg:block lg:self-start">
          <FeaturedPropertiesAsideWrapper />
        </aside>
      </div>
    </Shell>
  );
}
