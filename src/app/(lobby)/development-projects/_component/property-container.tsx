"use client";
import { AlertCard } from "@/components/alert-card";
import Amenities from "@/components/amenities";
import ContactCard from "@/components/contact-card";
import ContactSection from "@/components/contact-section";
import ContentSection from "@/components/content-section";
import PropertyDetailsTable from "@/components/property-details";
import PropertyListings from "@/components/property-listings";
import PropertyShowcase from "@/components/property-showcase";
import { Badge } from "@/components/ui/badge";
import Shell from "@/layouts/shell";
import { buildInnerHtml, cn, formatPrice } from "@/lib/utils";
import type { DeveloperProject } from "@/types";
import { Dot, MapPin } from "lucide-react";
import { useRef } from "react";
import FloorPlans from "./floor-plan";
import NearbyLocation from "./nearest-establishements";
import ProjectVideo from "./project-video";
import PropertyScrollNav from "./property-scroll-nav";

export default function PropertyContainer({
  projectData,
}: {
  projectData: DeveloperProject;
}) {
  const markup = buildInnerHtml(projectData.project.aboutproject ?? "");
  const unityTypes = projectData.unittypes.map(
    (unitType) => unitType.type + " ",
  );
  const projectType = projectData.projecttypes.map(
    (project) => project.type,
  )[0];
  const images = projectData.photos.map((photo) => photo.photo);

  const projectDetails = [
    { title: "Name", value: projectData.project.name || "Not specified" },
    {
      title: "Neighborhood",
      value: projectData.project.city || "Not specified",
    },
    {
      title: "Location",
      value: projectData.project.formatted_address || "Not specified",
    },
    {
      title: "Region",
      value: projectData.project.region || "Not specified",
    },
    {
      title: "Status",
      value: projectData.project.projectstatus || "Not specified",
    },
    {
      title: "Number of Buildings",
      value: projectData.project.unitcount || "Not specified",
    },
    {
      title: "Project Types",
      value:
        projectData.projecttypes.map((pt) => pt.type).join(", ") ||
        "Not specified",
    },
    {
      title: "Unit Types",
      value:
        projectData.unittypes.map((ut) => ut.type).join(", ") ||
        "Not specified",
    },
    {
      title: "Parking Types",
      value:
        projectData.parkingtypes.map((pt) => pt.type).join(", ") ||
        "Not specified",
    },
    {
      title: "Date Updated",
      value: projectData.project.updated_at,
    },
  ];

  // Define section refs in the parent component to share between children
  const sectionRefs = {
    "floor-plan": useRef<HTMLDivElement>(null),
    "site-plan": useRef<HTMLDivElement>(null),
    location: useRef<HTMLDivElement>(null),
    "available-units": useRef<HTMLDivElement>(null),
  };

  return (
    <>
      {/* Pass the section refs to both components */}
      <PropertyScrollNav sectionRefs={sectionRefs} />

      <Shell className="px-0">
        <div className="grid grid-cols-1 text-brand-accent w-full mt-12 md:grid-cols-[2fr,1fr] lg:gap-8 lg:px-0">
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
                  <div className="flex items-center">
                    <Badge
                      className={cn(
                        "uppercase",
                        projectData.project.projectstatus?.toLowerCase() ===
                          "completed"
                          ? "bg-green-500 text-white"
                          : projectData.project.projectstatus?.toLowerCase() ===
                              "ongoing"
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-500 text-white",
                      )}
                    >
                      {projectData.project.projectstatus}
                    </Badge>
                  </div>
                </div>
                <div className="mb-2 text-sm">
                  <span className="flex items-center font-light text-inherit">
                    {projectType} <Dot className="h-4 w-4" />{" "}
                    <span className=" uppercase line-clamp-1">
                      {unityTypes.map((type) => type)}
                    </span>
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-end text-xs font-medium text-blue-600 lg:text-sm">
                  {" "}
                  <MapPin className="h-5 w-5" strokeWidth="1.3" />{" "}
                  {projectData.project.formatted_address ||
                    projectData.project.city}
                </div>
              </div>

              {projectData.minmax.map((obj) => (
                <div
                  className="mt-6 flex items-center justify-between rounded-[16px] border border-orange-300 p-3 text-brand-accent shadow-sm"
                  key={projectData.project.projectid}
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
              ))}

              <div className="container mx-auto">
                <ContentSection
                  title="About Developer"
                  description=""
                  href=""
                  className="pt-14 md:pt-20 pb-10 md:pb-0"
                  btnHidden
                >
                  <p
                    dangerouslySetInnerHTML={markup}
                    className="text-brand-muted"
                  />
                </ContentSection>

                <ContentSection
                  title="Explore More"
                  description=""
                  href="/listings"
                  className="pt-14 md:pt-20 hidden md:block"
                  btnHidden
                >
                  <PropertyShowcase images={images} />
                </ContentSection>

                <ContentSection
                  title="Project Details"
                  description=""
                  href=""
                  className="pt-14 md:pt-20 hidden md:block"
                  btnHidden
                >
                  <PropertyDetailsTable details={projectDetails} />
                </ContentSection>

                {projectData.features.length !== 0 ? (
                  <ContentSection
                    title="Amenities"
                    description=""
                    href=""
                    className="pt-14 md:pt-20"
                    btnHidden
                  >
                    <Amenities
                      amenities={projectData.features.map((f) => f.feature)}
                    />
                  </ContentSection>
                ) : null}

                <ProjectVideo videoUrl={projectData.project.tourvideo} />

                <div
                  id="site-plan"
                  ref={sectionRefs["site-plan"]}
                  className="py-16"
                >
                  <h2 className="text-2xl font-bold mb-6">Site Plans</h2>
                  <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">
                      Site Plans map and details go here
                    </p>
                  </div>
                  <div className="h-64 mt-6 bg-gray-100 rounded-lg"></div>
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
              className="pt-14 md:pt-20"
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
              className="pt-14 md:pt-20"
              btnHidden
              id="location-heading"
            >
              <NearbyLocation />
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
      {/* <Shell> */}
      <div
        id="available-units"
        ref={sectionRefs["available-units"]}
        className="w-full"
      >
        {projectData.units.length !== 0 ? (
          <ContentSection
            title="Available Units"
            description=""
            href="/listings"
            className={cn(
              projectData.units.length !== 0 ? "px-0 mb-6" : "px-4",
              "pt-14 md:pt-20 lg:pt-24  md:block lg:max-w-7xl lg:mx-auto [&_p]:px-4 [&_h2]:px-4",
            )}
          >
            <PropertyListings
              listings={projectData.units.map((unit) => ({
                ...unit,
                image: unit.coverphoto,
                detailreq: `/developer-unit/${unit.unitid}`,
                streetaddress: unit.address,
                contract: unit.terms,
                title: unit.title || unit.unitname,
                garages: unit.garages.toString(),
                price: unit.price.toString(),
                bathroomcount: unit.baths.toString(),
                bedroomcount: unit.beds.toString(),
                summary: unit.title || unit.unitname,
                pricepart1: unit.price.toString(),
                pricepart2: unit.terms === "rent" ? "/month" : "",
              }))}
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
              className="my-10"
              title="No units available"
              description="Please check back later."
            />
          </Shell>
        )}
      </div>
      {/* </Shell> */}
    </>
  );
}
