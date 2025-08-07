import { Breadcrumbs } from "@/components/bread-crumbs";
import ContactCard from "@/components/contact-card";
import ContentSection from "@/components/content-section";
import Shell from "@/layouts/shell";
import { getDeveloperProfile } from "@/lib/get-developer-profile";
import { CheckCircle, MapPin } from "lucide-react";
import Image from "next/image";
import { DeveloperTabs } from "../_component/developer-tabs";
import ClientReviews from "../_component/client-reviews";
import { notFound } from "next/navigation";

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

    return (
      <main>
        <div className="relative w-full min-h-[200px] h-[300px] sm:min-h-[250px] sm:h-[350px] md:min-h-[400px] md:h-[50vh] md:max-h-[600px] overflow-hidden flex">
          {/* Background Image */}
          <Image
            src={`https://meqasa.com/uploads/imgs/${developer.developer.hero}`}
            alt={`${developer.developer.companyname} office building`}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
            className="object-cover"
            unoptimized
            priority
          />

          <Shell>
            {/* Content Container */}
            <div
              className="absolute bottom-0 left-0 w-full h-48 sm:h-56 md:h-64 bg-gradient-to-t from-black/95 to-transparent"
              aria-hidden="true"
            />
            <div className="absolute bottom-4 md:pb-4 z-10 px-0 flex flex-col sm:flex-row items-start sm:items-end h-fit gap-4 sm:gap-6">
              {/* Company Logo Card */}
              <div
                className="bg-white/90 backdrop-blur-sm rounded-md p-2 min-w-[120px] min-h-[120px] sm:min-w-[140px] sm:min-h-[140px] md:min-w-[160px] md:min-h-[160px] w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] md:flex items-center justify-center shadow-lg hidden"
                role="img"
                aria-label={`${developer.developer.companyname} logo`}
              >
                <Image
                  src={`https://meqasa.com/uploads/imgs/${developer.developer.logo}`}
                  alt={`${developer.developer.companyname} logo`}
                  width={120}
                  height={120}
                  className="object-contain w-auto h-auto"
                />
              </div>

              {/* Company Info */}
              <div className="text-white drop-shadow-lg">
                <h1 className="text-2xl sm:text-3xl font-semibold mb-2 sm:mb-3 text-white">
                  {developer.developer.companyname}
                </h1>
                <div className="flex items-center mb-2">
                  <CheckCircle
                    className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mr-2"
                    aria-hidden="true"
                    role="img"
                  />
                  <span className="text-xs sm:text-sm font-medium text-white/90">
                    <span className="sr-only">Status: </span>
                    active on meqasa
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin
                    className="w-5 h-5 text-brand-primary mr-2 flex-shrink-0"
                    aria-hidden="true"
                    role="img"
                  />
                  <span className="text-xs sm:text-sm font-medium text-white/90 line-clamp-1">
                    <span className="sr-only">Location: </span>
                    {developer.developer.address}
                  </span>
                </div>
              </div>
            </div>
          </Shell>
        </div>
        <Shell>
          <div className="grid grid-cols-1 text-brand-accent w-full mt-8 sm:mt-12 md:grid-cols-[2fr,1fr] lg:gap-8 lg:px-0">
            <div>
              <Breadcrumbs
                className="pb-4 text-gray-600"
                segments={[
                  { title: "Home", href: "/" },
                  { title: "Developers", href: "/developers" },
                  { title: developer.developer.companyname, href: "#" },
                ]}
              />
              <DeveloperTabs developer={developer} />
              <ContentSection
                title="About Developer"
                description=""
                href=""
                className="pt-10 sm:pt-14 md:pt-20 pb-8 sm:pb-10 md:pb-0"
                btnHidden
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: developer.developer.about,
                  }}
                  className="prose prose-sm max-w-none text-brand-muted"
                />
              </ContentSection>
              <ContentSection
                title={`What clients are saying about ${developer.developer.companyname}`}
                description=""
                href=""
                className="pt-10 sm:pt-14 md:pt-20 pb-8 sm:pb-10 md:pb-0"
                btnHidden
              >
                <ClientReviews />
              </ContentSection>
            </div>
            <aside
              className="hidden md:block pb-6"
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
    );
  } catch (error) {
    console.error("Error fetching developer profile:", error);
    notFound();
  }
}
