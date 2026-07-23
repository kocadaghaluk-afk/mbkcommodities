import type { Metadata } from "next";
import { Globe } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { pageSeo } from "@/content/seo";
import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { PageHero } from "@/components/sections/PageHero";
import { WorldMap } from "@/components/sections/WorldMap";
import { CounterpartyGrid } from "@/components/sections/CounterpartyGrid";
import { CTASection } from "@/components/sections/CTASection";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { counterpartyCards, marketsPageCopy } from "@/content/markets";
import { marketMapCopy } from "@/content/markets-map";

export const metadata: Metadata = buildMetadata(pageSeo.marketsPartnerships);

export default function MarketsPartnershipsPage() {
  const { eyebrow, headline, intro, perspective, counterparties, partnershipApproach, cta } =
    marketsPageCopy;

  return (
    <>
      <PageHero eyebrow={eyebrow} headline={headline} intro={intro} />

      <section className="py-16 md:py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-serif text-[length:var(--text-h2)] font-medium leading-[1.15]">
                {perspective.heading}
              </h2>
              <p className="mt-5 text-[length:var(--text-body-l)] leading-relaxed text-muted">
                {perspective.copy}
              </p>
            </div>
            <EditorialImage
              src="/images/markets/markets-partnerships.jpg"
              alt="Industrial port and shipping terminal viewed from an elevated platform, representing international logistics."
              aspectRatio="3/2"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[28%_1fr] lg:items-center">
            <div>
              <h2 className="font-serif text-[length:var(--text-h2)] font-medium leading-[1.15]">
                {marketMapCopy.heading}
              </h2>
              <p className="mt-5 text-[length:var(--text-body-l)] leading-relaxed text-muted">
                {marketMapCopy.intro}
              </p>
            </div>
            <WorldMap />
          </div>
        </Container>
      </section>

      <Container><Divider /></Container>

      <section className="py-16 md:py-24 lg:py-32">
        <Container>
          <h2 className="font-serif text-[length:var(--text-h2)] font-medium leading-[1.15]">
            {counterparties.heading}
          </h2>
          <div className="mt-12">
            <CounterpartyGrid items={counterpartyCards} />
          </div>
          <div className="mt-10 flex items-start gap-4 border border-line p-6">
            <Globe aria-hidden="true" className="h-6 w-6 shrink-0 text-maroon" strokeWidth={1.5} />
            <p className="text-[0.975rem] leading-relaxed text-muted">
              {counterparties.supportingCopy}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24 lg:py-32">
        <Container narrow>
          <h2 className="font-serif text-[length:var(--text-h2)] font-medium leading-[1.15]">
            {partnershipApproach.heading}
          </h2>
          {partnershipApproach.copy.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mt-5 text-[length:var(--text-body-l)] leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </Container>
      </section>

      <CTASection heading={cta.heading} button={cta.button} />
    </>
  );
}
