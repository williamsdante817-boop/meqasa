import { type ReactNode, Suspense } from "react";

interface LoadingBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  className?: string;
}

export function LoadingBoundary({
  children,
  fallback,
  className = "",
}: LoadingBoundaryProps) {
  return (
    <div className={className}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </div>
  );
}

// Specialized loading boundaries for different content types
export function BannerLoadingBoundary({ children }: { children: ReactNode }) {
  return (
    <LoadingBoundary
      fallback={
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg h-8 w-full"></div>
        </div>
      }
    >
      {children}
    </LoadingBoundary>
  );
}

export function ContentLoadingBoundary({ children }: { children: ReactNode }) {
  return (
    <LoadingBoundary
      fallback={
        <div className="space-y-4">
          <div className="animate-pulse bg-gray-200 h-6 w-3/4 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-4 w-2/3 rounded"></div>
        </div>
      }
    >
      {children}
    </LoadingBoundary>
  );
}
