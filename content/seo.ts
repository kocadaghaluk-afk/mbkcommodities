export interface PageSeo {
  path: string;
  title: string;
  description: string;
}

/**
 * Approved per-page metadata (05_Page_Specifications). Titles/descriptions
 * are used verbatim — do not rewrite into generic marketing language.
 *
 * Typed with `satisfies` rather than a `Record<string, PageSeo>` annotation.
 * The latter is an index-signature type, and under this project's
 * `noUncheckedIndexedAccess` tsconfig setting, every access through an
 * index signature — including dot-notation access like `pageSeo.home` —
 * is widened to `PageSeo | undefined`, regardless of the fact that these
 * exact 8 keys are always present. `satisfies` validates each value
 * against `PageSeo` while preserving the literal, named-key shape of the
 * object, so `pageSeo.home` etc. remain definite `PageSeo`, matching what
 * every call site (`buildMetadata(pageSeo.home)`, and 7 others) expects.
 */
export const pageSeo = {
  home: {
    path: "/",
    title: "MBK Holding Commodities | International Commodities Company",
    description:
      "MBK Holding Commodities is a Qatar-based international commodities company developing commercially sound opportunities across selected global markets.",
  },
  about: {
    path: "/about",
    title: "About MBK | MBK Holding Commodities",
    description:
      "Learn about MBK Holding Commodities, its institutional foundation, commercial approach and long-term perspective.",
  },
  chairmansMessage: {
    path: "/chairmans-message",
    title: "Chairman's Message | MBK Holding Commodities",
    description:
      "A long-term perspective from the Chairman of MBK Holding Commodities on responsible trade, institutional discipline and international outlook.",
  },
  businessAreas: {
    path: "/business-areas",
    title: "Business Areas | MBK Holding Commodities",
    description:
      "Explore MBK Holding Commodities' selected areas of activity across energy, precious metals, natural resources and industrial commodities.",
  },
  leadership: {
    path: "/leadership",
    title: "Leadership | MBK Holding Commodities",
    description:
      "Meet the leadership of MBK Holding Commodities and learn how strategic oversight, institutional representation and executive management support the company.",
  },
  marketsPartnerships: {
    path: "/markets-partnerships",
    title: "Markets & Partnerships | MBK Holding Commodities",
    description:
      "MBK develops professional commercial relationships across selected markets in the Middle East, Asia, Africa and Europe.",
  },
  contact: {
    path: "/contact",
    title: "Contact MBK Holding Commodities",
    description:
      "Contact MBK Holding Commodities in Doha, State of Qatar, for professional commercial enquiries.",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy Policy | MBK Holding Commodities",
    description:
      "Privacy policy for MBK Holding Commodities. This page is pending legal review prior to publication.",
  },
  terms: {
    path: "/terms",
    title: "Terms of Use | MBK Holding Commodities",
    description:
      "Terms of use for MBK Holding Commodities. This page is pending legal review prior to publication.",
  },
} satisfies Record<string, PageSeo>;
