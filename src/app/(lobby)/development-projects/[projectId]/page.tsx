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
  } catch (error) {
    return {
      title: "Development Project | MeQasa",
      description: "Explore development projects and new properties on MeQasa.",
    };
  }
}

export default async function DeveloperProjectPage({
  params,
}: DeveloperProjectPageProps) {
  const { projectId } = await params;
  const id = projectId.toString().split("-")[
    projectId.toString().split("-").length - 1
  ];

  const projectData = await getDeveloperProject(Number(id));

  console.log(projectData);

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
      <div>
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
          />
        </Shell>
        <div className="relative w-full h-[250px] md:h-[450px] overflow-hidden flex md:mb-4 ">
          {/* Background Image */}
          <Image
            src={`https://meqasa.com/uploads/imgs/${projectData.project.photo}`}
            alt="Office building"
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
            className="object-cover"
            unoptimized
            priority
          />

          <div className="absolute bottom-0 left-0 w-full h-52 bg-gradient-to-t from-black to-transparent"></div>
        </div>
        <Shell className="px-0">
          <div className="h-fit w-full bg-inherit">
            <div className="relative z-10 flex items-end gap-2 p-3 lg:container lg:-top-14 lg:gap-8 lg:px-0">
              {/* Company Logo Card */}
              <div className="bg-white rounded-lg p-2 w-[130px] h-[130px] md:w-[160px] md:h-[160px] flex items-center justify-center border">
                <Image
                  src={`https://meqasa.com/uploads/imgs/${projectData.project.logo}`}
                  alt="Goldkey Properties Logo"
                  width={120}
                  height={120}
                  className="object-contain w-auto h-auto"
                />
              </div>
              <div className="flex grow items-center justify-between">
                <div className="grid">
                  <h1 className="mb-1 text-xl font-extrabold text-brand-accent lg:text-3xl lg:font-bold">
                    {projectData.project.projectname}
                  </h1>
                  <div>
                    <Badge className="bg-brand-primary uppercase">
                      As Developer
                    </Badge>
                  </div>
                  <div className="mt-3">
                    <span className="flex items-center gap-2 text-sm font-normal text-brand-muted">
                      <CheckCircle
                        className="h-5 w-5 text-green-600"
                        strokeWidth="1.5"
                      />{" "}
                      active on meqasa
                    </span>
                    <span className="mt-1 flex items-center gap-2 text-end text-xs font-medium text-brand-blue lg:text-sm">
                      {" "}
                      <MapPin className="h-5 w-5" strokeWidth="1.5" />{" "}
                      {projectData.project.formatted_address ||
                        projectData.project.city}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <BrochureButton
                    className="hidden rounded-md md:flex items-center justify-center bg-brand-accent font-semibold hover:bg-brand-accent "
                    showIcon
                  />
                </div>
              </div>
            </div>
          </div>
        </Shell>
        <PropertyContainer projectData={projectData} />
      </div>
    </>
  );
}
