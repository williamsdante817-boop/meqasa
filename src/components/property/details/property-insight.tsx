import Image from "next/image";

import React from "react";
import { formatNumber, formatNumberToCedis } from "@/lib/utils";

export type PropertyInsightProps = {
  /** City/area name, e.g., "Lakeside Estate" */
  location?: string;
  /** Human-friendly type, e.g., "one-bedroom" or "2-bedroom" */
  bedroomType?: string;
  /** Negative means lower than average, positive means higher */
  priceDeltaPercent?: number;
  /** Average price for comparable listings, in GHS */
  avgPriceGhs?: number | string;
  /** Negative means smaller than average, positive means larger */
  sizeDeltaPercent?: number;
  /** Average size for comparable listings, in square meters */
  avgSizeSqm?: number | string;
};

function getDeltaWordForPrice(deltaPercent: number): string {
  return deltaPercent < 0 ? "lower" : "higher";
}

function getDeltaWordForSize(deltaPercent: number): string {
  return deltaPercent < 0 ? "smaller" : "larger";
}

function formatPercent(deltaPercent: number): string {
  return `${Math.abs(deltaPercent).toFixed(0)}%`;
}

export default function PropertyInsight(props: PropertyInsightProps) {
  const {
    location,
    bedroomType,
    priceDeltaPercent,
    avgPriceGhs,
    sizeDeltaPercent,
    avgSizeSqm,
  } = props;

  // Presentational defaults until functionality is wired
  const effectiveBedroomType = bedroomType ?? "one-bedroom";
  const effectiveLocation = location ?? "Ghana";
  const priceDelta =
    typeof priceDeltaPercent === "number" ? priceDeltaPercent : -12;
  const avgPrice = avgPriceGhs ?? 3200;
  const sizeDelta =
    typeof sizeDeltaPercent === "number" ? sizeDeltaPercent : -2;
  const avgSize = avgSizeSqm ?? 44;

  const contextPhrase = [effectiveBedroomType, effectiveLocation]
    .filter(Boolean)
    .join(" in ");

  return (
    <aside className="mt-16 border-y">
      <div className="py-8">
        <div>
          <h3 className="mb-6 text-xl font-bold text-b-accent">
            Property Insights
          </h3>

          <div className="flex items-center gap-6">
            <Image
              alt=""
              aria-hidden="true"
              src="/insights_price@3x.webp"
              width={32}
              height={32}
              className="hidden h-8 w-8 object-cover lg:block"
            />
            <div>
              <p className="font-light text-b-accent">
                This property is priced{" "}
                <span className="font-semibold">
                  {formatPercent(priceDelta)} {getDeltaWordForPrice(priceDelta)}
                </span>{" "}
                {contextPhrase
                  ? `than the average cost of ${contextPhrase}.`
                  : "than comparable listings."}
              </p>
              <small className="text-sm text-b-muted-dark">
                Avg. price:{" "}
                {formatNumberToCedis(avgPrice ?? 0, "en-GH", {
                  notation: "compact",
                })}
              </small>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-6">
            <Image
              alt=""
              aria-hidden="true"
              src="/insights_floorarea@3x.webp"
              width={32}
              height={32}
              className="hidden h-8 w-8 object-cover lg:block"
            />
            <div>
              <p className="font-light text-b-accent">
                This property measures{" "}
                <span className="font-semibold">
                  {formatPercent(sizeDelta)} {getDeltaWordForSize(sizeDelta)}
                </span>{" "}
                {contextPhrase
                  ? `than the average size of ${contextPhrase}.`
                  : "than comparable listings."}
              </p>
              <small className="text-sm text-b-muted-dark">
                Avg. size:{" "}
                {formatNumber(avgSize ?? 0, { maximumFractionDigits: 0 })} sqm
              </small>
            </div>
          </div>
        </div>

        <p className="mt-6 border-t border-border-b pt-3 text-xs text-b-muted-dark">
          The data presented reflects average prices and sizes for comparable
          listings
          {contextPhrase ? ` (${contextPhrase})` : ""} as listed on meqasa.com.
        </p>
      </div>
    </aside>
  );
}
