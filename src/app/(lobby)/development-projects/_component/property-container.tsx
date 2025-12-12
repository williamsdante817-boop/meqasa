"use client";
import Amenities from "@/components/amenities";
import { AlertCard } from "@/components/common/alert-card";
import ContactCard from "@/components/common/contact-card";
import ContactSection from "@/components/contact-section";
import ContentSection from "@/components/layout/content-section";
import type { Listing } from "@/components/property/cards/property-card";
import PropertyDetailsTable from "@/components/property/details/property-details";
import PropertyShowcase from "@/components/property/details/property-showcase";
import PropertyListings from "@/components/property/listings/property-listings";
import Shell from "@/layouts/shell";
import { cn } from "@/lib/utils";
import type { DeveloperProject } from "@/types";
import Image from "next/image";
import { useMemo, useRef } from "react";

// Import components directly for better performance and simpler code
import { ExpandableDescription } from "@/components/expandable-description";
import { NearestEstablishments } from "@/components/nearest-establishments";
import FloorPlans from "./floor-plan";
import ProjectVideo from "./project-video";
import PropertyScrollNav from "./property-scroll-nav";

// Import refactored modules
import {
  PropertyContainerError,
  PropertyContainerErrorBoundary,
} from "./property-container-error-boundary";
import {
  mapProjectUnits,
  SECTION_IDS,
  useProjectDataTransformers,
  validateProjectData,
} from "./property-container-utils";
import { PropertyPriceRange } from "./property-price-range";
import { PropertyProjectHeader } from "./property-project-header";

// Constants moved to property-container-utils.ts

// Error boundary and error components moved to property-container-error-boundary.tsx

// Data validation moved to property-container-utils.ts

// Data transformers moved to property-container-utils.ts

// Main component with enhanced error handling and performance
function PropertyContainerContent({
  projectData,
}: {
  projectData: DeveloperProject;
}) {
  // ALL HOOKS MUST BE CALLED AT THE TOP LEVEL, BEFORE ANY CONDITIONAL RETURNS

  // Create individual refs at the top level
  const floorPlanRef = useRef<HTMLDivElement>(null);
  const sitePlanRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const availableUnitsRef = useRef<HTMLDivElement>(null);

  // Group refs into an object for easier access
  const sectionRefs = useMemo(
    () => ({
      [SECTION_IDS.FLOOR_PLAN]: floorPlanRef,
      [SECTION_IDS.SITE_PLAN]: sitePlanRef,
      [SECTION_IDS.LOCATION]: locationRef,
      [SECTION_IDS.AVAILABLE_UNITS]: availableUnitsRef,
    }),
    []
  );

  // Use memoized transformers from utils
  const { markup, unityTypes, projectType, images, projectDetails } =
    useProjectDataTransformers(projectData);

  // Memoize units mapping using utility function
  const mappedUnits = useMemo<Listing[]>(() => {
    return mapProjectUnits(projectData.units ?? []);
  }, [projectData.units]);

  // Validate data AFTER all hooks have been called
  const validation = validateProjectData(projectData);
  if (!validation.isValid) {
    return (
      <PropertyContainerError
        error={
          new Error(`Invalid project data: ${validation.errors.join(", ")}`)
        }
        retry={() => window.location.reload()}
      />
    );
  }

  return (
    <>
      <PropertyScrollNav sectionRefs={sectionRefs} projectData={projectData} />
      <Shell>
        <div className="text-brand-accent mt-4 grid w-full grid-cols-1 lg:grid-cols-[2fr_1fr] lg:gap-8">
          <div className="mt-6 grid gap-8 pb-3 transition-all duration-300 ease-in lg:grid-cols-1 lg:px-0">
            <div>
              {/* Project Header - extracted to separate component */}
              <PropertyProjectHeader
                projectData={projectData}
                unityTypes={unityTypes}
                projectType={projectType}
              />

              {/* Price Range - extracted to separate component */}
              <PropertyPriceRange projectData={projectData} />

              <div className="container mx-auto">
                {projectData.project.aboutproject && (
                  <ContentSection
                    title="About Developer"
                    description=""
                    href=""
                    className="px-0 pt-14 pb-10 md:pt-20 md:pb-0"
                    btnHidden
                  >
                    <ExpandableDescription
                      description={markup}
                      name={projectData.project.companyname}
                      href=""
                    />
                  </ContentSection>
                )}

                {images && images.length > 0 && (
                  <ContentSection
                    title="Explore More"
                    description=""
                    href="/listings"
                    className="px-0 pt-14 md:pt-20"
                    btnHidden
                  >
                    <PropertyShowcase images={images} />
                  </ContentSection>
                )}

                <ContentSection
                  title="Project Details"
                  description=""
                  href=""
                  className="hidden px-0 pt-14 md:block md:pt-20"
                  btnHidden
                >
                  <PropertyDetailsTable details={projectDetails} />
                </ContentSection>

                {projectData.features && projectData.features.length > 0 && (
                  <ContentSection
                    title="Amenities"
                    description=""
                    href=""
                    className="px-0 pt-14 md:pt-20"
                    btnHidden
                  >
                    <Amenities
                      amenities={projectData.features.map((f) => f.feature)}
                    />
                  </ContentSection>
                )}

                {projectData.project.tourvideo && (
                  <ProjectVideo videoUrl={projectData.project.tourvideo} />
                )}

                {/* Only show site plans if they exist in the data */}
                {projectData.project.siteplan && (
                  <ContentSection
                    title="Site Plans"
                    description=""
                    href=""
                    className="px-0 pt-14 md:pt-20"
                    btnHidden
                    sectionId="site-plan"
                  >
                    <div
                      id="site-plan"
                      ref={sectionRefs["site-plan"]}
                      className="relative h-96 overflow-hidden rounded-lg border border-gray-200 bg-white"
                    >
                      <Image
                        src={`https://meqasa.com/uploads/imgs/${projectData.project.siteplan}`}
                        alt={`Site plan for ${projectData.project.projectname}`}
                        fill
                        className="object-contain"
                        sizes="(min-width: 768px) 100vw, 100vw"
                      />
                    </div>
                  </ContentSection>
                )}
              </div>
            </div>
          </div>
          <aside className="hidden pb-6 lg:block">
            <ContactCard
              src
              name={projectData.project.companyname}
              image={projectData.project.logo}
              projectId={projectData.project.projectid.toString()}
              pageType="project"
            />
          </aside>
        </div>
      </Shell>
      <Shell>
        <div className="w-full" role="complementary">
          <section
            id="floor-plan"
            ref={sectionRefs["floor-plan"]}
            aria-labelledby="floor-plans-heading"
          >
            <ContentSection
              title="Floor Plans"
              description="View available floor plan layouts"
              href="#floor-plan"
              className="px-0 pt-14 md:pt-20"
              btnHidden
              id="floor-plans-heading"
            >
              <FloorPlans floorPlans={projectData.floorplans || []} />
            </ContentSection>
          </section>

          <section
            id="location"
            ref={sectionRefs.location}
            className="w-full py-16"
            aria-labelledby="location-heading"
          >
            <ContentSection
              title="Nearest Establishments"
              description="View nearby points of interest"
              href="#location"
              className="px-0 pt-14 md:pt-20"
              btnHidden
              id="location-heading"
            >
              <NearestEstablishments
                className="mb-8"
                propertyLocation={{
                  lat: projectData.project.lat || 5.56,
                  lng: projectData.project.lng || -0.2057,
                }}
                propertyName={projectData.project.projectname}
                neighborhood={
                  projectData.project.city || projectData.project.region
                }
              />
              {/* <NearbyLocation /> */}
            </ContentSection>
          </section>
        </div>
      </Shell>

      <ContactSection
        name={projectData.project.companyname}
        image={projectData.project.logo}
        src
        projectId={projectData.project.projectid.toString()}
        pageType="project"
      />

      <div
        id={SECTION_IDS.AVAILABLE_UNITS}
        ref={sectionRefs[SECTION_IDS.AVAILABLE_UNITS]}
        className="w-full"
      >
        {mappedUnits.length > 0 ? (
          <ContentSection
            title="Available Units"
            description=""
            href={`/units/search?terms=${projectData.project.projectstatus === "completed" ? "sale" : "rent"}&projectid=${projectData.project.projectid}`}
            className={cn(
              "px-0 py-14 md:block md:pt-20 lg:mx-auto lg:max-w-7xl [&_h2]:px-4 [&_p]:px-4"
            )}
          >
            <PropertyListings
              listings={mappedUnits}
              parentContract={
                projectData.project.projectstatus === "completed"
                  ? "sale"
                  : "rent"
              }
            />
          </ContentSection>
        ) : (
          <Shell>
            <AlertCard
              className="my-10 h-[200px]"
              title="No units available"
              description="Please check back later for available units."
            />
          </Shell>
        )}
      </div>
    </>
  );
}

// Main exported component with error boundary
export default function PropertyContainer({
  projectData,
}: {
  projectData: DeveloperProject;
}) {
  return (
    <PropertyContainerErrorBoundary>
      <PropertyContainerContent projectData={projectData} />
    </PropertyContainerErrorBoundary>
  );
}
