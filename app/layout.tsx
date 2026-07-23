import type { Metadata } from "next";
import { newsreader, inter } from "@/lib/fonts";
import { siteConfig } from "@/content/site";
import { pageSeo } from "@/content/seo";
import { getSiteUrlForSitemap, isConfirmedProductionDeployment } from "@/lib/metadata";
import { buildOrganizationJsonLd } from "@/lib/jsonld";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrlForSitemap()),
  title: {
    default: pageSeo.home.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: pageSeo.home.description,
  // Indexing requires BOTH a genuine Vercel Production deployment
  // (VERCEL_ENV, not NODE_ENV — Preview builds also run in production
  // mode) AND an exact match on the approved domain. Local development,
  // any Preview deployment, and any staging environment all resolve to
  // false here unconditionally.
  robots: {
    index: isConfirmedProductionDeployment(),
    follow: isConfirmedProductionDeployment(),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = buildOrganizationJsonLd();

  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable}`}>
      <body className="bg-paper text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SkipLink />
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
