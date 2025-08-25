import ContactCard from "@/components/common/contact-card";
import ContentSection from "@/components/layout/content-section";
import { Badge } from "@/components/ui/badge";
import Shell from "@/layouts/shell";
import { Dot, MapPin } from "lucide-react";
import type { RefObject } from "react";

type SectionRefs = {
  "floor-plan": RefObject<HTMLDivElement>;
  "site-plan": RefObject<HTMLDivElement>;
  location: RefObject<HTMLDivElement>;
  "available-units": RefObject<HTMLDivElement>;
};

export default function PropertySections({
  sectionRefs,
}: {
  sectionRefs: SectionRefs;
}) {
  // get developer profile
  // const project = await getDeveloperProject(361);
  return (
    <Shell>
      <div className="grid grid-cols-1 text-b-accent w-full mt-12 md:grid-cols-[2fr,1fr] lg:gap-8 lg:px-0">
        <div className="mt-6 grid gap-8 px-3 pb-3 transition-all duration-300 ease-in lg:container lg:grid-cols-1 lg:p-0">
          <div>
            <div className="text-b-accent">
              <span className="text-base font-semibold">Project Highlight</span>
              <div className="item-center mb-1 mt-3 flex h-full gap-4">
                <h1 className="text-3xl font-extrabold text-inherit">
                  One Elm
                </h1>
                <div className="flex items-center">
                  <Badge className="bg-yellow-500 uppercase">ongoing</Badge>
                </div>
              </div>
              <div className="mb-2 text-sm">
                <span className="flex items-center font-light text-inherit">
                  Apartment <Dot className="h-4 w-4" />{" "}
                  <span className=" uppercase">1 BDR, 2 BDR, 3 BDR</span>
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-end text-xs font-medium text-b-blue lg:text-sm">
                {" "}
                <MapPin className="h-5 w-5" strokeWidth="1.3" /> Airport
                Residential, AC
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-[16px] border border-orange-300 p-3 text-b-accent shadow-sm">
              <div>
                <div className="mb-3">
                  <span className="text-sm font-semibold capitalize text-inherit lg:text-base">
                    price range
                  </span>
                  <span className="text-xs tracking-wide"> (minimum)</span>
                </div>

                <span className="text-xl font-extrabold text-inherit lg:text-2xl lg:font-bold">
                  GH₵ 1,380,000
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
                  GH₵ 10,380,000
                </span>
              </div>
            </div>

            <div className="container mx-auto">
              <div
                id="floor-plan"
                ref={sectionRefs["floor-plan"]}
                className="py-16"
              >
                <ContentSection
                  title="About Developer"
                  description=""
                  href=""
                  className="pt-14 md:pt-20 pb-10 md:pb-0"
                  btnHidden
                >
                  <p
                    dangerouslySetInnerHTML={{
                      __html:
                        "One Elm, located in an intimate enclave at the heart of Accra’s most distinguished and elegant area: Airport Residential. Far more than just a building, this development is defined by boldness, sophisticated pursuits with blended contemporary architectural style with minimalist designs to offer elevated living. Welcome to the statement of Airport Residential.",
                    }}
                  />
                </ContentSection>
              </div>

              <div
                id="site-plan"
                ref={sectionRefs["site-plan"]}
                className="py-16"
              >
                <ContentSection
                  title="Explore More"
                  description=""
                  href="/listings"
                  className="pt-14 md:pt-20 hidden md:block"
                  btnHidden
                >
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Necessitatibus, molestiae, quisquam deserunt dignissimos ut
                    eaque aliquid culpa voluptatibus omnis nihil ducimus, porro
                    eum amet dolorem veniam officia facere cupiditate repellat.
                  </p>
                  {/* <PropertyShowcase images={listingDetail?.imagelist} /> */}
                </ContentSection>
              </div>

              <div id="location" ref={sectionRefs.location} className="py-16">
                <h2 className="text-2xl font-bold mb-6">Location</h2>
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">
                    Location map and details go here
                  </p>
                </div>
                <div className="h-64 mt-6 bg-gray-100 rounded-lg"></div>
              </div>

              <div
                id="available-units"
                ref={sectionRefs["available-units"]}
                className="py-16"
              >
                <h2 className="text-2xl font-bold mb-6">Available Units</h2>
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">
                    Available units listing goes here
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
            name={"eveloper?.developer?.companyname"}
            image={`${"developer?.developer?.logo"}`}
          />
        </aside>
      </div>
    </Shell>
  );
}
