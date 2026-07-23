import { positioning } from "./positioning";

export interface NavItem {
  label: string;
  href: string;
}

export const siteConfig = {
  name: "MBK Holding Commodities",
  shortName: "MBK",
  location: "Doha, State of Qatar",
  description: positioning.sentence,

  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Chairman's Message", href: "/chairmans-message" },
    { label: "Business Areas", href: "/business-areas" },
    { label: "Leadership", href: "/leadership" },
    { label: "Markets & Partnerships", href: "/markets-partnerships" },
    { label: "Contact", href: "/contact" },
  ] as NavItem[],

  primaryCTA: { label: "Contact MBK", href: "/contact" } as NavItem,

  footer: {
    companyDescription: positioning.sentence,
    location: "Doha, State of Qatar",
    navigation: [
      { label: "About", href: "/about" },
      { label: "Business Areas", href: "/business-areas" },
      { label: "Leadership", href: "/leadership" },
      { label: "Markets & Partnerships", href: "/markets-partnerships" },
    ] as NavItem[],
    legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ] as NavItem[],
  },
} as const;

export function copyrightLine(year: number = new Date().getFullYear()): string {
  return `© ${year} MBK Holding Commodities. All rights reserved.`;
}
