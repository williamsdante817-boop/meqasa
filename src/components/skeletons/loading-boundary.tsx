"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface LoadingBoundaryProps {
  className?: string
  children?: React.ReactNode
  isLoading?: boolean
  loadingText?: string
  loadingComponent?: React.ReactNode
  rows?: number
  variant?: "default" | "grid" | "list" | "card"
}

const LoadingVariants = {
  default: () => (
    <div className="space-y-4">
      <Skeleton variant="text" size="lg" className="w-3/4" />
      <Skeleton variant="light" size="default" className="w-1/2" />
      <div className="space-y-2">
        <Skeleton variant="light" size="default" className="w-full" />
        <Skeleton variant="light" size="default" className="w-5/6" />
        <Skeleton variant="light" size="default" className="w-4/6" />
      </div>
    </div>
  ),
  
  grid: ({ rows = 6 }: { rows?: number }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton variant="shimmer" className="h-48 w-full rounded-lg" />
          <Skeleton variant="text" size="md" className="w-3/4" />
          <Skeleton variant="light" size="default" className="w-1/2" />
          <div className="flex items-center gap-2">
            <Skeleton variant="light" className="h-4 w-8" />
            <Skeleton variant="light" className="h-3 w-3 rounded-full" />
            <Skeleton variant="light" className="h-4 w-12" />
          </div>
        </div>
      ))}
    </div>
  ),
  
  list: ({ rows = 5 }: { rows?: number }) => (
    <div className="space-y-6">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border border-gray-100 rounded-lg">
          <Skeleton variant="shimmer" className="h-24 w-32 rounded-md flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" size="lg" className="w-4/5" />
            <Skeleton variant="text" size="md" className="w-1/2" />
            <Skeleton variant="light" size="default" className="w-2/3" />
            <div className="flex items-center gap-2 pt-1">
              <Skeleton variant="light" className="h-8 w-8 rounded-full" />
              <Skeleton variant="light" className="h-4 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
  
  card: ({ rows = 4 }: { rows?: number }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border border-gray-100 rounded-lg p-4 space-y-3">
          <Skeleton variant="shimmer" className="h-32 w-full rounded-md" />
          <Skeleton variant="text" size="md" className="w-4/5" />
          <Skeleton variant="light" size="default" className="w-3/5" />
          <div className="flex justify-between items-center pt-2">
            <Skeleton variant="light" className="h-4 w-16" />
            <Skeleton variant="light" className="h-6 w-6 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function LoadingBoundary({
  className,
  children,
  isLoading = true,
  loadingText = "Loading content...",
  loadingComponent,
  rows = 6,
  variant = "default"
}: LoadingBoundaryProps) {
  if (!isLoading && children) {
    return <>{children}</>
  }

  return (
    <div 
      className={cn("w-full", className)}
      role="status"
      aria-label={loadingText}
      aria-live="polite"
    >
      {loadingComponent ?? LoadingVariants[variant]({ rows })}
      <span className="sr-only">{loadingText}</span>
    </div>
  )
}

// Specialized loading components for common use cases
export function PropertyGridLoading({ count = 6 }: { count?: number }) {
  return (
    <LoadingBoundary 
      variant="grid" 
      rows={count} 
      loadingText="Loading properties..." 
    />
  )
}

export function PropertyListLoading({ count = 5 }: { count?: number }) {
  return (
    <LoadingBoundary 
      variant="list" 
      rows={count} 
      loadingText="Loading property listings..." 
    />
  )
}

export function SearchResultsLoading({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {/* Search header loading */}
      <div className="flex items-center justify-between py-4">
        <Skeleton variant="text" size="lg" className="w-48" />
        <div className="flex items-center gap-4">
          <Skeleton variant="light" className="h-9 w-32" />
          <Skeleton variant="light" className="h-9 w-24" />
        </div>
      </div>
      
      {/* Search results loading */}
      <LoadingBoundary 
        variant="list" 
        rows={count} 
        loadingText="Loading search results..." 
      />
    </div>
  )
}

export function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Dashboard header */}
      <div className="space-y-2">
        <Skeleton variant="text" size="2xl" className="w-1/3" />
        <Skeleton variant="light" size="default" className="w-1/2" />
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-6 border border-gray-100 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton variant="light" className="h-4 w-20" />
              <Skeleton variant="light" className="h-6 w-6 rounded-md" />
            </div>
            <Skeleton variant="text" size="2xl" className="w-1/2" />
            <Skeleton variant="light" className="h-3 w-1/3" />
          </div>
        ))}
      </div>
      
      {/* Main content */}
      <LoadingBoundary variant="grid" rows={6} loadingText="Loading dashboard content..." />
    </div>
  )
}