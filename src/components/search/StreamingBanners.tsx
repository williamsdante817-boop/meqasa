import { Suspense } from "react";
import { RectangleBannerSkeleton } from "./BannerSkeleton";
import RealEstateAd from "./ad";
import { sanitizeRichHtmlToInnerHtml } from "@/lib/dom-sanitizer";

// Streaming Rectangle Banners Component
async function StreamingRectangleBanners() {
  const { getRectangleBanners } = await import("@/lib/banners");
  const rectangleBanners = await getRectangleBanners();

  if (!rectangleBanners || rectangleBanners.length === 0) {
    return <RectangleBannerSkeleton />;
  }

  return (
    <aside className="w-full items-center grid grid-cols-1 gap-8">
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

  return (
    <div
      className="mb-8 border border-orange-300 rounded-lg shadow-sm overflow-hidden"
      role="banner"
      aria-label="Flexi banner showcasing featured projects"
      dangerouslySetInnerHTML={sanitizeRichHtmlToInnerHtml(flexiBanner)}
    />
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
