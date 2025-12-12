import { Suspense } from "react";
import type { ReactNode } from "react";
import { RectangleBannerSkeleton } from "./BannerSkeleton";
import RealEstateAd from "./ad";
import { sanitizeRichHtmlToInnerHtml } from "@/lib/dom-sanitizer";
import { extractFlexiBannerBlocks } from "@/lib/flexi-banner";
import { logError } from "@/lib/logger";

const SIDEBAR_AD_HEADING_ID = "search-sidebar-sponsored";

function deriveAdvertiserLabel(href: string): string {
  try {
    const url = new URL(href);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return "featured advertiser";
  }
}

function SidebarAdSection({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <aside
      aria-labelledby={SIDEBAR_AD_HEADING_ID}
      className="grid w-full grid-cols-1 items-start gap-8"
    >
      <h2 id={SIDEBAR_AD_HEADING_ID} className="sr-only">
        Sponsored listings
      </h2>
      {children}
    </aside>
  );
}

function SidebarAdsFallback() {
  return (
    <SidebarAdSection>
      <RectangleBannerSkeleton />
    </SidebarAdSection>
  );
}

// Streaming Rectangle Banners Component
async function StreamingRectangleBanners() {
  const { getRectangleBanners } = await import("@/lib/banners");
  const rectangleBanners = await getRectangleBanners();

  if (!rectangleBanners || rectangleBanners.length === 0) {
    return (
      <SidebarAdSection>
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
          Sponsored content will appear here soon.
        </div>
      </SidebarAdSection>
    );
  }

  return (
    <SidebarAdSection>
      {rectangleBanners.map((banner, idx) => {
        const advertiserLabel = deriveAdvertiserLabel(banner.href);
        return (
          <RealEstateAd
            key={`${banner.href}-${idx}`}
            src={banner.src}
            href={banner.href}
            alt={`Sponsored highlight from ${advertiserLabel}`}
            title={advertiserLabel}
            badge="Sponsored"
          />
        );
      })}
    </SidebarAdSection>
  );
}

// Streaming Flexi Banner Component
async function StreamingFlexiBanner() {
  const { getFlexiBanner } = await import("@/lib/banners");

  try {
    const flexiBanner = await getFlexiBanner();

    if (!flexiBanner) {
      return null;
    }

    const blocks = extractFlexiBannerBlocks(flexiBanner);

    if (blocks.length === 0) {
      return null;
    }

    return (
      <div className="mb-8 space-y-6" role="group" aria-label="Featured advertisements">
        {blocks.map((block, index) => (
          <div
            key={`flexi-block-${index}`}
            className="overflow-hidden rounded-lg border border-orange-300 shadow-sm"
            dangerouslySetInnerHTML={sanitizeRichHtmlToInnerHtml(block)}
          />
        ))}
      </div>
    );
  } catch (error) {
    logError("Failed to load flexi banner", error, {
      component: "StreamingFlexiBanner",
    });
    return null;
  }
}

export function StreamingSidebarBanners() {
  return (
    <div className="hidden lg:block">
      <Suspense fallback={<SidebarAdsFallback />}>
        <StreamingRectangleBanners />
      </Suspense>
    </div>
  );
}

export function StreamingFlexiBannerWrapper() {
  return (
    <Suspense fallback={null}>
      <StreamingFlexiBanner />
    </Suspense>
  );
}
