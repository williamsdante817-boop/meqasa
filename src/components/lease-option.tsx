import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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
    <div className="flex h-[120px] w-full max-w-[280px] md:h-full md:w-full flex-col items-center justify-center rounded-lg p-4 text-center border border-blue-400/80 bg-gray-50 font-light overflow-hidden">
      <div className="mb-1 text-brand-muted text-xs md:text-sm">{duration}</div>
      <div className="text-base md:text-md mb-1 text-brand-accent font-medium truncate">
        GH₵ {price}
      </div>
      <div className="text-brand-muted text-xs md:text-sm">per {unit}</div>
    </div>
  );
}

// Render lease options component
export default function LeaseOptions({ leaseOptions }: LeaseOptionsProps) {
  if (!leaseOptions || leaseOptions.length === 0) return null;
  return (
    <aside className="pt-14 md:pt-20">
      <Card className="flex w-full flex-col items-start gap-5 rounded-lg border-[#50a3ff] bg-[#d7e9ff] px-6 py-4 text-brand-accent md:flex-row">
        <Badge
          id="lease-options-heading"
          className="bg-blue-500 text-xs uppercase"
        >
          Available Lease options
        </Badge>
        <ul
          className="grid grid-cols-2 md:grid-cols-3 w-full gap-4 md:gap-3"
          role="list"
          aria-labelledby="lease-options-heading"
        >
          {leaseOptions?.map((option, index) => (
            <li
              key={index}
              className="h-full w-full min-w-0 flex justify-center"
            >
              <LeaseOptionCard option={option} />
            </li>
          ))}
        </ul>
      </Card>
    </aside>
  );
}
