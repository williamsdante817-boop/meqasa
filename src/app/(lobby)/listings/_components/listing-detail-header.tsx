"use client";

import { AddFavoriteButton } from "@/components/add-favorite-button";
import { Badge } from "@/components/ui/badge";
import PropertyFeatures from "@/components/common/property-features";
import TrendingPropertyCard from "@/components/common/trending-property-card";
import PropertyContextCard from "@/components/common/property-context-card";
import { sanitizeHtml } from "@/lib/dom-sanitizer";
import type { ListingDetails } from "@/types/property";
import { getIsFurnished } from "./listing-detail-utils";

interface ListingDetailHeaderProps {
  listingDetail: ListingDetails;
  agentHref: string;
}

export function ListingDetailHeader({
  listingDetail,
  agentHref,
}: ListingDetailHeaderProps) {
  const isFurnished = getIsFurnished(listingDetail.isfurnished);

  const safePriceHtml = {
    __html: sanitizeHtml(listingDetail.price ?? ""),
  } satisfies { __html: string };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-inherit">
          {listingDetail.title}
        </h1>
        <AddFavoriteButton
          listingId={Number(listingDetail.listingid)}
          className="flex-shrink-0"
        />
      </div>

      <div className="mb-4">
        <div
          className="text-2xl font-bold text-inherit lg:text-3xl"
          dangerouslySetInnerHTML={safePriceHtml}
          aria-label={`Price: ${listingDetail.price}`}
        />
      </div>

      <PropertyFeatures
        beds={listingDetail.beds}
        baths={listingDetail.baths}
        garages={listingDetail.garages}
        floorArea={listingDetail.floorarea}
      />

      <div className="mb-6 flex items-center gap-4">
        <Badge variant="info" className="uppercase">
          {isFurnished ? "Furnished" : "Unfurnished"}
        </Badge>
        <Badge
          variant="info"
          className="max-w-[280px] uppercase md:max-w-full"
        >
          <p className="w-full truncate">{listingDetail.location}</p>
        </Badge>
      </div>

      <TrendingPropertyCard
        propertyType="listing"
        ownerType={listingDetail.owner.type}
        count={
          listingDetail.owner.type === "Agent"
            ? parseInt(listingDetail.owner.listingscount) || 0
            : 0
        }
        threshold={listingDetail.owner.type === "Agent" ? 5 : 100}
      />

      <PropertyContextCard
        propertyType="listing"
        ownerType={listingDetail.owner.type}
        ownerName={listingDetail.owner.name}
        contract={listingDetail.contract}
        type={listingDetail.type}
        location={listingDetail.location}
        listingData={{
          parenttext: listingDetail.parenttext,
          categorytext: listingDetail.categorytext,
        }}
      />
    </div>
  );
}