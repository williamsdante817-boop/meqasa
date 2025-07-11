import { Suspense } from "react";
import { SearchResults } from "../../../../components/search/search-results";

interface SearchPageProps {
  params: Promise<{ type: string }>;
}

export default async function SearchPage({ params }: SearchPageProps) {
  const { type } = await params;

  return (
    <div className="">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <SearchResults type={type} />
      </Suspense>
    </div>
  );
}
