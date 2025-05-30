import Image from "next/image";
import Link from "next/link";
import type { MeqasaListing } from "@/types/meqasa";

interface PropertyCardProps {
  property: MeqasaListing;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const listingUrl = `https://meqasa.com/property/${property.detailrequest}`;

  return (
    <Link
      href={listingUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
    >
      <div className="relative h-48 w-full">
        <Image
          src={property.image || "/placeholder-property.jpg"}
          alt={property.summary}
          fill
          className="object-cover rounded-t-lg"
        />
        {property.availability === "furnished" && (
          <span className="absolute top-2 right-2 bg-[#cf007a] text-white px-2 py-1 rounded text-sm">
            Furnished
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {property.summary}
        </h3>

        <div className="text-[#cf007a] font-bold text-xl mb-2">
          {formatPrice(Number(property.pricepart1))}
          {property.contract === "rent" && (
            <span className="text-sm text-gray-500 ml-1">
              /{property.pricepart2}
            </span>
          )}
        </div>

        <div className="text-gray-600 mb-2">{property.locationstring}</div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          {property.bedroomcount && (
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1"
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
                className="w-4 h-4 mr-1"
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
