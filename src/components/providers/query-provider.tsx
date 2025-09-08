"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { getQueryClient } from "@/lib/query-client";
import { useState } from "react";

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * React Query Provider component
 * Provides QueryClient to the entire app with devtools in development
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Create query client instance
  // Using useState to ensure we get the same instance on the client
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only show devtools in development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
