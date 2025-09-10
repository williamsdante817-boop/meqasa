import Link from "next/link";
import React from "react";

export default function SeoText() {
  return (
    <aside
      className="pt-14 md:pt-20 lg:pt-24 text-sm leading-6 text-brand-muted lg:text-base"
      aria-labelledby="seo-text-heading"
      role="complementary"
    >
      <h2 id="seo-text-heading" className="sr-only">
        SEO Information
      </h2>
      <div className="grid items-center gap-6">
        <div>
          <p>
            MeQasa is the number one real estate website in Ghana with over
            40,000 properties listed from over 230 developers and over 2500
            agents. MeQasa plays a crucial role in Ghana&apos;s real estate
            sector by offering property seekers more choice and property sellers
            more leads than any other site.
          </p>
          <p>
            Looking for{" "}
            <Link
              href="/property-for-sale-in-accra"
              className="font-medium text-brand-blue no-underline hover:underline focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
              aria-label="View properties for sale in Accra"
            >
              properties for sale
            </Link>{" "}
            or{" "}
            <Link
              href="/property-for-rent-in-accra"
              className="font-medium text-brand-blue no-underline hover:underline focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
              aria-label="View properties for rent in Accra"
            >
              properties for rent
            </Link>
            ? Whatever your property needs, you&apos;re on the right website.
          </p>
          <p>
            From{" "}
            <Link
              href="/house-for-sale-in-accra"
              className="font-medium text-brand-blue no-underline hover:underline focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
              aria-label="View houses for sale in Accra"
            >
              houses in Accra
            </Link>{" "}
            to{" "}
            <Link
              href="/apartment-for-sale-in-east-legon"
              className="font-medium text-brand-blue no-underline hover:underline focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
              aria-label="View apartments for sale in East Legon"
            >
              apartments in East Legon
            </Link>
            , houses in Spintex to beach houses in Takoradi, MeQasa has the
            right property for you.
          </p>
        </div>
        <div>
          <p>
            Ghana&apos;s real estate landscape has evolved into a vast and
            exciting space over the last decade. While there is still a large
            under-supply of housing as compared to the needs of the population,
            Ghana&apos;s capital city Accra offers an impressive range of
            property that spans across all property types and prices.
          </p>
        </div>
      </div>
    </aside>
  );
}
