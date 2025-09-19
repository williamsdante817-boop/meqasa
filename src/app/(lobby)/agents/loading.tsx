import Shell from "@/layouts/shell";
import { Breadcrumbs } from "@/components/layout/bread-crumbs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function AgentsLoading() {
  return (
    <>
      {/* Structured Data Skeleton */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Real Estate Agents and Brokers",
          }),
        }}
      />
      <Shell>
        <div className="py-8">
          {/* Breadcrumb */}
          <Breadcrumbs
            className="mb-6"
            segments={[
              { title: "Home", href: "/" },
              { title: "Agents", href: "#" },
            ]}
          />

          {/* Agent Search Section Skeleton */}
          <div className="mb-8">
            <Skeleton className="mb-4 h-7 w-32" /> {/* Find an Agent title */}
            <Skeleton className="h-12 w-full max-w-md" /> {/* Search input */}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left Column - Agents */}
            <div className="space-y-6 lg:col-span-2">
              {/* Info Section - Exact match */}
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
                <Skeleton className="mb-3 h-6 w-80" />{" "}
                {/* "Real Estate Agents and Brokers on meQasa" */}
                <div className="space-y-2 text-sm">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="mt-2 h-4 w-64" />{" "}
                  {/* "Join the real estate professionals" link */}
                </div>
              </div>

              {/* Featured Agents Section */}
              <div>
                <Skeleton className="mb-4 h-6 w-36" />{" "}
                {/* "Featured Agents" title */}
                {/* Agent Cards - Vertical Layout to match AgentsList */}
                <div className="flex flex-col gap-6">
                  {/* Page info skeleton */}
                  <Skeleton className="mx-auto h-4 w-48" />{" "}
                  {/* "Showing X to Y of Z agents" */}
                  {/* Agent Cards Skeletons */}
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-1 items-start gap-4">
                          {/* Agent Logo/Photo */}
                          <Skeleton className="h-20 w-20 flex-shrink-0 rounded-lg" />

                          <div className="flex-1 space-y-3">
                            {/* Agent Name & Verification */}
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-6 w-40" />
                              <Skeleton className="h-5 w-16 rounded" />{" "}
                              {/* Verified badge */}
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-4 w-4 rounded" />{" "}
                              {/* MapPin icon */}
                              <Skeleton className="h-4 w-32" />
                            </div>

                            {/* Listings count */}
                            <Skeleton className="h-4 w-28" />

                            {/* Description */}
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-3/4" />
                            </div>

                            {/* Social links */}
                            <div className="flex items-center gap-2">
                              {Array.from({ length: 4 }).map(
                                (_, socialIndex) => (
                                  <Skeleton
                                    key={socialIndex}
                                    className="h-5 w-5 rounded"
                                  />
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Contact button */}
                        <Skeleton className="h-10 w-24 flex-shrink-0" />
                      </div>
                    </Card>
                  ))}
                  {/* Pagination Skeleton */}
                  <div className="mt-8 flex justify-center">
                    <div className="flex space-x-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-10 w-10" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - FAQ Skeleton */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <Skeleton className="mb-6 h-6 w-32" /> {/* FAQ title */}
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-200 pb-4 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-3/4" /> {/* Question */}
                        <Skeleton className="h-5 w-5 rounded" />{" "}
                        {/* Chevron icon */}
                      </div>
                      {index === 0 && (
                        <div className="mt-2 space-y-1">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-5/6" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Shell>
    </>
  );
}
