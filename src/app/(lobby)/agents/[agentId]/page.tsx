export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building,
  FacebookIcon,
  InstagramIcon,
  MapPin,
  Share2,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ContactCard from "@/components/contact-card";
import { AgentPropertyCard } from "../_components/agent-property-card";
import Shell from "@/layouts/shell";
import { Breadcrumbs } from "@/components/bread-crumbs";

// Static data for demonstration
const staticAgentData = {
  id: "1",
  name: "Kenneth Earlvin Ofori",
  company: "Sompa Properties",
  locality: "Trinity Junction, East Legon",
  logo: "https://meqasa.com/fascimos/somics/72228706",
  verified: "verified agent",
  accounttype: "Premium Agent",
  activelistings: "786",
  about:
    "THE WHITE GROUP COMPANY LTD began operations in 2005. We are well known for our distinguished leadership in real estate development, sale, rental as well as property management. At The White Group we believe everything is possible in achieving success. We have so far provided and developed areas for residential and commercial purposes in Ghana. We promise to establish and maintain integrity through outlines of communication. Our goal is to exhibit a positive attitude and associate with others who share the same principle. Our superior advantage is based on superior quality, information, luxury, security and perfection is the hallmark of our company. Our experience at The White Group Company is indisputable, from design cutting edge facilities created in collaboration with some of the world's most renowned architects to the flawless interior design exclusively for our clients. We are committed to providing unparalleled quality service with the highest degree of professionalism. At The White Group, we offer a specialized suite of realty services to cater to the demands of our clients. Our service listings include; Property rentals, land sales/leasing, properties sales, property management, development [commercial real estate], renovations, property listings, concierge services.",
  experience: "13 years",
  commission: {
    rental: "10%",
    sale: "2%",
  },
  socials: {
    facebook: "#",
    instagram: "#",
    twitter: "#",
    youtube: "#",
  },
};

const properties = [
  {
    src: "https://images.unsplash.com/photo-1592595896551-12b371d546d5?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "for rent",
    href: "/1",
  },
  {
    src: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "for sale",
    href: "/2",
  },
  {
    src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "for rent",
    href: "/3",
  },
  {
    src: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=3274&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "for sale",
    href: "/4",
  },
  {
    src: "https://images.unsplash.com/photo-1556912173-3bb406ef7e77?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "for rent",
    href: "/5",
  },
  {
    src: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?q=80&w=2784&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    type: "for sale",
    href: "/6",
  },
];

export default async function AgentDetailsPage({
  params,
}: {
  params: { agentId: string };
}) {
  // For now, we'll use static data instead of fetching from API
  // This can be replaced with actual API calls once the backend is fixed
  const agent = staticAgentData;

  if (!agent) {
    notFound();
  }

  const PROPERTY_CARD_COUNT = 10;

  return (
    <div>
      <header className="h-[225px] gap-3 border-t-2 border-[#FD5372] md:flex md:h-[525px]">
        <div className="relative isolate flex h-full items-center justify-center shadow-sm md:w-[650px]">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <svg
              className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <pattern
                  id="e813992c-7d03-4cc4-a2bd-151760b470a0"
                  width={200}
                  height={200}
                  x="50%"
                  y={-1}
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M100 200V.5M.5 .5H200" fill="none" />
                </pattern>
              </defs>
              <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
                <path
                  d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
                  strokeWidth={0}
                />
              </svg>
              <rect
                width="100%"
                height="100%"
                strokeWidth={0}
                fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
              />
            </svg>
          </div>
          <div className="aspect-square rounded-md border bg-white p-4 shadow-sm">
            <Image
              alt={agent.name}
              src={agent.logo}
              width={50}
              height={50}
              className="h-[100px] w-[100px] object-cover"
            />
          </div>
        </div>
        <div className="hidden h-full w-full grid-cols-3 grid-rows-2 gap-1 md:grid">
          {properties.map((x, i) => (
            <div key={i} className="relative overflow-hidden">
              <Image
                src={x.src}
                alt={`Property image for ${x.type}`}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-2 left-2 bg-brand-accent text-white uppercase">
                {x.type}
              </Badge>
            </div>
          ))}
        </div>
      </header>

      <Shell className="mt-20">
        <section className="grid md:grid-cols-[736px,1fr] md:gap-8">
          <div>
            <Breadcrumbs
              className="mb-6"
              segments={[
                { title: "Home", href: "/" },
                { title: "Agents", href: "/agents" },
                { title: agent.name, href: "#" },
              ]}
            />
            <div className="text-brand-accent">
              <div className="flex flex-col items-start gap-3 md:flex-row md:justify-between md:gap-0">
                <div>
                  <h1 className="relative text-[23px] font-bold leading-5 text-brand-accent md:leading-8">
                    {agent.name}
                    <Badge className="absolute -right-32 -top-2 inline-block bg-green-500 uppercase text-white">
                      {agent.verified}
                    </Badge>
                  </h1>
                  <p className="text-l mt-2 flex items-center gap-2 text-brand-muted">
                    <MapPin
                      className="h-5 w-5 text-brand-primary"
                      strokeWidth="1.3"
                    />
                    {agent.locality}
                  </p>
                  <p className="text-l mt-2 flex items-center gap-2 text-brand-muted">
                    <Building
                      className="h-5 w-5 text-brand-primary"
                      strokeWidth="1.3"
                    />
                    {agent.company}
                  </p>
                </div>
                <Button
                  size="default"
                  variant="outline"
                  aria-label="Share agent profile"
                >
                  <span>Share</span>
                  <Share2
                    className="h-5 w-5 text-brand-muted"
                    strokeWidth="1.3"
                    aria-hidden="true"
                    focusable="false"
                  />
                </Button>
              </div>

              <div className="my-8 flex max-w-full items-center gap-6 md:gap-3">
                <Link
                  href={agent.socials.facebook}
                  aria-label="Facebook (placeholder)"
                  tabIndex={-1}
                  aria-disabled="true"
                >
                  <FacebookIcon
                    className="h-5 w-5"
                    strokeWidth="1.3"
                    aria-hidden="true"
                    focusable="false"
                  />
                </Link>
                <Link
                  href={agent.socials.instagram}
                  aria-label="Instagram (placeholder)"
                  tabIndex={-1}
                  aria-disabled="true"
                >
                  <InstagramIcon
                    className="h-5 w-5"
                    strokeWidth="1.3"
                    aria-hidden="true"
                    focusable="false"
                  />
                </Link>
                <Link
                  href={agent.socials.twitter}
                  aria-label="Twitter (placeholder)"
                  tabIndex={-1}
                  aria-disabled="true"
                >
                  <TwitterIcon
                    className="h-5 w-5"
                    strokeWidth="1.3"
                    aria-hidden="true"
                    focusable="false"
                  />
                </Link>
                <Link
                  href={agent.socials.youtube}
                  aria-label="YouTube (placeholder)"
                  tabIndex={-1}
                  aria-disabled="true"
                >
                  <YoutubeIcon
                    className="h-6 w-6"
                    strokeWidth="1.3"
                    aria-hidden="true"
                    focusable="false"
                  />
                </Link>
              </div>

              <div className="mb-10 grid grid-cols-3 divide-x border-y border-gray-100 px-2 py-8">
                <div>
                  <p className="font-semibold capitalize md:text-lg">
                    commission
                  </p>
                </div>
                <div>
                  <p className="text-center font-semibold capitalize md:text-lg">
                    rental :{" "}
                    <span className="font-medium text-brand-muted">
                      {agent.commission.rental}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-center font-semibold capitalize md:text-lg">
                    sale :{" "}
                    <span className="font-medium text-brand-muted">
                      {agent.commission.sale}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mb-10">
                <h2 className="mb-4 text-xl font-semibold">
                  About {agent.name.split(" ")[0]}
                </h2>
                <p className="text-brand-muted">{agent.about}</p>
              </div>

              <div className="mb-10 border-b border-gray-100 pb-8">
                <p className="text-lg font-semibold capitalize">
                  Experience :{" "}
                  <span className="inline-block font-medium lowercase text-brand-muted">
                    {agent.experience}
                  </span>
                </p>
              </div>

              <h2 className="mb-6 text-lg font-bold text-brand-accent">
                Listings By {agent.company} ({agent.activelistings})
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 mb-8">
              {Array.from({ length: PROPERTY_CARD_COUNT }).map((_, index) => (
                <AgentPropertyCard key={index} />
              ))}
            </div>
          </div>

          {/* Vertical form */}
          <aside className="relative mb-5 pb-8 md:mb-0">
            <ContactCard name={agent.name} image={agent.logo} />
          </aside>
        </section>
      </Shell>
    </div>
  );
}
