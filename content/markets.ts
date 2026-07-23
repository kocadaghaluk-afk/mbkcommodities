export interface CounterpartyCardContent {
  id: string;
  title: string;
  description: string;
}

/**
 * Approved title + one-sentence description per category. Descriptions
 * use only concepts already present elsewhere in the site's approved
 * copy — no new claims, statistics, counterparties, transaction volumes
 * or government relationships.
 */
export const counterpartyCards: CounterpartyCardContent[] = [
  {
    id: "producers",
    title: "Producers",
    description: "We engage with producers to build practical, credible sourcing relationships.",
  },
  {
    id: "suppliers",
    title: "Suppliers",
    description: "We work with suppliers whose reliability and standards support consistent commercial activity.",
  },
  {
    id: "industrial-buyers",
    title: "Industrial Buyers",
    description: "We support industrial buyers with access to selected commodities through clear, dependable arrangements.",
  },
  {
    id: "strategic-partners",
    title: "Strategic Partners",
    description: "We develop partnerships with organisations that bring complementary capabilities and shared objectives.",
  },
  {
    id: "government-state-related-entities",
    title: "Government and State-Related Entities",
    description:
      "We approach potential engagement with government and state-related entities through appropriate institutional channels and clearly defined commercial objectives.",
  },
  {
    id: "financial-institutions",
    title: "Financial Institutions",
    description: "We work with financial institutions to support the credible structuring of commercial activity.",
  },
];

export const marketsPageCopy = {
  eyebrow: "Markets & Partnerships",
  headline: "International perspective. Relationship-led development.",
  intro:
    "MBK works across selected commercial environments, developing relationships with counterparties capable of supporting credible and sustainable business.",
  perspective: {
    heading: "Selected international markets.",
    copy:
      "Our commercial presence spans the Middle East, Asia, Africa, Europe and the Americas. Market participation is opportunity-led and based on counterparty quality, commercial relevance and execution capability.",
  },
  counterparties: {
    heading: "Counterparties",
    supportingCopy:
      "MBK seeks professional counterparties with clear commercial objectives, credible capabilities and a long-term approach to cooperation.",
  },
  partnershipApproach: {
    heading: "Complementary capabilities. Aligned interests.",
    copy:
      "We approach partnerships as structured commercial relationships in which each party contributes relevant expertise, access, resources or execution capability.\n\nThe objective is not simply to complete a transaction, but to establish a credible foundation for continued cooperation where mutual value can be sustained.",
  },
  cta: {
    heading: "Explore a long-term commercial relationship with MBK.",
    button: { label: "Contact MBK", href: "/contact" },
  },
} as const;

export const homeMarketsCopy = {
  heading: "International outlook. Selective engagement.",
  copy: "MBK develops relationships across selected markets in the Middle East, Asia, Africa and Europe, working with professional counterparties whose capabilities and objectives support sustainable commercial cooperation.",
  link: { label: "Markets & Partnerships", href: "/markets-partnerships" },
} as const;
