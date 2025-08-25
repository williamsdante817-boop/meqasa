import { Card } from "@/components/ui/card";
import { Building2, Search } from "lucide-react";

export function EmptyDevelopersState() {
  return (
    <Card className="w-full bg-white p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
          <Building2 className="w-8 h-8 text-gray-400" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-brand-accent">
            No Developers Found
          </h3>
          <p className="text-brand-muted max-w-md">
            We couldn&apos;t find any real estate developers at the moment.
            Please check back later or try searching with different criteria.
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-brand-muted">
          <Search className="w-4 h-4" />
          <span>Try adjusting your search or check back later</span>
        </div>
      </div>
    </Card>
  );
}
