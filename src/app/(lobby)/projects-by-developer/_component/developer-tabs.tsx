"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnitCard from "@/components/property/cards/unit-card";
import type { DeveloperDetails, Project, Unit } from "@/types";
import React, { useMemo, useState } from "react";
import { ProjectCard } from "./project-card";
import { PaginatedContent } from "@/components/paginated-content";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Home,
  Clock,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function DeveloperTabs({ developer }: { developer: DeveloperDetails }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "name">(
    "newest"
  );

  // Enhanced data processing with memoization for performance
  const { pastProjects, currentProjects, processedStats } = useMemo(() => {
    const allProjects = developer?.projects || [];
    const units = developer?.units || [];

    const past = allProjects.filter((p) => p.projectstatus === "completed");
    const current = allProjects.filter((p) => p.projectstatus !== "completed");
    const ongoing = allProjects.filter((p) => p.projectstatus === "ongoing");

    const stats = {
      totalProjects: allProjects.length,
      completedProjects: past.length,
      ongoingProjects: ongoing.length,
      availableUnits: units.length,
      avgProjectsPerYear:
        allProjects.length > 0
          ? Math.round(
              allProjects.length / Math.max(new Date().getFullYear() - 2010, 1)
            )
          : 0,
    };

    return {
      pastProjects: past,
      currentProjects: current,
      processedStats: stats,
    };
  }, [developer?.projects, developer?.units]);

  // Enhanced filtering and sorting with proper typing
  const getFilteredProjects = useMemo(() => {
    return (items: Project[]) => {
      let filtered = [...items];

      // Search filtering
      if (searchQuery) {
        filtered = filtered.filter((item) => {
          const searchFields = [item.projectname, item.city];
          return searchFields.some((field) =>
            field?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });
      }

      // Status filtering for projects
      if (selectedStatus !== "all") {
        filtered = filtered.filter(
          (item) => item.projectstatus === selectedStatus
        );
      }

      // Sorting
      filtered.sort((a, b) => {
        if (sortOrder === "name") {
          return a.projectname.localeCompare(b.projectname);
        } else if (sortOrder === "newest") {
          return Number(b.projectid) - Number(a.projectid);
        } else {
          return Number(a.projectid) - Number(b.projectid);
        }
      });

      return filtered;
    };
  }, [searchQuery, selectedStatus, sortOrder]);

  const getFilteredUnits = useMemo(() => {
    return (items: Unit[]) => {
      let filtered = [...items];

      // Search filtering
      if (searchQuery) {
        filtered = filtered.filter((item) => {
          const searchFields = [item.title, item.city, item.address];
          return searchFields.some((field) =>
            field?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });
      }

      // Sorting
      filtered.sort((a, b) => {
        if (sortOrder === "name") {
          return a.title.localeCompare(b.title);
        } else if (sortOrder === "newest") {
          return Number(b.unitid) - Number(a.unitid);
        } else {
          return Number(a.unitid) - Number(b.unitid);
        }
      });

      return filtered;
    };
  }, [searchQuery, sortOrder]);

  const renderProjectCard = (project: Project, index: number) => {
    // Generate consistent lowercase URL
    const citySlug =
      project?.city?.split(" ").join("-").toLowerCase() || "ghana";
    const projectSlug =
      project?.projectname?.split(" ").join("-").toLowerCase() || "project";
    const url = `/development-projects/${citySlug}-${projectSlug}-${project?.projectid}`;
    return (
      <ProjectCard
        key={`${project.projectid}-${index}`}
        name={project.projectname}
        status={project.projectstatus}
        src={`https://meqasa.com/uploads/imgs/${project?.photo}`}
        url={url}
      />
    );
  };

  const renderUnitCard = (unit: Unit, index: number) => (
    <UnitCard key={`${unit.unitid}-${index}`} unit={unit} />
  );

  // Enhanced empty state component
  const EmptyStateCard = ({
    title,
    description,
    icon: Icon,
    actionText,
    onAction,
  }: {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    actionText?: string;
    onAction?: () => void;
  }) => (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-brand-accent mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-brand-muted mb-4 max-w-md">{description}</p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );

  return (
    <div className="w-full space-y-6">
      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-2 gap-4 rounded-lg border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 lg:grid-cols-4">
        <div className="text-center">
          <div className="text-brand-accent text-2xl font-bold">
            {processedStats.totalProjects}
          </div>
          <div className="text-brand-muted text-sm">Total Projects</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {processedStats.completedProjects}
          </div>
          <div className="text-brand-muted text-sm">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {processedStats.ongoingProjects}
          </div>
          <div className="text-brand-muted text-sm">Ongoing</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {processedStats.availableUnits}
          </div>
          <div className="text-brand-muted text-sm">Available Units</div>
        </div>
      </div>

      {/* Enhanced Search and Filter Controls */}
      <div className="flex flex-col items-stretch justify-between gap-4 rounded-lg border bg-gray-50 p-4 sm:flex-row sm:items-center">
        <div className="max-w-md flex-1">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search projects or units..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white pl-10"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Sort:</span>
            <Button
              variant={sortOrder === "newest" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortOrder("newest")}
            >
              Newest
            </Button>
            <Button
              variant={sortOrder === "name" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortOrder("name")}
            >
              Name
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="bg-muted grid h-full w-full grid-cols-3 px-2">
          <TabsTrigger
            value="current"
            className="group text-brand-muted data-[state=active]:text-brand-accent relative text-sm transition-all duration-200"
          >
            <Building2 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Current Projects</span>
            <span className="sm:hidden">Current</span>
            <Badge
              variant="secondary"
              className={cn(
                "ml-2 flex h-5 w-5 items-center justify-center p-0 text-xs font-semibold transition-all duration-200",
                "group-data-[state=active]:bg-brand-blue group-data-[state=active]:text-white",
                "hidden lg:flex"
              )}
            >
              {currentProjects?.length || 0}
            </Badge>
          </TabsTrigger>

          <TabsTrigger
            value="available"
            className="group text-brand-muted data-[state=active]:text-brand-accent relative text-sm transition-all duration-200"
          >
            <Home className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Available Units</span>
            <span className="sm:hidden">Units</span>
            <Badge
              variant="secondary"
              className={cn(
                "ml-2 flex h-5 w-5 items-center justify-center p-0 text-xs font-semibold transition-all duration-200",
                "group-data-[state=active]:bg-brand-blue group-data-[state=active]:text-white",
                "hidden lg:flex"
              )}
            >
              {developer?.units?.length || 0}
            </Badge>
          </TabsTrigger>

          <TabsTrigger
            value="past"
            className="group text-brand-muted data-[state=active]:text-brand-accent relative text-sm transition-all duration-200"
          >
            <Clock className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Past Projects</span>
            <span className="sm:hidden">Past</span>
            <Badge
              variant="secondary"
              className={cn(
                "ml-2 flex h-5 w-5 items-center justify-center p-0 text-xs font-semibold transition-all duration-200",
                "group-data-[state=active]:bg-brand-blue group-data-[state=active]:text-white",
                "hidden lg:flex"
              )}
            >
              {pastProjects?.length || 0}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-8">
          {currentProjects.length === 0 ? (
            <EmptyStateCard
              title="No Current Projects"
              description="This developer doesn't have any ongoing projects at the moment. Check back later for new developments."
              icon={Building2}
              actionText="View Past Projects"
              // onAction={() => {
              //   const pastTab = document.querySelector('[value="past"]')!;
              //   pastTab?.click();
              // }}
            />
          ) : (
            <PaginatedContent
              items={getFilteredProjects(currentProjects)}
              itemsPerPage={6}
              renderItem={renderProjectCard}
              gridClassName="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8"
              emptyMessage={
                searchQuery
                  ? `No current projects match "${searchQuery}"`
                  : "No Current Projects"
              }
              showPagination={currentProjects && currentProjects.length > 6}
            />
          )}
        </TabsContent>

        <TabsContent value="available" className="mt-8">
          {!developer?.units || developer.units.length === 0 ? (
            <EmptyStateCard
              title="No Available Units"
              description="This developer doesn't have any units available for sale or rent right now."
              icon={Home}
              actionText="View All Projects"
              // onAction={() => {
              //   const currentTab = document.querySelector('[value="current"]')!;
              //   currentTab?.click();
              // }}
            />
          ) : (
            <PaginatedContent
              items={getFilteredUnits(developer.units)}
              itemsPerPage={6}
              renderItem={renderUnitCard}
              gridClassName="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8"
              emptyMessage={
                searchQuery
                  ? `No units match "${searchQuery}"`
                  : "No Available Units"
              }
              showPagination={developer.units && developer.units.length > 6}
            />
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-8">
          {pastProjects.length === 0 ? (
            <EmptyStateCard
              title="No Completed Projects"
              description="This developer hasn't completed any projects yet, or the information isn't available."
              icon={Clock}
              actionText="View Current Projects"
              // onAction={() => {
              //   const currentTab = document.querySelector('[value="current"]')!;
              //   currentTab?.click();
              // }}
            />
          ) : (
            <PaginatedContent
              items={getFilteredProjects(pastProjects)}
              itemsPerPage={6}
              renderItem={renderProjectCard}
              gridClassName="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8"
              emptyMessage={
                searchQuery
                  ? `No past projects match "${searchQuery}"`
                  : "No Past Projects"
              }
              showPagination={pastProjects && pastProjects.length > 6}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
