"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnitCard from "@/components/property/cards/unit-card";
import type { DeveloperDetails, Project, Unit } from "@/types";
import React, { useMemo, useState } from "react";
import { ProjectCard } from "./project-card";
import { PaginatedContent } from "@/components/paginated-content";
import { Badge } from "@/components/ui/badge";
import { Building2, Home, Clock, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function DeveloperTabs({ developer }: { developer: DeveloperDetails }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "name">("newest");

  // Enhanced data processing with memoization for performance
  const { pastProjects, currentProjects, processedStats } = useMemo(() => {
    const allProjects = developer?.projects || [];
    const units = developer?.units || [];

    const past = allProjects.filter(p => p.projectstatus === "completed");
    const current = allProjects.filter(p => p.projectstatus !== "completed");
    const ongoing = allProjects.filter(p => p.projectstatus === "ongoing");

    const stats = {
      totalProjects: allProjects.length,
      completedProjects: past.length,
      ongoingProjects: ongoing.length,
      availableUnits: units.length,
      avgProjectsPerYear: allProjects.length > 0 ? Math.round(allProjects.length / Math.max(new Date().getFullYear() - 2010, 1)) : 0
    };

    return {
      pastProjects: past,
      currentProjects: current,
      processedStats: stats
    };
  }, [developer?.projects, developer?.units]);

  // Enhanced filtering and sorting with proper typing
  const getFilteredProjects = useMemo(() => {
    return (items: Project[]) => {
      let filtered = [...items];

      // Search filtering
      if (searchQuery) {
        filtered = filtered.filter(item => {
          const searchFields = [item.projectname, item.city];
          return searchFields.some(field => 
            field?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });
      }

      // Status filtering for projects
      if (selectedStatus !== "all") {
        filtered = filtered.filter(item => item.projectstatus === selectedStatus);
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
        filtered = filtered.filter(item => {
          const searchFields = [item.title, item.city, item.address];
          return searchFields.some(field => 
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
    const url = `development-projects/${project?.city.split(" ").join("-")}-${project?.projectname.split(" ").join("-")}-${project?.projectid}`;
    return (
      <ProjectCard
        key={`${project.projectid}-${index}`}
        name={project.projectname}
        status={project.projectstatus}
        src={`https://meqasa.com/uploads/imgs/${project?.photo}`}
        url={`/${url.toLowerCase()}`}
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
    onAction 
  }: {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    actionText?: string;
    onAction?: () => void;
  }) => (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-brand-accent mb-2">{title}</h3>
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-brand-accent">{processedStats.totalProjects}</div>
          <div className="text-sm text-brand-muted">Total Projects</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{processedStats.completedProjects}</div>
          <div className="text-sm text-brand-muted">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{processedStats.ongoingProjects}</div>
          <div className="text-sm text-brand-muted">Ongoing</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{processedStats.availableUnits}</div>
          <div className="text-sm text-brand-muted">Available Units</div>
        </div>
      </div>

      {/* Enhanced Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between p-4 bg-gray-50 rounded-lg border">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects or units..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
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
        <TabsList className="grid h-full w-full grid-cols-3 px-2 bg-muted">
          <TabsTrigger
            value="current"
            className="group relative text-sm text-brand-muted data-[state=active]:text-brand-accent transition-all duration-200"
          >
            <Building2 className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Current Projects</span>
            <span className="sm:hidden">Current</span>
            <Badge
              variant="secondary"
              className={cn(
                "ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs font-semibold transition-all duration-200",
                "group-data-[state=active]:bg-brand-blue group-data-[state=active]:text-white",
                "hidden lg:flex"
              )}
            >
              {currentProjects?.length || 0}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger
            value="available"
            className="group relative text-sm text-brand-muted data-[state=active]:text-brand-accent transition-all duration-200"
          >
            <Home className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Available Units</span>
            <span className="sm:hidden">Units</span>
            <Badge
              variant="secondary"
              className={cn(
                "ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs font-semibold transition-all duration-200",
                "group-data-[state=active]:bg-brand-blue group-data-[state=active]:text-white",
                "hidden lg:flex"
              )}
            >
              {developer?.units?.length || 0}
            </Badge>
          </TabsTrigger>
          
          <TabsTrigger
            value="past"
            className="group relative text-sm text-brand-muted data-[state=active]:text-brand-accent transition-all duration-200"
          >
            <Clock className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Past Projects</span>
            <span className="sm:hidden">Past</span>
            <Badge
              variant="secondary"
              className={cn(
                "ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs font-semibold transition-all duration-200",
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
              emptyMessage={searchQuery ? `No current projects match "${searchQuery}"` : "No Current Projects"}
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
              emptyMessage={searchQuery ? `No units match "${searchQuery}"` : "No Available Units"}
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
              emptyMessage={searchQuery ? `No past projects match "${searchQuery}"` : "No Past Projects"}
              showPagination={pastProjects && pastProjects.length > 6}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
