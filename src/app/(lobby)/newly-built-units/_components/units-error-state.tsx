import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface UnitsErrorStateProps {
  error: string;
  onRetry?: () => void;
}

export function UnitsErrorState({ error, onRetry }: UnitsErrorStateProps) {
  return (
    <div className="py-12 text-center">
      <div className="space-y-4">
        <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
        <h3 className="text-brand-accent text-xl font-semibold">
          Error Loading Units
        </h3>
        <p className="text-brand-muted mx-auto max-w-md">{error}</p>
        <Button onClick={onRetry || (() => window.location.reload())}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
