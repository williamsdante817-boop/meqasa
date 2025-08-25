"use client";
import { AlertCard } from "@/components/common/alert-card";
import Amenities from "@/components/amenities";
import ContactCard from "@/components/common/contact-card";
import ContactSection from "@/components/contact-section";
import ContentSection from "@/components/layout/content-section";
import PropertyDetailsTable from "@/components/property/details/property-details";
import PropertyListings from "@/components/property/listings/property-listings";
import PropertyShowcase from "@/components/property/details/property-showcase";
import { Badge } from "@/components/ui/badge";
import Shell from "@/layouts/shell";
import { cn, formatPrice } from "@/lib/utils";
import { sanitizeRichHtmlToInnerHtml } from "@/lib/dom-sanitizer";
import type { DeveloperProject } from "@/types";
import { Dot, MapPin, AlertCircle, RefreshCw } from "lucide-react";
import { useRef, useMemo, Component, type ReactNode } from "react";

// Import components directly for better performance and simpler code
import FloorPlans from "./floor-plan";
import NearbyLocation from "./nearest-establishements";
import { NearestEstablishments } from "@/components/nearest-establishments";
import ProjectVideo from "./project-video";
import PropertyScrollNav from "./property-scroll-nav";

// Constants for better maintainability
const SECTION_IDS = {
  FLOOR_PLAN: "floor-plan",
  SITE_PLAN: "site-plan",
  LOCATION: "location",
  AVAILABLE_UNITS: "available-units",
} as const;

const STATUS_BADGE_VARIANTS = {
  completed: "bg-green-500 text-white",
  ongoing: "bg-yellow-500 text-white",
  default: "bg-gray-500 text-white",
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
      className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center"
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="h-16 w-16 text-red-500 mb-4" aria-hidden="true" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-600 mb-4 max-w-md">
        We couldn&apos;t load the project details. Please try again or contact
        support if the problem persists.
      </p>
      {errorId && (
        <p className="text-xs text-gray-400 mb-6">Error ID: {errorId}</p>
      )}
      <button
        onClick={retry}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
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
  return useMemo(
    () => ({
      markup: sanitizeRichHtmlToInnerHtml(
        projectData.project?.aboutproject ?? "",
      ),
      unityTypes: (projectData.unittypes ?? []).map(
        (unitType) => unitType.type + " ",
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
    [projectData],
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
    [],
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
        className="mt-6 flex items-center justify-between rounded-lg border border-orange-300 p-3 text-brand-accent shadow-sm"
        key={`${projectData.project.projectid}-${index}`}
      >
        <div>
          <div className="mb-3">
            <span className="text-sm font-semibold capitalize text-inherit lg:text-base">
              price range
            </span>
            <span className="text-xs tracking-wide"> (minimum)</span>
          </div>
          <span className="text-xl font-extrabold text-inherit lg:text-2xl lg:font-bold">
            {formatPrice(obj.minprice, { currency: "GHS" })}
          </span>
        </div>
        <div>
          <div className="mb-3">
            <span className="text-sm font-semibold capitalize text-inherit lg:text-base">
              price range
            </span>
            <span className="text-xs tracking-wide"> (maximum)</span>
          </div>
          <span className="text-xl font-extrabold text-inherit lg:text-2xl lg:font-bold">
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

      <Shell className="px-0">
        <div className="grid grid-cols-1 text-brand-accent w-full mt-4 lg:grid-cols-[2fr_1fr] lg:gap-8 lg:px-0">
          <div className="mt-6 grid gap-8 px-3 pb-3 transition-all duration-300 ease-in lg:container lg:grid-cols-1 lg:p-0">
            <div>
              <div className="text-brand-accent">
                <span className="text-base font-semibold">
                  Project Highlight
                </span>
                <div className="item-center mb-1 mt-3 flex h-full gap-4">
                  <h1 className="text-3xl font-extrabold text-inherit">
                    {projectData.project.projectname}
                  </h1>
                  {projectData.project.projectstatus && (
                    <div className="flex items-center">
                      <Badge
                        className={cn("uppercase", statusBadgeVariant)}
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
                    <span className="uppercase line-clamp-1">
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
                  {projectData.project.formatted_address ??
                    projectData.project.city}
                </div>
              </div>

              {priceRangeDisplay ?? (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                  Price information not available
                </div>
              )}

              <div className="container mx-auto">
                {projectData.project.aboutproject && (
                  <ContentSection
                    title="About Developer"
                    description=""
                    href=""
                    className="pt-14 px-0 md:pt-20 pb-10 md:pb-0"
                    btnHidden
                  >
                    <div
                      dangerouslySetInnerHTML={markup}
                      className="text-brand-muted prose prose-sm max-w-none"
                      aria-label="About developer information"
                    />
                  </ContentSection>
                )}

                {images && images.length > 0 && (
                  <ContentSection
                    title="Explore More"
                    description=""
                    href="/listings"
                    className="pt-14 px-0 md:pt-20 hidden md:block"
                    btnHidden
                  >
                    <PropertyShowcase images={images} />
                  </ContentSection>
                )}

                <ContentSection
                  title="Project Details"
                  description=""
                  href=""
                  className="pt-14 px-0 md:pt-20 hidden md:block"
                  btnHidden
                >
                  <PropertyDetailsTable details={projectDetails} />
                </ContentSection>

                {projectData.features && projectData.features.length > 0 && (
                  <ContentSection
                    title="Amenities"
                    description=""
                    href=""
                    className="pt-14 px-0 md:pt-20"
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

                <div
                  id="site-plan"
                  ref={sectionRefs["site-plan"]}
                  className="py-16 px-0"
                >
                  <h2 className="text-2xl font-bold mb-6">Site Plans</h2>
                  <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">
                      Site plans will be available soon
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <aside className="hidden lg:block pb-6">
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
              className="pt-14 px-0 md:pt-20"
              btnHidden
              id="floor-plans-heading"
            >
              <FloorPlans />
            </ContentSection>
          </section>

          <section
            id="location"
            ref={sectionRefs.location}
            className="py-16 w-full"
            aria-labelledby="location-heading"
          >
            <ContentSection
              title="Nearest Establishments"
              description="View nearby points of interest"
              href="#location"
              className="pt-14 px-0 md:pt-20"
              btnHidden
              id="location-heading"
            >
              <NearestEstablishments
                className="mb-8"
                projectLocation={{
                  lat: projectData.project.lat || 5.56,
                  lng: projectData.project.lng || -0.2057,
                }}
                projectName={projectData.project.projectname}
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
              "py-14 px-0 md:pt-20 md:block lg:max-w-7xl lg:mx-auto [&_p]:px-4 [&_h2]:px-4",
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
