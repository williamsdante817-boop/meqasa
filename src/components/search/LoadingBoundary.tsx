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
          <div className="h-8 w-full rounded-lg bg-gray-200"></div>
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
          <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
          <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200"></div>
        </div>
      }
    >
      {children}
    </LoadingBoundary>
  );
}
