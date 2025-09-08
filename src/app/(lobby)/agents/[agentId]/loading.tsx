import { Skeleton } from "@/components/ui/skeleton";
import Shell from "@/layouts/shell";

export default function AgentDetailsLoading() {
  return (
    <>
      {/* Structured Data Skeleton */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
          }),
        }}
      />

      <div>
        {/* Agent Header Section */}
        <Shell>
          {/* Agent Header Card Skeleton - matching AgentHeader component */}
          <div className="bg-white rounded-lg shadow-sm border p-6 my-6">
            <div className="flex items-start gap-6">
              {/* Agent Logo */}
              <div className="flex-shrink-0">
                <Skeleton className="h-20 w-20 rounded-lg" />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    {/* Agent Name & Verification */}
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-48" />
                      <Skeleton className="h-6 w-20 rounded" />{" "}
                      {/* Verified badge */}
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" /> {/* MapPin icon */}
                      <Skeleton className="h-4 w-32" />
                    </div>

                    {/* Company */}
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" /> {/* Building icon */}
                      <Skeleton className="h-4 w-28" />
                    </div>

                    {/* About section */}
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-full max-w-md" />
                      <Skeleton className="h-4 w-full max-w-sm" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>

                  {/* Share button */}
                  <Skeleton className="h-9 w-20" />
                </div>

                {/* Stats section */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-8 rounded" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Shell>

        {/* Main Content */}
        <Shell className="mt-20">
          <div className="grid grid-cols-1 text-brand-accent w-full mt-4 lg:grid-cols-[2fr_1fr] lg:gap-8 lg:px-0">
            <div>
              {/* Breadcrumbs */}
              <div className="mb-6">
                <div className="flex space-x-2 items-center">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-4" /> {/* Separator */}
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-4" /> {/* Separator */}
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>

              {/* Agent Listings Section - matching AgentListings structure */}
              <div className="mb-8">
                {/* Listings Header */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-3 mb-2">
                      <Skeleton className="h-6 w-40" />{" "}
                      {/* "Listings By AgentName" */}
                      <Skeleton className="h-6 w-20 rounded" />{" "}
                      {/* Badge with total count */}
                    </div>
                    <Skeleton className="h-4 w-56 mb-6" />{" "}
                    {/* "Showing X-Y of Z listings" */}
                  </div>
                </div>

                {/* Property Listings Cards */}
                <div className="grid grid-cols-1 gap-8 mb-8">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="flex gap-4 p-4">
                        {/* Property Image */}
                        <Skeleton className="h-32 w-48 rounded-lg flex-shrink-0" />

                        <div className="flex-1 space-y-3">
                          {/* Property Title & Price */}
                          <div className="flex justify-between items-start">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-6 w-24" />
                          </div>

                          {/* Property Address */}
                          <Skeleton className="h-4 w-2/3" />

                          {/* Property Features (bed, bath, etc.) */}
                          <div className="flex space-x-4">
                            <div className="flex items-center gap-1">
                              <Skeleton className="h-4 w-4" />
                              <Skeleton className="h-4 w-8" />
                            </div>
                            <div className="flex items-center gap-1">
                              <Skeleton className="h-4 w-4" />
                              <Skeleton className="h-4 w-8" />
                            </div>
                            <div className="flex items-center gap-1">
                              <Skeleton className="h-4 w-4" />
                              <Skeleton className="h-4 w-12" />
                            </div>
                          </div>

                          {/* Property Description */}
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                          </div>

                          {/* Property Type & Contract */}
                          <div className="flex gap-2">
                            <Skeleton className="h-5 w-16 rounded" />
                            <Skeleton className="h-5 w-12 rounded" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Skeleton */}
                <div className="flex justify-center">
                  <div className="flex space-x-2">
                    <Skeleton className="h-10 w-20" /> {/* Previous */}
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Skeleton key={index} className="h-10 w-10" />
                    ))}
                    <Skeleton className="h-10 w-16" /> {/* Next */}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Contact Card */}
            <aside className="relative mb-5 pb-8 md:mb-0">
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
                <div className="space-y-4">
                  {/* Contact header */}
                  <Skeleton className="h-6 w-32" />

                  {/* Agent info */}
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>

                  {/* Contact buttons */}
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>

                  {/* Additional info */}
                  <div className="pt-4 border-t space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Shell>
      </div>
    </>
  );
}
