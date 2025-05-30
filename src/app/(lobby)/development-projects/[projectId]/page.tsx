import { Breadcrumbs } from "@/components/bread-crumbs";
import { Badge } from "@/components/ui/badge";
import Shell from "@/layouts/shell";
import { CheckCircle, MapPin } from "lucide-react";
import Image from "next/image";
import BrochureDialog from "../_component/brochure-dialog";

import PropertyContainer from "@/app/(lobby)/development-projects/_component/property-container";
import { getDeveloperProject } from "@/lib/get-developer-project";

export default async function DeveloperProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const id = projectId.toString().split("-")[
    projectId.toString().split("-").length - 1
  ];

  const projectData = await getDeveloperProject(Number(id));

  console.log(projectData);

  return (
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
              title: `developers`,
              href: `/developers`,
            },
            {
              title: `Goldkey Properties`,
              href: `/developers/1`,
            },
            {
              title: `One Elm`,
              href: `/developers/1/projects/1`,
            },
          ]}
        />
      </Shell>
      <div className="relative w-full h-[250px] md:h-[450px] overflow-hidden flex mb-4 ">
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
            <div className="bg-white rounded-md p-2 w-[160px] h-[160px] flex items-center justify-center shadow-sm border">
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
                <BrochureDialog
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
  );
}
