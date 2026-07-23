import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { pageSeo } from "@/content/seo";
import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { PageHero } from "@/components/sections/PageHero";
import { CTASection } from "@/components/sections/CTASection";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { aboutPageCopy } from "@/content/about";

export const metadata: Metadata = buildMetadata(pageSeo.about);

export default function AboutPage() {
  const { hero, whoWeAre, purpose, approach, institutionalFoundation, qatarContext, cta } = aboutPageCopy;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        headline={hero.headline}
        intro={hero.intro}
        imagePath={hero.imagePath}
        imageAlt={hero.imageAlt}
        imageFocalPoint="center 45%"
      />
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 lg:pt-32 lg:pb-20">
        <Container narrow>
          <h2 className="font-serif text-[length:var(--text-h2)] font-medium leading-[1.15]">
            {whoWeAre.heading}
          </h2>
          {whoWeAre.copy.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mt-5 text-[length:var(--text-body-l)] leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
        </Container>
      </section>

      <Container><Divider /></Container>

      <section className="pt-12 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32">
        <Container narrow>
          <h2 className="font-serif text-[length:var(--text-h2)] font-medium leading-[1.15]">
            {purpose.heading}
          </h2>
          <p className="mt-5 text-[length:var(--text-body-l)] leading-relaxed text-muted">{purpose.copy}</p>
        </Container>
      </section>

      <section className="py-16 md:py-24 lg:py-32">
        <Container>
          <h2 className="font-serif text-[length:var(--text-h2)] font-medium leading-[1.15]">
            {approach.heading}
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-3">
            {approach.columns.map((column) => (
              <div key={column.title} className="border-t border-line pt-6">
                <h3 className="font-serif text-[length:var(--text-h3)] font-medium leading-[1.2]">{column.title}</h3>
                <p className="mt-4 text-[0.975rem] leading-relaxed text-muted">{column.copy}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-serif text-[length:var(--text-h2)] font-medium leading-[1.15]">
                {institutionalFoundation.heading}
              </h2>
              <p className="mt-5 text-[length:var(--text-body-l)] leading-relaxed text-muted">
                {institutionalFoundation.copy}
              </p>
            </div>
            <EditorialImage
              src={institutionalFoundation.imagePath}
              alt={institutionalFoundation.imageAlt}
              aspectRatio="3/2"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-serif text-[length:var(--text-h2)] font-medium leading-[1.15]">
                {qatarContext.heading}
              </h2>
              {qatarContext.copy.split("\n\n").map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="mt-5 text-[length:var(--text-body-l)] leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
            <EditorialImage
              src={qatarContext.imagePath}
              alt={qatarContext.imageAlt}
              aspectRatio="3/2"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </Container>
      </section>

      <CTASection heading={cta.heading} buttons={[...cta.buttons]} />
    </>
  );
}
