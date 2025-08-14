import { AlertCard } from "@/components/alert-card";
import Amenities from "@/components/amenities";
import { Breadcrumbs } from "@/components/bread-crumbs";
import ContactCard from "@/components/contact-card";
import ContactSection from "@/components/contact-section";
import ContentSection from "@/components/content-section";
import { DynamicCarousel } from "@/components/dynamic-carousel";
import { AddFavoriteButton } from "@/components/add-favorite-button";
import { Icons } from "@/components/icons";
import MortgageCalculator from "@/components/mortgage-calculator";
import PropertyDetailsTable from "@/components/property-details";
import PropertyFavoritesBanner from "@/components/property-favorite-banner";
import PropertyInsight from "@/components/property-insight";
import PropertyListings from "@/components/property-listings";
import PropertyPlan from "@/components/property-plan";
import PropertyShowcase from "@/components/property-showcase";
import SafetyTipsCard from "@/components/safety-tip";
import { Badge } from "@/components/ui/badge";
import Shell from "@/layouts/shell";
import { getUnitDetails } from "@/lib/get-unit-details";
import { buildInnerHtml, cn, formatNumber, slugify } from "@/lib/utils";
import { BathIcon, BedIcon, ParkingSquare, Square } from "lucide-react";
import Link from "next/link";
import ProjectVideo from "../../development-projects/_component/project-video";

export default async function DeveloperUnitPage({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const { unitId } = await params;

  const unitDetails = await getUnitDetails(unitId);

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

  const searchParams = new URLSearchParams({
    q: location || "ghana",
    page: "1",
  });
  if (type) searchParams.set("ftype", type);
  if (typeof unitDetails.unit.beds === "number" && unitDetails.unit.beds > 0) {
    searchParams.set("fbeds", String(unitDetails.unit.beds));
  }
  if (
    typeof unitDetails.unit.baths === "number" &&
    unitDetails.unit.baths > 0
  ) {
    searchParams.set("fbaths", String(unitDetails.unit.baths));
  }
  const similarSearchHref = `/search/${contract}?${searchParams.toString()}`;

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
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <h2 className="text-2xl font-extrabold text-brand-accent lg:text-3xl">
                  {unitDetails.unit.sellingprice
                    ? `GH₵ ${formatNumber(unitDetails.unit.sellingprice)}`
                    : "Price on Request"}
                </h2>
              </div>
              <span className="flex gap-2 md:gap-4 text-xs">
                <Badge className="uppercase text-white bg-brand-primary hidden md:block">
                  {unitDetails.unit.terms === "sale" ? "For Sale" : "For Rent"}
                </Badge>
                {Boolean(unitDetails.unit.soldout === 0) && (
                  <Badge className="uppercase text-white bg-green-500">
                    Available
                  </Badge>
                )}
              </span>
              <AddFavoriteButton listingId={Number(unitDetails.unit.unitid)} />
            </div>
            <div className="flex items-center gap-4 py-2">
              <div className="flex items-center gap-1.5 md:gap-4 flex-wrap">
                {unitDetails.unit.beds ? (
                  <div className="flex items-center gap-2">
                    <p className="flex items-center gap-1 text-brand-accent">
                      <BedIcon className="text-brand-muted" strokeWidth={1.2} />{" "}
                      {unitDetails.unit.beds} Beds
                    </p>
                  </div>
                ) : null}{" "}
                {unitDetails.unit.baths ? (
                  <div className="flex items-center gap-2">
                    <p className="flex items-center gap-1 text-brand-accent">
                      <BathIcon
                        className="text-brand-muted"
                        strokeWidth={1.2}
                      />{" "}
                      {unitDetails.unit.baths} Baths
                    </p>
                  </div>
                ) : null}{" "}
                {unitDetails.unit.garages ? (
                  <div className="flex items-center gap-2">
                    <p className="flex items-center gap-1 text-brand-accent">
                      <ParkingSquare
                        className="text-brand-muted"
                        strokeWidth={1.2}
                      />{" "}
                      {unitDetails.unit.garages} Parking
                    </p>
                  </div>
                ) : null}{" "}
                <div className="flex items-center gap-2">
                  {unitDetails.unit.floorarea ? (
                    <p className="flex items-center gap-1 text-brand-accent">
                      <Square className="text-brand-muted" strokeWidth={1.2} />{" "}
                      {unitDetails.unit.floorarea} sqm
                    </p>
                  ) : null}{" "}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <Badge className="uppercase text-xs text-blue-500 bg-blue-100/60">
                {unitDetails.unit.fullyfurnished ? "Furnished" : "Unfurnished"}
              </Badge>
              <Badge className="uppercase text-xs text-blue-500 bg-blue-100/60 max-w-[280px] md:max-w-full">
                <p className="truncate w-full">{unitDetails.unit.address}</p>
              </Badge>
            </div>
            <aside className="mb-6">
              {unitDetails.photos.length !== 0 && (
                <div className="flex items-center gap-8 border-y text-sm py-4 lg:py-10 lg:text-base">
                  <div>
                    <Icons.trend />
                  </div>
                  <div>
                    <p className="text-brand-accent lg:font-semibold">
                      This unit is popular
                    </p>
                    <p className="text-brand-accent">
                      <span>{`It's been viewed ${formatNumber(unitDetails.unit.pageviews, { notation: "compact" })} times.`}</span>
                      <span className="lg:font-semibold">
                        {" "}
                        Contact developer before it&apos;s gone!
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </aside>
            <SafetyTipsCard />

            <ContentSection
              title="Description"
              description=""
              href="/developer-units"
              className="pt-14 md:pt-20 pb-10 md:pb-0"
              btnHidden
            >
              <p
                dangerouslySetInnerHTML={buildInnerHtml(
                  unitDetails.unit.description,
                )}
                className="text-brand-muted"
              />
              <span className="block text-gray-500 mt-4">
                Listed by:{" "}
                <Link
                  href={developerHref}
                  className="decoration-dashed underline underline-offset-2"
                >
                  {unitDetails.unit.companyname}
                </Link>
              </span>
            </ContentSection>
            <ContentSection
              title="Explore More"
              description=""
              href="/developer-units"
              className="pt-14 md:pt-20 hidden md:block"
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

            <ContentSection
              title="Property Plan"
              description=""
              href=""
              className="pt-14 md:pt-20"
              btnHidden
            >
              <PropertyPlan />
            </ContentSection>

            <PropertyInsight />
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
