export const homeHero = {
  eyebrow: "Qatar-Based International Commodities Company",
  headline: "Connecting markets through disciplined commercial engagement.",
  supportingCopy:
    "MBK Holding Commodities develops and advances commercially sound opportunities across selected commodity sectors and international markets.",
  /** Visually dominant primary action (refinement pass: CTA hierarchy). */
  primaryCTA: { label: "Contact MBK", href: "/contact" },
  /** Understated, text-style secondary action — not an equal second button. */
  secondaryCTA: { label: "Explore Our Business Areas", href: "/business-areas" },
  imagePath: "/images/home/home-hero.jpg",
  imageAlt: "A bulk carrier vessel underway at sunrise, with a Gulf coastal skyline visible in the distance.",
} as const;

export const homeIntroduction = {
  heading: "A commercial company built on institutional foundations.",
  copy: "Operating within the broader MBK Holding ecosystem, MBK Holding Commodities combines experienced leadership, established relationships and a disciplined approach to international business.\n\nWe engage with producers, suppliers, industrial buyers and strategic counterparties to develop practical commercial opportunities with a long-term perspective.",
  link: { label: "About MBK", href: "/about" },
} as const;

export interface ProcessStep {
  id: string;
  label: string;
  copy: string;
}

export const howMbkWorks = {
  heading: "From access to executable opportunity.",
  intro:
    "MBK follows a disciplined four-stage process, from opportunity identification through execution.",
  steps: [
    { id: "identify", label: "Identify", copy: "Recognise commercially relevant opportunities." },
    { id: "align", label: "Align", copy: "Bring credible counterparties and interests together." },
    { id: "structure", label: "Structure", copy: "Develop a practical commercial framework." },
    { id: "execute", label: "Execute", copy: "Coordinate progress with discipline and accountability." },
  ] as ProcessStep[],
} as const;

export const homeClosingCTA = {
  heading: "Begin a professional commercial conversation.",
  copy: "We welcome enquiries from producers, suppliers, buyers and strategic institutions seeking serious, long-term commercial engagement.",
  button: { label: "Contact MBK", href: "/contact" },
} as const;
