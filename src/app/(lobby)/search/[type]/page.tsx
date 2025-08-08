import { Breadcrumbs } from "@/components/bread-crumbs";
import { HeroBannerSkeleton } from "@/components/search/BannerSkeleton";
import { HeroBanner } from "@/components/search/HeroBanner";
import PropertyTypeLinks from "@/components/search/PropertyTypeLinks";
import { ResultSearchFilter } from "@/components/search/results-search-filter";
import {
  StreamingFlexiBannerWrapper,
  StreamingSidebarBanners,
} from "@/components/search/StreamingBanners";
import { ResultsPopup } from "@/components/results-popup";
import Shell from "@/layouts/shell";
import { getResultsHeroBanner } from "@/lib/banners";
import { loadMoreProperties, searchProperties } from "@/lib/meqasa";
import { SearchResultsWrapper } from "./SearchResultsWrapper";

interface SearchPageProps {
  params: Promise<{ type: string }>;
  searchParams: Promise<Record<string, string>>;
}

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const { type } = await params;
  const resolvedSearchParams = await searchParams;
  const location = resolvedSearchParams.q ?? "Ghana";

  // Load critical data on server: hero banner and search results
  const [heroBanner, searchData] = await Promise.all([
    getResultsHeroBanner().catch(() => null),
    (async () => {
      const currentPage = parseInt(resolvedSearchParams.page ?? "1");
      const urlSearchId = resolvedSearchParams.searchId
        ? parseInt(resolvedSearchParams.searchId)
        : null;

      try {
        if (currentPage > 1 && urlSearchId) {
          return await loadMoreProperties(type, location, {
            y: urlSearchId,
            w: currentPage,
          });
        } else {
          return await searchProperties(type, location, {
            ...resolvedSearchParams,
            app: "vercel",
          });
        }
      } catch (error) {
        console.error("Error fetching search data:", error);
        // Return a fallback response instead of throwing
        return {
          results: [],
          resultcount: 0,
          searchid: null,
        };
      }
    })(),
  ]);

  const segments = [
    { title: "Home", href: "/", key: "home" },
    {
      title: `For ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      href: `/search/${type}`,
      key: `search-${type}`,
    },
    { title: location, href: "#", key: `location-${location}` },
  ];

  return (
    <div>
      {/* Hero Banner - loaded on server, immediately available */}
      {heroBanner ? (
        <HeroBanner
          src={heroBanner.src}
          href={heroBanner.href}
          alt="Hero banner showcasing featured properties"
        />
      ) : (
        <HeroBannerSkeleton />
      )}

      <div className="hidden md:block sticky top-[64px] z-50 bg-white">
        <ResultSearchFilter />
      </div>
      <Shell className="mt-12 flex gap-8 md:px-0">
        <PropertyTypeLinks />
        <div className="w-full">
          <Breadcrumbs className="capitalize" segments={segments} />
          <header>
            <h1 className="mt-2 text-lg font-bold leading-6 text-brand-accent capitalize md:text-xl">
              Property for {type} in {location}
            </h1>
            <p className="mt-3 text-sm text-brand-muted">
              {searchData.resultcount} properties found
            </p>
          </header>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[736px,300px] mt-8 md:px-0">
            <div>
              {/* Streaming Flexi Banner - non-critical, loads progressively */}
              <StreamingFlexiBannerWrapper />

              {/* Main search results - critical content loads immediately */}
              <SearchResultsWrapper
                type={type}
                location={location}
                initialResults={searchData.results}
                initialTotal={searchData.resultcount}
                initialSearchId={searchData.searchid}
                initialPage={parseInt(resolvedSearchParams.page ?? "1")}
              />
            </div>

            {/* Streaming Sidebar Banners - non-critical, loads progressively */}
            <StreamingSidebarBanners />
          </div>
        </div>
      </Shell>
      <ResultsPopup type={type} />
    </div>
  );
}
