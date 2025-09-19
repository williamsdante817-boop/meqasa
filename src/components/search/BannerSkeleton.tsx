export function BannerSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-full rounded-lg bg-gray-200"></div>
    </div>
  );
}

export function HeroBannerSkeleton() {
  return (
    <div className="relative hidden h-[280px] max-h-[280px] animate-pulse bg-gray-200 lg:block">
      <div className="absolute inset-0 rounded bg-gray-300"></div>
    </div>
  );
}

export function RectangleBannerSkeleton() {
  return (
    <div className="h-[250px] w-full animate-pulse rounded-lg bg-gray-200 shadow"></div>
  );
}
