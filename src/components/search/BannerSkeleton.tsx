export function BannerSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg h-8 w-full"></div>
    </div>
  );
}

export function HeroBannerSkeleton() {
  return (
    <div className="hidden lg:block max-h-[280px] h-[280px] relative bg-gray-200 animate-pulse">
      <div className="absolute inset-0 bg-gray-300 rounded"></div>
    </div>
  );
}

export function RectangleBannerSkeleton() {
  return (
    <div className="w-full h-[250px] bg-gray-200 rounded-lg shadow animate-pulse"></div>
  );
}
