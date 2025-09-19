import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface LeaseOptionsProps {
  leaseOptions?: string[];
}

function LeaseOptionCard({ option }: { option: string }) {
  // Extract duration and price robustly
  const durationRegex = /(\d+)\s*(?:month|months)/i;
  const durationMatch = durationRegex.exec(option);

  // Try to capture price after common Ghana Cedi markers first
  const currencyRegex = /GH(?:S|₵|&#8373;)?\s*([\d,.]+)/i;
  const currencyPriceMatch = currencyRegex.exec(option);

  // Fallback: grab the last number-like token in the string (helps when format varies)
  let fallbackPrice = "";
  const allNumberTokensRegex = /\d[\d,.]*/g;
  const allNumberTokens: string[] = [];
  let tokenMatch: RegExpExecArray | null;
  while ((tokenMatch = allNumberTokensRegex.exec(option)) !== null) {
    allNumberTokens.push(tokenMatch[0]);
  }
  if (allNumberTokens.length > 0) {
    fallbackPrice = allNumberTokens[allNumberTokens.length - 1] ?? "";
    if (durationMatch && fallbackPrice === durationMatch[1]) {
      fallbackPrice = "";
    }
  }

  const duration = durationMatch ? `${durationMatch[1]} months` : "";
  const price = currencyPriceMatch ? currencyPriceMatch[1] : fallbackPrice;
  const unit = "month";

  return (
    <div className="flex h-[120px] w-full flex-col items-center justify-center rounded-lg border border-blue-200 bg-white p-4 text-center transition-all hover:border-blue-300 hover:shadow-md">
      <div className="mb-2 flex items-center gap-1 text-blue-600">
        <Calendar className="h-3 w-3" />
        <span className="text-xs font-medium">{duration}</span>
      </div>
      <div className="text-brand-accent mb-1 flex items-center gap-1">
        <span className="text-lg font-semibold">GH₵ {price}</span>
      </div>
      <div className="text-brand-muted text-xs">per {unit}</div>
    </div>
  );
}

// Render lease options component
export default function LeaseOptions({ leaseOptions }: LeaseOptionsProps) {
  if (!leaseOptions || leaseOptions.length === 0) return null;
  return (
    <aside className="pt-14 md:pt-20">
      <Card className="rounded-lg border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 md:p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Calendar className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-brand-accent text-base font-semibold lg:text-lg">
              Available Lease Options
            </h3>
            <p className="text-sm text-blue-600">
              Flexible payment terms available
            </p>
          </div>
        </div>

        <div
          className="grid grid-cols-2 gap-4 lg:grid-cols-3"
          role="list"
          aria-label="Available lease payment options"
        >
          {leaseOptions?.map((option, index) => (
            <div key={index} className="w-full">
              <LeaseOptionCard option={option} />
            </div>
          ))}
        </div>
      </Card>
    </aside>
  );
}
