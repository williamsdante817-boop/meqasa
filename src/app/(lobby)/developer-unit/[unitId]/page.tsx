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
import {
  extractUnitData,
  hasCompressedData,
} from "@/lib/compressed-data-utils";
import { getUnitDetails } from "@/lib/get-unit-details";
import { buildInnerHtml, cn, formatNumber, slugify } from "@/lib/utils";
import {
  BathIcon,
  BedIcon,
  ParkingSquare,
  Square,
  Tag,
  ExternalLink,
} from "lucide-react";
import { logInfo } from "@/lib/logger";
import ProjectVideo from "../../development-projects/_component/project-video";
import TrendingPropertyCard from "@/components/common/trending-property-card";
import PropertyContextCard from "@/components/common/property-context-card";
import PropertyFeatures from "@/components/common/property-features";
import Link from "next/link";
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
      logInfo("Using compressed unit data (cache hit)", {
        unitId,
        component: "DeveloperUnitPage",
      });
    } else {
      logInfo("Compressed data invalid, fetching from API", {
        unitId,
        component: "DeveloperUnitPage",
      });
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
          <div className="py-10 text-center">
            <h1 className="text-brand-accent text-2xl font-bold">
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

  logInfo("Unit details loaded", {
    unitId: unitDetails?.unit?.unitid,
    similarUnitsCount: unitDetails?.similarunits?.length || 0,
    component: "DeveloperUnitPage",
  });

  // Log detailed unit data for development purposes
  if (unitDetails?.unit) {
    logInfo("Developer unit details data", {
      unitId: unitDetails.unit.unitid,
      title: unitDetails.unit.title,
      sellingPrice: unitDetails.unit.sellingprice,
      terms: unitDetails.unit.terms,
      unittypename: unitDetails.unit.unittypename,
      beds: unitDetails.unit.beds,
      baths: unitDetails.unit.baths,
      garages: unitDetails.unit.garages,
      floorarea: unitDetails.unit.floorarea,
      fullyfurnished: unitDetails.unit.fullyfurnished,
      city: unitDetails.unit.city,
      address: unitDetails.unit.address,
      pageviews: unitDetails.unit.pageviews,
      soldout: unitDetails.unit.soldout,
      companyname: unitDetails.unit.companyname,
      developerid: unitDetails.unit.developerid,
      projectid: unitDetails.unit.projectid,
      featuresCount: unitDetails.features?.length || 0,
      photosCount: unitDetails.photos?.length || 0,
      similarUnitsCount: unitDetails.similarunits?.length || 0,
      component: "DeveloperUnitPage",
    });
  }

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
        <div className="mb-3 space-y-3">
          <Breadcrumbs
            className="pt-4"
            segments={[
              { title: "Home", href: "/" },
              {
                title: `For ${unitDetails.unit.terms}`,
                href: `/search/${contract}?q=ghana`,
              },
              {
                title: `${unitDetails.unit.unittypename}`,
                href: `/search/${contract}?q=ghana&ftype=${encodeURIComponent(type.toLowerCase())}`,
              },
              {
                title: `${unitDetails.unit.city}`,
                href: `/search/${contract}?q=${encodeURIComponent(location.toLowerCase())}`,
              },
            ]}
            aria-label="Developer unit navigation"
          />
          <h1 className="text-brand-accent text-2xl leading-tight font-bold tracking-tighter capitalize md:text-3xl lg:leading-[1.1]">
            {unitDetails.unit.title || unitDetails.unit.unittypename}
          </h1>
        </div>
      </Shell>
      <section
        className="border-brand-badge-ongoing flex items-center justify-center border-b bg-black"
        aria-label="Unit images"
      >
        <DynamicCarousel
          isDeveloper={typeof unitDetails.unit.unitid === "number"}
          images={(() => {
            // duplicate last photo to ensure at least 5 images
            const photos: string[] = unitDetails.photos.map(
              (photo) => photo.photo
            );
            if (photos.length >= 5) return photos;
            if (photos.length === 0) return Array<string>(5).fill("");
            const lastPhoto = photos[photos.length - 1] ?? photos[0] ?? "";
            const additionalPhotos: string[] = Array<string>(
              5 - photos.length
            ).fill(lastPhoto);
            return [...photos, ...additionalPhotos];
          })()}
          unitId={Number(unitDetails.unit.unitid)}
        />
      </section>
      <Shell>
        <div className="text-brand-accent mt-4 grid w-full grid-cols-1 lg:grid-cols-[2fr_1fr] lg:gap-8 lg:px-0">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-3 md:flex-nowrap md:items-center md:gap-4">
              <div className="flex items-center">
                <h2 className="text-brand-accent text-2xl font-extrabold lg:text-3xl">
                  {unitDetails.unit.sellingprice
                    ? `GH₵ ${formatNumber(unitDetails.unit.sellingprice)}`
                    : "Price on Request"}
                </h2>
                <span className="text-brand-muted ml-2 text-sm font-light md:text-xl">
                  {unitDetails.unit.terms === "rent" ? "/month" : ""}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs md:gap-3">
                <Badge variant="default" className="uppercase">
                  {unitDetails.unit.terms === "sale" ? "For Sale" : "For Rent"}
                </Badge>
                {Boolean(unitDetails.unit.soldout === 0) && (
                  <Badge variant="success" className="uppercase">
                    Available
                  </Badge>
                )}
                {/* Desktop favorite button - hidden on mobile since it's in carousel */}
                <div className="hidden md:block">
                  <AddFavoriteButton
                    listingId={Number(unitDetails.unit.unitid)}
                    showLabel={true}
                    size="md"
                    hideLabelOnMobile={false}
                  />
                </div>
              </div>
            </div>
            <PropertyFeatures
              beds={unitDetails.unit.beds}
              baths={unitDetails.unit.baths}
              garages={unitDetails.unit.garages}
              floorArea={unitDetails.unit.floorarea}
            />
            <div className="mb-6 flex items-center gap-4">
              <Badge variant="info" className="uppercase">
                {unitDetails.unit.fullyfurnished ? "Furnished" : "Unfurnished"}
              </Badge>
              <Badge
                variant="info"
                className="max-w-[280px] uppercase md:max-w-full"
              >
                <p className="w-full truncate">{unitDetails.unit.address}</p>
              </Badge>
            </div>
            <TrendingPropertyCard
              propertyType="developer-unit"
              count={unitDetails.unit.pageviews || 0}
              threshold={1}
            />
            <PropertyContextCard
              propertyType="developer-unit"
              ownerName={unitDetails.unit.companyname}
              contract={unitDetails.unit.terms || "sale"}
              type={unitDetails.unit.unittypename || "unit"}
              location={unitDetails.unit.city}
              developerData={{
                companyName: unitDetails.unit.companyname,
                developerHref: developerHref,
                similarSearchHref: similarSearchHref,
                unitTypeName: unitDetails.unit.unittypename,
                city: unitDetails.unit.city,
              }}
            />
            <ContentSection
              title="Description"
              description=""
              href="/developer-units"
              className="pt-14 pb-10 md:pt-20 md:pb-0"
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
                    (feature) => feature.feature
                  )}
                />
              </ContentSection>
            ) : null}

            <SafetyTipsCard />

            {/* Only show property plan if it exists in the data */}
            {unitDetails.unit.floorplan && (
              <ContentSection
                title="Property Plan"
                description=""
                href=""
                className="pt-14 md:pt-20"
                btnHidden
              >
                <PropertyPlan
                  planUrl={`https://meqasa.com/uploads/imgs/${unitDetails.unit.floorplan}`}
                  planTitle={`Floor plan for ${unitDetails.unit.title || unitDetails.unit.unittypename}`}
                />
              </ContentSection>
            )}

            <PropertyInsight
              location={unitDetails.unit.city ?? unitDetails.unit.address ?? ""}
              bedroomType={
                unitDetails.unit.beds
                  ? `${unitDetails.unit.beds}-bedroom`
                  : undefined
              }
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
            unitDetails.similarunits.length !== 0 ? "mb-6 px-0" : "px-4",
            "pt-14 md:block md:pt-20 lg:mx-auto lg:max-w-7xl lg:pt-24 [&_h2]:px-4 [&_p]:px-4"
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
