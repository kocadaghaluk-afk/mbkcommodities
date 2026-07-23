import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { pageSeo } from "@/content/seo";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { BusinessAreaGrid } from "@/components/sections/BusinessAreaBlock";
import { CTASection } from "@/components/sections/CTASection";
import { businessAreas, businessAreasIntro } from "@/content/business-areas";

export const metadata: Metadata = buildMetadata(pageSeo.businessAreas);

export default function BusinessAreasPage() {
  const { page, commercialModel, cta } = businessAreasIntro;

  return (
    <>
      <PageHero eyebrow={page.eyebrow} headline={page.headline} intro={page.intro} />

      <section className="pt-16 pb-12 md:pt-24 md:pb-16 lg:pt-32 lg:pb-20">
        <Container>
          <BusinessAreaGrid areas={businessAreas} variant="full" />
        </Container>
      </section>

      <section className="pt-12 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32">
        <Container narrow>
          <h2 className="font-serif text-[length:var(--text-h2)] font-medium leading-[1.15]">
            {commercialModel.heading}
          </h2>
          {commercialModel.copy.split("\n\n").map((paragraph) => (
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
