import Link from "next/link";
import { memo } from "react";

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

  const hasValidISO = dateISO ? !Number.isNaN(Date.parse(dateISO)) : false;
  const readableDate =
    displayDate ??
    (hasValidISO
      ? new Date(dateISO!).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : undefined);

  return (
    <article className="mt-12 grid grid-cols-[min-content_minmax(0,1fr)] gap-[16px]">
      <p
        className="text-[28px] font-black leading-8 text-brand-muted opacity-50"
        aria-hidden="true"
      >
        {formatIndex(index)}
      </p>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-brand-accent mb-1 leading-tight">
          <Link
            href={postUrl}
            className="line-clamp-2 text-[15px] cursor-pointer font-semibold text-brand-accent hover:underline focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
          >
            {title}
          </Link>
        </h3>
        {readableDate ? (
          <time
            {...(hasValidISO ? { dateTime: dateISO! } : {})}
            className="mt-2 block text-sm text-brand-muted"
          >
            {readableDate}
          </time>
        ) : null}
      </div>
    </article>
  );
}

export default memo(MarketNewsCard);
