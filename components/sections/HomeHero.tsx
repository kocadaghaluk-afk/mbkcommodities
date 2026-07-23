import Link from "next/link";
import { EditorialImage } from "@/components/ui/EditorialImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

interface HomeHeroProps {
  eyebrow: string;
  headline: string;
  supportingCopy: string;
  primaryCTA: { label: string; href: string };
  secondaryCTA: { label: string; href: string };
  imagePath: string;
  imageAlt: string;
}

/**
 * Two-column institutional Home hero (refinement pass):
 * - Left: eyebrow, headline, supporting copy, CTA pair.
 * - Right: large editorial media area reserved for a real commodities
 *   infrastructure photograph. `imagePath` is a single, centrally
 *   configured prop (sourced from content/home.ts) so swapping in
 *   approved photography later requires no structural changes here.
 *
 * Markup order is deliberately text-first, image-second: on mobile this
 * naturally stacks text above the image with no extra ordering utilities;
 * on lg+ the two-column grid places that same source order side by side
 * (text left, image right).
 *
 * Renders #hero-sentinel at its base so the global Header can detect when
 * the hero has scrolled past and switch from transparent to solid.
 */
export function HomeHero({
  eyebrow,
  headline,
  supportingCopy,
  primaryCTA,
  secondaryCTA,
  imagePath,
  imageAlt,
}: HomeHeroProps) {
  return (
    <section className="relative bg-ink">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-0 lg:min-h-[86vh]">
          <Eyebrow light>{eyebrow}</Eyebrow>
          {/*
            Width governed by this column's layout, not a character clamp
            (Brand Bible 3.1: Display is controlled by word count, manual
            line breaks, and container width).
          */}
          <h1 className="mt-5 font-serif text-[length:var(--text-display)] font-medium leading-[1.05] tracking-[-0.01em] text-white">
            {headline}
          </h1>
          <p className="mt-6 max-w-[46ch] text-[length:var(--text-body-l)] leading-relaxed text-white/80">
            {supportingCopy}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            {/* Primary: visually dominant filled button. */}
            <Button href={primaryCTA.href} className="!bg-white !text-ink">
              {primaryCTA.label}
            </Button>

            {/* Secondary: understated text-style action, not a second button. */}
            <Link
              href={secondaryCTA.href}
              className="group inline-flex items-center gap-2 text-[length:var(--text-button)] font-medium text-white/75 transition-colors hover:text-white"
            >
              {secondaryCTA.label}
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>

        <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-auto lg:h-[86vh]">
          <EditorialImage
            src={imagePath}
            alt={imageAlt}
            aspectRatio="auto"
            className="h-full w-full"
            priority
            animate={false}
            focalPoint="center 60%"
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
          {/* Gradient blends the image into the text panel's Ink background. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/10 to-transparent lg:from-ink/45"
          />
          {/* A quiet Teal Deep cast across the photograph — a restrained
              color-grade echo of the brand palette (Brand Bible, Section 5:
              Photography Direction), rather than a neutral tint. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-teal-deep/20 mix-blend-multiply" />
        </div>
      </div>

      <div id="hero-sentinel" aria-hidden="true" className="absolute bottom-0 h-px w-full" />
    </section>
  );
}
