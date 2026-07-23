export interface LeadershipProfile {
  name: string;
  title: string;
  copy: string;
  /**
   * Concise one-sentence contribution used only on the Home page preview
   * cards. Not new copy — this is the verbatim first sentence of the
   * approved `copy` field above, reused as-is so the Home preview never
   * diverges from the approved profile text.
   */
  homeOneLiner: string;
  portraitPath: string;
  portraitAlt: string;
  /** Governance sequence — drives page order, not visual hierarchy or card size. */
  order: number;
}

/**
 * The four approved leadership profiles, in governance order. All profiles
 * use identical card treatment, portrait crop/size and copy length
 * proportions — sequence communicates governance order, not decorative
 * hierarchy (per 05_Page_Specifications, Leadership > Portrait Rules).
 */
export const leadership: LeadershipProfile[] = [
  {
    order: 1,
    name: "Sheikh Mansoor Bin Khalifa Al Thani",
    title: "Chairman",
    copy: "The Chairman provides strategic oversight and long-term institutional direction. His leadership supports the company's standing, strategic perspective and final consideration of matters of significant importance.",
    homeOneLiner: "Provides strategic oversight and long-term institutional direction.",
    portraitPath: "/images/leadership/chairman.jpg",
    portraitAlt: "Portrait of the Chairman.",
  },
  {
    order: 2,
    name: "Nasser Al-Kuwari",
    title: "General Director",
    copy: "Nasser Al-Kuwari contributes senior institutional representation, strategic relationships and executive perspective. Drawing on extensive experience and strong standing within Qatar's business and institutional environment, he represents MBK in selected high-level engagements and supports strategically significant commercial discussions.",
    homeOneLiner: "Contributes senior institutional representation and strategic relationships.",
    portraitPath: "/images/leadership/general-director.jpg",
    portraitAlt: "Portrait of the General Director.",
  },
  {
    order: 3,
    name: "Tariq Sobhi",
    title: "Chief Executive Officer",
    copy: "Tariq Sobhi provides executive leadership to the company and directs its commercial development. His role brings together strategic priorities, opportunity advancement and coordination across MBK's international business agenda.",
    homeOneLiner: "Provides executive leadership and direction of commercial development.",
    portraitPath: "/images/leadership/ceo.jpg",
    portraitAlt: "Portrait of the Chief Executive Officer.",
  },
  {
    order: 4,
    name: "Haluk Kocadağ",
    title: "Chief Operating Officer",
    copy: "Haluk Kocadağ coordinates the development and execution readiness of commercial opportunities. His work spans counterparty engagement, commercial structuring, cross-functional coordination and the disciplined advancement of transactions.",
    homeOneLiner: "Coordinates the development and execution readiness of commercial opportunities.",
    portraitPath: "/images/leadership/coo.jpg",
    portraitAlt: "Portrait of the Chief Operating Officer.",
  },
];

export const leadershipPageCopy = {
  eyebrow: "Leadership",
  headline: "Complementary leadership. Shared commercial purpose.",
  intro:
    "MBK's leadership combines strategic oversight, institutional representation, executive direction and operational execution.",
  model: {
    heading: "Leadership aligned around execution.",
    copy: "Strategic oversight, institutional representation and executive management operate as complementary functions. This structure enables opportunities to be developed professionally before significant matters are presented for final consideration.",
  },
  cta: {
    heading: "Connect through MBK's official corporate channels.",
    button: { label: "Contact MBK", href: "/contact" },
  },
} as const;

export const homeLeadershipCopy = {
  heading: "Leadership with strategic and commercial perspective.",
  copy: "MBK's leadership model brings together strategic oversight, institutional representation, executive direction and disciplined commercial execution.",
  link: { label: "Meet Our Leadership", href: "/leadership" },
} as const;
