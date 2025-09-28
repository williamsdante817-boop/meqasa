"use client";

import { AlertCard } from "@/components/common/alert-card";
import Amenities from "@/components/amenities";
import ContentSection from "@/components/layout/content-section";
import { ExpandableDescription } from "@/components/expandable-description";
import LeaseOptions from "@/components/lease-option";
import MortgageCalculator from "@/components/mortgage-calculator";
import PropertyDetailsTable from "@/components/property/details/property-details";
import PropertyFavoritesBanner from "@/components/property-favorite-banner";
import PropertyInsight from "@/components/property/details/property-insight";
import PropertyShowcase from "@/components/property/details/property-showcase";
import SafetyTipsCard from "@/components/safety-tip";
import { buildInnerHtml } from "@/lib/utils";
import type { ListingDetails } from "@/types/property";
import ProjectVideo from "../../development-projects/_component/project-video";
import {
  buildPropertyDetails,
  CONTRACT_TYPES,
  PROPERTY_TYPES,
  extractNumericPrice,
} from "./listing-detail-utils";

interface ListingDetailContentProps {
  listingDetail: ListingDetails;
  agentHref: string;
}

export function ListingDetailContent({
  listingDetail,
  agentHref,
}: ListingDetailContentProps) {
  const propertyDetails = buildPropertyDetails(listingDetail);

  return (
    <>
      {/* Description Section */}
      <ContentSection
        title="Description"
        description=""
        href="/listings"
        className="overflow-hidden px-0 pt-14 pb-10 md:pt-20 md:pb-0"
        btnHidden
      >
        {listingDetail?.description &&
        listingDetail.description.trim() !== "" ? (
          <ExpandableDescription
            description={buildInnerHtml(listingDetail.description)}
            name={listingDetail.owner.name}
            href={agentHref}
          />
        ) : (
          <AlertCard
            title="No description provided"
            description="This listing doesn't have a detailed description yet."
            className="my-4 h-[200px] md:h-[300px]"
          />
        )}
      </ContentSection>

      {/* Image Gallery */}
      <ContentSection
        title="Explore More"
        description=""
        href="/listings"
        className="px-0 pt-14 md:pt-20"
        btnHidden
      >
        <PropertyShowcase images={listingDetail?.imagelist} />
      </ContentSection>

      {/* Favorites Banner */}
      <PropertyFavoritesBanner
        propertyId={Number(listingDetail.detailreq.split("-").pop())}
        propertyType="listing"
      />

      {/* Video Section */}
      {(listingDetail as unknown as { videoUrl?: string }).videoUrl &&
        (listingDetail as unknown as { videoUrl?: string }).videoUrl!.trim() !==
          "" && (
          <ProjectVideo
            videoUrl={
              (listingDetail as unknown as { videoUrl?: string }).videoUrl!
            }
          />
        )}

      {/* Property Details */}
      <ContentSection
        title="Project Details"
        description=""
        href=""
        className="pt-14 md:pt-20"
        btnHidden
      >
        <PropertyDetailsTable details={propertyDetails} />
      </ContentSection>

      {/* Lease Options (for non-sale properties) */}
      {listingDetail.contract.toLowerCase() !== CONTRACT_TYPES.SALE && (
        <LeaseOptions leaseOptions={listingDetail.leaseoptions} />
      )}

      {/* Amenities */}
      {listingDetail.amenities.length > 0 && (
        <ContentSection
          title="Amenities"
          description=""
          href=""
          className="pt-14 md:pt-20"
          btnHidden
        >
          <Amenities amenities={listingDetail.amenities} />
        </ContentSection>
      )}

      {/* Safety Tips */}
      <SafetyTipsCard />

      {/* Property Insight */}
      <PropertyInsight
        location={listingDetail.locationstring}
        bedroomType={
          listingDetail.beds ? `${listingDetail.beds}-bedroom` : undefined
        }
      />

      {/* Mortgage Calculator (for sale properties, non-land) */}
      {listingDetail.contract.toLowerCase() === CONTRACT_TYPES.SALE &&
        listingDetail.type.toLowerCase() !== PROPERTY_TYPES.LAND && (
          <ContentSection
            title="Mortgage Calculator"
            description=""
            href=""
            className="pt-14 md:pt-20"
            btnHidden
          >
            <MortgageCalculator
              key={listingDetail.listingid}
              price={extractNumericPrice(listingDetail.price)}
            />
          </ContentSection>
        )}
    </>
  );
}
