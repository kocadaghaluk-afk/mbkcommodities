import type { Metadata } from "next";
import type { PageSeo } from "@/content/seo";
import { siteConfig } from "@/content/site";

/**
 * The one approved production domain. Used ONLY as an exact-match target
 * for the indexing/headers guards below — deliberately NEVER as the
 * fallback value for getSiteUrl(). An earlier version of this file used
 * it as the fallback too, which meant an unset NEXT_PUBLIC_SITE_URL
 * would silently resolve to "looks like production" and could enable
 * indexing by accident. Fixed here: a missing env var now fails toward
 * an obviously-non-production value instead.
 */
const APPROVED_PRODUCTION_DOMAIN = "https://mbkcommodities.com";

/**
 * Safe fallback used only when NEXT_PUBLIC_SITE_URL is unset — for local
 * development. Deliberately not a production-looking URL, so a missing
 * env var can never be mistaken for a confirmed production deployment.
 */
const LOCAL_DEV_FALLBACK = "http://localhost:3000";

function normalizeUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  return configured ? normalizeUrl(configured) : LOCAL_DEV_FALLBACK;
}

/**
 * True only when BOTH hold:
 *  (a) this is a genuine Vercel Production deployment — checked via
 *      VERCEL_ENV, not NODE_ENV, because Vercel Preview builds also run
 *      in production mode and are otherwise indistinguishable from real
 *      Production by NODE_ENV alone;
 *  (b) NEXT_PUBLIC_SITE_URL resolves to exactly the approved domain.
 *
 * Neither condition alone is sufficient — this is deliberate. Used to
 * gate search-engine indexing (app/layout.tsx) and, separately, to gate
 * production-only security headers (next.config.ts uses the same
 * VERCEL_ENV check directly, since next.config.ts can't import from
 * lib/ at the point headers() runs).
 */
export function isConfirmedProductionDeployment(): boolean {
  const isVercelProduction = process.env.VERCEL_ENV === "production";
  const isApprovedDomain = getSiteUrl() === APPROVED_PRODUCTION_DOMAIN;
  return isVercelProduction && isApprovedDomain;
}

/**
 * Fails loudly during a genuine Vercel Production build if the
 * production URL isn't exactly the approved domain — rather than
 * silently shipping a sitemap, canonical tags, or Open Graph URLs
 * pointing at the wrong place. Local dev and Preview builds are
 * completely unaffected by this check, regardless of what
 * NEXT_PUBLIC_SITE_URL currently holds in those contexts.
 */
function assertProductionUrlIsConfigured(): void {
  const isVercelProduction = process.env.VERCEL_ENV === "production";
  const currentUrl = getSiteUrl();
  if (isVercelProduction && currentUrl !== APPROVED_PRODUCTION_DOMAIN) {
    throw new Error(
      `Production build misconfiguration: NEXT_PUBLIC_SITE_URL must be exactly ` +
        `"${APPROVED_PRODUCTION_DOMAIN}" on Vercel Production (VERCEL_ENV=production). ` +
        `Got: "${currentUrl}". Fix this in the Vercel project's Production ` +
        `environment variables before deploying.`
    );
  }
}

/**
 * Builds a Next.js Metadata object from an approved PageSeo entry.
 * Single source of truth for title/description/OG/Twitter across pages.
 */
export function buildMetadata(page: PageSeo): Metadata {
  assertProductionUrlIsConfigured();
  const siteUrl = getSiteUrl();
  const canonical = new URL(page.path, siteUrl).toString();

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
  };
}

export function getSiteUrlForSitemap(): string {
  assertProductionUrlIsConfigured();
  return getSiteUrl();
}
