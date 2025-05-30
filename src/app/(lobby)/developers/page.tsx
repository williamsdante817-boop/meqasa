import Shell from "@/layouts/shell";
import { DeveloperCard } from "@/components/developer-card";
import SearchInput from "@/components/search-input";

export const metadata = {
  title: "Real Estate Developers | Meqasa",
  description:
    "Browse through our list of trusted real estate developers in Ghana",
};

export default function DevelopersPage() {
  const developers = [
    {
      developerid: "549504051",
      about:
        "For almost three decades in the Ghanaian real estate market, Goldkey Properties has developed an area of over 200,000 sqm for sale and rent in prime locations around Accra, including, Cantonments, Air",
      email: "afua.owusu@goldkeygh.com",
      logo: "c4085edb510333529100aefe69f2e93b",
      subdomain: "goldkeypropertieslimited.meqasa.com",
      facebook: "https://www.facebook.com/Goldkey-Properties-1931091600455654/",
      twitter: "https://twitter.com/GoldkeyGH",
      linkedin: "",
      instagram: "https://www.instagram.com/goldkeygh/?hl=en",
      hero: "ecec878867b32953568176d107a630a6",
      city: "Cantonments",
      address: "Rangoon Ln, Accra, Ghana",
      website: "http://www.goldkeyghana.com/",
      companyname: "Goldkey Properties Ltd",
      name: "Goldkey Properties Limited",
      unitcount: 18,
      landcount: 0,
      prcount: 12,
    },
    {
      developerid: "549504051",
      about:
        "For almost three decades in the Ghanaian real estate market, Goldkey Properties has developed an area of over 200,000 sqm for sale and rent in prime locations around Accra, including, Cantonments, Air",
      email: "afua.owusu@goldkeygh.com",
      logo: "c4085edb510333529100aefe69f2e93b",
      subdomain: "goldkeypropertieslimited.meqasa.com",
      facebook: "https://www.facebook.com/Goldkey-Properties-1931091600455654/",
      twitter: "https://twitter.com/GoldkeyGH",
      linkedin: "",
      instagram: "https://www.instagram.com/goldkeygh/?hl=en",
      hero: "ecec878867b32953568176d107a630a6",
      city: "Cantonments",
      address: "Rangoon Ln, Accra, Ghana",
      website: "http://www.goldkeyghana.com/",
      companyname: "Goldkey Properties Ltd",
      name: "Goldkey Properties Limited",
      unitcount: 18,
      landcount: 0,
      prcount: 12,
    },
    {
      developerid: "549504051",
      about:
        "For almost three decades in the Ghanaian real estate market, Goldkey Properties has developed an area of over 200,000 sqm for sale and rent in prime locations around Accra, including, Cantonments, Air",
      email: "afua.owusu@goldkeygh.com",
      logo: "c4085edb510333529100aefe69f2e93b",
      subdomain: "goldkeypropertieslimited.meqasa.com",
      facebook: "https://www.facebook.com/Goldkey-Properties-1931091600455654/",
      twitter: "https://twitter.com/GoldkeyGH",
      linkedin: "",
      instagram: "https://www.instagram.com/goldkeygh/?hl=en",
      hero: "ecec878867b32953568176d107a630a6",
      city: "Cantonments",
      address: "Rangoon Ln, Accra, Ghana",
      website: "http://www.goldkeyghana.com/",
      companyname: "Goldkey Properties Ltd",
      name: "Goldkey Properties Limited",
      unitcount: 18,
      landcount: 0,
      prcount: 12,
    },
  ];

  return (
    <Shell>
      <div className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8">
          <div>
            <header className="mb-8 text-b-accent">
              <h1 className="mb-2 text-lg font-bold leading-tight tracking-tighter text-brand-accent md:text-xl">
                Find a Developer
              </h1>
              <div className="w-full">
                <SearchInput data={developers} path="projects-by-developer" />
              </div>
            </header>
            <div className="space-y-8">
              {developers.map((developer) => (
                <DeveloperCard
                  key={developer.developerid}
                  developer={developer}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
