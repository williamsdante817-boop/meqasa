import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import ContactCard from "@/components/common/contact-card";
import ContentSection from "@/components/layout/content-section";
import Shell from "@/layouts/shell";
import { buildRichInnerHtml } from "@/lib/utils";
import { getDeveloperProfile } from "@/lib/get-developer-profile";
import { CheckCircle, MapPin, Building2 } from "lucide-react";
import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { DeveloperTabs } from "../_component/developer-tabs";
import ClientReviews from "../_component/client-reviews";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { StreamingErrorBoundary } from "@/components/streaming/StreamingErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import type { DeveloperDetails } from "@/types";
import type { Metadata } from "next";
import { ExpandableDescription } from "@/components/expandable-description";

// Data validation helper - more lenient validation
function validateDeveloperData(developer: DeveloperDetails) {
  if (!developer?.developer) {
    console.warn("Developer data missing developer object");
    return false;
  }

  // Only require essential fields - hero and logo are optional for better UX
  const requiredFields = ["companyname", "address"] as const;
  const hasRequiredFields = requiredFields.every((field) => {
    const hasField = developer.developer[field];
    if (!hasField) {
      console.warn(`Missing required field: ${field}`);
    }
    return hasField;
  });

  // Log optional fields for debugging
  if (!developer.developer.hero) {
    console.warn("Missing hero image - will show fallback");
  }
  if (!developer.developer.logo) {
    console.warn("Missing logo - will show fallback");
  }

  return hasRequiredFields;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ developerId: string }>;
}): Promise<Metadata> {
  try {
    const { developerId } = await params;
    const id = developerId.split("-").pop();

    if (!id) {
      return {
        title: "Developer Not Found",
        description: "The requested developer profile could not be found.",
      };
    }

    const developer = await getDeveloperProfile(Number(id));

    if (!developer?.developer) {
      return {
        title: "Developer Not Found",
        description: "The requested developer profile could not be found.",
      };
    }

    const companyName = developer.developer.companyname;
    const address = developer.developer.address;
    const description =
      developer.developer.description ??
      `Explore properties and projects by ${companyName}, a leading developer in ${address}.`;

    return {
      title: `${companyName} - Developer Profile | MeQasa`,
      description: description,
      keywords: [
        `${companyName}`,
        "developer",
        "properties",
        "real estate",
        address,
        "MeQasa",
      ],
      openGraph: {
        title: `${companyName} - Developer Profile`,
        description: description,
        type: "website",
        url: `https://meqasa.com/projects-by-developer/${developerId}`,
        images: developer.developer.logo
          ? [
              {
                url: `https://meqasa.com/uploads/imgs/${developer.developer.logo}`,
                width: 1200,
                height: 630,
                alt: `${companyName} logo`,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${companyName} - Developer Profile`,
        description: description,
        images: developer.developer.logo
          ? [`https://meqasa.com/uploads/imgs/${developer.developer.logo}`]
          : [],
      },
      alternates: {
        canonical: `https://meqasa.com/projects-by-developer/${developerId}`,
      },
    };
  } catch {
    return {
      title: "Developer Profile | MeQasa",
      description: "Explore developer profiles and properties on MeQasa.",
    };
  }
}

// Generate structured data for SEO
function generateStructuredData(
  developer: DeveloperDetails,
  developerId: string
) {
  const companyName = developer.developer.companyname;
  const address = developer.developer.address;
  const logo = developer.developer.logo;
  const website = developer.developer.website;

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: companyName,
    address: {
      "@type": "PostalAddress",
      addressLocality: address,
    },
    image: logo ? `https://meqasa.com/uploads/imgs/${logo}` : undefined,
    url: `https://meqasa.com/projects-by-developer/${developerId}`,
    sameAs: [
      website && `https://${website}`,
      developer.developer.facebook &&
        `https://facebook.com/${developer.developer.facebook}`,
      developer.developer.twitter &&
        `https://twitter.com/${developer.developer.twitter}`,
      developer.developer.linkedin &&
        `https://linkedin.com/company/${developer.developer.linkedin}`,
      developer.developer.instagram &&
        `https://instagram.com/${developer.developer.instagram}`,
    ].filter(Boolean),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${companyName} Properties`,
      itemListElement:
        developer.projects?.map((project) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "RealEstateListing",
            name: project.projectname,
            description: `Property by ${companyName}`,
            image: `https://meqasa.com/uploads/imgs/${project.photo}`,
          },
        })) || [],
    },
  };
}

export default async function DeveloperProfilePage({
  params,
}: {
  params: Promise<{ developerId: string }>;
}) {
  const { developerId } = await params;
  const id = developerId.split("-").pop();

  if (!id) {
    notFound();
  }

  try {
    const developer = await getDeveloperProfile(Number(id));

    if (!developer?.developer) {
      notFound();
    }

    // Validate required data
    if (!validateDeveloperData(developer)) {
      console.error("Developer data validation failed:", developer);
      notFound();
    }

    // Generate structured data
    const structuredData = generateStructuredData(developer, developerId);

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <main
          role="main"
          aria-label={`${developer.developer.companyname} developer profile`}
        >
          <div className="relative flex h-[300px] min-h-[200px] w-full overflow-hidden sm:h-[350px] sm:min-h-[250px] md:h-[50vh] md:max-h-[600px] md:min-h-[400px]">
            {/* Background Image with fallback */}
            {developer.developer.hero ? (
              <ImageWithFallback
                src={`https://meqasa.com/uploads/imgs/${developer.developer.hero}`}
                alt={`${developer.developer.companyname} office building`}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                className="object-cover"
                unoptimized
                priority
                fallbackAlt="Developer office building"
              />
            ) : (
              <div className="from-brand-primary to-brand-primary/80 flex h-full w-full items-center justify-center bg-gradient-to-br">
                <div className="text-center text-white">
                  <Building2 className="mx-auto mb-4 h-16 w-16 opacity-50" />
                  <h2 className="text-2xl font-semibold opacity-75">
                    {developer.developer.companyname}
                  </h2>
                </div>
              </div>
            )}

            <Shell>
              {/* Content Container */}
              <div
                className="absolute bottom-0 left-0 h-48 w-full bg-gradient-to-t from-black/95 to-transparent sm:h-56 md:h-64"
                aria-hidden="true"
              />
              <div className="absolute bottom-4 z-10 flex h-fit flex-col items-start gap-4 px-0 sm:flex-row sm:items-end sm:gap-6 md:pb-4">
                {/* Company Logo Card */}
                {developer.developer.logo && (
                  <div
                    className="hidden h-[120px] min-h-[120px] w-[120px] min-w-[120px] items-center justify-center rounded-md bg-white/90 p-2 shadow-lg backdrop-blur-sm sm:h-[140px] sm:min-h-[140px] sm:w-[140px] sm:min-w-[140px] md:flex md:h-[160px] md:min-h-[160px] md:w-[160px] md:min-w-[160px]"
                    role="img"
                    aria-label={`${developer.developer.companyname} logo`}
                  >
                    <ImageWithFallback
                      src={`https://meqasa.com/uploads/imgs/${developer.developer.logo}`}
                      alt={`${developer.developer.companyname} logo`}
                      width={120}
                      height={120}
                      className="h-auto w-auto object-contain"
                      fallbackAlt={`${developer.developer.companyname} logo`}
                    />
                  </div>
                )}

                {/* Company Info */}
                <div className="text-white drop-shadow-lg">
                  <h1 className="mb-2 text-2xl font-semibold text-white sm:mb-3 sm:text-3xl">
                    {developer.developer.companyname}
                  </h1>
                  <div className="mb-2 flex items-center">
                    <CheckCircle
                      className="mr-2 h-4 w-4 text-green-400 sm:w-5"
                      aria-hidden="true"
                      role="img"
                    />
                    <span className="text-xs font-medium text-white/90 sm:text-sm">
                      <span className="sr-only">Status: </span>
                      active on meqasa
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin
                      className="text-brand-primary mr-2 h-5 w-5 flex-shrink-0"
                      aria-hidden="true"
                      role="img"
                    />
                    <span className="line-clamp-1 text-xs font-medium text-white/90 sm:text-sm">
                      <span className="sr-only">Location: </span>
                      {developer.developer.address}
                    </span>
                  </div>
                </div>
              </div>
            </Shell>
          </div>
          <Shell>
            <div className="text-brand-accent mt-4 grid w-full grid-cols-1 lg:grid-cols-[2fr_1fr] lg:gap-8 lg:px-0">
              <div>
                <nav aria-label="Breadcrumb navigation">
                  <Breadcrumbs
                    className="pb-4 text-gray-600"
                    segments={[
                      { title: "Home", href: "/" },
                      { title: "Developers", href: "/developers" },
                      { title: developer.developer.companyname, href: "#" },
                    ]}
                  />
                </nav>

                {/* Error boundary around DeveloperTabs */}
                <StreamingErrorBoundary
                  errorFallback={
                    <div
                      className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center"
                      role="alert"
                      aria-live="polite"
                    >
                      <h2 className="mb-4 text-2xl font-semibold text-red-600">
                        Something went wrong
                      </h2>
                      <p className="mb-6 max-w-md text-gray-600">
                        We encountered an error while loading the developer
                        projects. Please try again.
                      </p>
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-brand-primary hover:bg-brand-primary/90 focus:ring-brand-primary rounded-md px-4 py-2 text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
                        aria-label="Retry loading developer projects"
                      >
                        Try again
                      </button>
                    </div>
                  }
                >
                  <Suspense
                    fallback={
                      <div
                        className="mt-8"
                        role="status"
                        aria-label="Loading developer projects and units"
                      >
                        <Skeleton className="h-64 w-full" />
                      </div>
                    }
                  >
                    <DeveloperTabs developer={developer} />
                  </Suspense>
                </StreamingErrorBoundary>

                <section aria-labelledby="about-developer-heading">
                  <ContentSection
                    title="About Developer"
                    description=""
                    href=""
                    className="pt-10 pb-8 sm:pt-14 sm:pb-10 md:pt-20 md:pb-0"
                    btnHidden
                  >
                    <ExpandableDescription
                      description={buildRichInnerHtml(
                        developer.developer.about ?? ""
                      )}
                      name={developer.developer.companyname}
                      href={`/projects-by-developer/${developerId}`}
                    />
                  </ContentSection>
                </section>

                <section aria-labelledby="client-reviews-heading">
                  <ContentSection
                    title={`What clients are saying about ${developer.developer.companyname}`}
                    description=""
                    href=""
                    className="pt-10 pb-8 sm:pt-14 sm:pb-10 md:pt-20 md:pb-0"
                    btnHidden
                  >
                    {/* Error boundary around ClientReviews */}
                    <StreamingErrorBoundary
                      errorFallback={
                        <div
                          className="flex min-h-[200px] flex-col items-center justify-center p-8 text-center"
                          role="alert"
                          aria-live="polite"
                        >
                          <h2 className="mb-4 text-xl font-semibold text-red-600">
                            Something went wrong
                          </h2>
                          <p className="mb-6 max-w-md text-gray-600">
                            We encountered an error while loading client
                            reviews. Please try again.
                          </p>
                          <button
                            onClick={() => window.location.reload()}
                            className="bg-brand-primary hover:bg-brand-primary/90 focus:ring-brand-primary rounded-md px-4 py-2 text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
                            aria-label="Retry loading client reviews"
                          >
                            Try again
                          </button>
                        </div>
                      }
                    >
                      <Suspense
                        fallback={
                          <div
                            className="h-32"
                            role="status"
                            aria-label="Loading client reviews"
                          >
                            <Skeleton className="h-full w-full" />
                          </div>
                        }
                      >
                        <ClientReviews />
                      </Suspense>
                    </StreamingErrorBoundary>
                  </ContentSection>
                </section>
              </div>
              <aside
                className="hidden pb-6 md:block"
                aria-label="Contact information"
              >
                <ContactCard
                  name={developer.developer.companyname}
                  image={developer.developer.logo}
                  src
                  projectId={developerId}
                  pageType="project"
                />
              </aside>
            </div>
          </Shell>
        </main>
      </>
    );
  } catch (error: unknown) {
    console.error("Error fetching developer profile:", error);
    notFound();
  }
}
