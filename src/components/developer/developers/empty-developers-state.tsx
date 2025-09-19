import { Card } from "@/components/ui/card";
import { Building2, Search } from "lucide-react";

export function EmptyDevelopersState() {
  return (
    <Card className="w-full bg-white p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Building2 className="h-8 w-8 text-gray-400" />
        </div>

        <div className="space-y-2">
          <h3 className="text-brand-accent text-lg font-semibold">
            No Developers Found
          </h3>
          <p className="text-brand-muted max-w-md">
            We couldn&apos;t find any real estate developers at the moment.
            Please check back later or try searching with different criteria.
          </p>
        </div>

        <div className="text-brand-muted flex items-center gap-2 text-sm">
          <Search className="h-4 w-4" />
          <span>Try adjusting your search or check back later</span>
        </div>
      </div>
    </Card>
  );
}
