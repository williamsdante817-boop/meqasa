"use client";
import Amenities from "@/components/amenities";
import { AlertCard } from "@/components/common/alert-card";
import ContactCard from "@/components/common/contact-card";
import ContactSection from "@/components/contact-section";
import ContentSection from "@/components/layout/content-section";
import PropertyDetailsTable from "@/components/property/details/property-details";
import PropertyShowcase from "@/components/property/details/property-showcase";
import PropertyListings from "@/components/property/listings/property-listings";
import { Badge } from "@/components/ui/badge";
import Shell from "@/layouts/shell";
import { sanitizeRichHtmlToInnerHtml } from "@/lib/dom-sanitizer";
import { cn, formatPrice } from "@/lib/utils";
import type { DeveloperProject } from "@/types";
import { AlertCircle, Dot, MapPin, RefreshCw } from "lucide-react";
import { Component, useMemo, useRef, type ReactNode } from "react";

// Import components directly for better performance and simpler code
import { NearestEstablishments } from "@/components/nearest-establishments";
import FloorPlans from "./floor-plan";
import ProjectVideo from "./project-video";
import PropertyScrollNav from "./property-scroll-nav";
import { ExpandableDescription } from "@/components/expandable-description";

// Constants for better maintainability
const SECTION_IDS = {
  FLOOR_PLAN: "floor-plan",
  SITE_PLAN: "site-plan",
  LOCATION: "location",
  AVAILABLE_UNITS: "available-units",
} as const;

const STATUS_BADGE_VARIANTS = {
  completed: "success",
  ongoing: "warning",
  default: "default",
} as const;

// Enhanced error boundary for production
class PropertyContainerErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error; errorId?: string }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    // Enhanced error logging for production monitoring
    console.error("PropertyContainer Error:", {
      error: error.message,
      stack: error.stack,
      errorInfo,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <PropertyContainerError
            error={this.state.error!}
            errorId={this.state.errorId}
            retry={() =>
              this.setState({
                hasError: false,
                error: undefined,
                errorId: undefined,
              })
            }
          />
        )
      );
    }

    return this.props.children;
  }
}

// Enhanced error fallback component
function PropertyContainerError({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error,
  errorId,
  retry,
}: {
  error: Error;
  errorId?: string;
  retry: () => void;
}) {
  return (
    <div
      className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center"
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="mb-4 h-16 w-16 text-red-500" aria-hidden="true" />
      <h2 className="mb-2 text-2xl font-bold text-gray-900">
        Something went wrong
      </h2>
      <p className="mb-4 max-w-md text-gray-600">
        We couldn&apos;t load the project details. Please try again or contact
        support if the problem persists.
      </p>
      {errorId && (
        <p className="mb-6 text-xs text-gray-400">Error ID: {errorId}</p>
      )}
      <button
        onClick={retry}
        className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        aria-label="Retry loading project details"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </button>
    </div>
  );
}

// Enhanced data validation helper
function validateProjectData(data: DeveloperProject): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if data exists
  if (!data) {
    errors.push("No project data provided");
    return { isValid: false, errors };
  }

  // Check if project object exists
  if (!data.project) {
    errors.push("Project information is missing");
    return { isValid: false, errors };
  }

  // Check required project fields
  if (!data.project.projectid) errors.push("Missing project ID");
  if (!data.project.projectname) errors.push("Missing project name");
  if (!data.project.companyname) errors.push("Missing company name");

  // Check if arrays exist to prevent runtime errors
  if (!Array.isArray(data.unittypes)) errors.push("Unit types data is invalid");
  if (!Array.isArray(data.projecttypes))
    errors.push("Project types data is invalid");
  if (!Array.isArray(data.photos)) errors.push("Photos data is invalid");
  if (!Array.isArray(data.features)) errors.push("Features data is invalid");
  if (!Array.isArray(data.units)) errors.push("Units data is invalid");

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Memoized project data transformers with safety checks
function useProjectDataTransformers(projectData: DeveloperProject) {
  console.log(projectData);
  return useMemo(
    () => ({
      markup: sanitizeRichHtmlToInnerHtml(
        projectData.project?.aboutproject ?? ""
      ),
      unityTypes: (projectData.unittypes ?? []).map(
        (unitType) => unitType.type + " "
      ),
      projectType:
        (projectData.projecttypes ?? []).map((project) => project.type)[0] ??
        "Not specified",
      images: (projectData.photos ?? []).map((photo) => photo.photo),
      projectDetails: [
        { title: "Name", value: projectData.project?.name ?? "Not specified" },
        {
          title: "Neighborhood",
          value: projectData.project?.city ?? "Not specified",
        },
        {
          title: "Location",
          value: projectData.project?.formatted_address ?? "Not specified",
        },
        {
          title: "Region",
          value: projectData.project?.region ?? "Not specified",
        },
        {
          title: "Status",
          value: projectData.project?.projectstatus ?? "Not specified",
        },
        {
          title: "Number of Buildings",
          value: projectData.project?.unitcount ?? "Not specified",
        },
        {
          title: "Project Types",
          value:
            (projectData.projecttypes ?? []).map((pt) => pt.type).join(", ") ||
            "Not specified",
        },
        {
          title: "Unit Types",
          value:
            (projectData.unittypes ?? []).map((ut) => ut.type).join(", ") ||
            "Not specified",
        },
        {
          title: "Parking Types",
          value:
            (projectData.parkingtypes ?? []).map((pt) => pt.type).join(", ") ||
            "Not specified",
        },
        {
          title: "Date Updated",
          value: projectData.project?.updated_at ?? "Not specified",
        },
      ],
    }),
    [projectData]
  );
}

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

  // Use memoized transformers - this hook MUST be called first
  const { markup, unityTypes, projectType, images, projectDetails } =
    useProjectDataTransformers(projectData);

  // Memoize status badge variant - this hook MUST be called second
  const statusBadgeVariant = useMemo(() => {
    const status = projectData.project.projectstatus?.toLowerCase();
    return (
      STATUS_BADGE_VARIANTS[status as keyof typeof STATUS_BADGE_VARIANTS] ||
      STATUS_BADGE_VARIANTS.default
    );
  }, [projectData.project.projectstatus]);

  // Memoize price range display - this hook MUST be called third
  const priceRangeDisplay = useMemo(() => {
    if (!projectData.minmax || projectData.minmax.length === 0) {
      return null;
    }

    return projectData.minmax.map((obj, index) => (
      <div
        className="mt-6 flex items-center justify-between rounded-lg border border-orange-200 bg-gradient-to-r from-gray-50 to-gray-50 p-4 shadow-sm transition-shadow md:p-6"
        key={`${projectData.project.projectid}-${index}`}
      >
        <div>
          <div className="mb-3">
            <span className="text-brand-accent text-sm font-semibold lg:text-base">
              Price Range
            </span>
            <span className="text-brand-muted block text-xs"> (minimum)</span>
          </div>
          <span className="text-brand-accent text-xl font-extrabold lg:text-2xl lg:font-bold">
            {formatPrice(obj.minprice, { currency: "GHS" })}
          </span>
        </div>
        <div>
          <div className="mb-3">
            <span className="text-brand-accent text-sm font-semibold lg:text-base">
              Price Range
            </span>
            <span className="text-brand-muted block text-xs"> (maximum)</span>
          </div>
          <span className="text-brand-accent text-xl font-extrabold lg:text-2xl lg:font-bold">
            {formatPrice(obj.maxprice, { currency: "GHS" })}
          </span>
        </div>
      </div>
    ));
  }, [projectData.minmax, projectData.project.projectid]);

  // Memoize units mapping - this hook MUST be called fourth
  const mappedUnits = useMemo(() => {
    if (!projectData.units || projectData.units.length === 0) return [];

    return projectData.units.map((unit) => ({
      ...unit,
      image: unit.coverphoto,
      detailreq: `/developer-unit/${unit.unitid}`,
      listingid: String(unit.unitid),
      streetaddress: unit.address,
      contract: unit.terms,
      title: unit.title ?? unit.unitname,
      garages: unit.garages?.toString() ?? "0",
      price: unit.price?.toString() ?? "0",
      bathroomcount: unit.baths?.toString() ?? "0",
      bedroomcount: unit.beds?.toString() ?? "0",
      summary: unit.title ?? unit.unitname,
      pricepart1: unit.price?.toString() ?? "0",
      pricepart2: unit.terms === "rent" ? "/month" : "",
      featured: Boolean(unit.featured),
    }));
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
      <PropertyScrollNav sectionRefs={sectionRefs} />
      <Shell>
        <div className="text-brand-accent mt-4 grid w-full grid-cols-1 lg:grid-cols-[2fr_1fr] lg:gap-8">
          <div className="mt-6 grid gap-8 pb-3 transition-all duration-300 ease-in lg:grid-cols-1 lg:px-0">
            <div>
              <div className="text-brand-accent">
                <span className="text-base font-semibold">
                  Project Highlight
                </span>
                <div className="item-center mt-3 mb-1 flex h-full gap-4">
                  <h1 className="text-3xl font-extrabold text-inherit">
                    {projectData.project.projectname}
                  </h1>
                  {projectData.project.projectstatus && (
                    <div className="flex items-center">
                      <Badge
                        variant={statusBadgeVariant}
                        className="uppercase"
                        aria-label={`Project status: ${projectData.project.projectstatus}`}
                      >
                        {projectData.project.projectstatus}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="mb-2 text-sm">
                  <span className="flex items-center font-light text-inherit">
                    {projectType} <Dot className="h-4 w-4" aria-hidden="true" />
                    <span className="line-clamp-1 uppercase">
                      {unityTypes.map((type) => type)}
                    </span>
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-end text-xs font-medium text-blue-600 lg:text-sm">
                  <MapPin
                    className="h-5 w-5"
                    strokeWidth="1.3"
                    aria-hidden="true"
                  />
                  {projectData.project.formatted_address ||
                    projectData.project.city}
                </div>
              </div>

              {priceRangeDisplay ?? (
                <div className="mt-6 rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-50 p-4 text-center md:p-6">
                  <p className="text-brand-muted text-sm">
                    Price information not available
                  </p>
                </div>
              )}

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
                    className="hidden px-0 pt-14 md:block md:pt-20"
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
                    className="flex h-96 items-center justify-center rounded-lg border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-50"
                  >
                    <p className="text-brand-muted text-sm">
                      Site plans will be available soon
                    </p>
                  </div>
                </ContentSection>
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
              <FloorPlans />
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
            href="/listings"
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
