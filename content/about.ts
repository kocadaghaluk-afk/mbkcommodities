export const aboutPageCopy = {
  hero: {
    eyebrow: "About MBK",
    headline: "Institutional foundation. Commercial purpose.",
    intro:
      "MBK Holding Commodities is a Qatar-based international commodities company operating across selected sectors and markets.",
    imagePath: "/images/about/about-hero.jpg",
    imageAlt: "Doha skyline and waterfront corniche at dawn.",
  },
  whoWeAre: {
    heading: "Built for international commercial engagement.",
    copy: "MBK identifies, develops and advances commodity opportunities through professional relationships, informed commercial judgment and coordinated execution.\n\nThe company operates within the broader MBK Holding ecosystem, drawing on its institutional foundation while developing a distinct commercial identity and long-term market presence.",
  },
  purpose: {
    heading: "Creating sustainable commercial value.",
    copy: "Our purpose is to connect credible market participants and develop commercially sound structures that support reliable trade, responsible engagement and lasting business relationships.",
  },
  approach: {
    heading: "Our Approach",
    columns: [
      {
        title: "Commercial Discipline",
        copy: "We assess opportunities on commercial merit, execution visibility and strategic relevance.",
      },
      {
        title: "Relationship Perspective",
        copy: "We build professional relationships intended to extend beyond individual transactions.",
      },
      {
        title: "Long-Term Development",
        copy: "We pursue measured growth aligned with capability, reputation and institutional strength.",
      },
    ],
  },
  institutionalFoundation: {
    heading: "Operating within the MBK Holding ecosystem.",
    copy: "The MBK Holding foundation supports the company through experienced leadership, institutional perspective and established international relationships. MBK Holding Commodities applies that foundation to selected commodity markets through its own commercial objectives and operating discipline.",
    imagePath: "/images/about/institutional-relationships.jpg",
    imageAlt: "Executive discussion in an international corporate setting.",
  },
  qatarContext: {
    heading: "Operating within Qatar's long-term development environment",
    copy: "Headquartered in Doha, MBK Holding Commodities operates within the wider development environment shaped by Qatar National Vision 2030 and its long-term emphasis on economic resilience, international connectivity and responsible development.\n\nWithin this context, MBK pursues disciplined commercial engagement, durable relationships and measured growth across selected international markets.",
    imagePath: "/images/about/qatar-vision.jpg",
    imageAlt: "Doha skyline viewed across the bay at dawn.",
  },
  cta: {
    heading: "Learn how MBK approaches international commodity markets.",
    buttons: [
      { label: "Business Areas", href: "/business-areas" },
      { label: "Contact MBK", href: "/contact" },
    ],
  },
} as const;

/**
 * RETIRED — no longer rendered anywhere on the site.
 *
 * This was a draft, never-approved "Chairman's Perspective" section
 * originally built for this About page. It has been superseded by the
 * approved "Chairman's Message", now a standalone page at
 * /chairmans-message (content/chairmans-message.ts,
 * components/sections/ChairmanMessagePage.tsx) — the site now has a
 * single official Chairman-voice source, not two.
 *
 * The component that used to render this (ChairmanPerspective.tsx) has
 * been deleted. This text is kept here only for source-control
 * recordkeeping, per instruction, and is not imported or referenced by
 * any page or component.
 */
export const archivedChairmanPerspectiveDraft = {
  status: "pending-approval" as "pending-approval" | "approved",
  heading: "A Chairman's Perspective",
  paragraphs: [
    "Long-term commercial value is built through discipline, sound judgment and relationships that can endure beyond a single transaction.",
    "From Doha, MBK Holding Commodities brings together regional grounding and an international commercial outlook. We seek to engage with producers, suppliers, industrial buyers and institutional counterparties who value measured execution, clarity and long-term cooperation.",
    "Our priority is not to pursue every opportunity, but to evaluate selected opportunities carefully and advance those that can be structured responsibly and credibly.",
  ],
} as const;
