import { Suspense } from "react";
import { RectangleBannerSkeleton } from "./BannerSkeleton";
import RealEstateAd from "./ad";
import { sanitizeRichHtmlToInnerHtml } from "@/lib/dom-sanitizer";
import { extractFlexiBannerBlocks } from "@/lib/flexi-banner";

// Streaming Rectangle Banners Component
async function StreamingRectangleBanners() {
  const { getRectangleBanners } = await import("@/lib/banners");
  const rectangleBanners = await getRectangleBanners();

  if (!rectangleBanners || rectangleBanners.length === 0) {
    return <RectangleBannerSkeleton />;
  }

  return (
    <aside className="grid w-full grid-cols-1 items-center gap-8">
      {rectangleBanners.map((banner, idx) => (
        <RealEstateAd key={idx} src={banner.src} href={banner.href} />
      ))}
    </aside>
  );
}

// Streaming Flexi Banner Component
async function StreamingFlexiBanner() {
  const { getFlexiBanner } = await import("@/lib/banners");
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
}

export function StreamingSidebarBanners() {
  return (
    <div className="hidden lg:block">
      <Suspense fallback={<RectangleBannerSkeleton />}>
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
