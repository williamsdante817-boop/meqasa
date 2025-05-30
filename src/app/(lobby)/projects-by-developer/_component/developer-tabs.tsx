import { AlertCard } from "@/components/alert-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnitCard from "@/components/unit-card";
import type { DeveloperDetails } from "@/types";
import React from "react";
import { ProjectCard } from "./project-card";

export function DeveloperTabs({ developer }: { developer: DeveloperDetails }) {
  const pastProjects = developer?.projects?.filter(
    (p) => p.projectstatus === "completed",
  );
  return (
    <Tabs defaultValue="current" className="w-full">
      <TabsList className="grid h-[60px] w-full grid-cols-3 px-2">
        <TabsTrigger
          value="current"
          className="group h-11 text-sm text-brand-muted data-[state=active]:text-brand-accent"
        >
          Current Projects{" "}
          <span className="ml-2 hidden h-6 w-6 items-center justify-center rounded-md bg-rose-500 font-semibold text-white opacity-0 shadow-subtle transition-opacity duration-200 ease-in group-data-[state=active]:opacity-100 lg:flex">
            {developer?.projects?.length}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="available"
          className="group h-11 text-sm text-brand-muted data-[state=active]:text-brand-accent"
        >
          Available Units{" "}
          <span className="ml-2 hidden h-6 w-6 items-center justify-center rounded-md bg-rose-500 font-semibold text-white opacity-0 shadow-subtle transition-opacity duration-200 ease-in group-data-[state=active]:opacity-100 lg:flex">
            {developer?.units?.length}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="past"
          className="group h-11 text-sm text-brand-muted data-[state=active]:text-brand-accent"
        >
          Past Projects{" "}
          <span className="ml-2 hidden h-6 w-6 items-center justify-center rounded-md bg-rose-500 font-semibold text-white opacity-0 shadow-subtle transition-opacity duration-200 ease-in group-data-[state=active]:opacity-100 lg:flex">
            {pastProjects?.length}
          </span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="current" className="mt-8">
        {developer?.projects?.length === 0 ? (
          <AlertCard title="No Current Projects" />
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:gap-8">
            {developer?.projects?.map((project, i: number) => {
              const url = `/development-projects/${project?.city.split(" ").join("-")}-${project?.projectname.split(" ").join("-")}-${project?.projectid}`;
              return (
                <React.Fragment key={i}>
                  <ProjectCard
                    name={project.projectname}
                    status={project.projectstatus}
                    src={`https://meqasa.com/uploads/imgs/${project?.photo}`}
                    url={`/${url.toLocaleLowerCase()}`}
                  />
                </React.Fragment>
              );
            })}
          </div>
        )}
      </TabsContent>
      <TabsContent value="available" className="mt-8">
        {developer?.units?.length === 0 ? (
          <AlertCard title="No Available Units" />
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-8">
            {developer?.units?.map((unit, i) => (
              <React.Fragment key={i}>
                <UnitCard unit={unit} />
              </React.Fragment>
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent value="past" className="mt-8">
        {pastProjects?.length === 0 ? (
          <AlertCard title="No Past Projects" />
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:gap-8">
            {pastProjects?.map((project, i) => {
              const url = `development-projects/${project?.city.split(" ").join("-")}-${project?.projectname.split(" ").join("-")}-${project?.projectid}`;

              return (
                <React.Fragment key={i}>
                  <ProjectCard
                    name={project.projectname}
                    status={project.projectstatus}
                    src={`https://meqasa.com/uploads/imgs/${project?.photo}`}
                    url={`/${url.toLocaleLowerCase()}`}
                  />
                </React.Fragment>
              );
            })}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
