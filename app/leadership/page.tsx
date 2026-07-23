import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { pageSeo } from "@/content/seo";
import { Container } from "@/components/ui/Container";
import { PageHero } from "@/components/sections/PageHero";
import { LeadershipGrid } from "@/components/sections/LeadershipProfile";
import { CTASection } from "@/components/sections/CTASection";
import { leadership, leadershipPageCopy } from "@/content/leadership";

export const metadata: Metadata = buildMetadata(pageSeo.leadership);

export default function LeadershipPage() {
  const { eyebrow, headline, intro, model, cta } = leadershipPageCopy;

  return (
    <>
      <PageHero eyebrow={eyebrow} headline={headline} intro={intro} />

      <section className="pt-16 pb-12 md:pt-24 md:pb-16 lg:pt-32 lg:pb-20">
        <Container>
          <LeadershipGrid profiles={leadership} variant="full" />
        </Container>
      </section>

      <section className="pt-12 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32">
        <Container narrow>
          <h2 className="font-serif text-[length:var(--text-h2)] font-medium leading-[1.15]">
            {model.heading}
          </h2>
          <p className="mt-5 text-[length:var(--text-body-l)] leading-relaxed text-muted">{model.copy}</p>
        </Container>
      </section>

      <CTASection heading={cta.heading} button={cta.button} />
    </>
  );
}
