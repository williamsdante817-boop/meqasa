import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Main wrapper component for streaming fresh content
interface FreshContentWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FreshContentWrapper({
  children,
  fallback = <Skeleton className="h-32 w-full" />,
}: FreshContentWrapperProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
