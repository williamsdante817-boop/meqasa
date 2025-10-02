"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { sanitizeRichHtmlToInnerHtml } from "@/lib/dom-sanitizer";

const SKELETON_CLASSES = "h-[180px] w-full animate-pulse rounded-lg bg-gray-100";

interface FlexiBannerClientProps {
  html: string;
  bannerType: string;
}

export function FlexiBannerClient({ html, bannerType }: FlexiBannerClientProps) {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return <div className={SKELETON_CLASSES} aria-hidden />;
  }

  return (
    <Card
      className="mb-8 overflow-hidden rounded-lg border border-orange-300 shadow-sm"
      role="banner"
      aria-label="Promoted content"
    >
      <div dangerouslySetInnerHTML={sanitizeRichHtmlToInnerHtml(html)} />
    </Card>
  );
}
