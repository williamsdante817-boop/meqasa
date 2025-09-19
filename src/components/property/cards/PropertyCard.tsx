import Image from "next/image";
import Link from "next/link";
import type { MeqasaListing } from "@/types/meqasa";

interface PropertyCardProps {
  property: MeqasaListing;
  priority?: boolean;
  index?: number;
}

export default function PropertyCard({
  property,
  priority = false,
  index = 0,
}: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const listingUrl = `https://meqasa.com/property/${property.detailreq}`;

  return (
    <Link
      href={listingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg bg-white shadow-md transition-shadow duration-200 hover:shadow-lg"
    >
      <div className="relative h-48 w-full">
        <Image
          src={property.image || "/placeholder-property.jpg"}
          alt={property.summary}
          fill
          className="rounded-t-lg object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 300px"
          priority={priority && index < 4}
          loading={priority && index < 4 ? undefined : "lazy"}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAEAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        />
        {property.availability === "furnished" && (
          <span className="absolute top-2 right-2 rounded bg-[#cf007a] px-2 py-1 text-sm text-white">
            Furnished
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
          {property.summary}
        </h3>

        <div className="mb-2 text-xl text-[#cf007a]">
          <span className="font-bold">
            {formatPrice(Number(property.pricepart1))}
          </span>
          {property.contract === "rent" && (
            <span className="ml-1 text-sm font-normal text-gray-500">
              /{property.pricepart2}
            </span>
          )}
        </div>

        <div className="mb-2 text-gray-600">{property.locationstring}</div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          {property.bedroomcount && (
            <div className="flex items-center">
              <svg
                className="mr-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              {property.bedroomcount}{" "}
              {Number(property.bedroomcount) === 1 ? "bed" : "beds"}
            </div>
          )}
          {property.bathroomcount && (
            <div className="flex items-center">
              <svg
                className="mr-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {property.bathroomcount}{" "}
              {Number(property.bathroomcount) === 1 ? "bath" : "baths"}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
