export interface BusinessArea {
  slug: string;
  name: string;
  /** Short copy used in the Home page grid. */
  homeCopy: string;
  /** Full copy used on the Business Areas page. */
  fullCopy: string;
  /** Optional non-promissory taxonomy list (Energy only, per spec). */
  taxonomy?: string[];
  imagePath: string;
  imageAlt: string;
}

/**
 * The five approved business areas, in the order they must consistently
 * appear across the site. All five receive identical structural and visual
 * treatment — none should be rendered smaller, later-loading, or otherwise
 * visually subordinate to the others.
 */
export const businessAreas: BusinessArea[] = [
  {
    slug: "energy-commodities",
    name: "Energy Commodities",
    homeCopy:
      "Commercial engagement across selected energy products and related markets.",
    fullCopy:
      "MBK engages across selected energy markets through producer, supplier and buyer relationships. The company focuses on opportunities supported by credible counterparties, practical commercial structures and clear execution pathways.",
    taxonomy: ["Petroleum products", "Gas-related commodities", "Selected energy feedstocks"],
    imagePath: "/images/business-areas/energy.jpg",
    imageAlt: "Aerial view of an energy storage terminal with tanker berths and pipeline infrastructure.",
  },
  {
    slug: "precious-metals",
    name: "Precious Metals",
    homeCopy:
      "Opportunity development and strategic commercial relationships within selected precious-metals markets.",
    fullCopy:
      "MBK develops selected precious-metals opportunities through trusted commercial relationships, careful counterparty assessment and appropriate transaction structures.",
    imagePath: "/images/business-areas/precious-metals.jpg",
    imageAlt: "Stacked gold bars, representing precious-metals commercial context.",
  },
  {
    slug: "natural-resources-mining",
    name: "Natural Resources & Mining",
    homeCopy:
      "Commercial opportunities connected to responsibly developed natural resources and mining supply.",
    fullCopy:
      "The company evaluates opportunities connected to mining supply and natural resources where commercial viability, responsible sourcing and execution capability are sufficiently established.",
    imagePath: "/images/business-areas/mining.jpg",
    imageAlt: "Aerial view of an open-pit mining operation with heavy haul trucks and bulk material handling.",
  },
  {
    slug: "industrial-commodities",
    name: "Industrial Commodities",
    homeCopy:
      "Selected commodities serving industrial, infrastructure and manufacturing demand.",
    fullCopy:
      "MBK participates selectively in industrial commodity markets supporting infrastructure, manufacturing and international trade.",
    imagePath: "/images/business-areas/industrial.jpg",
    imageAlt: "Spools of industrial-grade wire in a manufacturing or materials-handling context.",
  },
  {
    slug: "chemicals-petrochemicals",
    name: "Chemicals & Petrochemicals",
    homeCopy:
      "Selected commercial opportunities across chemical and petrochemical markets, supported by credible supply and demand relationships.",
    fullCopy:
      "MBK develops selected opportunities across chemical and petrochemical markets, working with credible producers, suppliers and buyers where product suitability, logistics and commercial structure are sufficiently established.",
    imagePath: "/images/business-areas/chemicals.jpg",
    imageAlt: "Aerial view of chemical and petrochemical storage tanks and pipeline infrastructure at a coastal facility.",
  },
];

export const businessAreasIntro = {
  home: {
    heading: "Selected areas of activity",
    intro:
      "Our commercial focus spans sectors central to international trade and industrial development.",
    link: { label: "Explore Our Business Areas", href: "/business-areas" },
  },
  page: {
    eyebrow: "Business Areas",
    headline: "Focused participation across selected commodity markets.",
    intro:
      "MBK develops commercial opportunities where relationships, market understanding and disciplined execution can create meaningful value.",
  },
  commercialModel: {
    heading: "The role follows the opportunity.",
    copy:
      "MBK is not limited to a single fixed commercial role. Depending on the opportunity, the company may contribute through strategic sourcing, commercial structuring, partnership development, transaction coordination or selective participation.\n\nParticipation is determined by the quality of the opportunity, the counterparties involved and the value MBK can responsibly contribute.",
  },
  cta: {
    heading: "Discuss a commercially relevant opportunity.",
    button: { label: "Contact MBK", href: "/contact" },
  },
} as const;
