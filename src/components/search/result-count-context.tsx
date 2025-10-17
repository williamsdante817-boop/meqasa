"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface ResultCountContextValue {
  count: number;
  setCount: (next: number) => void;
}

const ResultCountContext = createContext<ResultCountContextValue | undefined>(
  undefined
);

interface ResultCountProviderProps {
  initialCount?: number;
  children: ReactNode;
}

export function ResultCountProvider({
  initialCount = 0,
  children,
}: ResultCountProviderProps) {
  const [count, setCount] = useState(initialCount);
  const value = useMemo(
    () => ({
      count,
      setCount,
    }),
    [count]
  );

  return (
    <ResultCountContext.Provider value={value}>
      {children}
    </ResultCountContext.Provider>
  );
}

export function useResultCount() {
  const context = useContext(ResultCountContext);
  if (!context) {
    throw new Error("useResultCount must be used within a ResultCountProvider");
  }
  return context;
}
