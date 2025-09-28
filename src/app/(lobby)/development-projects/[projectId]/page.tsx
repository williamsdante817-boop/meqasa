import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import { Badge } from "@/components/ui/badge";
import Shell from "@/layouts/shell";
import { CheckCircle, MapPin } from "lucide-react";
import Image from "next/image";
import BrochureButton from "../_component/brochure-button";

import PropertyContainer from "@/app/(lobby)/development-projects/_component/property-container";
import { getDeveloperProject } from "@/lib/get-developer-project";
import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { logError } from "@/lib/logger";

interface DeveloperProjectPageProps {
  params: Promise<{ projectId: string }>;
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: DeveloperProjectPageProps): Promise<Metadata> {
  try {
    const { projectId } = await params;
    const id = projectId.toString().split("-")[
      projectId.toString().split("-").length - 1
    ];

    const projectData = await getDeveloperProject(Number(id));

    if (!projectData?.project) {
      return {
        title: "Project Not Found | MeQasa",
        description: "The requested development project could not be found.",
      };
    }

    const projectName = projectData.project.projectname;
    const developerName = projectData.project.name || "Developer";
    const location =
      projectData.project.formatted_address || projectData.project.city;
    const description = `Explore ${projectName} by ${developerName} in ${location}. View project details, floor plans, available units, and contact information on MeQasa.`;

    return {
      title: `${projectName} - ${developerName} | Development Project | MeQasa`,
      description: description,
      keywords: [
        projectName,
        developerName,
        location,
        "development project",
        "real estate project",
        "property development",
        "MeQasa",
        "Ghana real estate",
        "new development",
        "property project",
      ],
      authors: [{ name: "MeQasa" }],
      creator: "MeQasa",
      publisher: "MeQasa",
      metadataBase: new URL(siteConfig.url),
      alternates: {
        canonical: `/development-projects/${projectId}`,
      },
      openGraph: {
        type: "website",
        locale: "en_US",
        url: `/development-projects/${projectId}`,
        siteName: siteConfig.name,
        title: `${projectName} - ${developerName} | Development Project`,
        description: description,
        images: projectData.project.photo
          ? [
              {
                url: `https://meqasa.com/uploads/imgs/${projectData.project.photo}`,
                width: 1200,
                height: 630,
                alt: `${projectName} development project`,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        site: "@meqasa",
        creator: "@meqasa",
        title: `${projectName} - ${developerName} | Development Project`,
        description: description,
        images: projectData.project.photo
          ? [`https://meqasa.com/uploads/imgs/${projectData.project.photo}`]
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
  } catch {
    return {
      title: "Development Project | MeQasa",
      description: "Explore development projects and new properties on MeQasa.",
    };
  }
}

export default async function DeveloperProjectPage({
  params,
}: DeveloperProjectPageProps) {
  try {
    const { projectId } = await params;
    const id = projectId.toString().split("-")[
      projectId.toString().split("-").length - 1
    ];

    const projectData = await getDeveloperProject(Number(id));

    // Error handling for missing project data
    if (!projectData?.project) {
      return (
        <main className="flex min-h-screen items-center justify-center">
          <div className="mx-auto max-w-md space-y-4 p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-brand-accent text-2xl font-bold">
              Project Not Found
            </h1>
            <p className="text-brand-muted">
              The development project you&apos;re looking for could not be found
              or may have been removed.
            </p>
          </div>
        </main>
      );
    }

    // Generate structured data for the development project
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      name: projectData.project.projectname,
      description: `Development project by ${projectData.project.name || "Developer"} in ${projectData.project.formatted_address || projectData.project.city}`,
      url: `${siteConfig.url}/development-projects/${projectId}`,
      image: `https://meqasa.com/uploads/imgs/${projectData.project.photo}`,
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        price: "Contact for pricing",
        priceCurrency: "GHS",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: projectData.project.city,
        addressCountry: "Ghana",
        streetAddress: projectData.project.formatted_address,
      },
      provider: {
        "@type": "RealEstateAgent",
        name: projectData.project.name || "Developer",
        logo: `https://meqasa.com/uploads/imgs/${projectData.project.logo}`,
      },
      category: "Development Project",
      propertyType: "Development",
    };

    return (
      <>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <main itemScope itemType="https://schema.org/RealEstateListing">
          <Shell>
            <Breadcrumbs
              className="my-4"
              segments={[
                {
                  title: "Home",
                  href: "/",
                },
                {
                  title: "Developers",
                  href: `/developers`,
                },
                {
                  title: projectData.project.name || "Developer",
                  href: `/projects-by-developer/${projectData.project.developerid || 1}`,
                },
                {
                  title: projectData.project.projectname,
                  href: "#",
                },
              ]}
              aria-label="Project navigation breadcrumb"
            />
          </Shell>
          <section
            className="relative flex h-[250px] w-full overflow-hidden md:mb-4 md:h-[450px]"
            aria-label="Project hero image"
          >
            {/* Background Image */}
            <Image
              src={`https://meqasa.com/uploads/imgs/${projectData.project.photo}`}
              alt={`${projectData.project.projectname} - ${projectData.project.name || "Developer"} development project`}
              fill
              sizes="(min-width: 1024px) 100vw, (min-width: 768px) 100vw, 100vw"
              className="object-cover"
              unoptimized
              priority
            />

            {/* Gradient overlay for text readability */}
            <div className="absolute bottom-0 left-0 h-52 w-full bg-gradient-to-t from-black/70 to-transparent"></div>
          </section>
          <Shell className="px-0">
            <div className="h-fit w-full bg-inherit">
              <div className="relative z-10 flex items-start gap-4 p-4 sm:items-end lg:-top-14 lg:container lg:gap-8 lg:px-0">
                {/* Company Logo Card */}
                <div className="flex h-[100px] w-[100px] flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:h-[120px] sm:w-[120px] md:h-[160px] md:w-[160px]">
                  <Image
                    src={`https://meqasa.com/uploads/imgs/${projectData.project.logo}`}
                    alt={`${projectData.project.name || "Developer"} company logo`}
                    width={120}
                    height={120}
                    className="h-auto w-auto max-w-[60px] object-contain sm:max-w-[80px] md:max-w-[120px]"
                  />
                </div>
                <div className="flex min-w-0 grow items-center justify-between">
                  <div className="grid min-w-0 gap-2">
                    <div className="space-y-2">
                      <h1
                        className="text-brand-accent line-clamp-2 text-xl leading-tight font-extrabold lg:text-3xl lg:font-bold"
                        itemProp="name"
                      >
                        {projectData.project.projectname}
                      </h1>
                      <p
                        className="text-brand-muted truncate text-sm font-medium md:text-base"
                        itemProp="provider"
                      >
                        by {projectData.project.name || "Developer"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-brand-primary/10 text-brand-primary border-brand-primary/20 font-medium uppercase"
                      >
                        Development Project
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-green-200 bg-green-50 text-green-700"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" strokeWidth="2" />
                        Active
                      </Badge>
                    </div>

                    <div
                      className="text-brand-blue mt-2 flex items-center gap-2 text-sm font-medium"
                      itemProp="address"
                    >
                      <MapPin
                        className="h-4 w-4 flex-shrink-0"
                        strokeWidth="1.5"
                        aria-hidden="true"
                      />
                      <span className="truncate">
                        {projectData.project.formatted_address ||
                          projectData.project.city}
                      </span>
                    </div>
                  </div>

                  {/* Only show brochure button if brochure data exists */}
                  {projectData.project.brochure && (
                    <div className="ml-4 flex flex-shrink-0 items-center gap-2">
                      <BrochureButton
                        className="bg-brand-accent hover:bg-brand-accent/90 hidden items-center justify-center rounded-lg font-semibold text-white shadow-md transition-colors md:flex"
                        showIcon
                        href={projectData.project.brochure}
                        aria-label={`Download ${projectData.project.projectname} brochure`}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Shell>
          <PropertyContainer projectData={projectData} />
        </main>
      </>
    );
  } catch (error) {
    logError("Failed to load development project page", error, {
      component: "DeveloperProjectPage",
      action: "getDeveloperProject",
      projectId: (await params).projectId,
    });
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="mx-auto max-w-md space-y-4 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-brand-accent text-2xl font-bold">
            Something went wrong
          </h1>
          <p className="text-brand-muted">
            We encountered an error while loading this development project.
            Please try again later.
          </p>
        </div>
      </main>
    );
  }
}
