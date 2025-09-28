import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import Shell from "@/layouts/shell";

import { AlertCard } from "@/components/common/alert-card";
import { AddFavoriteButton } from "@/components/add-favorite-button";
import Amenities from "@/components/amenities";
import ContactCard from "@/components/common/contact-card";
import ContactSection from "@/components/contact-section";
import ContentSection from "@/components/layout/content-section";
import { DynamicCarousel } from "@/components/common/dynamic-carousel";
import LeaseOptions from "@/components/lease-option";
import MortgageCalculator from "@/components/mortgage-calculator";
import PropertyDetailsTable from "@/components/property/details/property-details";
import PropertyFavoritesBanner from "@/components/property-favorite-banner";
import PropertyInsight from "@/components/property/details/property-insight";
import PropertyListings from "@/components/property/listings/property-listings";
import PropertyShowcase from "@/components/property/details/property-showcase";
import SafetyTipsCard from "@/components/safety-tip";
import TrendingPropertyCard from "@/components/common/trending-property-card";
import PropertyContextCard from "@/components/common/property-context-card";
import PropertyFeatures from "@/components/common/property-features";
import { Badge } from "@/components/ui/badge";
import { getListingDetails } from "@/lib/get-listing-detail";
import {
  extractPropertyData,
  hasCompressedData,
} from "@/lib/compressed-data-utils";
import { buildInnerHtml, cn } from "@/lib/utils";
import { sanitizeHtml } from "@/lib/dom-sanitizer";
import { ShieldCheck } from "lucide-react";
import ProjectVideo from "../../development-projects/_component/project-video";
import type { Metadata } from "next";
import { createPropertyError } from "@/lib/error-handling";
import { ExpandableDescription } from "@/components/expandable-description";
import { logError, logInfo } from "@/lib/logger";
import {
  generateListingDetailMetadata,
  generateListingDetailStructuredData,
  generateWebsiteStructuredData,
  generateOrganizationStructuredData,
} from "@/lib/seo";
import { StructuredData } from "@/components/structured-data";

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
  APPROVED3: "approved3", // For owner-direct properties
} as const;

// Helper function to extract the first currency amount (e.g., GH₵ 3,687,912) from HTML/text and return digits
const extractNumericPrice = (priceString: string): string => {
  if (!priceString) return "0";
  const text = priceString.replace(/<[^>]*>/g, " ");

  // Try to match currency with comma-formatted numbers first (1,234,567 format)
  const currencyWithCommasRegex =
    /(?:GH\s*₵|GHS|GH₵)\s*([0-9]{1,3}(?:,[0-9]{3})+(?:\.[0-9]+)?)/i;
  const currencyMatch = currencyWithCommasRegex.exec(text);
  if (currencyMatch?.[1]) {
    return currencyMatch[1].replace(/,/g, "");
  }

  // Try to match currency with plain numbers (no commas, handles large numbers)
  const currencyPlainRegex = /(?:GH\s*₵|GHS|GH₵)\s*([0-9]+(?:\.[0-9]+)?)/i;
  const currencyPlainMatch = currencyPlainRegex.exec(text);
  if (currencyPlainMatch?.[1]) {
    return currencyPlainMatch[1];
  }

  // Match formatted numbers without currency (1,234,567 format)
  const formattedNumberRegex = /([0-9]{1,3}(?:,[0-9]{3})+(?:\.[0-9]+)?)/;
  const formattedMatch = formattedNumberRegex.exec(text);
  if (formattedMatch?.[1]) {
    return formattedMatch[1].replace(/,/g, "");
  }

  // Match plain numbers (fallback)
  const plainNumberRegex = /([0-9]+(?:\.[0-9]+)?)/;
  const plainMatch = plainNumberRegex.exec(text);
  if (plainMatch?.[1]) {
    return plainMatch[1];
  }

  return "0";
};

// Generate metadata for SEO using centralized utility
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const match = /-(\d+)$/.exec(slug);

    if (!match?.[1]) {
      return generateListingDetailMetadata(null, slug);
    }

    const listingId = match[1];
    const listingDetail = await getListingDetails(listingId);

    return generateListingDetailMetadata(listingDetail, slug);
  } catch (error) {
    logError("Error generating metadata for listing", error, {
      component: "ListingMetadata",
      action: "generateMetadata",
    });
    return generateListingDetailMetadata(null, slug);
  }
}

export default async function DetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;

  // Extract listing ID more reliably
  const match = /-(\d+)$/.exec(slug);
  if (!match?.[1]) {
    throw createPropertyError(new Error("Invalid slug format"), "invalid_slug");
  }

  const listingId = match[1];
  logInfo("Extracting listing ID from slug", {
    slug,
    listingId,
    component: "ListingsPage",
  });

  // Check for compressed data from search first (SSR-compatible)
  let listingDetail;

  if (hasCompressedData(searchParamsResolved)) {
    // Extract compressed property data
    listingDetail = extractPropertyData(searchParamsResolved);

    if (listingDetail) {
      logInfo("Using compressed property data (cache hit)", {
        listingId,
        component: "ListingsPage",
      });
    } else {
      logInfo("Compressed data invalid, fetching from API", {
        listingId,
        component: "ListingsPage",
      });
      listingDetail = await getListingDetails(listingId);
    }
  } else {
    // Normal API call when not coming from search
    logInfo("Calling getListingDetails API", {
      listingId,
      component: "ListingsPage",
    });
    listingDetail = await getListingDetails(listingId);
  }

  logInfo("Retrieved listing details", {
    success: !!listingDetail,
    listingId: listingDetail?.listingid,
    component: "ListingsPage",
  });

  // Log detailed listing data for development purposes
  if (listingDetail) {
    logInfo("Listing details data", {
      listingId: listingDetail.listingid,
      title: listingDetail.title,
      price: listingDetail.price,
      contract: listingDetail.contract,
      type: listingDetail.type,
      location: listingDetail.location,
      beds: listingDetail.beds,
      baths: listingDetail.baths,
      garages: listingDetail.garages,
      floorarea: listingDetail.floorarea,
      isfurnished: listingDetail.isfurnished,
      owner: {
        name: listingDetail.owner.name,
        type: listingDetail.owner.type,
        verification: listingDetail.owner.verification,
        listingscount: listingDetail.owner.listingscount,
      },
      amenitiesCount: listingDetail.amenities.length,
      imageCount: listingDetail.imagelist.length,
      similarsCount: listingDetail.similars.length,
      component: "ListingsPage",
    });
  }

  if (!listingDetail) {
    throw createPropertyError(new Error("Property listing not found"));
  }

  // Generate structured data using centralized utility

  // Build Similar Listings search href based on current listing details
  const contract = listingDetail.contract.toLowerCase();
  const location = listingDetail.location.toLowerCase();
  const type = listingDetail.type.toLowerCase();
  const similarSearchParams = new URLSearchParams({
    q: location,
    page: "1",
    ftype: type,
  });
  const numBeds = Number.parseInt(listingDetail.beds, 10);
  const numBaths = Number.parseInt(listingDetail.baths, 10);
  if (!Number.isNaN(numBeds) && numBeds > 0)
    similarSearchParams.set("fbeds", String(numBeds));
  if (!Number.isNaN(numBaths) && numBaths > 0)
    similarSearchParams.set("fbaths", String(numBaths));
  const similarSearchHref = `/search/${contract}?${similarSearchParams.toString()}`;

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

  const isFurnished =
    typeof listingDetail.isfurnished === "boolean"
      ? listingDetail.isfurnished
      : typeof listingDetail.isfurnished === "string"
        ? ["1", "true", "yes", "y"].includes(
            listingDetail.isfurnished.toLowerCase()
          )
        : false;

  const safePriceHtml = {
    __html: sanitizeHtml(listingDetail.price ?? ""),
  } satisfies { __html: string };
  // const safeDescriptionHtml = {
  //   __html: sanitizeHtml(listingDetail.description ?? ""),
  // } satisfies { __html: string };

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
    <>
      {/* Structured Data for SEO - following homepage pattern */}
      <StructuredData
        data={generateListingDetailStructuredData(listingDetail, slug)}
      />
      <StructuredData data={generateWebsiteStructuredData()} />
      <StructuredData data={generateOrganizationStructuredData()} />

      <main>
        <Shell>
          <div className="mb-3 space-y-3">
            <Breadcrumbs
              className="pt-4"
              segments={[
                { title: "Home", href: "/" },
                {
                  title: `For ${listingDetail.contract}`,
                  href: `/search/${listingDetail.contract.toLowerCase()}?q=ghana`,
                },
                {
                  title: `${listingDetail.type}`,
                  href: `/search/${listingDetail.contract.toLowerCase()}?q=ghana&ftype=${encodeURIComponent(listingDetail.type.toLowerCase())}`,
                },
                {
                  title: `${listingDetail.location}`,
                  href: `/search/${listingDetail.contract.toLowerCase()}?q=${encodeURIComponent(listingDetail.location.toLowerCase())}`,
                },
              ]}
              aria-label="Property listing navigation"
            />
            <h1 className="text-brand-accent text-2xl leading-tight font-bold tracking-tighter capitalize md:text-3xl lg:leading-[1.1]">
              {listingDetail.title}
            </h1>
          </div>
        </Shell>
        <section
          className="border-brand-badge-ongoing flex items-center justify-center border-b bg-black"
          aria-label="Property images"
        >
          <DynamicCarousel
            images={listingDetail.imagelist}
            listingId={Number(listingDetail.detailreq.split("-").pop()) || 0}
          />
        </section>
        <Shell>
          <div className="text-brand-accent mt-4 grid w-full grid-cols-1 lg:grid-cols-[2fr_1fr] lg:gap-8 lg:px-0">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-3 md:flex-nowrap md:items-center md:gap-4">
                <div className="flex items-center">
                  <h2
                    className="text-brand-accent text-2xl font-extrabold lg:text-3xl"
                    dangerouslySetInnerHTML={safePriceHtml}
                  />
                  <span className="text-brand-muted ml-2 text-sm font-light md:text-xl">
                    {listingDetail.leaseunit}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs md:gap-3">
                  {(listingDetail.owner.verification ===
                    VERIFICATION_STATUSES.APPROVED ||
                    listingDetail.owner.verification ===
                      VERIFICATION_STATUSES.APPROVED2) && (
                    <Badge variant="success" className="uppercase">
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                  {listingDetail.owner.verification ===
                    VERIFICATION_STATUSES.APPROVED3 && (
                    <Badge variant="success" className="uppercase">
                      <ShieldCheck className="mr-1 h-3 w-3" />
                      Verified Owner
                    </Badge>
                  )}
                  {Boolean(listingDetail.isnegotiable) && (
                    <Badge variant="default" className="uppercase">
                      Negotiable
                    </Badge>
                  )}
                  {/* Desktop favorite button - hidden on mobile since it's in carousel */}
                  <div className="hidden md:block">
                    <AddFavoriteButton
                      listingId={
                        Number(listingDetail.detailreq.split("-").pop()) || 0
                      }
                      showLabel={true}
                      size="md"
                      hideLabelOnMobile={false}
                    />
                  </div>
                </div>
              </div>
              <PropertyFeatures
                beds={listingDetail.beds}
                baths={listingDetail.baths}
                garages={listingDetail.garages}
                floorArea={listingDetail.floorarea}
              />
              <div className="mb-6 flex items-center gap-4">
                <Badge variant="info" className="uppercase">
                  {isFurnished ? "Furnished" : "Unfurnished"}
                </Badge>
                <Badge
                  variant="info"
                  className="max-w-[280px] uppercase md:max-w-full"
                >
                  <p className="w-full truncate">{listingDetail.location}</p>
                </Badge>
              </div>
              <TrendingPropertyCard
                propertyType="listing"
                ownerType={listingDetail.owner.type}
                count={
                  listingDetail.owner.type === "Agent"
                    ? parseInt(listingDetail.owner.listingscount) || 0
                    : 0
                }
                threshold={listingDetail.owner.type === "Agent" ? 5 : 100}
              />
              <PropertyContextCard
                propertyType="listing"
                ownerType={listingDetail.owner.type}
                ownerName={listingDetail.owner.name}
                contract={listingDetail.contract}
                type={listingDetail.type}
                location={listingDetail.location}
                listingData={{
                  parenttext: listingDetail.parenttext,
                  categorytext: listingDetail.categorytext,
                }}
              />
              <ContentSection
                title="Description"
                description=""
                href="/listings"
                className="overflow-hidden px-0 pt-14 pb-10 md:pt-20 md:pb-0"
                btnHidden
              >
                {listingDetail?.description &&
                listingDetail.description.trim() !== "" ? (
                  <ExpandableDescription
                    description={buildInnerHtml(listingDetail.description)}
                    name={listingDetail.owner.name}
                    href={agentHref}
                  />
                ) : (
                  <AlertCard
                    title="No description provided"
                    description="This listing doesn't have a detailed description yet."
                    className="my-4 h-[200px] md:h-[300px]"
                  />
                )}
              </ContentSection>
              <ContentSection
                title="Explore More"
                description=""
                href="/listings"
                className="px-0 pt-14 md:pt-20"
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

              <SafetyTipsCard />

              <PropertyInsight
                location={listingDetail.locationstring}
                bedroomType={
                  listingDetail.beds
                    ? `${listingDetail.beds}-bedroom`
                    : undefined
                }
              />
            </div>
            <aside className="hidden lg:block">
              <ContactCard
                name={listingDetail.owner.name}
                image={`${listingDetail.owner.logo !== "" ? listingDetail.owner.logo : listingDetail.owner.profilepic}`}
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
                  key={listingDetail.listingid}
                  price={extractNumericPrice(listingDetail.price)}
                />
              </ContentSection>
            )}
        </Shell>

        <ContactSection
          name={listingDetail.owner.name}
          image={`${listingDetail.owner.logo !== "" ? listingDetail.owner.logo : listingDetail.owner.profilepic}`}
          listingId={listingDetail.listingid}
        />
        {listingDetail.similars.length > 0 ? (
          <ContentSection
            title="Similar Listings"
            description=""
            href={similarSearchHref}
            className={cn(
              "mx-auto w-full",
              "mb-6 pt-14 md:block md:pt-20 lg:pt-24 [&_h2]:px-4 md:[&_h2]:px-0 [&_p]:px-4 md:[&_p]:px-0"
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
    </>
  );
}
