import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { pageSeo } from "@/content/seo";
import { Container } from "@/components/ui/Container";
import { HomeHero } from "@/components/sections/HomeHero";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { BusinessAreaGrid } from "@/components/sections/BusinessAreaBlock";
import { HowMBKWorks } from "@/components/sections/HowMBKWorks";
import { LeadershipGrid } from "@/components/sections/LeadershipProfile";
import { CTASection } from "@/components/sections/CTASection";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { homeHero, homeIntroduction, howMbkWorks, homeClosingCTA } from "@/content/home";
import { businessAreas, businessAreasIntro } from "@/content/business-areas";
import { leadership, homeLeadershipCopy } from "@/content/leadership";
import { homeMarketsCopy } from "@/content/markets";

export const metadata: Metadata = buildMetadata(pageSeo.home);

export default function HomePage() {
  return (
    <>
      <HomeHero
        eyebrow={homeHero.eyebrow}
        headline={homeHero.headline}
        supportingCopy={homeHero.supportingCopy}
        primaryCTA={homeHero.primaryCTA}
        secondaryCTA={homeHero.secondaryCTA}
        imagePath={homeHero.imagePath}
        imageAlt={homeHero.imageAlt}
      />

      {/* Institutional Introduction */}
      <section className="py-16 md:py-24 lg:py-32">
        <Container narrow>
          <h2 className="font-serif text-[length:var(--text-h2)] font-medium leading-[1.15]">
            {homeIntroduction.heading}
          </h2>
          {homeIntroduction.copy.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mt-5 text-[length:var(--text-body-l)] leading-relaxed text-muted">
              {paragraph}
            </p>
          ))}
          <Link href={homeIntroduction.link.href} className="mt-6 inline-block border-b border-teal text-teal text-[length:var(--text-button)] font-medium transition-opacity hover:opacity-70">
            {homeIntroduction.link.label}
          </Link>
        </Container>
      </section>

      {/* Business Areas */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 lg:pt-32 lg:pb-20">
        <Container>
          <SectionHeader heading={businessAreasIntro.home.heading} intro={businessAreasIntro.home.intro} />
          <div className="mt-12">
            <BusinessAreaGrid areas={businessAreas} variant="home" />
          </div>
          <Link href={businessAreasIntro.home.link.href} className="mt-10 inline-block border-b border-teal text-teal text-[length:var(--text-button)] font-medium transition-opacity hover:opacity-70">
            {businessAreasIntro.home.link.label}
          </Link>
        </Container>
      </section>

      {/* How MBK Works */}
      <section className="pt-12 pb-12 md:pt-16 md:pb-16 lg:pt-20 lg:pb-20">
        <Container>
          <HowMBKWorks heading={howMbkWorks.heading} intro={howMbkWorks.intro} steps={[...howMbkWorks.steps]} />
        </Container>
      </section>

      {/* Leadership — compact editorial preview; full profiles live on /leadership */}
      <section className="pt-12 pb-12 md:pt-16 md:pb-16 lg:pt-20 lg:pb-20">
        <Container>
          <SectionHeader heading={homeLeadershipCopy.heading} intro={homeLeadershipCopy.copy} />
          <div className="mt-12">
            <LeadershipGrid profiles={leadership} variant="home" />
          </div>
          <Link href={homeLeadershipCopy.link.href} className="mt-10 inline-block border-b border-teal text-teal text-[length:var(--text-button)] font-medium transition-opacity hover:opacity-70">
            {homeLeadershipCopy.link.label}
          </Link>
        </Container>
      </section>

      {/* Markets & Partnerships */}
      <section className="py-16 md:py-24 lg:py-32">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div className="max-w-[640px]">
              <h2 className="font-serif text-[length:var(--text-h2)] font-medium leading-[1.15]">
                {homeMarketsCopy.heading}
              </h2>
              <p className="mt-5 text-[length:var(--text-body-l)] leading-relaxed text-muted">
                {homeMarketsCopy.copy}
              </p>
              <Link href={homeMarketsCopy.link.href} className="mt-6 inline-block border-b border-teal text-teal text-[length:var(--text-button)] font-medium transition-opacity hover:opacity-70">
                {homeMarketsCopy.link.label}
              </Link>
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

      <CTASection heading={homeClosingCTA.heading} copy={homeClosingCTA.copy} button={homeClosingCTA.button} />
    </>
  );
}
