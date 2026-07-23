/**
 * INTERNAL DEVELOPMENT & HANDOVER TOOL — DO NOT IMPORT FROM PUBLIC PAGES.
 *
 * This registry tracks every placeholder value or asset in the project so
 * the outstanding-approvals list and placeholder inventory in the handover
 * report can be generated mechanically rather than by manual review.
 *
 * It must never be rendered on public-facing pages. Public pages resolve
 * approval-gated content by omission (see content/contact.ts) rather than
 * by displaying a "pending" or "[APPROVAL REQUIRED]" state to visitors.
 *
 * This file may be surfaced in a development-only diagnostics route or
 * printed directly for the handover report — not shipped to production
 * rendering paths.
 */

export type PlaceholderStatus =
  | "pending-approval"
  | "resolved"
  | "placeholder-asset"
  | "pending-legal-review";

export interface PlaceholderEntry {
  id: string;
  status: PlaceholderStatus;
  description: string;
  location: string;
}

export const placeholderRegistry: PlaceholderEntry[] = [
  {
    id: "production-domain",
    status: "resolved",
    description: "Production domain approved and confirmed: https://mbkcommodities.com. Configured via NEXT_PUBLIC_SITE_URL in .env.example/.env.local, and hardcoded as the fallback + indexing-guard reference value in lib/metadata.ts (APPROVED_PRODUCTION_DOMAIN). Search-engine indexing (app/layout.tsx) is now gated on this exact value via isConfirmedProductionDomain() — only a deployment actually serving from this domain will be indexed. Still required before full production readiness: Resend sender-domain verification against this domain (see contact-form-production-readiness), and Vercel custom-domain assignment.",
    location: ".env.local, .env.example, lib/metadata.ts, app/layout.tsx, app/sitemap.ts, app/robots.ts",
  },
  {
    id: "markets-map-country-level-claims",
    status: "resolved",
    description: "Markets & Partnerships map shows country-level 'MBK Presence' / 'Strategic Partner' markers — a deliberate, approved exception to the original master specification's 'broad regions only, no country-level activity claims' map rule. See MASTER_SPEC_ADDENDUM.md for the full governance record before adding, removing, or reclassifying any country.",
    location: "content/markets-map.ts, content/world-map-data.ts, components/sections/WorldMap.tsx, MASTER_SPEC_ADDENDUM.md",
  },
  {
    id: "chairman-perspective",
    status: "resolved",
    description: "RETIRED. This draft About-page section was never approved and has been superseded by the approved Homepage 'Chairman's Message' section (see chairman-message entry below) — the site now has a single official Chairman-voice section, not two. The rendering component (ChairmanPerspective.tsx) has been deleted; the draft text is kept in content/about.ts (archivedChairmanPerspectiveDraft) for source-control recordkeeping only, not referenced anywhere.",
    location: "content/about.ts (archivedChairmanPerspectiveDraft, unused)",
  },
  {
    id: "chairman-message",
    status: "resolved",
    description: "Chairman's Message — approved, signed, and published with final attribution (Sheikh Mansoor Bin Khalifa Al Thani, Chairman, MBK Holding Commodities). Originally a homepage section (twice, in two different positions), now a standalone page at /chairmans-message, linked from primary navigation between About and Business Areas. This is the site's single public Chairman-voice source.",
    location: "content/chairmans-message.ts, components/sections/ChairmanMessagePage.tsx, app/chairmans-message/page.tsx, content/site.ts (nav), content/seo.ts (metadata)",
  },
  {
    id: "leadership-biography-source",
    status: "pending-approval",
    description: "Leadership biographies (Home preview one-liners and full Leadership-page bios) remain the original approved copy. A 'Company Profile' document was supplied but is not usable as a source — its content (sovereign-influence framing, unverified deal-specific claims, 'newly established' language) directly conflicts with this project's no-invented-claims governance and was not used. Biographies will only be revised once a genuinely usable, verifiable source is supplied.",
    location: "content/leadership.ts",
  },
  {
    id: "general-director-title",
    status: "resolved",
    description: "General Director title approved for Nasser Al-Kuwari.",
    location: "content/leadership.ts",
  },
  {
    id: "contact-email",
    status: "placeholder-asset",
    description: "info@mbkcommodities.qa is a temporary development placeholder, not the final production address — no production domain has been selected yet, and this address should not be assumed final. It is safe to keep using for development/local testing and is correctly displayed on the site meanwhile (the site's own display logic doesn't distinguish 'temporary' from 'final' — that distinction lives only here). Replace with the real address once MBK finalizes the production domain. Not currently treated as a launch blocker — see contact-form-production-readiness below, which defers this deliberately.",
    location: "content/contact.ts (env: CONTACT_EMAIL), components/layout/Footer.tsx, app/contact/page.tsx, .env.local, .env.example",
  },
  {
    id: "contact-telephone",
    status: "pending-approval",
    description: "Corporate telephone number not yet approved. Row omitted from public site until CONTACT_TELEPHONE is configured.",
    location: "content/contact.ts (env: CONTACT_TELEPHONE), components/layout/Footer.tsx, app/contact/page.tsx",
  },
  {
    id: "contact-linkedin",
    status: "pending-approval",
    description: "Corporate LinkedIn URL not yet approved. Link omitted from public site until CONTACT_LINKEDIN_URL is configured.",
    location: "content/contact.ts (env: CONTACT_LINKEDIN_URL), components/layout/Footer.tsx, app/contact/page.tsx",
  },
  {
    id: "legal-privacy",
    status: "pending-legal-review",
    description: "Privacy Policy wording is a placeholder shell only. Do not publish to production until legally reviewed and approved. The contact form's consent link depends on this page.",
    location: "app/privacy/page.tsx",
  },
  {
    id: "legal-terms",
    status: "pending-legal-review",
    description: "Terms of Use wording is a placeholder shell only. Do not publish to production until legally reviewed and approved.",
    location: "app/terms/page.tsx",
  },
  {
    id: "contact-form-production-readiness",
    status: "pending-approval",
    description: "Email delivery (Resend) and rate limiting (Upstash Redis) are implemented in code against real provider APIs — see lib/email-provider.ts and lib/rate-limit.ts. Two categories of remaining work, deliberately kept separate: (1) DEFERRED, not currently blocking — Resend sender-domain verification and final CONTACT_RECIPIENT_EMAIL/RESEND_FROM_EMAIL values depend on a production domain that hasn't been chosen yet (see production-domain); Upstash credentials are a quick setup step once ready. (2) STILL AN ACTUAL BLOCKER — the Privacy Policy must receive legal approval, since the form's consent checkbox depends on it regardless of domain/email status.",
    location: "lib/actions.ts, lib/email-provider.ts, lib/rate-limit.ts, .env.example",
  },
  {
    id: "brand-logo-primary",
    status: "resolved",
    description: "Full-color lockup — the real, approved MBK Holding Commodities logo (supplied by MBK), used via the Logo component. This is the only approved logo asset (Brand Bible v1.1, Section 4).",
    location: "public/brand/logo-primary.png",
  },
  {
    id: "brand-logo-reversed",
    status: "pending-approval",
    description: "Reversed/light version of the lockup. Not yet approved or produced (Brand Bible v1.1, Section 4.4). Until approved, dark/photographic placements use the full-color lockup with a light scrim (see components/ui/Logo.tsx `withScrim`).",
    location: "Not present in the repository — no file exists to reference.",
  },
  {
    id: "brand-logo-monochrome",
    status: "pending-approval",
    description: "Monochrome (Ink/White) versions of the lockup. Not yet approved or produced (Brand Bible v1.1, Section 4.4).",
    location: "Not present in the repository — no file exists to reference.",
  },
  {
    id: "brand-logo-compact-mark",
    status: "pending-approval",
    description: "Compact mark for favicon/small-scale use. Not yet approved or produced, and must never be created by cropping the full lockup (Brand Bible v1.1, Section 4.5).",
    location: "Not present in the repository — no file exists to reference.",
  },
  {
    id: "brand-favicon",
    status: "placeholder-asset",
    description: "Favicon is a neutral placeholder mark (not derived from the approved logo), pending an official compact mark.",
    location: "public/brand/favicon.svg",
  },
  {
    id: "image-home-hero",
    status: "resolved",
    description: "Final production photograph — bulk carrier vessel at sunrise with a Gulf coastal skyline in the distance. Confirmed not to depict LNG carrier or LNG terminal infrastructure before integration, per instruction not to imply MBK owns or operates LNG infrastructure.",
    location: "public/images/home/home-hero.jpg",
  },
  {
    id: "image-about-hero",
    status: "resolved",
    description: "About page hero — Doha skyline and waterfront corniche at dawn.",
    location: "public/images/about/about-hero.jpg",
  },
  {
    id: "image-about-institutional-relationships",
    status: "resolved",
    description: "Institutional Foundation section image. Representative editorial stock photography only — the people shown are not MBK employees, executives or counterparties, and the setting is not an MBK office. Alt text is deliberately neutral (\"Executive discussion in an international corporate setting\") to avoid any such implication.",
    location: "public/images/about/institutional-relationships.jpg",
  },
  {
    id: "image-about-qatar-vision",
    status: "resolved",
    description: "Qatar National Vision context section image — Doha skyline across the bay at dawn. No government logos, emblems or official graphics.",
    location: "public/images/about/qatar-vision.jpg",
  },
  {
    id: "image-business-area-energy",
    status: "resolved",
    description: "Energy Commodities business-area image — final production photograph (storage terminal, tanker berth, pipeline infrastructure).",
    location: "public/images/business-areas/energy.jpg",
  },
  {
    id: "image-business-area-precious-metals",
    status: "resolved",
    description: "Precious Metals business-area image — final production photograph.",
    location: "public/images/business-areas/precious-metals.jpg",
  },
  {
    id: "image-business-area-mining",
    status: "resolved",
    description: "Natural Resources & Mining business-area image — final production photograph.",
    location: "public/images/business-areas/mining.jpg",
  },
  {
    id: "image-business-area-industrial",
    status: "resolved",
    description: "Industrial Commodities business-area image — final production photograph.",
    location: "public/images/business-areas/industrial.jpg",
  },
  {
    id: "image-business-area-chemicals",
    status: "resolved",
    description: "Chemicals & Petrochemicals business-area image — final production photograph.",
    location: "public/images/business-areas/chemicals.jpg",
  },
  {
    id: "image-leadership-chairman",
    status: "resolved",
    description: "Chairman portrait — final production photograph. Cropped consistently with the General Director and CEO portraits (same crop rectangle applied to all three identically-sized source images): Qatar flag remains visible per instruction, reduced from its original frame share so it doesn't dominate, without being removed.",
    location: "public/images/leadership/chairman.jpg",
  },
  {
    id: "image-leadership-general-director",
    status: "resolved",
    description: "General Director portrait — final production photograph. Same uniform crop treatment as the Chairman and CEO portraits.",
    location: "public/images/leadership/general-director.jpg",
  },
  {
    id: "image-leadership-ceo",
    status: "resolved",
    description: "Chief Executive Officer portrait — final production photograph. Same uniform crop treatment as the Chairman and General Director portraits.",
    location: "public/images/leadership/ceo.jpg",
  },
  {
    id: "image-leadership-coo",
    status: "resolved",
    description: "Chief Operating Officer portrait — approved final photograph. Same crop treatment (percentage-based) applied as the Chairman, General Director, and CEO portraits.",
    location: "public/images/leadership/coo.jpg",
  },
  {
    id: "image-markets",
    status: "resolved",
    description: "Markets & Partnerships supporting image — replaced with an approved higher-resolution photograph (industrial port/terminal viewed from an elevated platform). Cropped from an 864×1232 portrait source to 864×576 (3:2) — a real improvement over the previous 512×279 source, though still below the 1600-2000px long-edge recommended elsewhere in this project for prominent images; consider a higher-resolution version if this image is ever needed at a larger display size. This photo includes identifiable people in the foreground — treated the same as the About_2 institutional-relationships photo: representative editorial imagery only, not implying the people shown are MBK employees, executives, or that this depicts a real MBK site visit. Alt text is kept neutral and scene-descriptive accordingly.",
    location: "public/images/markets/markets-partnerships.jpg",
  },
];

export function outstandingApprovals(): PlaceholderEntry[] {
  return placeholderRegistry.filter(
    (entry) => entry.status === "pending-approval" || entry.status === "pending-legal-review"
  );
}

export function placeholderAssets(): PlaceholderEntry[] {
  return placeholderRegistry.filter((entry) => entry.status === "placeholder-asset");
}
