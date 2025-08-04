import { Skeleton } from "@/components/ui/skeleton";
import Shell from "@/layouts/shell";

export default function SearchResultsSkeleton() {
  return (
    <>
      <Shell className="mt-8 flex gap-8 px-0">
        <div className="hidden">
          <aside className="flex flex-col gap-3">
            <div className="w-full">
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

        <div className="w-full">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[736px,1fr] md:px-0">
            <div className="w-full pb-8">
              <div className="grid grid-cols-1 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-4 rounded-xl border-[#fea3b1] shadow-none md:flex-row md:border md:p-4 w-full"
                  >
                    <div className="w-full md:min-w-[256px] md:w-[256px] p-0">
                      <Skeleton className="rounded-2xl h-[202px] w-full md:w-[256px]" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between px-4 pb-4 md:p-0">
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
            </div>
            <div>
              <aside className="hidden w-full items-center md:gridk grid-cols-1 gap-4">
                <Skeleton className="h-[300px] w-[250px]" />
                <Skeleton className="h-[300px] w-[250px]" />
                <Skeleton className="h-[300px] w-[250px]" />
              </aside>
            </div>
          </div>
        </div>
      </Shell>
    </>
  );
}
