export interface LocationDetail {
  title: string;
  description: string[];
  subsections?: { title: string; content: string }[];
}

export const locationDetails: Record<string, LocationDetail> = {
  "East-Legon": {
    title: "East Legon Locality Profile",
    description: [
      "East Legon is a vibrant and affluent residential area in Accra, Ghana. Known for its modern developments and proximity to the University of Ghana, it has become a prime location for both residential and commercial real estate.",
      "The area boasts a wide range of amenities including high-end restaurants, shopping centers, and international schools. Its strategic location offers easy access to the Tetteh Quarshie Interchange, connecting it to other major parts of the city.",
      "Real estate in East Legon is highly sought after, with a mix of luxury apartments, townhouses, and detached homes. It is a popular choice for expatriates and wealthy locals alike.",
    ],
    subsections: [
      {
        title: "LOCAL LIFE",
        content:
          "Life in East Legon is characterized by convenience and luxury. Residents enjoy access to top-tier gyms, spas, and recreational facilities. The nightlife is lively, with numerous bars and lounges offering entertainment.",
      },
      {
        title: "BUSINESS FRIENDLY",
        content:
          "East Legon is also a thriving business hub. Many multinational companies and local startups have established their offices here, taking advantage of the area's excellent infrastructure and connectivity.",
      },
      {
        title: "HIGH SECURITY",
        content:
          "Security is a priority in East Legon, with many gated communities and private security firms operating in the area. The presence of police patrols further enhances the safety of the neighborhood.",
      },
    ],
  },
  "popular-places-Airport-Residential-Area": {
    title: "Airport Residential Area Locality Profile",
    description: [
      "The Airport Residential Area is one of Accra's most prestigious and upscale neighborhoods. Located just minutes from the Kotoka International Airport, it is home to diplomats, business executives, and affluent families.",
      "This serene neighborhood is known for its tree-lined streets, spacious compounds, and colonial-style architecture blended with modern luxury apartments.",
      "It offers a quiet retreat from the city's bustle while remaining close to the central business district. The area features excellent infrastructure and a high standard of living.",
    ],
    subsections: [
      {
        title: "PRESTIGE & LUXURY",
        content:
          "Living in Airport Residential Area is synonymous with prestige. The properties here are among the most expensive in the country, reflecting the exclusivity and high demand for this prime location.",
      },
      {
        title: "DIPLOMATIC HUB",
        content:
          "The area hosts numerous embassies and diplomatic residences, contributing to its cosmopolitan atmosphere and high security. It is a preferred location for the international community.",
      },
    ],
  },
  "popular-places-Osu": {
    title: "Osu Locality Profile",
    description: [
      "Osu is the heartbeat of Accra's entertainment and commercial life. Often referred to as the 'Oxford Street' of Ghana, it is a bustling area filled with energy and activity 24/7.",
      "Famous for its vibrant nightlife, Osu is packed with restaurants, bars, casinos, and nightclubs. It is also a major shopping destination, with numerous boutiques and craft markets.",
      "Residential properties in Osu range from colonial-era houses to modern apartments. It attracts a diverse mix of young professionals, artists, and tourists who want to be in the center of the action.",
    ],
    subsections: [
      {
        title: "NIGHTLIFE & ENTERTAINMENT",
        content:
          "Osu's Oxford Street is legendary for its nightlife. Whether you're looking for fine dining, street food, or live music, Osu has it all. It is the go-to destination for fun and entertainment in Accra.",
      },
      {
        title: "COMMERCIAL HUB",
        content:
          "Beyond entertainment, Osu is a significant commercial center with many banks, corporate offices, and service providers. It is a dynamic environment where business meets pleasure.",
      },
    ],
  },
  "popular-places-Dzorwulu": {
    title: "Dzorwulu Locality Profile",
    description: [
      "Dzorwulu is a well-established residential area known for its peaceful environment and family-friendly atmosphere. It is centrally located, offering easy access to both the airport and the city center.",
      "The neighborhood is a mix of residential and commercial properties, with a growing number of businesses setting up shop along the main roads. It maintains a community feel while providing urban conveniences.",
      "Dzorwulu is popular among middle to upper-class families. It features good schools, reliable utilities, and a network of well-maintained roads.",
    ],
    subsections: [
      {
        title: "FAMILY ORIENTED",
        content:
          "Dzorwulu is an ideal place for families. It offers a safe and quiet environment with plenty of space for children to play. The community is tight-knit and welcoming.",
      },
      {
        title: "ACCESSIBILITY",
        content:
          "One of Dzorwulu's key advantages is its accessibility. It is bordered by the N1 highway, making it easy to travel to other parts of Accra. Commuting is relatively stress-free compared to other areas.",
      },
    ],
  },
};
