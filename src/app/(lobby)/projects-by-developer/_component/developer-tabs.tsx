"use client";

import { AlertCard } from "@/components/common/alert-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnitCard from "@/components/property/cards/unit-card";
import type { DeveloperDetails, Project, Unit } from "@/types";
import React from "react";
import { ProjectCard } from "./project-card";
import { PaginatedContent } from "@/components/paginated-content";

export function DeveloperTabs({ developer }: { developer: DeveloperDetails }) {
  const pastProjects = developer?.projects?.filter(
    (p) => p.projectstatus === "completed",
  );

  const renderProjectCard = (project: Project, index: number) => {
    const url = `development-projects/${project?.city.split(" ").join("-")}-${project?.projectname.split(" ").join("-")}-${project?.projectid}`;
    return (
      <ProjectCard
        key={index}
        name={project.projectname}
        status={project.projectstatus}
        src={`https://meqasa.com/uploads/imgs/${project?.photo}`}
        url={`/${url.toLocaleLowerCase()}`}
      />
    );
  };

  const renderUnitCard = (unit: Unit, index: number) => (
    <UnitCard key={index} unit={unit} />
  );

  return (
    <Tabs defaultValue="current" className="w-full">
      <TabsList className="grid h-full w-full grid-cols-3 px-2">
        <TabsTrigger
          value="current"
          className="group text-sm text-brand-muted data-[state=active]:text-brand-accent"
        >
          Current Projects{" "}
          <span className="ml-2 hidden h-6 w-6 items-center justify-center rounded-md bg-rose-500 font-semibold text-white opacity-0 shadow-subtle transition-opacity duration-200 ease-in group-data-[state=active]:opacity-100 lg:flex">
            {developer?.projects?.length}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="available"
          className="group text-sm text-brand-muted data-[state=active]:text-brand-accent"
        >
          Available Units{" "}
          <span className="ml-2 hidden h-6 w-6 items-center justify-center rounded-md bg-rose-500 font-semibold text-white opacity-0 shadow-subtle transition-opacity duration-200 ease-in group-data-[state=active]:opacity-100 lg:flex">
            {developer?.units?.length}
          </span>
        </TabsTrigger>
        <TabsTrigger
          value="past"
          className="group text-sm text-brand-muted data-[state=active]:text-brand-accent"
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
          <PaginatedContent
            items={developer?.projects || []}
            itemsPerPage={6}
            renderItem={renderProjectCard}
            gridClassName="grid grid-cols-2 gap-4 lg:gap-8"
            emptyMessage="No Current Projects"
            showPagination={
              developer?.projects && developer.projects.length > 6
            }
          />
        )}
      </TabsContent>

      <TabsContent value="available" className="mt-8">
        {developer?.units?.length === 0 ? (
          <AlertCard title="No Available Units" />
        ) : (
          <PaginatedContent
            items={developer?.units || []}
            itemsPerPage={6}
            renderItem={renderUnitCard}
            gridClassName="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-8"
            emptyMessage="No Available Units"
            showPagination={developer?.units && developer.units.length > 6}
          />
        )}
      </TabsContent>

      <TabsContent value="past" className="mt-8">
        {pastProjects?.length === 0 ? (
          <AlertCard title="No Past Projects" />
        ) : (
          <PaginatedContent
            items={pastProjects || []}
            itemsPerPage={6}
            renderItem={renderProjectCard}
            gridClassName="grid grid-cols-2 gap-4 lg:gap-8"
            emptyMessage="No Past Projects"
            showPagination={pastProjects && pastProjects.length > 6}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
