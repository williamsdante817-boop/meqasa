"use client";

import { useState, useEffect } from "react";
import DevelopmentProjectCard from "./development-project-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DevelopmentProject {
  projectid: number;
  projectname: string;
  address: string;
  city: string;
  region: string;
  aboutproject: string;
  photoUrl: string | null;
  logoUrl: string | null;
  status: "new" | "ongoing" | "completed";
  isFeatured: boolean;
  location: string;
  fullLocation: string;
  unitcount: number;
  pageviews: number;
  weburl?: string;
}

interface DevelopmentProjectsGridProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function DevelopmentProjectsGrid({ 
  searchParams 
}: DevelopmentProjectsGridProps) {
  const [projects, setProjects] = useState<DevelopmentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // API call function
  const fetchProjects = async (): Promise<DevelopmentProject[]> => {
    try {
      const response = await fetch('/api/development-projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const data: { projects?: DevelopmentProject[] } = await response.json();
      return data.projects ?? [];
    } catch (error) {
      console.error('Error fetching development projects:', error);
      return [];
    }
  };

  // Filter projects based on search params
  const getFilteredProjects = (allProjects: DevelopmentProject[]) => {
    let filtered = [...allProjects];

    if (searchParams.featured) {
      filtered = filtered.filter(project => project.isFeatured);
    }

    if (searchParams.status) {
      filtered = filtered.filter(project => project.status === searchParams.status);
    }

    if (searchParams.location) {
      filtered = filtered.filter(project => 
        project.fullLocation.toLowerCase().includes(
          (searchParams.location as string).toLowerCase()
        ) || 
        project.region.toLowerCase().includes(
          (searchParams.location as string).toLowerCase()
        )
      );
    }

    if (searchParams.search) {
      const searchTerm = (searchParams.search as string).toLowerCase();
      filtered = filtered.filter(project => 
        project.projectname.toLowerCase().includes(searchTerm) ||
        project.aboutproject.toLowerCase().includes(searchTerm) ||
        project.fullLocation.toLowerCase().includes(searchTerm) ||
        project.region.toLowerCase().includes(searchTerm)
      );
    }

    return filtered;
  };

  // Load initial projects
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const allProjects = await fetchProjects();
        const filteredProjects = getFilteredProjects(allProjects);
        setProjects(filteredProjects);
        setHasMore(false); // For now, we load all projects at once
      } catch (error) {
        console.error('Error loading projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    void loadProjects();
  }, [searchParams]);

  // Load more projects
  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/development-projects', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ page: page + 1, ...searchParams })
      // });
      // const data = await response.json();
      // setProjects(prev => [...prev, ...data.projects]);
      // setHasMore(data.hasMore);
      // setPage(prev => prev + 1);
      
      // Simulate loading more
      await new Promise(resolve => setTimeout(resolve, 1000));
      setHasMore(false); // No more to load in mock
    } catch (error) {
      console.error('Error loading more projects:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-64 rounded-lg mb-4" />
            <div className="bg-gray-200 h-4 rounded mb-2" />
            <div className="bg-gray-200 h-4 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-brand-accent mb-2">
          No projects found
        </h3>
        <p className="text-brand-muted">
          Try adjusting your filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-brand-muted">
          Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <DevelopmentProjectCard
            key={project.projectid}
            project={project}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={loadMore}
            disabled={loadingMore}
            variant="outline"
            className="min-w-32"
          >
            {loadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Projects"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}