import { AddFavoriteButton } from "@/components/add-favorite-button";
import Amenities from "@/components/amenities";
import { AlertCard } from "@/components/common/alert-card";
import ContactCard from "@/components/common/contact-card";
import { DynamicCarousel } from "@/components/common/dynamic-carousel";
import ContactSection from "@/components/contact-section";
import { ExpandableDescription } from "@/components/expandable-description";
import { Icons } from "@/components/icons";
import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import ContentSection from "@/components/layout/content-section";
import MortgageCalculator from "@/components/mortgage-calculator";
import PropertyFavoritesBanner from "@/components/property-favorite-banner";
import PropertyDetailsTable from "@/components/property/details/property-details";
import PropertyInsight from "@/components/property/details/property-insight";
import PropertyPlan from "@/components/property/details/property-plan";
import PropertyShowcase from "@/components/property/details/property-showcase";
import PropertyListings from "@/components/property/listings/property-listings";
import SafetyTipsCard from "@/components/safety-tip";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Shell from "@/layouts/shell";
import { extractUnitData, hasCompressedData } from "@/lib/compressed-data-utils";
import { getUnitDetails } from "@/lib/get-unit-details";
import { buildInnerHtml, cn, formatNumber, slugify } from "@/lib/utils";
import { BathIcon, BedIcon, ParkingSquare, Square } from "lucide-react";
import ProjectVideo from "../../development-projects/_component/project-video";
export default async function DeveloperUnitPage({
  params,
  searchParams,
}: {
  params: Promise<{ unitId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { unitId } = await params;
  const searchParamsResolved = await searchParams;

  // Check for compressed data from search first (SSR-compatible)
  let unitDetails;
  
  if (hasCompressedData(searchParamsResolved)) {
    // Extract compressed unit data
    unitDetails = extractUnitData(searchParamsResolved);
    
    if (unitDetails) {
      console.log(`✅ COMPRESSED DATA HIT: Using passed unit data, no API call needed!`);
    } else {
      console.log(`⚠️ COMPRESSED DATA INVALID: Fetching from API`);
      unitDetails = await getUnitDetails(unitId);
    }
  } else {
    // Normal API call when not coming from search
    unitDetails = await getUnitDetails(unitId);
  }

  // Extract unit ID more reliably
  const match = /-(\d+)$/.exec(unitId);

  if (!match?.[1]) {
    return (
      <main>
        <Shell>
          <div className="text-center py-10">
            <h1 className="text-2xl font-bold text-brand-accent">
              Unit Not Found
            </h1>
            <p className="text-brand-muted mt-2">
              The requested developer unit could not be found.
            </p>
          </div>
        </Shell>
      </main>
    );
  }

  const propertyDetails = [
    {
      title: "Type",
      value: unitDetails.unit.unittypename ?? "Not specified",
    },
    { title: "Terms", value: unitDetails.unit.terms ?? "Not specified" },
    { title: "Location", value: unitDetails.unit.address ?? "Not specified" },
    {
      title: "Bedrooms",
      value: unitDetails.unit.beds?.toString() ?? "Not specified",
    },
    {
      title: "Bathrooms",
      value: unitDetails.unit.baths?.toString() ?? "Not specified",
    },
    {
      title: "Parking",
      value: unitDetails.unit.garages?.toString() ?? "Not specified",
    },
    {
      title: "Area",
      value: unitDetails.unit.floorarea
        ? `${unitDetails.unit.floorarea} ㎡`
        : "Not specified",
    },
    {
      title: "Furnished",
      value: unitDetails.unit.fullyfurnished ? "Yes" : "No",
    },
    {
      title: "Reference",
      value: unitDetails.unit.unitid.toString(),
    },
  ];

  console.log("unitDetails", unitDetails.similarunits);

  // Construct developer-aware hrefs similar to listings page
  const contract = unitDetails.unit.terms?.toLowerCase() ?? "";
  const location = unitDetails.unit.city?.toLowerCase() ?? "";
  const type = unitDetails.unit.unittypename?.toLowerCase() ?? "";

  const similarSearchParams = new URLSearchParams({
    q: location || "ghana",
    page: "1",
  });
  if (type) similarSearchParams.set("ftype", type);
  if (typeof unitDetails.unit.beds === "number" && unitDetails.unit.beds > 0) {
    similarSearchParams.set("fbeds", String(unitDetails.unit.beds));
  }
  if (
    typeof unitDetails.unit.baths === "number" &&
    unitDetails.unit.baths > 0
  ) {
    similarSearchParams.set("fbaths", String(unitDetails.unit.baths));
  }
  const similarSearchHref = `/search/${contract}?${similarSearchParams.toString()}`;

  const developerSlug = slugify(unitDetails.unit.companyname || "developer");
  const developerHref = `/projects-by-developer/${developerSlug}-${unitDetails.unit.developerid}`;

  return (
    <main>
      <Shell>
        <div className="space-y-3 mb-3">
          <Breadcrumbs
            className="pt-4"
            segments={[
              { title: "Home", href: "/" },
              {
                title: `For ${unitDetails.unit.terms}`,
                href: `/search/${contract}?q=ghana&page=1`,
              },
              {
                title: `${unitDetails.unit.unittypename}`,
                href: `/search/${contract}?q=ghana&ftype=${type}&page=1`,
              },
              {
                title: `${unitDetails.unit.city}`,
                href: `/search/${contract}?q=${location}&page=1`,
              },
            ]}
            aria-label="Developer unit navigation"
          />
          <h1 className="font-bold leading-tight tracking-tighter text-brand-accent lg:leading-[1.1] text-2xl md:text-3xl capitalize">
            {unitDetails.unit.title || unitDetails.unit.unittypename}
          </h1>
        </div>
      </Shell>
      <section
        className="border-b border-brand-badge-ongoing bg-black flex items-center justify-center"
        aria-label="Unit images"
      >
        <DynamicCarousel
          isDeveloper={typeof unitDetails.unit.unitid === "number"}
          images={(() => {
            // duplicate last photo to ensure at least 5 images
            const photos: string[] = unitDetails.photos.map(
              (photo) => photo.photo,
            );
            if (photos.length >= 5) return photos;
            if (photos.length === 0) return Array<string>(5).fill("");
            const lastPhoto = photos[photos.length - 1] ?? photos[0] ?? "";
            const additionalPhotos: string[] = Array<string>(
              5 - photos.length,
            ).fill(lastPhoto);
            return [...photos, ...additionalPhotos];
          })()}
          unitId={Number(unitDetails.unit.unitid)}
        />
      </section>
      <Shell>
        <div className="grid grid-cols-1 text-brand-accent w-full mt-4 lg:grid-cols-[2fr_1fr] lg:gap-8 lg:px-0">
          <div>
            <div className="flex items-start justify-between flex-wrap gap-3 md:flex-nowrap md:items-center md:gap-4">
              <div className="flex items-center">
                <h2
                  className="text-2xl font-extrabold text-brand-accent lg:text-3xl"
                >
                  {unitDetails.unit.sellingprice
                    ? `GH₵ ${formatNumber(unitDetails.unit.sellingprice)}`
                    : "Price on Request"}
                </h2>
                <span className="text-brand-muted font-light text-sm md:text-xl ml-2">
                  {unitDetails.unit.terms === "rent" ? "/month" : ""}
                </span>
              </div>
              <div className="flex gap-2 md:gap-3 text-xs flex-wrap">
                <Badge variant="default" className="uppercase">
                  {unitDetails.unit.terms === "sale" ? "For Sale" : "For Rent"}
                </Badge>
                {Boolean(unitDetails.unit.soldout === 0) && (
                  <Badge variant="success" className="uppercase">
                    Available
                  </Badge>
                )}
              </div>
              <AddFavoriteButton listingId={Number(unitDetails.unit.unitid)} />
            </div>
            <div className="flex items-center gap-4 py-3">
              <div 
                className="flex items-center gap-3 md:gap-6 flex-wrap"
                role="list"
                aria-label="Property features"
              >
                {unitDetails.unit.beds && (
                  <div className="flex items-center gap-2" role="listitem">
                    <p className="flex items-center gap-2 text-brand-accent">
                      <BedIcon
                        className="h-5 w-5 text-brand-muted"
                        strokeWidth={1.2}
                        aria-hidden="true"
                      />
                      <span>{unitDetails.unit.beds} Beds</span>
                    </p>
                  </div>
                )}
                {unitDetails.unit.baths && (
                  <div className="flex items-center gap-2" role="listitem">
                    <p className="flex items-center gap-2 text-brand-accent">
                      <BathIcon
                        className="h-5 w-5 text-brand-muted"
                        strokeWidth={1.2}
                        aria-hidden="true"
                      />
                      <span>{unitDetails.unit.baths} Baths</span>
                    </p>
                  </div>
                )}
                {unitDetails.unit.garages && (
                  <div className="flex items-center gap-2" role="listitem">
                    <p className="flex items-center gap-2 text-brand-accent">
                      <ParkingSquare
                        className="h-5 w-5 text-brand-muted"
                        strokeWidth={1.2}
                        aria-hidden="true"
                      />
                      <span>{unitDetails.unit.garages} Parking</span>
                    </p>
                  </div>
                )}
                {unitDetails.unit.floorarea && (
                  <div className="flex items-center gap-2" role="listitem">
                    <p className="flex items-center gap-2 text-brand-accent">
                      <Square
                        className="h-5 w-5 text-brand-muted"
                        strokeWidth={1.2}
                        aria-hidden="true"
                      />
                      <span>{unitDetails.unit.floorarea} sqm</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <Badge variant="info" className="uppercase">
                {unitDetails.unit.fullyfurnished ? "Furnished" : "Unfurnished"}
              </Badge>
              <Badge variant="info" className="uppercase max-w-[280px] md:max-w-full">
                <p className="truncate w-full">{unitDetails.unit.address}</p>
              </Badge>
            </div>
            <aside className="mb-6">
                {unitDetails.unit.pageviews !== 0 && (
                  <Card className="relative overflow-hidden border-l-3 border-l-orange-500 bg-gradient-to-r rounded-lg from-orange-50 to-amber-50 p-4 md:p-6">
                    <div className="flex items-center gap-4 md:gap-6">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                        <Icons.trend className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge variant="warning" className="text-xs font-semibold flex-shrink-0">
                            🔥 TRENDING
                          </Badge>
                          <span className="text-xs text-orange-600 font-medium">
                            High Interest Property
                          </span>
                        </div>
                        <h3 className="text-brand-accent font-semibold text-base md:text-lg mb-2 leading-tight">
                          This property is in high demand
                        </h3>
                        <div className="flex items-center gap-2 text-sm md:text-base flex-wrap">
                          <span className="font-medium text-brand-accent flex-shrink-0">
                            {`${formatNumber(unitDetails.unit.pageviews, { notation: "compact" })} views`}
                          </span>
                          <span className="text-brand-muted">•</span>
                          <span className="text-orange-600 font-medium">
                            Contact agent before it&apos;s gone!
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Subtle background pattern */}
                    <div className="absolute top-2 right-2 opacity-5">
                      <Icons.trend className="h-16 w-16 md:h-20 md:w-20 text-orange-500" />
                    </div>
                  </Card>
                )}
              </aside>
            <ContentSection
              title="Description"
              description=""
              href="/developer-units"
              className="pt-14 md:pt-20 pb-10 md:pb-0"
              btnHidden
            >
                  <ExpandableDescription
                     description={buildInnerHtml(unitDetails.unit.description)}
                     name={unitDetails.unit.companyname}
                     href={developerHref}
                   />
            </ContentSection>
            <ContentSection
              title="Explore More"
              description=""
              href="/developer-units"
              className="pt-14 md:pt-20"
              btnHidden
            >
              <PropertyShowcase
                images={unitDetails.photos.map((photo) => photo.photo)}
              />
            </ContentSection>
            <PropertyFavoritesBanner
              propertyId={Number(unitDetails.unit.unitid)}
              propertyType="listing"
            />

            {unitDetails.unit.tourvideo &&
              unitDetails.unit.tourvideo.trim() !== "" && (
                <ProjectVideo videoUrl={unitDetails.unit.tourvideo} />
              )}

            <ContentSection
              title="Project Details"
              description=""
              href=""
              className="pt-14 md:pt-20"
              btnHidden
            >
              <PropertyDetailsTable details={propertyDetails} />
            </ContentSection>

            {unitDetails.features?.length > 0 ? (
              <ContentSection
                title="Amenities"
                description=""
                href=""
                className="pt-14 md:pt-20"
                btnHidden
              >
                <Amenities
                  amenities={unitDetails.features.map(
                    (feature) => feature.feature,
                  )}
                />
              </ContentSection>
            ) : null}

            <SafetyTipsCard />

            <ContentSection
              title="Property Plan"
              description=""
              href=""
              className="pt-14 md:pt-20"
              btnHidden
            >
              <PropertyPlan />
            </ContentSection>

            <PropertyInsight 
              location={unitDetails.unit.city ?? unitDetails.unit.address ?? ""}
              bedroomType={unitDetails.unit.beds ? `${unitDetails.unit.beds}-bedroom` : undefined}
            />
          </div>
          <aside className="hidden lg:block">
            <ContactCard
              name={unitDetails.unit.companyname}
              image={unitDetails.unit.logo}
              src
              projectId={unitDetails.unit.projectid?.toString() ?? ""}
              pageType="project"
            />
          </aside>
        </div>
      </Shell>

      {unitDetails.unit.terms === "sale" && (
        <Shell>
          <ContentSection
            title="Mortgage Calculator"
            description=""
            href=""
            className="pt-14 md:pt-20"
            btnHidden
          >
            <MortgageCalculator
              key={String(unitDetails.unit.unitid)}
              price={unitDetails.unit.sellingprice.toString()}
            />
          </ContentSection>
        </Shell>
      )}

      <ContactSection
        name={unitDetails.unit.companyname}
        image={unitDetails.unit.logo}
        src
        projectId={unitDetails.unit.projectid?.toString() ?? ""}
        pageType="project"
      />

      {unitDetails.similarunits?.length > 0 ? (
        <ContentSection
          title="Similar Units"
          description=""
          href={similarSearchHref}
          className={cn(
            unitDetails.similarunits.length !== 0 ? "px-0 mb-6" : "px-4",
            "pt-14 md:pt-20 lg:pt-24  md:block lg:max-w-7xl lg:mx-auto [&_p]:px-4 [&_h2]:px-4",
          )}
        >
          <PropertyListings
            listings={unitDetails.similarunits}
            parentContract={unitDetails.unit.terms}
          />
        </ContentSection>
      ) : (
        <Shell>
          <AlertCard className="my-10" />
        </Shell>
      )}
    </main>
  );
}
