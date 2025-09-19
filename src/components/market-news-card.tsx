import Link from "next/link";
import { memo } from "react";
import { formatDisplayDate, isValidDateString } from "@/lib/utils";

interface MarketNewsCardProps {
  index: number;
  title: string;
  dateISO?: string; // Machine-readable ISO 8601 date (e.g., 2023-01-23)
  displayDate?: string; // Human-readable date (e.g., Jan 23, 2023)
  slug?: string; // Optional slug for the blog post
}

const formatIndex = (index: number): string =>
  (index + 1).toString().padStart(2, "0");

function MarketNewsCard({
  index,
  title,
  dateISO,
  displayDate,
}: MarketNewsCardProps) {
  // Placeholder href until backend routes are ready
  const postUrl = "/blog";

  const hasValidISO = dateISO ? isValidDateString(dateISO) : false;
  const readableDate =
    displayDate ?? (hasValidISO && dateISO ? formatDisplayDate(dateISO) : undefined);

  return (
    <article className="mt-12 grid grid-cols-[min-content_minmax(0,1fr)] gap-[16px]">
      <p
        className="text-brand-muted text-[28px] leading-8 font-black opacity-50"
        aria-hidden="true"
      >
        {formatIndex(index)}
      </p>
      <div className="space-y-2">
        <h3 className="text-brand-accent mb-1 text-lg leading-tight font-semibold">
          <Link
            href={postUrl}
            className="text-brand-accent focus:ring-brand-accent line-clamp-2 cursor-pointer text-[15px] font-semibold hover:underline focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            {title}
          </Link>
        </h3>
        {readableDate ? (
          <time
            {...(hasValidISO ? { dateTime: dateISO! } : {})}
            className="text-brand-muted mt-2 block text-sm"
          >
            {readableDate}
          </time>
        ) : null}
      </div>
    </article>
  );
}

export default memo(MarketNewsCard);
