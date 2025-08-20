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
import { cn, formatNumber, sanitizeHtmlString } from "@/lib/utils";
import { BathIcon, BedIcon, ParkingSquare, Square } from "lucide-react";
import Link from "next/link";
import ProjectVideo from "../../development-projects/_component/project-video";
import { ErrorCard } from "@/components/error-card";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

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

// Helper function to extract the first currency amount (e.g., GH₵ 3,687,912) from HTML/text and return digits
const extractNumericPrice = (priceString: string): string => {
  if (!priceString) return "0";
  const text = priceString.replace(/<[^>]*>/g, " ");
  const currencyRegex =
    /(?:GH\s*₵|GHS|GH₵)?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?)/i;
  const match = currencyRegex.exec(text);
  if (match?.[1]) return match[1].replace(/,/g, "");
  const digitsOnly = text.replace(/[^\d]/g, "");
  return digitsOnly || "0";
};

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const match = /-(\d+)$/.exec(slug);

    if (!match?.[1]) {
      return {
        title: "Listing Not Found | MeQasa",
        description: "The requested property listing could not be found.",
      };
    }

    const listingId = match[1];
    const listingDetail = await getListingDetails(listingId);

    if (!listingDetail) {
      return {
        title: "Listing Not Found | MeQasa",
        description: "The requested property listing could not be found.",
      };
    }

    const title = `${listingDetail.title || "Property"} for ${listingDetail.contract} in ${listingDetail.locationstring} | MeQasa`;
    const description = `${listingDetail.title || "Property"} for ${listingDetail.contract} in ${listingDetail.locationstring}. ${listingDetail.beds} bed, ${listingDetail.baths} bath property with ${listingDetail.floorarea} sqm floor area. ${listingDetail.price ? `Price: ${listingDetail.price}` : "Contact for pricing"}.`;

    const keywords = [
      listingDetail.title || "property",
      listingDetail.contract,
      listingDetail.locationstring,
      listingDetail.type,
      `${listingDetail.beds} bedroom`,
      `${listingDetail.baths} bathroom`,
      listingDetail.floorarea,
      "MeQasa",
      "Ghana real estate",
      "property listing",
      listingDetail.contract === "rent"
        ? "rental property"
        : "property for sale",
    ];

    return {
      title,
      description,
      keywords,
      authors: [{ name: "MeQasa" }],
      creator: "MeQasa",
      publisher: "MeQasa",
      metadataBase: new URL(siteConfig.url),
      alternates: {
        canonical: `/listings/${slug}`,
      },
      openGraph: {
        type: "website",
        locale: "en_US",
        url: `/listings/${slug}`,
        siteName: siteConfig.name,
        title,
        description,
        images: listingDetail.imagelist?.[0]
          ? [
              {
                url: `https://meqasa.com/uploads/imgs/${listingDetail.imagelist[0]}`,
                width: 1200,
                height: 630,
                alt: listingDetail.title || "Property listing",
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        site: "@meqasa",
        creator: "@meqasa",
        title,
        description,
        images: listingDetail.imagelist?.[0]
          ? [`https://meqasa.com/uploads/imgs/${listingDetail.imagelist[0]}`]
          : [],
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  } catch (error) {
    return {
      title: "Property Listing | MeQasa",
      description: "View detailed property information on MeQasa.",
    };
  }
}

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

    // Generate structured data for the property listing
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      name: listingDetail.title || `Property for ${listingDetail.contract}`,
      description:
        listingDetail.description ||
        `${listingDetail.title || "Property"} for ${listingDetail.contract} in ${listingDetail.locationstring}`,
      url: `${siteConfig.url}/listings/${slug}`,
      image: listingDetail.imagelist?.[0]
        ? `https://meqasa.com/uploads/imgs/${listingDetail.imagelist[0]}`
        : undefined,
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        price: listingDetail.price || "Contact for pricing",
        priceCurrency: "GHS",
        businessFunction:
          listingDetail.contract === "rent"
            ? "http://purl.org/goodrelations/v1#LeaseOut"
            : "http://purl.org/goodrelations/v1#Sell",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: listingDetail.streetaddress,
        addressLocality: listingDetail.locationstring,
        addressCountry: "Ghana",
      },
      numberOfBedrooms: parseInt(listingDetail.beds) || undefined,
      numberOfBathrooms: parseInt(listingDetail.baths) || undefined,
      floorSize: {
        "@type": "QuantitativeValue",
        value: listingDetail.floorarea,
        unitCode: "MTK",
      },
      propertyType: listingDetail.type,
      category:
        listingDetail.contract === "rent"
          ? "Rental Property"
          : "Property for Sale",
    };

    // Build Similar Listings search href based on current listing details
    const contract = listingDetail.contract.toLowerCase();
    const location = listingDetail.location.toLowerCase();
    const type = listingDetail.type.toLowerCase();
    const searchParams = new URLSearchParams({
      q: location,
      page: "1",
      ftype: type,
    });
    const numBeds = Number.parseInt(listingDetail.beds, 10);
    const numBaths = Number.parseInt(listingDetail.baths, 10);
    if (!Number.isNaN(numBeds) && numBeds > 0)
      searchParams.set("fbeds", String(numBeds));
    if (!Number.isNaN(numBaths) && numBaths > 0)
      searchParams.set("fbaths", String(numBaths));
    const similarSearchHref = `/search/${contract}?${searchParams.toString()}`;

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
              listingDetail.isfurnished.toLowerCase(),
            )
          : false;

    const safePriceHtml = {
      __html: sanitizeHtmlString(listingDetail.price ?? ""),
    } satisfies { __html: string };
    const safeDescriptionHtml = {
      __html: sanitizeHtmlString(listingDetail.description ?? ""),
    } satisfies { __html: string };

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
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
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
            <div className="grid grid-cols-1 text-brand-accent w-full mt-4 lg:grid-cols-[2fr_1fr] lg:gap-8 lg:px-0">
              <div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <h2
                      className="text-2xl font-extrabold text-brand-accent lg:text-3xl"
                      dangerouslySetInnerHTML={safePriceHtml}
                    />
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
                <div className="flex items-center gap-4 py-3">
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
                    {isFurnished ? "Furnished" : "Unfurnished"}
                  </Badge>
                  <Badge className="uppercase text-xs text-blue-500 bg-blue-100/60 max-w-[280px] md:max-w-full">
                    <p className="truncate w-full">{listingDetail.location}</p>
                  </Badge>
                </div>
                <aside className="mb-6">
                  {listingDetail.owner.listingscount !== "0" && (
                    <div className="flex items-center gap-4 md:gap-8 border-y text-sm py-4 lg:py-10 lg:text-base">
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
                  <Card className="flex items-start justify-between gap-5 rounded-lg border-orange-200 px-4 text-brand-accent lg:flex-row lg:w-fit lg:px-6 py-4">
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
                  className="pt-14 md:pt-20 px-0 pb-10 md:pb-0"
                  btnHidden
                >
                  {listingDetail?.description &&
                  listingDetail.description.trim() !== "" ? (
                    <>
                      <p
                        dangerouslySetInnerHTML={safeDescriptionHtml}
                        className="text-brand-muted"
                      />
                      <span className="block text-gray-500 mt-4">
                        Listed by:{" "}
                        <Link
                          href={agentHref}
                          className="decoration-dashed hover:text-blue-500 underline underline-offset-2"
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
                  className="pt-14 px-0 md:pt-20"
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

                {listingDetail.contract.toLowerCase() !==
                  CONTRACT_TYPES.SALE && (
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
                "w-full mx-auto",
                "pt-14 md:pt-20 lg:pt-24 md:block mb-6",
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
  } catch (error: unknown) {
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

    // Handle explicit "listing not found" coming from backend
    if (
      error instanceof Error &&
      error.message.toLowerCase().includes("listing not found")
    ) {
      return (
        <main>
          <Shell>
            <div className="max-w-md mx-auto my-20">
              <ErrorCard
                title="Property listing not found"
                description={error.message}
                retryLink="/"
                retryLinkText="Go to Home"
              />
            </div>
          </Shell>
        </main>
      );
    }

    return (
      <main>
        <Shell>
          <div className="max-w-md mx-auto my-20">
            <ErrorCard
              title="Error Loading Page"
              description="Sorry, we encountered an error while loading this property listing. Please try again later."
              retryLink="/"
              retryLinkText="Go to Home"
            />
          </div>
        </Shell>
      </main>
    );
  }
}
