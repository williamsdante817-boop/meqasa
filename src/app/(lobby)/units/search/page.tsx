import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import Shell from "@/layouts/shell";
import type { Metadata } from "next";
import { ReferenceSearch } from "@/components/search/ReferenceSearch";
import { StreamingFlexiBannerWrapper } from "@/components/search/StreamingBanners";
// Optimized imports for better tree-shaking and bundle size
import { UnitsSearchFilter } from "./_components/units-search-filter";
import { UnitsSearchWrapper } from "./_components/units-search-wrapper";
import { ResultCountProvider, UnitsSearchSubtitle } from "./_components";
import {
  generateSearchMetadata,
  generatePageTitle,
  generateSubtitle,
} from "./_components/metadata-utils";
import { fetchUnitsSearchResults } from "./_components/api-utils";
import {
  SidebarLinks,
  DEFAULT_LOCATION_LINKS,
} from "./_components/sidebar-links";
import { StructuredData } from "./_components/structured-data";
import type { SearchParams } from "./_components/types";

interface UnitsSearchPageProps {
  searchParams: Promise<SearchParams>;
}

// Generate metadata for SEO
export async function generateMetadata({
  searchParams,
}: UnitsSearchPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  return generateSearchMetadata(resolvedSearchParams);
}

export default async function UnitsSearchPage({
  searchParams,
}: UnitsSearchPageProps) {
  const resolvedSearchParams = await searchParams;

  // Fetch initial search results server-side
  const { units: initialSearchData, hasMore } =
    await fetchUnitsSearchResults(resolvedSearchParams);

  // Extract search parameters for easier use
  const address = Array.isArray(resolvedSearchParams.address)
    ? resolvedSearchParams.address[0]
    : resolvedSearchParams.address;

  const segments = [
    { title: "Home", href: "/", key: "home" },
    {
      title: "Newly Built Units",
      href: "/newly-built-units",
      key: "newly-built-units",
    },
    {
      title: address || "Ghana",
      href: "#",
      key: `location-${address || "ghana"}`,
    },
  ];

  // Generate page metadata and titles
  const pageTitle = generatePageTitle(resolvedSearchParams);
  const pageSubtitle = generateSubtitle(
    resolvedSearchParams,
    initialSearchData.length
  );

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData
        units={initialSearchData}
        searchParams={resolvedSearchParams}
        address={address}
      />
      <div>
        <ResultCountProvider initialCount={initialSearchData.length}>
          {/* Search Filter - sticky */}
          <div className="sticky top-[56px] z-50 bg-white">
            <UnitsSearchFilter />
          </div>

          <Shell className="py-8 md:py-12">
            <div className="w-full">
              <Breadcrumbs className="mb-8 capitalize" segments={segments} />
              <header className="mb-16">
                <div>
                  <h1 className="text-brand-accent mb-4 text-lg leading-6 font-bold capitalize md:text-xl">
                    {pageTitle}
                  </h1>
                  <UnitsSearchSubtitle
                    initialSubtitle={pageSubtitle}
                    searchParams={resolvedSearchParams}
                  />
                </div>
              </header>
              <div className="mb-8 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-green-50 p-4 md:hidden">
                <ReferenceSearch
                  showLabel={true}
                  size="default"
                  className="max-w-md"
                  enableUnifiedSearch={true}
                  placeholder="Search by unit reference ( e.g.4001 )"
                />
              </div>

              <div className="mt-8 grid w-full grid-cols-1 gap-8 md:px-0 lg:grid-cols-[minmax(0,736px)_1fr]">
                <div className="mb-8">
                  {/* Streaming Flexi Banner - non-critical, loads progressively */}
                  <StreamingFlexiBannerWrapper />

                  {/* Main search results - critical content loads immediately */}
                  <UnitsSearchWrapper
                    initialResults={initialSearchData}
                    searchParams={resolvedSearchParams}
                    initialHasMore={hasMore}
                  />
                </div>

                {/* Developer Units Reference Search Component */}
                <div>
                  <div className="hidden rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-green-50 p-4 md:block">
                    <ReferenceSearch
                      showLabel={true}
                      size="default"
                      className="max-w-md"
                      enableUnifiedSearch={true}
                      placeholder="Search by unit reference ( e.g.4001 )"
                    />
                  </div>
                  <SidebarLinks links={DEFAULT_LOCATION_LINKS} />
                </div>
              </div>
            </div>
          </Shell>
        </ResultCountProvider>
      </div>
    </>
  );
}
