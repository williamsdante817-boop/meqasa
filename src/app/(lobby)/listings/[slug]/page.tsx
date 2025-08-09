import { Breadcrumbs } from "@/components/bread-crumbs";
import Shell from "@/layouts/shell";

import { AlertCard } from "@/components/alert-card";
import Amenities from "@/components/amenities";
import ContactCard from "@/components/contact-card";
import ContactSection from "@/components/contact-section";
import ContentSection from "@/components/content-section";
import { DynamicCarousel } from "@/components/dynamic-carousel";
import { Icons } from "@/components/icons";
import LeaseOptions from "@/components/lease-option";
import MortgageCalculator from "@/components/mortgage-calculator";
import PropertyDetailsTable from "@/components/property-details";
import PropertyFavoritesBanner from "@/components/property-favorite-banner";
import PropertyInsight from "@/components/property-insight";
import PropertyListings from "@/components/property-listings";
import PropertyShowcase from "@/components/property-showcase";
import SafetyTipsCard from "@/components/safety-tip";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getListingDetails } from "@/lib/get-listing-detail";
import { cn, formatNumber } from "@/lib/utils";
import { BathIcon, BedIcon, ParkingSquare, Square } from "lucide-react";
import Link from "next/link";
import ProjectVideo from "../../development-projects/_component/project-video";

// Constants for better maintainability
const CONTRACT_TYPES = {
  SALE: "sale",
  RENT: "rent",
  SHORT_STAY: "short-stay",
} as const;

const PROPERTY_TYPES = {
  LAND: "land",
} as const;

const VERIFICATION_STATUSES = {
  APPROVED: "approved",
  APPROVED2: "approved2",
} as const;

// Helper function to extract numeric price from price string
const extractNumericPrice = (priceString: string): string => {
  return priceString.replace(/[^\d]/g, "") || "0";
};

export default async function DetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Extract listing ID more reliably
  const match = /-(\d+)$/.exec(slug);
  if (!match?.[1]) {
    // Return a not found page instead of throwing
    return (
      <main>
        <Shell>
          <div className="text-center py-10">
            <h1 className="text-2xl font-bold text-brand-accent">
              Listing Not Found
            </h1>
            <p className="text-brand-muted mt-2">
              The requested property listing could not be found.
            </p>
          </div>
        </Shell>
      </main>
    );
  }

  const listingId = match[1];

  try {
    const listingDetail = await getListingDetails(listingId);
    console.log(listingDetail);

    if (!listingDetail) {
      return (
        <main>
          <Shell>
            <div className="text-center py-10">
              <h1 className="text-2xl font-bold text-brand-accent">
                Listing Not Found
              </h1>
              <p className="text-brand-muted mt-2">
                The requested property listing could not be found.
              </p>
            </div>
          </Shell>
        </main>
      );
    }

    // Build Similar Listings search href based on current listing details
    const contract = listingDetail.contract.toLowerCase();
    const location = listingDetail.location.toLowerCase();
    const type = listingDetail.type.toLowerCase();
    const params = new URLSearchParams({ q: location, page: "1", ftype: type });
    const numBeds = Number.parseInt(listingDetail.beds, 10);
    const numBaths = Number.parseInt(listingDetail.baths, 10);
    if (!Number.isNaN(numBeds) && numBeds > 0)
      params.set("fbeds", String(numBeds));
    if (!Number.isNaN(numBaths) && numBaths > 0)
      params.set("fbaths", String(numBaths));
    const similarSearchHref = `/search/${contract}?${params.toString()}`;

    // Construct internal agent link `/agents/{name}?g={id}` using owner.page as source of id
    const agentNameEncoded = encodeURIComponent(listingDetail.owner.name);
    const ownerPageUrl = listingDetail.owner.page;
    let agentIdFromPage = "";
    const qMarkIndex = ownerPageUrl.indexOf("?");
    if (qMarkIndex !== -1) {
      const queryString = ownerPageUrl.slice(qMarkIndex + 1);
      const sp = new URLSearchParams(queryString);
      agentIdFromPage = sp.get("g") ?? "";
    } else {
      const execResult = /[?&]g=([^&]+)/.exec(ownerPageUrl);
      agentIdFromPage = execResult?.[1] ?? "";
    }
    const agentHref = agentIdFromPage
      ? `/agents/${agentNameEncoded}?g=${encodeURIComponent(agentIdFromPage)}`
      : `/agents/${agentNameEncoded}`;

    const propertyDetails = [
      { title: "Type", value: listingDetail.type || "Not specified" },
      { title: "Contract", value: listingDetail.contract || "Not specified" },
      { title: "Location", value: listingDetail.location || "Not specified" },
      {
        title: "Bedrooms",
        value: listingDetail.beds || "Not specified",
      },
      {
        title: "Bathrooms",
        value: listingDetail.baths || "Not specified",
      },
      { title: "Garages", value: listingDetail.garages || "Not specified" },
      {
        title: "Area",
        value: listingDetail.floorarea
          ? `${listingDetail.floorarea} ㎡`
          : "Not specified",
      },
      {
        title: "Furnished",
        value:
          listingDetail.isfurnished !== ""
            ? listingDetail.isfurnished
              ? "Yes"
              : "No"
            : "Not specified",
      },
      {
        title: "Reference",
        value: listingDetail.listingid,
      },
    ];

    return (
      <main>
        <Shell>
          <div className="space-y-3 mb-3">
            <Breadcrumbs
              className="pt-4"
              segments={[
                { title: "Home", href: "/" },
                {
                  title: `For ${listingDetail.contract}`,
                  href: `/search/${listingDetail.contract.toLowerCase()}?q=ghana&page=1`,
                },
                {
                  title: `${listingDetail.type}`,
                  href: `/search/${listingDetail.contract.toLowerCase()}?q=ghana&ftype=${listingDetail.type}&page=1`,
                },
                {
                  title: `${listingDetail.location}`,
                  href: `/search/${listingDetail.contract.toLowerCase()}?q=${listingDetail.location}&page=1`,
                },
              ]}
              aria-label="Property listing navigation"
            />
            <h1 className="font-bold leading-tight tracking-tighter text-brand-accent lg:leading-[1.1] text-2xl md:text-3xl capitalize">
              {listingDetail.title}
            </h1>
          </div>
        </Shell>
        <section
          className="border-b border-brand-badge-ongoing bg-black flex items-center justify-center"
          aria-label="Property images"
        >
          <DynamicCarousel images={listingDetail.imagelist} />
        </section>
        <Shell>
          <div className="grid grid-cols-1 text-brand-accent w-full mt-4 md:grid-cols-[2fr,1fr] lg:gap-8 lg:px-0">
            <div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <h2
                    className="text-2xl font-extrabold text-brand-accent lg:text-3xl"
                    dangerouslySetInnerHTML={{ __html: listingDetail.price }}
                  ></h2>
                  <span className="text-brand-muted font-light text-sm md:text-xl">
                    {listingDetail.leaseunit}
                  </span>
                </div>
                <span className="flex gap-2 md:gap-4 text-xs">
                  {(listingDetail.owner.verification ===
                    VERIFICATION_STATUSES.APPROVED ||
                    listingDetail.owner.verification ===
                      VERIFICATION_STATUSES.APPROVED2) && (
                    <Badge className="hidden md:block uppercase text-white bg-green-500">
                      Verified
                    </Badge>
                  )}
                  {Boolean(listingDetail.isnegotiable) && (
                    <Badge className="uppercase  text-white bg-brand-primary">
                      Negotiable
                    </Badge>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-4 py-2">
                <div
                  className="flex items-center gap-1.5 md:gap-4 flex-wrap"
                  role="list"
                  aria-label="Property features"
                >
                  {listingDetail.beds && (
                    <div className="flex items-center gap-2" role="listitem">
                      <p className="flex items-center gap-1 text-brand-accent">
                        <BedIcon
                          className="text-brand-muted"
                          strokeWidth={1.2}
                          aria-hidden="true"
                        />{" "}
                        <span>{listingDetail.beds} Beds</span>
                      </p>
                    </div>
                  )}
                  {listingDetail.baths && (
                    <div className="flex items-center gap-2" role="listitem">
                      <p className="flex items-center gap-1 text-brand-accent">
                        <BathIcon
                          className="text-brand-muted"
                          strokeWidth={1.2}
                          aria-hidden="true"
                        />{" "}
                        <span>{listingDetail.baths} Baths</span>
                      </p>
                    </div>
                  )}
                  {listingDetail.garages && (
                    <div className="flex items-center gap-2" role="listitem">
                      <p className="flex items-center gap-1 text-brand-accent">
                        <ParkingSquare
                          className="text-brand-muted"
                          strokeWidth={1.2}
                          aria-hidden="true"
                        />{" "}
                        <span>{listingDetail.garages} Parking</span>
                      </p>
                    </div>
                  )}
                  {listingDetail.floorarea && (
                    <div className="flex items-center gap-2" role="listitem">
                      <p className="flex items-center gap-1 text-brand-accent">
                        <Square
                          className="text-brand-muted"
                          strokeWidth={1.2}
                          aria-hidden="true"
                        />{" "}
                        <span>{listingDetail.floorarea} sqm</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <Badge className="uppercase text-xs text-blue-500 bg-blue-100/60">
                  {listingDetail.isfurnished !== ""
                    ? "Furnished"
                    : "Unfurnished"}
                </Badge>
                <Badge className="uppercase text-xs text-blue-500 bg-blue-100/60 max-w-[280px] md:max-w-full">
                  <p className="truncate w-full">{listingDetail.location}</p>
                </Badge>
              </div>
              <aside className="mb-6">
                {listingDetail.owner.listingscount !== "0" && (
                  <div className="flex items-center gap-8 border-y text-sm py-4 lg:py-10 lg:text-base">
                    <div>
                      <Icons.trend />
                    </div>
                    <div>
                      <p className="text-brand-accent lg:font-semibold">
                        This property is popular
                      </p>
                      <p className="text-brand-accent">
                        <span>{`It's been viewed ${formatNumber(listingDetail.owner.listingscount, { notation: "compact" })} times.`}</span>
                        <span className="lg:font-semibold">
                          {" "}
                          Contact agent before it&apos;s gone!
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </aside>
              <aside className="mb-6">
                <Card className="flex items-start justify-between gap-5 rounded-lg border-orange-200 px-4 text-brand-accent lg:flex-row lg:w-fit lg:px-6 lg:py-4">
                  <Badge className="bg-orange-500 uppercase">
                    {listingDetail.owner.type !== "Agent"
                      ? "Project name"
                      : "Categories"}
                  </Badge>
                  <div>
                    {listingDetail.owner.type !== "Agent" ? (
                      <p className="font-semibold">{"Project name"}</p>
                    ) : (
                      // categoryData.categories?.map((cat) => (
                      <div>
                        <Link
                          href={`/search/${listingDetail.contract.toLowerCase()}?q=ghana&ftype=${listingDetail.type.toLowerCase()}&page=1`}
                          className="block text-sm text-blue-500"
                          key={listingDetail.parenttext}
                        >
                          {listingDetail.parenttext}
                        </Link>
                        <Link
                          href={`/search/${listingDetail.contract.toLowerCase()}?q=${listingDetail.location.toLowerCase()}&ftype=${listingDetail.type.toLowerCase()}&page=1`}
                          className="block text-sm text-blue-500"
                          key={listingDetail.categorytext}
                        >
                          {listingDetail.categorytext}
                        </Link>
                      </div>
                    )}
                  </div>
                </Card>
              </aside>
              <SafetyTipsCard />
              <ContentSection
                title="Description"
                description=""
                href="/listings"
                className="pt-14 md:pt-20 pb-10 md:pb-0"
                btnHidden
              >
                {listingDetail?.description &&
                listingDetail.description.trim() !== "" ? (
                  <>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: listingDetail.description,
                      }}
                      className="text-brand-muted"
                    />
                    <span className="block text-gray-500 mt-4">
                      Listed by:{" "}
                      <Link
                        href={agentHref}
                        className="decoration-dashed underline underline-offset-2"
                      >
                        {listingDetail.owner.name}
                      </Link>
                    </span>
                  </>
                ) : (
                  <AlertCard
                    title="No description provided"
                    description="This listing doesn't have a detailed description yet."
                    className="my-4"
                  />
                )}
              </ContentSection>
              <ContentSection
                title="Explore More"
                description=""
                href="/listings"
                className="pt-14 md:pt-20"
                btnHidden
              >
                <PropertyShowcase images={listingDetail?.imagelist} />
              </ContentSection>
              <PropertyFavoritesBanner
                propertyId={Number(listingDetail.detailreq.split("-").pop())}
                propertyType="listing"
              />

              {/* Video component - will show when video data is available */}
              {(listingDetail as unknown as { videoUrl?: string }).videoUrl &&
                (
                  listingDetail as unknown as { videoUrl?: string }
                ).videoUrl!.trim() !== "" && (
                  <ProjectVideo
                    videoUrl={
                      (listingDetail as unknown as { videoUrl?: string })
                        .videoUrl!
                    }
                  />
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

              {listingDetail.contract.toLowerCase() !== CONTRACT_TYPES.SALE && (
                <LeaseOptions leaseOptions={listingDetail.leaseoptions} />
              )}

              {listingDetail.amenities.length > 0 && (
                <ContentSection
                  title="Amenities"
                  description=""
                  href=""
                  className="pt-14 md:pt-20"
                  btnHidden
                >
                  <Amenities amenities={listingDetail.amenities} />
                </ContentSection>
              )}

              <PropertyInsight />
            </div>
            <aside className="hidden lg:block">
              <ContactCard
                name={listingDetail.owner.name}
                image={listingDetail.owner.logo}
                listingId={listingDetail.listingid}
              />
            </aside>
          </div>
        </Shell>
        <Shell>
          {listingDetail.contract.toLowerCase() === CONTRACT_TYPES.SALE &&
            listingDetail.type.toLowerCase() !== PROPERTY_TYPES.LAND && (
              <ContentSection
                title="Mortgage Calculator"
                description=""
                href=""
                className="pt-14 md:pt-20"
                btnHidden
              >
                <MortgageCalculator
                  price={extractNumericPrice(listingDetail.price)}
                />
              </ContentSection>
            )}
        </Shell>

        <ContactSection
          name={listingDetail.owner.name}
          image={listingDetail.owner.logo}
          listingId={listingDetail.listingid}
        />
        {listingDetail.similars.length > 0 ? (
          <ContentSection
            title="Similar Listings"
            description=""
            href={similarSearchHref}
            className={cn(
              listingDetail.similars.length > 0 ? "px-0 mb-6" : "px-4",
              "pt-14 md:pt-20 lg:pt-24  md:block lg:max-w-7xl lg:mx-auto [&_p]:px-4 [&_h2]:px-4",
            )}
          >
            <PropertyListings
              listings={listingDetail.similars}
              parentContract={listingDetail.contract}
            />
          </ContentSection>
        ) : (
          <Shell>
            <AlertCard className="my-10" />
          </Shell>
        )}
      </main>
    );
  } catch (error: unknown) {
    console.error("Error fetching listing details:", error);

    // Check if it's a specific "listing not published" error
    if (
      error instanceof Error &&
      error.message.includes("listing not published")
    ) {
      return (
        <main>
          <Shell>
            <div className="text-center py-10">
              <AlertCard
                title="Listing Not Available"
                description="This property listing is not currently published or available for viewing."
                className="my-10"
              />
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary-dark transition-colors"
                >
                  ← Back to Home
                </Link>
              </div>
            </div>
          </Shell>
        </main>
      );
    }

    return (
      <main>
        <Shell>
          <div className="text-center py-10">
            <h1 className="text-2xl font-bold text-brand-accent">
              Error Loading Listing
            </h1>
            <p className="text-brand-muted mt-2">
              Sorry, we encountered an error while loading this property
              listing. Please try again later.
            </p>
          </div>
        </Shell>
      </main>
    );
  }
}
