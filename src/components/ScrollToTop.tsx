'use client';

import { usePathname } from 'next/navigation';
import { useEffect, startTransition } from 'react';

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    startTransition(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  }, [pathname]);

  return null;
}
