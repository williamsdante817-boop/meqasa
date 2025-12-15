'use client';

import { useEffect } from 'react';

export function DisableScrollRestoration() {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return null;
}
