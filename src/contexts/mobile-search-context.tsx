"use client";

import { usePathname } from "next/navigation";
import * as React from "react";

interface MobileSearchContextValue {
  isOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
}

const MobileSearchContext = React.createContext<
  MobileSearchContextValue | undefined
>(undefined);

export function MobileSearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const openSearch = React.useCallback(() => setIsOpen(true), []);
  const closeSearch = React.useCallback(() => setIsOpen(false), []);

  // Auto-close modal on route change
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const value = React.useMemo(
    () => ({ isOpen, openSearch, closeSearch }),
    [isOpen, openSearch, closeSearch]
  );

  return (
    <MobileSearchContext.Provider value={value}>
      {children}
    </MobileSearchContext.Provider>
  );
}

export function useMobileSearch() {
  const context = React.useContext(MobileSearchContext);
  if (!context) {
    throw new Error("useMobileSearch must be used within MobileSearchProvider");
  }
  return context;
}
