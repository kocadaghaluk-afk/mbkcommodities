import type { MetadataRoute } from "next";
import { getSiteUrlForSitemap } from "@/lib/metadata";
import { pageSeo } from "@/content/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrlForSitemap();

  return Object.values(pageSeo).map((page) => ({
    url: new URL(page.path, siteUrl).toString(),
    changeFrequency: "monthly" as const,
    priority: page.path === "/" ? 1 : 0.7,
  }));
}
