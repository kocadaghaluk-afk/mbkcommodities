import { siteConfig } from "@/content/site";
import { positioning } from "@/content/positioning";
import { getSiteUrlForSitemap } from "./metadata";

/**
 * Organisation JSON-LD using only explicitly approved information.
 *
 * Do not add sameAs, foundingDate, address, employee counts, executives or
 * other identifiers until MBK approves them (06_Development_Rules > SEO).
 */
export function buildOrganizationJsonLd() {
  const siteUrl = getSiteUrlForSitemap();

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteUrl,
    description: positioning.sentence,
  };
}
