import { Skeleton } from "@/components/ui/skeleton";
import { ResultSearchFilter } from "@/components/search/results-search-filter";
import Shell from "@/layouts/shell";

export default function SearchResultsSkeleton() {
  return (
    <>
      <div className="relative">
        <div
          className="hidden lg:block max-h-[280px] h-[280px] relative bg-contain bg-center"
          style={{
            backgroundImage: `url(https://dve7rykno93gs.cloudfront.net/pieoq/904309523`,
          }}
          role="img"
          aria-label="Hero banner showcasing featured properties"
        ></div>
      </div>

      <ResultSearchFilter />
      <Shell className="mt-12 flex gap-8">
        <div>
          <aside className="hidden md:flex md:flex-col md:gap-3">
            <div className="">
              <ul className="w-max text-xs">
                <li className="mb-2">
                  <Skeleton className="h-8 w-16" />
                </li>
                <li className="mb-2">
                  <Skeleton className="h-8 w-20" />
                </li>
                <li className="mb-2">
                  <Skeleton className="h-8 w-24" />
                </li>
                <li className="mb-2">
                  <Skeleton className="h-8 w-20" />
                </li>
                <li className="mb-2">
                  <Skeleton className="h-8 w-22" />
                </li>
                <li className="mb-2">
                  <Skeleton className="h-8 w-12" />
                </li>
                <li className="mb-2">
                  <Skeleton className="h-8 w-20" />
                </li>
                <li className="mb-2">
                  <Skeleton className="h-8 w-14" />
                </li>
                <li className="mb-2">
                  <Skeleton className="h-8 w-10" />
                </li>
                <li className="mb-2">
                  <Skeleton className="h-8 w-24" />
                </li>
              </ul>
            </div>
          </aside>
        </div>

        <div>
          <aside>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-6 w-64 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </aside>
          <div className="mt-12 grid grid-cols-1 gap-8 px-4 md:grid-cols-[736px,1fr] md:px-0">
            <div className="grid grid-cols-1 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-4 rounded-xl shadow-none lg:flex-row lg:border lg:p-4"
                >
                  <div className="min-w-[256px] p-0">
                    <Skeleton className="rounded-2xl h-[202px] w-[256px]" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between px-4 pb-4 lg:p-0">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-5 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-1/3 mb-2" />
                    <div className="flex items-center gap-2 mt-2">
                      <Skeleton className="h-11 w-11 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <aside className="w-full items-center grid grid-cols-1 gap-4">
                <Skeleton className="h-[300px] w-full" />
                <Skeleton className="h-[300px] w-full" />
                <Skeleton className="h-[300px] w-full" />
              </aside>
            </div>
          </div>
        </div>
      </Shell>
    </>
  );
}
